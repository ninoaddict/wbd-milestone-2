import { ChatRoom } from "@prisma/client";
import { Server, Socket } from "socket.io";

import { getSession, ServerEventsResolver } from "./helper";
import { UserSession } from "./type";
import { messageEvent } from "./events/message";
import { isTypingEvent } from "./events/typing";

const serverEvents = [messageEvent, isTypingEvent] as const;
export type ClientToServerEvents = ServerEventsResolver<typeof serverEvents>;

type ChatPayload = {
  id: string;
  message: string;
  timestamp: Date;
  fromId: string;
  toId: string;
  chatRoomId: string;
};

export type ServerToClientEvents = {
  hello: (name: string) => void;
  addMessage: (post: ChatPayload) => void;
  whoIsTyping: (data: string) => void;
  deleteChat: (data: string) => void;
};

interface InterServerEvents {
  ping: () => void;
}

export type SocketData<AuthRequired = false> = {
  session: AuthRequired extends true ? UserSession : UserSession | null;
  chatRoom: Map<bigint, ChatRoom>;
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
    socket.data.chatRoom = new Map<bigint, ChatRoom>();
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
