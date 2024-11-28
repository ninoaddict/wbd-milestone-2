import type { Socket } from "socket.io-client";
import io from "socket.io-client";
import parser from "socket.io-msgpack-parser";

const URL = "http://localhost:3000";

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

type ServerToClientEvents = {
  hello: (name: string) => void;
  addMessage: (post: ChatPayload) => void;
  whoIsTyping: (data: string) => void;
  deleteChat: (data: string) => void;
};

type ClientToServerEvents = {
  message: (
    input: {
      message: string;
      receiverId: bigint;
    },
    callback?:
      | ((
          data: SocketResponse<
            {
              message: string;
              id: bigint;
              timestamp: Date;
              fromId: bigint;
              toId: bigint;
              chatRoomId: bigint;
            },
            unknown
          >
        ) => void)
      | undefined
  ) => void;
  isTyping: (
    input: {
      receiverId: string;
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
