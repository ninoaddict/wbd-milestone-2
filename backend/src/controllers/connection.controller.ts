import { Request, Router } from "express";
import Controller from "@/interfaces/controller";
import { BaseResponse } from "@/interfaces/base-response";
import { handleRequest } from "../utils/handle-request";
import ConnectionService from "../services/connection.service";
import { RequestWithUser } from "@/domain/dtos/auth.dto";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validate.middleware";
import { getConnectionSchema } from "../domain/schema/connection.schema";

class ConnectionController implements Controller {
  /**
   * @swagger
   * /api/connection/requests:
   *   get:
   *     summary: This is the endpoint to get connection requests
   *     responses:
   *       200:
   *         description: Connection requests fetched successfully
   *       400:
   *         description: Bad Request
   * /api/connection/{userId}:
   *   get:
   *     summary: This is the endpoint to get the specific user's connections
   *     parameters:
   *        - name: userId
   *          in: path
   *          descriptions: The id of the specific user
   *          required: true
   *          schema:
   *            type: integer
   *     responses:
   *       200:
   *         description: Connection fetched successfully
   *       400:
   *         description: Bad Request
   * /api/connection/send/{toId}:
   *   post:
   *     summary: This is the endpoint to send connection request to the target user
   *     parameters:
   *        - name: toId
   *          in: path
   *          descriptions: The id of the specific target user
   *          required: true
   *          schema:
   *            type: integer
   *     responses:
   *       200:
   *         description: Connection fetched successfully
   *       400:
   *         description: Bad Request
   *       401:
   *         description: User already connected || Connection request has been sent || This user has sent connection request
   * /api/connection/reject/{toId}:
   *   post:
   *     summary: This is the endpoint to reject connection request to the target user
   *     parameters:
   *        - name: toId
   *          in: path
   *          descriptions: The id of the specific target user
   *          required: true
   *          schema:
   *            type: integer
   *     responses:
   *       200:
   *         description: Connection rejected successfully
   *       400:
   *         description: Bad Request
   *       401:
   *         description: Connection request has never been sent
   * /api/connection/accept/{toId}:
   *   post:
   *     summary: This is the endpoint to accept connection request to the target user
   *     parameters:
   *        - name: toId
   *          in: path
   *          descriptions: The id of the specific target user
   *          required: true
   *          schema:
   *            type: integer
   *     responses:
   *       200:
   *         description: Connection accepted successfully
   *       400:
   *         description: Bad Request
   *       401:
   *         description: Connection request has never been sent
   * /api/connection/delete/{toId}:
   *   delete:
   *     summary: This is the endpoint to unconnect target user
   *     parameters:
   *        - name: toId
   *          in: path
   *          descriptions: The id of the specific target user
   *          required: true
   *          schema:
   *            type: integer
   *     responses:
   *       200:
   *         description: Connection deleted successfully
   *       400:
   *         description: Bad Request
   *       401:
   *         description: Connection request has never been sent
   */
  public path = "/connection";
  public router = Router();
  private connectionService: ConnectionService;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.connectionService = new ConnectionService();
    this.authMiddleware = new AuthMiddleware();
    this.initRoutes();
  }

  getAllRequests = async (req: RequestWithUser): Promise<BaseResponse> => {
    return {
      body: await this.connectionService.getAllRequests(req.user!.id),
      message: "Connection requests fetched successfully",
    };
  };

  getAllConnections = async (req: Request): Promise<BaseResponse> => {
    return {
      body: await this.connectionService.getAllConnections(
        BigInt(req.params.id)
      ),
      message: "Connections fetched successfully",
    };
  };

  sendConnectionRequest = async (
    req: RequestWithUser
  ): Promise<BaseResponse> => {
    return {
      body: await this.connectionService.sendConnectionRequest(
        req.user!.id,
        BigInt(req.params.id)
      ),
      message: "Connection request sent successsfully",
    };
  };

  rejectConnectionRequest = async (
    req: RequestWithUser
  ): Promise<BaseResponse> => {
    return {
      body: await this.connectionService.rejectConnnectionRequest(
        BigInt(req.params.id),
        req.user!.id
      ),
      message: "Connection request rejected successfully",
    };
  };

  acceptConnectionRequest = async (
    req: RequestWithUser
  ): Promise<BaseResponse> => {
    return {
      body: await this.connectionService.acceptConnectionRequest(
        BigInt(req.params.id),
        req.user!.id
      ),
      message: "Connection request accepted successfully",
    };
  };

  getRecommendations = async (req: RequestWithUser): Promise<BaseResponse> => {
    return {
      body: await this.connectionService.getRecommendations(req.user?.id!),
      message: "Successfully get recommendations",
    };
  };

  deleteConnection = async (req: RequestWithUser): Promise<BaseResponse> => {
    return {
      body: await this.connectionService.deleteConnection(
        BigInt(req.params.id),
        req.user!.id
      ),
      message: "Connection deleted successfully",
    };
  };

  private initRoutes() {
    this.router.get(
      `${this.path}/requests`,
      this.authMiddleware.checkUser,
      handleRequest(this.getAllRequests)
    );

    this.router.get(
      `${this.path}/:id(\\d+)`,
      validateRequest(getConnectionSchema),
      handleRequest(this.getAllConnections)
    );

    this.router.get(
      `${this.path}/recommendation`,
      this.authMiddleware.checkUser,
      handleRequest(this.getRecommendations)
    );

    this.router.post(
      `${this.path}/send/:id(\\d+)`,
      this.authMiddleware.checkUser,
      handleRequest(this.sendConnectionRequest)
    );

    this.router.post(
      `${this.path}/reject/:id(\\d+)`,
      [this.authMiddleware.checkUser, validateRequest(getConnectionSchema)],
      handleRequest(this.rejectConnectionRequest)
    );

    this.router.post(
      `${this.path}/accept/:id(\\d+)`,
      [this.authMiddleware.checkUser, validateRequest(getConnectionSchema)],
      handleRequest(this.acceptConnectionRequest)
    );

    this.router.delete(
      `${this.path}/delete/:id(\\d+)`,
      this.authMiddleware.checkUser,
      handleRequest(this.deleteConnection)
    );
  }
}

export default ConnectionController;
