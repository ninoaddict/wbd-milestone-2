import { api } from "@/lib/api";
import { LimitedUser, User } from "@/domain/interfaces/user.interface";

interface SelfResponse {
  body: User | undefined;
}

interface LimitedUserResponse {
  body: LimitedUser | undefined;
}

export const getUser = async (): Promise<User | null> => {
  try {
    const res = (await api.get("/self")).data as SelfResponse;
    return res.body ?? null;
  } catch (error) {
    // console.error("Failed to fetch user:", error);
    return null;
  }
};

export const getLimitedUser = async (
  userId: string
): Promise<LimitedUser | null> => {
  try {
    const res = (await api.get(`/user/${userId}`)).data as LimitedUserResponse;
    return res.body ?? null;
  } catch (error) {
    return null;
  }
};
