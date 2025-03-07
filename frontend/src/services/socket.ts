import type { Socket } from "socket.io-client";
import io from "socket.io-client";
import parser from "socket.io-msgpack-parser";
import { BACKEND_URL } from "@/config";

const URL = BACKEND_URL;

export type ChatPayload = {
  id: string;
  message: string;
  timestamp: Date;
  fromId: string;
  toId: string;
  chatRoomId: string;
};

export type SocketResponse<Data = unknown, Error = unknown> =
  | { success: false; error?: Error }
  | { success: true; data?: Data };

export type ServerToClientEvents = {
  hello: (name: string) => void;
  addMessage: (post: ChatPayload) => void;
  joinSuccess: (message: string) => void;
  leaveSuccess: (message: string) => void;
  whoIsTyping: (data: string) => void;
  deleteChat: (data: string) => void;
};

export type ClientToServerEvents = {
  message: (
    input: {
      message: string;
      receiverId: string;
    },
    callback?:
      | ((
          data: SocketResponse<
            {
              id: string;
              message: string;
              timestamp: Date;
              fromId: string;
              toId: string;
              chatRoomId: string;
            },
            unknown
          >
        ) => void)
      | undefined
  ) => void;
  isTyping: (
    input: {
      roomId: string;
    },
    callback?: ((data: SocketResponse<void, unknown>) => void) | undefined
  ) => void;
  joinRoom: (
    input: {
      roomId: string;
    },
    callback?: ((data: SocketResponse<void, unknown>) => void) | undefined
  ) => void;
  leaveRoom: (
    input: {
      roomId: string;
    },
    callback?: ((data: SocketResponse<void, unknown>) => void) | undefined
  ) => void;
};

export type SocketClient = Socket<ServerToClientEvents, ClientToServerEvents>;

export const socket: SocketClient = io(URL, {
  withCredentials: false,
  parser,
  transports: ["websocket"],
  autoConnect: false,
});
