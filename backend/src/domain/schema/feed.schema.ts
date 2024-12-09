import { z } from "zod";
import { RequestSchema } from "../../middlewares/validate.middleware";
import BadRequest from "../../errors/bad-request.error";

export const updateFeedSchema: RequestSchema = {
  body: z.object({
    content: z
      .string({ required_error: "Content cannot be empty" })
      .min(1)
      .max(280, { message: "Cannot be more than 280 characters" }),
  }),
};

export const getFeedsSchema: RequestSchema = {
  query: z.object({
    limit: z
      .string()
      .default("10")
      .transform((val) => {
        const num = Number(val);
        if (isNaN(num)) {
          throw new BadRequest("Invalid take");
        }
        if (num < 1 || num > 50) {
          // min 1, max 50
          throw new BadRequest("Invalid take");
        }
        return num;
      }),
    cursor: z
      .string()
      .optional()
      .transform((val) => {
        if (!val) return val;
        try {
          const parsed = BigInt(val);
          if (isNaN(Number(parsed))) {
            throw new BadRequest("Invalid messageId");
          }
          return parsed;
        } catch (error) {
          throw new BadRequest("Invalid messageId");
        }
      }),
  }),
};
