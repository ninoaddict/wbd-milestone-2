import { Chat } from "@prisma/client";

export type ServerToClientEvents = {
  isTyping: (id: string) => void;
  add: (message: Chat) => void;
};
export type UserSession = {
  id: bigint;
  email: string;
  iat: number;
  exp: number;
};
