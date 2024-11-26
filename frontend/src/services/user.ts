import { api } from "@/lib/api";
import { User } from "@/domain/interfaces/user.interface";

interface SelfResponse {
  body: User | undefined;
}

export const getUser = async (): Promise<User | null> => {
  try {
    const res = (await api.get("/self")).data as SelfResponse;
    return res.body ?? null;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
};
