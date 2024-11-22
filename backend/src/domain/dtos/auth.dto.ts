import { User } from "@prisma/client";
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

export type RequestWithUser = Request & {
  user: User;
};
