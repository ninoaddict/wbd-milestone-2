import { z } from "zod";
import { RequestSchema } from "@/middlewares/validate.middleware";
import BadRequest from "../../errors/bad-request.error";

export const getChatRoomSchema: RequestSchema = {
  params: z.object({
    id: z
      .string({ required_error: "roomId cannot be empty" })
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

export const getMessagesSchema: RequestSchema = {
  params: z.object({
    roomId: z
      .string({ required_error: "roomId cannot be empty" })
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
  query: z.object({
    // take: z.number().min(1).max(50).default(15),
    take: z
      .string()
      .default("15")
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
