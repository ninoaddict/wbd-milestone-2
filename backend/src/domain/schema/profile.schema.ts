import { z } from "zod";
import { RequestSchema } from "@/middlewares/validate.middleware";
import BadRequest from "../../errors/bad-request.error";

const updateProfileBody = z.object({
  name: z
    .string({ required_error: "Name cannot be empty" })
    .min(3, { message: "Name must be at least 3 characters" }),
  username: z
    .string({ required_error: "Username cannot be empty" })
    .min(3, { message: "Name must be at least 3 characters" }),
  work_history: z.string().optional(),
  skills: z.string().optional(),
  profile_photo: z.null().optional(),
});

export const updateProfileParamsSchema: RequestSchema = {
  params: z.object({
    userId: z
      .string({ required_error: "userId cannot be empty" })
      .transform((val) => {
        try {
          const parsed = BigInt(val);
          if (isNaN(Number(parsed))) {
            throw new BadRequest("Invalid id");
          }
          return parsed;
        } catch (error) {
          throw new BadRequest("Invalid id");
        }
      }),
  }),
};

export const updateProfileSchema: RequestSchema = {
  body: updateProfileBody,
};

export const getProfileSchema: RequestSchema = {
  params: z.object({
    userId: z
      .string({ required_error: "userId cannot be empty" })
      .transform((val) => {
        try {
          const parsed = BigInt(val);
          if (isNaN(Number(parsed))) {
            throw new BadRequest("Invalid id");
          }
          return parsed;
        } catch (error) {
          throw new BadRequest("Invalid id");
        }
      }),
  }),
};

export type updateProfileDto = z.infer<typeof updateProfileBody>;
