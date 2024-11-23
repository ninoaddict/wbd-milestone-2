import { Request, Router } from "express";
import Controller from "@/interfaces/controller";
import { BaseResponse } from "@/interfaces/base-response";
import { handleRequest } from "../utils/handle-request";
import { validateRequest } from "../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "../domain/schema/auth.schema";
import UserService from "../services/user.service";

class AuthController implements Controller {
  public path = "";
  public router = Router();
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
    this.initRoutes();
  }

  register = async (req: Request): Promise<BaseResponse> => {
    return {
      body: await this.userService.register(req.body),
      message: "User registered successfully",
    };
  };

  login = async (req: Request): Promise<BaseResponse> => {
    return {
      body: await this.userService.login(req.body),
      message: "User logged in successfully",
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
      validateRequest(registerSchema),
      handleRequest(this.register)
    );
    this.router.post(
      `${this.path}/login`,
      validateRequest(loginSchema),
      handleRequest(this.login)
    );
    this.router.get(`${this.path}/users`, handleRequest(this.getUsers));
  }
}

export default AuthController;
