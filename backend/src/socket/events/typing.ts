import { z } from "zod";
import { createEvent } from "../helper";

export const isTypingEvent = createEvent(
  {
    name: "isTyping",
    input: z.object({
      receiverId: z
        .string()
        .min(1)
        .transform((val) => {
          try {
            const parsed = BigInt(val);
            if (isNaN(Number(parsed))) {
              throw new Error("Invalid userId");
            }
            return parsed;
          } catch (error) {
            throw new Error("Invalid userId");
          }
        }),
    }),
    authRequired: true,
  },
  ({ ctx, input }) => {
    const user = ctx.client.data.session;
    ctx.io
      .to([input.receiverId.toString()])
      .emit("whoIsTyping", user.id.toString());
  }
);
