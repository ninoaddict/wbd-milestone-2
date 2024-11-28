import { z } from "zod";
import { createEvent } from "../helper";
import { RoomChat } from "@prisma/client";

export const messageEvent = createEvent(
  {
    name: "message",
    input: z.object({
      message: z.string().min(1),
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
  async ({ ctx, input }) => {
    let roomChat: RoomChat;

    const roomChatFromSession = ctx.client.data.roomChat.get(input.receiverId);
    if (!roomChatFromSession) {
      const roomFromDb = await ctx.prisma.roomChat.findFirst({
        where: {
          OR: [
            {
              firstUserId: input.receiverId,
              secondUserId: ctx.client.data.session.id,
            },
            {
              secondUserId: input.receiverId,
              firstUserId: ctx.client.data.session.id,
            },
          ],
        },
      });

      if (!roomFromDb) throw new Error("Room chat not found");
      roomChat = roomFromDb;
    } else {
      roomChat = roomChatFromSession;
    }

    const message = await ctx.prisma.chat.create({
      data: {
        fromId: ctx.client.data.session.id,
        toId: input.receiverId,
        message: input.message,
        roomChatId: roomChat.id,
      },
    });
    ctx.io
      .to([message.fromId.toString(), message.toId.toString()])
      .emit("addMessage", message);
    return message;
  }
);
