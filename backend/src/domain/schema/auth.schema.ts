import { z } from "zod";
import { RequestSchema } from "@/middlewares/validate.middleware";

export const loginSchema: RequestSchema = {
  body: z.object({
    identifier: z.string({ required_error: "Identifier cannot be empty" }),
    password: z
      .string({ required_error: "Password cannot be empty" })
      .min(8, { message: "Password must be at least 8 characters" }),
  }),
};

export const registerSchema: RequestSchema = {
  body: z.object({
    username: z
      .string({ required_error: "Username cannot be empty" })
      .min(5, { message: "Username should not be shorter than 5 characters" })
      .max(16, { message: "Username should not be longer than 16 characters" })
      .refine((username) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username), {
        message: "Username cannot be in the form of an email",
      }),
    email: z
      .string({ required_error: "Email cannot be empty" })
      .email({ message: "Invalid email format" }),
    password: z
      .string({ required_error: "Password cannot be empty" })
      .min(8, { message: "Password must be at least 8 characters" }),
    name: z.string({ required_error: "Name cannot be empty" }),
  }),
};
