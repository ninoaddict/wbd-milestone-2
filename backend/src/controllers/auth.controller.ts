import { Request, Router, Response } from "express";
import Controller from "@/interfaces/controller";
import { BaseResponse } from "@/interfaces/base-response";
import { handleRequest } from "../utils/handle-request";
import { validateRequest } from "../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "../domain/schema/auth.schema";
import UserService from "../services/user.service";
import { AuthMiddleware } from "@/middlewares/auth.middleware";

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
    res.cookie("auth_token", body.token);
    return {
      body,
      message: "User registered successfully",
    };
  };

  login = async (req: Request, res: Response): Promise<BaseResponse> => {
    const body = await this.userService.login(req.body);
    res.cookie("auth_token", body.token);
    return {
      body,
      message: "User logged in successfully",
    };
  };

  logout = async (_: Request, res: Response): Promise<BaseResponse> => {
    res.clearCookie("auth_token");
    return {
      message: "User logged out successfully",
    };
  };

  getUsers = async (req: Request): Promise<BaseResponse> => {
    return {
      body: await this.userService.findAllUsers(req.query.query),
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
    this.router.get(`${this.path}/users`, handleRequest(this.getUsers));
  }
}

export default AuthController;
