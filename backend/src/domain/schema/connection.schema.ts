import { z } from "zod";
import { RequestSchema } from "@/middlewares/validate.middleware";
import BadRequest from "../../errors/bad-request.error";

export const getConnectionSchema: RequestSchema = {
  params: z.object({
    id: z
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
