import { z } from "zod";
import { createEvent } from "../helper";

export const isTypingEvent = createEvent(
  {
    name: "isTyping",
    input: z.object({ receiverId: z.string().uuid() }),
    authRequired: true,
  },
  ({ ctx, input }) => {
    const user = ctx.client.data.session;
    ctx.io.to([input.receiverId]).emit("whoIsTyping", user.id.toString());
  }
);
