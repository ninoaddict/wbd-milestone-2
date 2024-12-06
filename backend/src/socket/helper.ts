import { z } from "zod";
import { SocketClientInServer, SocketServer } from "./socket";
import { IncomingMessage } from "http";
import cookie from "cookie";
import { JwtService } from "../services/jwt.service";
import { UserSession } from "./type";
import { PrismaClient } from "@prisma/client";
import prisma from "../database/prisma";

export type SocketResponse<Data = unknown, Error = unknown> =
  | { success: false; error?: Error }
  | { success: true; data?: Data };

export type ServerEvent<
  _EventName extends string,
  _InputSchema extends z.ZodType,
  _Return,
  AuthRequired extends boolean
> = (io: SocketServer, socket: SocketClientInServer<AuthRequired>) => void;

export type ServerEventResolver<T> = T extends ServerEvent<
  infer EventName,
  infer InputSchema,
  infer Return,
  infer _AuthRequired
>
  ? {
      [key in EventName]: (
        input: z.infer<InputSchema>,
        callback?: (data: SocketResponse<Return>) => void
      ) => void;
    }
  : never;

type ExtractKeys<T> = T extends object ? keyof T : never;
type MergeValues<T> = T extends object ? T[keyof T] : never;

type Merge<T extends object> = {
  [K in ExtractKeys<T>]: MergeValues<Extract<T, { [P in K]: unknown }>>;
};

export type ServerEventsResolver<
  T extends readonly ServerEvent<string, z.ZodUndefined, unknown, boolean>[]
> = Merge<ServerEventResolver<T[number]>>;

export async function getSession(req: IncomingMessage) {
  const cookies = req.headers.cookie;
  if (!cookies) return null;

  const parsedCookie = cookie.parse(cookies);
  const authToken = parsedCookie["auth_token"];
  const jwtService = new JwtService();
  try {
    const decodedToken = jwtService.decode(authToken);
    return {
      id: BigInt(decodedToken.id),
      email: decodedToken.email,
      iat: decodedToken.iat,
      exp: decodedToken.exp,
    } as UserSession;
  } catch (error) {
    return null;
  }
}

export function createEvent<
  EventName extends string,
  Return,
  AuthRequired extends boolean = false,
  InputSchema extends z.ZodType = z.ZodUndefined
>(
  {
    name,
    input,
    authRequired,
  }: {
    name: EventName;
    input?: InputSchema;
    authRequired?: AuthRequired;
  },
  handler: ({
    ctx,
    input,
  }: {
    ctx: {
      io: SocketServer;
      client: SocketClientInServer<AuthRequired>;
      prisma: PrismaClient;
    };
    input: z.infer<InputSchema>;
  }) => Promise<Return> | Return
): ServerEvent<EventName, InputSchema, Return, AuthRequired> {
  return (io, socket) => {
    socket.on(
      name,
      // @ts-expect-error - This is a valid event name
      async (data: unknown, callback?: (response: SocketResponse) => void) => {
        if (authRequired && !socket.data.session) {
          callback?.({ success: false, error: "Unauthenticated" });
          return;
        }

        const validation: z.SafeParseReturnType<unknown, unknown> =
          input?.safeParse(data) ?? {
            success: true,
            data: undefined,
          };

        if (!validation.success) {
          callback?.({ success: false, error: validation.error });
          return;
        }

        try {
          const result = await handler({
            ctx: {
              io,
              client: socket,
              prisma,
            },
            input: validation.data,
          });
          callback?.({ success: true, data: result });
          return;
        } catch (error) {
          callback?.({ success: false, error });
          return;
        }
      }
    );
  };
}
