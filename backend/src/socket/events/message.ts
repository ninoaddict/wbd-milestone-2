import { z } from "zod";
import { createEvent } from "../helper";
import { Prisma } from "@prisma/client";
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
    // check if chat room is valid
    const chatRoomId = input.receiverId;
    const chatRoom = await ctx.prisma.chatRoom.findUnique({
      where: {
        id: chatRoomId,
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
      throw new Error("Unauthorized user");
    }

    const myId = ctx.client.data.session.id;
    const otherId =
      myId === chatRoom.firstUserId
        ? chatRoom.secondUserId
        : chatRoom.firstUserId;

    const message = await ctx.prisma.$transaction(async (tx) => {
      const msg = await tx.chat.create({
        data: {
          fromId: myId,
          toId: otherId,
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
        userId: otherId,
      },
    });

    const myProfile = await ctx.prisma.user.findUnique({
      where: {
        id: myId,
      },
      select: {
        name: true,
      },
    });

    // non blocking codes
    setImmediate(() => {
      subscriptions.forEach(async (raw) => {
        const endpoint = raw.endpoint;
        const keys = raw.keys as Prisma.JsonObject;
        const p256dh = keys.p256dh as string;
        const auth = keys.auth as string;

        const payload = {
          title: myProfile?.name || "New Message",
          body:
            message.message.length <= 50
              ? message.message
              : message.message.substring(0, 50) + "...",
          url: `http://localhost:5173/chat/${message.chatRoomId}`,
        };

        try {
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
        } catch (error: any) {
          if (error.statusCode === 410 || error.statusCode === 404) {
            await ctx.prisma.pushSubscription.delete({
              where: { endpoint },
            });
          } else {
            console.error("Push notification error:", error);
          }
        }
      });
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
