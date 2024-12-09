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
  /**
   * @swagger
   * /api/chat:
   *   get:
   *     summary: This is the endpoint to get chat headers
   *     responses:
   *       200:
   *         description: Chat headers fetched successfully
   * /api/chat/{roomId}:
   *    get:
   *     summary: This is the endpoint to get all mesagges from the adjacent chat room
   *     parameters:
   *        - name: roomId
   *          in: path
   *          descriptions: The id of the specific chat room
   *          required: true
   *          schema:
   *            type: integer
   *        - name: cursor
   *          in: query
   *          descriptions: The cursor of the chat room
   *          required: false
   *          schema:
   *            type: string
   *     responses:
   *       200:
   *         description: Messages fetched successfully
   *       401:
   *         description: Unauthorized
   * /api/chat/room/{roomId}:
   *    get:
   *     summary: This is the endpoint to get all mesagges from the adjacent chat room
   *     parameters:
   *        - name: roomId
   *          in: path
   *          descriptions: The id of the specific chat room
   *          required: true
   *          schema:
   *            type: integer
   *     responses:
   *       200:
   *         description: Successfully fetched chat room
   *       401:
   *         description: Unauthorized
   */
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

  getChatHeaders = async (req: RequestWithUser): Promise<BaseResponse> => {
    return {
      body: await this.chatService.getChatHeaders(BigInt(req.user?.id!)),
      message: "Chat headers fetched successfully",
    };
  };

  private initRoutes() {
    this.router.get(
      `${this.path}/`,
      this.authMiddleware.checkUser,
      handleRequest(this.getChatHeaders)
    );

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
