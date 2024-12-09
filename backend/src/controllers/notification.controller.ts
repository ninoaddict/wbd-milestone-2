import { Request, Router } from "express";
import Controller from "@/interfaces/controller";
import { BaseResponse } from "@/interfaces/base-response";
import { handleRequest } from "../utils/handle-request";
import { RequestWithUser } from "@/domain/dtos/auth.dto";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import NotificationService from "../services/notification.service";
import { validateRequest } from "../middlewares/validate.middleware";
import {
  SubscribeSchema,
  UnsubscribeSchema,
} from "../domain/schema/notification.schema";

class NotificationController implements Controller {
  public path = "/notification";
  public router = Router();
  private notificationService: NotificationService;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.notificationService = new NotificationService();
    this.authMiddleware = new AuthMiddleware();
    this.initRoutes();
  }

  subscribe = async (req: RequestWithUser): Promise<BaseResponse> => {
    await this.notificationService.subscribe(
      req.body.subscription,
      req.user?.id!
    );
    return {
      message: "Subscribed",
    };
  };

  unsubscribe = async (req: Request): Promise<BaseResponse> => {
    await this.notificationService.unsubscribe(req.body.endpoint);
    return {
      message: "Unsubscribed",
    };
  };

  private initRoutes() {
    this.router.post(
      `${this.path}/subscribe`,
      [this.authMiddleware.checkUser, validateRequest(SubscribeSchema)],
      handleRequest(this.subscribe)
    );

    this.router.post(
      `${this.path}/unsubscribe`,
      validateRequest(UnsubscribeSchema),
      handleRequest(this.unsubscribe)
    );
  }
}

export default NotificationController;
