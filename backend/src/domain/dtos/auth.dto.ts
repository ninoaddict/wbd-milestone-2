import { Request } from "express";

export interface LoginDto {
  identifier: string;
  password: string;
}

export interface registerDto {
  email: string;
  username: string;
  password: string;
  name: string;
}

export interface UserPayload {
  id: bigint;
  email: string;
}

export type RequestWithUser = Request & {
  user?: UserPayload;
};
