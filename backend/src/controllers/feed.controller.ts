import { RequestWithUser } from "@/domain/dtos/auth.dto";
import { BaseResponse } from "@/interfaces/base-response";
import Controller from "@/interfaces/controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import FeedService from "../services/feed.service";
import { handleRequest } from "../utils/handle-request";
import { Request, Router } from "express";
import { validateRequest } from "../middlewares/validate.middleware";
import { updateFeedSchema } from "../domain/schema/feed.schema";
import { upload } from "../utils/storage";

class FeedController implements Controller {
    public path = "";
    public router = Router();
    private feedService: FeedService;
    private authMiddleware: AuthMiddleware;

    constructor() {
        this.feedService = new FeedService();
        this.authMiddleware = new AuthMiddleware();
        this.initRoutes();
    }

    getFeeds = async (req: RequestWithUser): Promise<BaseResponse> => {
        return {
            body: await this.feedService.getFeeds(req.user?.id),
            message: "Feeds retrieved successfully"
        };
    }

    postFeeds = async (req: RequestWithUser): Promise<BaseResponse> => {
        return {
            body: await this.feedService.postFeeds(req.user?.id, req.body.content),
            message: "Feeds retrieved successfully"
        };
    }

    updateFeeds = async (req: Request): Promise<BaseResponse> => {
        console.log(req.params)
        return {
            body: await this.feedService.updateFeeds(BigInt(req.params.feedId), req.body.content),
            message: "Feeds edited successfully"
        };
    }

    deleteFeeds = async (req: Request): Promise<BaseResponse> => {
        return {
            body: await this.feedService.deleteFeeds(BigInt(req.params.feedId)),
            message: "Feeds edited successfully"
        }
    }

    private initRoutes() {
        this.router.get(
            `${this.path}/feed`,
            this.authMiddleware.checkUser,
            handleRequest(this.getFeeds)
        )
        this.router.post(
            `${this.path}/feed`,
            [this.authMiddleware.checkUser,
            upload.single("sum_random_file"),
            validateRequest(updateFeedSchema)],
            handleRequest(this.postFeeds)
        )
        this.router.put(
            `${this.path}/feed/:feedId`,
            [this.authMiddleware.checkUser,
            upload.single("sum_random_file"),
            validateRequest(updateFeedSchema)],
            handleRequest(this.updateFeeds)
        )
        this.router.delete(
            `${this.path}/feed/:feedId`,
            this.authMiddleware.checkUser,
            handleRequest(this.deleteFeeds)
        )
    }
}

export default FeedController;