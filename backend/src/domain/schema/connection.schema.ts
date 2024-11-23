import { z } from "zod";
import { RequestSchema } from "@/middlewares/validate.middleware";
import BadRequest from "../../errors/bad-request.error";

export const getConnectionSchema: RequestSchema = {
  params: z.object({
    id: z.string().transform((val) => {
      const parsed = BigInt(val);
      if (isNaN(Number(parsed))) {
        throw new BadRequest("Invalid id");
      }
      return parsed;
    }),
  }),
};
