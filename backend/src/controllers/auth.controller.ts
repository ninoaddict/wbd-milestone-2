import { Request, Router } from "express";
import Controller from "@/interfaces/controller";
import { BaseResponse } from "@/interfaces/base-response";
import { handleRequest } from "../utils/handle-request";

class AuthController implements Controller {
  public path = "/api";
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  register = async (_: Request): Promise<BaseResponse> => {
    return { data: "halo", message: "berhasil register" };
  };

  login = async (_: Request): Promise<BaseResponse> => {
    return { data: "halo", message: "berhasil login" };
  };

  private initializeRoutes() {
    this.router.get(`${this.path}/register`, handleRequest(this.register));
    this.router.get(`${this.path}/login`, handleRequest(this.login));
  }
}

export default AuthController;
