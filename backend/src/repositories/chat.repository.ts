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
