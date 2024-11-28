import { Chat, RoomChat } from "@prisma/client";
import { Server, Socket } from "socket.io";

import { getSession, ServerEventsResolver } from "./helper";
import { UserSession } from "./type";
import { messageEvent } from "./events/message";
import { isTypingEvent } from "./events/typing";

const serverEvents = [messageEvent, isTypingEvent] as const;
export type ClientToServerEvents = ServerEventsResolver<typeof serverEvents>;

export type ServerToClientEvents = {
  hello: (name: string) => void;
  addMessage: (post: Chat) => void;
  whoIsTyping: (data: string) => void;
  deleteChat: (data: string) => void;
};

interface InterServerEvents {
  ping: () => void;
}

export type SocketData<AuthRequired = false> = {
  session: AuthRequired extends true ? UserSession : UserSession | null;
  roomChat: Map<bigint, RoomChat>;
};

export type SocketServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData<boolean>
>;

export type SocketClientInServer<AuthRequired = false> = Socket<
  never,
  ServerToClientEvents,
  InterServerEvents,
  SocketData<AuthRequired>
>;

export function setupSocket(io: SocketServer) {
  io.use((socket, next) => {
    getSession(socket.request)
      .then((session) => {
        socket.data.session = session;
        next();
      })
      .catch(next);
  });

  io.use((socket, next) => {
    socket.data.roomChat = new Map<bigint, RoomChat>();
    next();
  });

  io.on("connection", (socket) => {
    if (socket.data.session) {
      serverEvents.forEach((event) => event(io, socket));
      const userId = socket.data.session.id;
      void socket.join(userId.toString());
      socket.on("disconnect", () => {
        void socket.leave(userId.toString());
      });
    }
  });
}
