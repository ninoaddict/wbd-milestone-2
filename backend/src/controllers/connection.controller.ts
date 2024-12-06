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
      message: "Connection requests fetch successfully",
    };
  };

  getAllConnections = async (req: Request): Promise<BaseResponse> => {
    return {
      body: await this.connectionService.getAllConnections(
        BigInt(req.params.id)
      ),
      message: "Connections fetch successfully",
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

  deleteConnection = async (req: RequestWithUser): Promise<BaseResponse> => {
    console.log("Aaaaaa");
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
