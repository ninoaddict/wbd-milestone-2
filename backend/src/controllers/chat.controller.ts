import { Router } from "express";
import Controller from "@/interfaces/controller";
import ChatService from "../services/chat.service";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { RequestWithUser } from "../domain/dtos/auth.dto";
import { BaseResponse } from "../interfaces/base-response";
import { validateRequest } from "../middlewares/validate.middleware";
import {
  getChatRoomSchema,
  getMessagesSchema,
} from "../domain/schema/chat.schema";
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

  getMessages = async (req: RequestWithUser): Promise<BaseResponse> => {
    return {
      body: await this.chatService.getMessages(
        Number(req.query.take),
        BigInt(req.params.roomId),
        req.user?.id!,
        // @ts-ignore comments
        req.query.cursor
      ),
      message: "Messages fetched successfully",
    };
  };

  private initRoutes() {
    this.router.get(
      `${this.path}/:roomId(\\d+)`,
      [this.authMiddleware.checkUser, validateRequest(getMessagesSchema)],
      handleRequest(this.getMessages)
    );

    this.router.get(
      `${this.path}/room/:id(\\d+)`,
      [this.authMiddleware.checkUser, validateRequest(getChatRoomSchema)],
      handleRequest(this.isInChatRoom)
    );
  }
}

export default ChatController;
