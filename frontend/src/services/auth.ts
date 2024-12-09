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
  (await api.post("/login", payload)).data as AuthResponse;
  const user = await getUser();
  if (!user) {
    throw new AxiosError("User not found");
  }
  return user;
};

export const register = async (payload: RegisterPayload): Promise<User> => {
  (await api.post("/register", payload)).data as AuthResponse;
  const user = await getUser();
  if (!user) {
    throw new AxiosError("User not found");
  }
  return user;
};

export const logout = async () => {
  await api.post("/logout");
};
