import prisma from "../database/prisma";

class ChatRepository {
  isInChatRoom = async (userId: bigint, matchId: bigint) => {
    const match = await prisma.chatRoom.findFirst({
      where: {
        id: matchId,
        OR: [{ firstUserId: userId }, { secondUserId: userId }],
      },
    });
    return match;
  };

  getChatHeaders = async (userId: bigint) => {
    return await prisma.$transaction(async (tx) => {
      const chatHeaders = await tx.chatRoom.findMany({
        where: {
          OR: [
            {
              firstUserId: userId,
            },
            {
              secondUserId: userId,
            },
          ],
        },
        orderBy: {
          lastTimeStamp: "desc",
        },
      });

      const res = await Promise.all(
        chatHeaders.map(async (chatHeader) => {
          if (chatHeader.firstUserId === userId) {
            const profile = await tx.user.findUnique({
              where: {
                id: chatHeader.secondUserId,
              },
              select: {
                username: true,
                name: true,
                profile_photo_path: true,
              },
            });
            return {
              ...chatHeader,
              profile,
            };
          } else {
            const profile = await tx.user.findUnique({
              where: {
                id: chatHeader.firstUserId,
              },
              select: {
                username: true,
                name: true,
                profile_photo_path: true,
              },
            });
            return {
              ...chatHeader,
              profile,
            };
          }
        })
      );
      return res;
    });
  };

  getMessages = async (take: number, roomId: bigint, id?: bigint) => {
    const messages = await prisma.chat.findMany({
      orderBy: {
        timestamp: "desc",
      },
      cursor: id
        ? {
            id,
          }
        : undefined,
      take: take + 1,
      skip: 0,
      where: {
        chatRoomId: roomId,
      },
    });

    let nextCursor = undefined;
    if (messages.length > take) {
      const next = messages.pop();
      if (next) {
        nextCursor = next.id;
      }
    }
    return {
      messages,
      nextCursor,
    };
  };
}

export default ChatRepository;
