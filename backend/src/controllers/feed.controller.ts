import { RequestWithUser } from "@/domain/dtos/auth.dto";
import { BaseResponse } from "@/interfaces/base-response";
import Controller from "@/interfaces/controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import FeedService from "../services/feed.service";
import { handleRequest } from "../utils/handle-request";
import { Router } from "express";
import { validateRequest } from "../middlewares/validate.middleware";
import { getFeedsSchema, updateFeedSchema } from "../domain/schema/feed.schema";
import { upload } from "../utils/storage";
import { createContentLimiter } from "../config/rateLimiter";

class FeedController implements Controller {
  /**
   * @swagger
   * /api/feed:
   *   get:
   *     summary: This is the endpoint to get feeds based on limit and offset
   *     parameters:
   *        - name: limit
   *          in: query
   *          descriptions: The limit of fetched feeds
   *          required: true
   *          schema:
   *            type: integer
   *        - name: cursor
   *          in: query
   *          descriptions: The offset of fetched feeds
   *          required: true
   *          schema:
   *            type: integer
   *     responses:
   *       200:
   *         description: Feeds retrieved successfully
   *       400:
   *         description: Bad Request
   *   post:
   *     summary: This is the endpoint to post new feeds
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               content:
   *                 type: string
   *                 example: Spongebob is hiding in a closet
   *     responses:
   *       200:
   *         description: Feeds posted successfully
   *       400:
   *         description: Bad Request
   * /api/feed/{editedFeedId}:
   *    put:
   *     summary: This is the endpoint to update existing feeds
   *     parameters:
   *       - name: editedFeedId
   *         in: path
   *         descriptions: The id of the specific feed
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               content:
   *                 type: string
   *                 example: Spongebob is not like that
   *     responses:
   *       200:
   *         description: Feeds edited successfully
   *       400:
   *         description: Bad Request
   * /api/feed/{deletedFeedId}:
   *    delete:
   *     summary: This is the endpoint to delete existing feeds
   *     parameters:
   *       - name: deletedFeedId
   *         in: path
   *         descriptions: The id of the specific feed
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Feeds deleted successfully
   *       400:
   *         description: Bad Request
   */

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
      body: await this.feedService.getFeeds(
        Number(req.query.limit),
        // @ts-ignore
        req.query.cursor,
        req.user?.id
      ),
      message: "Feeds fetched successfully",
    };
  };

  postFeeds = async (req: RequestWithUser): Promise<BaseResponse> => {
    return {
      body: await this.feedService.postFeeds(req.user?.id, req.body.content),
      message: "Feeds posted successfully",
    };
  };

  updateFeeds = async (req: RequestWithUser): Promise<BaseResponse> => {
    return {
      body: await this.feedService.updateFeeds(
        BigInt(req.params.feedId),
        req.user?.id,
        req.body.content
      ),
      message: "Feeds edited successfully",
    };
  };

  deleteFeeds = async (req: RequestWithUser): Promise<BaseResponse> => {
    return {
      body: await this.feedService.deleteFeeds(
        BigInt(req.params.feedId),
        req.user?.id
      ),
      message: "Feeds deleted successfully",
    };
  };

  private initRoutes() {
    this.router.get(
      `${this.path}/feed`,
      [this.authMiddleware.checkUser, validateRequest(getFeedsSchema)],
      handleRequest(this.getFeeds)
    );
    this.router.post(
      `${this.path}/feed`,
      [
        createContentLimiter,
        this.authMiddleware.checkUser,
        upload.single("sum_random_file"),
        validateRequest(updateFeedSchema),
      ],
      handleRequest(this.postFeeds)
    );
    this.router.put(
      `${this.path}/feed/:feedId`,
      [
        createContentLimiter,
        this.authMiddleware.checkUser,
        upload.single("sum_random_file"),
        validateRequest(updateFeedSchema),
      ],
      handleRequest(this.updateFeeds)
    );
    this.router.delete(
      `${this.path}/feed/:feedId`,
      [createContentLimiter, this.authMiddleware.checkUser],
      handleRequest(this.deleteFeeds)
    );
  }
}

export default FeedController;
