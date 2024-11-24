import { z } from "zod";
import { RequestSchema } from "@/middlewares/validate.middleware";
import { experienceDto } from "../dtos/profile.dto";
import BadRequest from "../../errors/bad-request.error";

const updateProfileBody = z.object({
  name: z.string({ required_error: "Name cannot be empty" }).min(1),
  description: z.string().optional(),
  about: z.string().optional(),
  skills: z.array(z.string()),
  experience: z.array(z.string()).transform((val) => {
    return val.map((f) => {
      const raw = JSON.parse(f);
      let id = undefined;
      if (raw.id) {
        const parsed = BigInt(raw.id);
        if (isNaN(Number(parsed))) {
          throw new BadRequest("Invalid id");
        }
        id = parsed;
      }
      const res: experienceDto = {
        id,
        title: raw.title,
        companyName: raw.companyName,
        location: raw.location,
        startDate: raw.startDate,
        endDate: raw.endDate,
      };
      return res;
    });
  }),
});

export const updateProfileParamsSchema: RequestSchema = {
  params: z.object({
    userId: z
      .string({ required_error: "userId cannot be empty" })
      .transform((val) => {
        const parsed = BigInt(val);
        if (isNaN(Number(parsed))) {
          throw new BadRequest("Invalid id");
        }
        return parsed;
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
        const parsed = BigInt(val);
        if (isNaN(Number(parsed))) {
          throw new BadRequest("Invalid id");
        }
        return parsed;
      }),
  }),
};

export type updateProfileDto = z.infer<typeof updateProfileBody>;
