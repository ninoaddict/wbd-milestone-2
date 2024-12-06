import { z } from "zod";
import { createEvent } from "../helper";

export const leaveEvent = createEvent(
  {
    name: "leaveRoom",
    input: z.object({
      roomId: z
        .string()
        .min(1)
        .transform((val) => {
          try {
            const parsed = BigInt(val);
            if (isNaN(Number(parsed))) {
              throw new Error("Invalid roomId");
            }
            return parsed;
          } catch (error) {
            throw new Error("Invalid roomId");
          }
        }),
    }),
    authRequired: true,
  },
  async ({ ctx, input }) => {
    ctx.client.leave(input.roomId.toString());
    ctx.io.to(ctx.client.id).emit("leaveSuccess", "Leaving room successfully");
  }
);
