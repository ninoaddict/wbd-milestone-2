import Unauthorized from "../errors/unauthorized.error";
import ChatRepository from "../repositories/chat.repository";

class ChatService {
  private chatRepository: ChatRepository;

  constructor() {
    this.chatRepository = new ChatRepository();
  }

  isInChatRoom = async (userId: bigint, matchId: bigint) => {
    const match = await this.chatRepository.isInChatRoom(userId, matchId);
    if (!match) {
      throw new Unauthorized();
    }
    return match;
  };

  getChatHeaders = async (userId: bigint) => {
    const data = await this.chatRepository.getChatHeaders(userId);
    return data.map((datum) => {
      return {
        profile: {
          username: datum.profile?.username,
          name: datum.profile?.full_name,
          profile_photo_path: datum.profile?.full_name,
        },
        id: datum.id,
        firstUserId: datum.firstUserId,
        secondUserId: datum.secondUserId,
        lastMessage: datum.lastMessage,
        lastTimeStamp: datum.lastTimeStamp,
      };
    });
  };

  getMessages = async (
    take: number,
    roomId: bigint,
    userId: bigint,
    id?: bigint
  ) => {
    if (!(await this.chatRepository.isInChatRoom(userId, roomId))) {
      throw new Unauthorized();
    }
    return await this.chatRepository.getMessages(take, roomId, id);
  };
}

export default ChatService;
