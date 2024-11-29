import { z } from "zod";
import { createEvent } from "../helper";

export const joinEvent = createEvent(
  {
    name: "joinRoom",
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
    const chatRoom = await ctx.prisma.chatRoom.findFirst({
      where: {
        id: input.roomId,
        OR: [
          {
            firstUserId: ctx.client.data.session.id,
          },
          {
            secondUserId: ctx.client.data.session.id,
          },
        ],
      },
    });
    if (!chatRoom) {
      throw new Error("Invalid chat room");
    } else {
      const otherUser =
        chatRoom.firstUserId === ctx.client.data.session.id
          ? chatRoom.secondUserId
          : chatRoom.firstUserId;
      ctx.client.data.chatRoom.set(otherUser, chatRoom);
      ctx.client.join(input.roomId.toString());
      ctx.io.to(ctx.client.id).emit("joinSuccess", "Joining room successfully");
    }
  }
);
