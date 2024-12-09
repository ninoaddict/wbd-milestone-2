import { Server, Socket } from "socket.io";
import { getSession, ServerEventsResolver } from "./helper";
import { UserSession } from "./type";
import { messageEvent } from "./events/message";
import { isTypingEvent } from "./events/typing";
import { joinEvent } from "./events/join";
import { leaveEvent } from "./events/leave";

const serverEvents = [
  messageEvent,
  isTypingEvent,
  joinEvent,
  leaveEvent,
] as const;
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
  joinSuccess: (message: string) => void;
  leaveSuccess: (message: string) => void;
  whoIsTyping: (data: string) => void;
  deleteChat: (data: string) => void;
};

interface InterServerEvents {
  ping: () => void;
}

export type SocketData<AuthRequired = false> = {
  session: AuthRequired extends true ? UserSession : UserSession | null;
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

  io.on("connection", (socket) => {
    if (socket.data.session) {
      serverEvents.forEach((event) => event(io, socket));
    }
  });
}
