import { z } from "zod";
import { createEvent } from "../helper";
import { ChatRoom, Prisma } from "@prisma/client";
import webPush from "../../config/webPushConfig";

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
    let chatRoom: ChatRoom;

    const chatRoomFromSession = ctx.client.data.chatRoom.get(input.receiverId);
    if (!chatRoomFromSession) {
      const roomFromDb = await ctx.prisma.chatRoom.findFirst({
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

      if (!roomFromDb) {
        throw new Error("Room chat not found");
      }
      chatRoom = roomFromDb;
      ctx.client.data.chatRoom.set(input.receiverId, roomFromDb);
    } else {
      chatRoom = chatRoomFromSession;
    }

    const message = await ctx.prisma.$transaction(async (tx) => {
      const msg = await tx.chat.create({
        data: {
          fromId: ctx.client.data.session.id,
          toId: input.receiverId,
          message: input.message,
          chatRoomId: chatRoom.id,
        },
      });
      // also update for chatroom
      await tx.chatRoom.update({
        where: {
          id: chatRoom.id,
        },
        data: {
          lastTimeStamp: msg.timestamp,
          lastMessage: msg.message,
        },
      });
      return msg;
    });

    const subscriptions = await ctx.prisma.pushSubscription.findMany({
      where: {
        userId: input.receiverId,
      },
    });
    subscriptions.forEach(async (raw) => {
      const endpoint = raw.endpoint;
      const keys = raw.keys as Prisma.JsonObject;
      const p256dh = keys.p256dh as string;
      const auth = keys.auth as string;
      const payload = {
        title: "New message",
        body:
          message.message.length <= 50
            ? message.message
            : message.message.substring(0, 50) + "...",
        url: `http://localhost:5173/chat/${message.chatRoomId}`,
      };
      await webPush.sendNotification(
        {
          endpoint,
          keys: {
            p256dh,
            auth,
          },
        },
        JSON.stringify(payload)
      );
    });

    const messagePayload = {
      id: message.id.toString(),
      message: message.message,
      timestamp: message.timestamp,
      fromId: message.fromId.toString(),
      toId: message.toId.toString(),
      chatRoomId: message.chatRoomId.toString(),
    };
    ctx.io.to(message.chatRoomId.toString()).emit("addMessage", messagePayload);
    return messagePayload;
  }
);
