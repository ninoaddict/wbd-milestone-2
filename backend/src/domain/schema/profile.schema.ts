import { z } from "zod";
import { RequestSchema } from "@/middlewares/validate.middleware";
import { experienceDto } from "../dtos/profile.dto";

const updateProfileBody = z.object({
  name: z.string({ required_error: "Name cannot be empty" }).min(1),
  description: z.string().optional(),
  about: z.string().optional(),
  skills: z.array(z.string()),
  experience: z.array(z.string()).transform((val) => {
    return val.map((f) => {
      const raw = JSON.parse(f);
      const res: experienceDto = {
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

export const updateProfileSchema: RequestSchema = {
  body: updateProfileBody,
};

export type updateProfileType = z.infer<typeof updateProfileBody>;
