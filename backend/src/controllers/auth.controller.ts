import { Request, Router, Response } from "express";
import Controller from "@/interfaces/controller";
import { BaseResponse } from "@/interfaces/base-response";
import { handleRequest } from "../utils/handle-request";
import { validateRequest } from "../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "../domain/schema/auth.schema";
import UserService from "../services/user.service";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { RequestWithUser } from "../domain/dtos/auth.dto";

class AuthController implements Controller {
  public path = "";
  public router = Router();
  private userService: UserService;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.userService = new UserService();
    this.authMiddleware = new AuthMiddleware();
    this.initRoutes();
  }

  register = async (req: Request, res: Response): Promise<BaseResponse> => {
    const body = await this.userService.register(req.body);
    res.cookie("auth_token", body.token, { httpOnly: true });
    return {
      body,
      message: "User registered successfully",
    };
  };

  login = async (req: Request, res: Response): Promise<BaseResponse> => {
    const body = await this.userService.login(req.body);
    res.cookie("auth_token", body.token, { httpOnly: true });
    return {
      body,
      message: "User logged in successfully",
    };
  };

  self = async (req: RequestWithUser): Promise<BaseResponse> => {
    if (!req.user) {
      return {
        message: "User not logged in",
      };
    }
    return {
      body: await this.userService.findUserById(req.user.id),
      message: "Retrieve user successfully",
    };
  };

  logout = async (_: Request, res: Response): Promise<BaseResponse> => {
    res.clearCookie("auth_token");
    return {
      message: "User logged out successfully",
    };
  };

  getUsers = async (req: RequestWithUser): Promise<BaseResponse> => {
    return {
      body: await this.userService.findAllUsers(req.user?.id),
      message: "Successfully fetch all users",
    };
  };

  private initRoutes() {
    this.router.post(
      `${this.path}/register`,
      [this.authMiddleware.checkAuthUser, validateRequest(registerSchema)],
      handleRequest(this.register)
    );
    this.router.post(
      `${this.path}/login`,
      [this.authMiddleware.checkAuthUser, validateRequest(loginSchema)],
      handleRequest(this.login)
    );
    this.router.post(
      `${this.path}/logout`,
      this.authMiddleware.checkUser,
      handleRequest(this.logout)
    );
    this.router.get(
      `${this.path}/self`,
      this.authMiddleware.checkPublicUser,
      handleRequest(this.self)
    );
    this.router.get(
      `${this.path}/users`,
      this.authMiddleware.checkPublicUser,
      handleRequest(this.getUsers)
    );
  }
}

export default AuthController;
