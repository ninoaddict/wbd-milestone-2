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
   * /api/feed/{userId}:
   *    get:
   *     summary: This is the endpoint to get the specific user's feeds
   *     parameters:
   *       - name: userId
   *         in: path
   *         descriptions: The id of the specific user
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Feeds retrieved successfully
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
    // console.log(req.query.limit, req.query.cursor)
    if (req.query.cursor) {
      return {
        body: await this.feedService.getFeeds(
          req.query.limit,
          req.query.cursor,
          req.user?.id
        ),
        message: "Feeds retrieved successfully",
      };
    } else {
      return {
        body: await this.feedService.getFeeds(
          req.query.limit,
          BigInt(0),
          req.user?.id
        ),
        message: "Feeds retrieved successfully",
      };
    }
  };

  getMyFeeds = async (req: RequestWithUser): Promise<BaseResponse> => {
    return {
      body: await this.feedService.getMyFeeds(req.user?.id),
      message: "Feeds retrieved successfully",
    };
  };

  postFeeds = async (req: RequestWithUser): Promise<BaseResponse> => {
    await this.feedService.postFeeds(req.user?.id, req.body.content);
    return {
      message: "Feeds posted successfully",
    };
  };

  updateFeeds = async (req: Request): Promise<BaseResponse> => {
    return {
      body: await this.feedService.updateFeeds(
        BigInt(req.params.feedId),
        req.body.content
      ),
      message: "Feeds edited successfully",
    };
  };

  deleteFeeds = async (req: Request): Promise<BaseResponse> => {
    return {
      body: await this.feedService.deleteFeeds(BigInt(req.params.feedId)),
      message: "Feeds deleted successfully",
    };
  };

  private initRoutes() {
    this.router.get(
      `${this.path}/feed`,
      this.authMiddleware.checkUser,
      handleRequest(this.getFeeds)
    );
    this.router.post(
      `${this.path}/feed`,
      [
        this.authMiddleware.checkUser,
        upload.single("sum_random_file"),
        validateRequest(updateFeedSchema),
      ],
      handleRequest(this.postFeeds)
    );
    this.router.put(
      `${this.path}/feed/:feedId`,
      [
        this.authMiddleware.checkUser,
        upload.single("sum_random_file"),
        validateRequest(updateFeedSchema),
      ],
      handleRequest(this.updateFeeds)
    );
    this.router.delete(
      `${this.path}/feed/:feedId`,
      this.authMiddleware.checkUser,
      handleRequest(this.deleteFeeds)
    );
    this.router.get(
      `${this.path}/feed/:userId`,
      this.authMiddleware.checkUser,
      handleRequest(this.getMyFeeds)
    );
  }
}

export default FeedController;
