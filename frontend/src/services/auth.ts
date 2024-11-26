import { User } from "@/domain/interfaces/user.interface";
import { api } from "@/lib/api";
import { getUser } from "./user";
import { AxiosError } from "axios";

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  name: string;
  password: string;
}

interface AuthResponse {
  body: {
    token: string;
  };
  message: string;
}

export const login = async (payload: LoginPayload): Promise<User> => {
  const token = (await api.post("/login", payload)).data as AuthResponse;
  console.log(token.body.token);
  const user = await getUser();
  if (!user) {
    throw new AxiosError("User not found");
  }
  return user;
};
