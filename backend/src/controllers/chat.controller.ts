import { Router } from "express";
import Controller from "@/interfaces/controller";
import ChatService from "../services/chat.service";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { RequestWithUser } from "../domain/dtos/auth.dto";
import { BaseResponse } from "../interfaces/base-response";
import { validateRequest } from "../middlewares/validate.middleware";
import { getChatRoomSchema } from "../domain/schema/chat.schema";
import { handleRequest } from "../utils/handle-request";

class ChatController implements Controller {
  public path = "/chat";
  public router = Router();
  private chatService: ChatService;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.chatService = new ChatService();
    this.authMiddleware = new AuthMiddleware();
    this.initRoutes();
  }

  isInChatRoom = async (req: RequestWithUser): Promise<BaseResponse> => {
    return {
      body: await this.chatService.isInChatRoom(
        req.user?.id!,
        BigInt(req.params.id)
      ),
      message: "Successfully fetched chat room",
    };
  };

  private initRoutes() {
    this.router.get(
      `${this.path}/room/:id(\\d+)`,
      [this.authMiddleware.checkUser, validateRequest(getChatRoomSchema)],
      handleRequest(this.isInChatRoom)
    );
  }
}

export default ChatController;
