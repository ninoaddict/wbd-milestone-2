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
}

export default ChatService;
