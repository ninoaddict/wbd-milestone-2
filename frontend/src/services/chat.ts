import { api } from "@/lib/api";
import { AxiosError } from "axios";

interface ChatRoomResponse {
  body: ChatRoomData;
  message: string;
}

interface ChatRoomData {
  id: string;
  firstUserId: string;
  secondUserId: string;
}

export const getChatRoomData = async (roomId: string) => {
  const res = (await api.get(`/chat/room/${roomId}`)).data as ChatRoomResponse;
  if (!res || !res.body) {
    throw new AxiosError("Chat room not found");
  }
  return res.body;
};
