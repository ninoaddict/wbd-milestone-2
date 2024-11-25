import { api } from "@/lib/api";
import { SelfResponse, User } from "@/domain/interfaces/user.interface";

export const getUser = async (): Promise<User | null> => {
  const res = (await api.get("/self")).data as SelfResponse;
  return res.body ?? null;
};
