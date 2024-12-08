import { z } from "zod";

export const editProfileSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
});
