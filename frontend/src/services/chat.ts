import { api } from "@/lib/api";
import { AxiosError } from "axios";
import { ChatPayload } from "./socket";

interface ChatRoomResponse {
  body: ChatRoomData;
  message: string;
}

interface ChatRoomData {
  id: string;
  firstUserId: string;
  secondUserId: string;
}

export interface MessagesData {
  messages: ChatPayload[];
  nextCursor: string | undefined;
}

export interface MessagesResponse {
  body: MessagesData;
  message: string;
}

export const getChatRoomData = async (roomId: string) => {
  const res = (await api.get(`/chat/room/${roomId}`)).data as ChatRoomResponse;
  if (!res || !res.body) {
    throw new AxiosError("Chat room not found");
  }
  return res.body;
};
