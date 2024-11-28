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
}

export default ChatRepository;
