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
  /**
   * @swagger
   * /api/register:
   *   post:
   *     summary: This is the endpoint to register new informations to create a new account
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                type: string
   *                example: fluffy@gmail.com
   *               username:
   *                type: string
   *                example: fluffy222
   *               name:
   *                type: string
   *                example: fluffy
   *               password:
   *                type: string
   *                example: password
   *             required:
   *               - email
   *               - username
   *               - name
   *               - password
   *     responses:
   *       200:
   *         description: User registered successfully
   *       400:
   *         description: Email or Username is already taken
   * /api/login:
   *   post:
   *     summary: This is the endpoint to login to an existing account
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *              identifier:
   *               type: string
   *               example: bearish@gmail.com
   *              password:
   *               type: string
   *               example: password
   *     responses:
   *       200:
   *         description: User logged in successfully
   *       401:
   *         description: Invalid credential
   * /api/logout:
   *   post:
   *     summary: This is the endpoint to logout from the user's account
   *     responses:
   *       200:
   *         description: User logged out successfully
   * /api/self:
   *   get:
   *     summary: This is the endpoint to retrieve current user's information
   *     responses:
   *       200:
   *         description: Retrieve user successfully
   *       404:
   *         description: User not found
   * /api/users:
   *   get:
   *     summary: This is the endpoint to find all users in LinkedPurry
   *     responses:
   *       200:
   *         description: Successfully fetch all users
   *       404:
   *         description: User not found
   * /api/user/{id}:
   *   get:
   *     summary: This is the endpoint to find a specific user in LinkedPurry
   *     parameters:
   *        - name: id
   *          in: path
   *          descriptions: The id of the specific user
   *          required: true
   *          schema:
   *            type: integer
   *     responses:
   *       200:
   *         description: Successfully fetch all users
   *       404:
   *         description: User not found
   */
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
    res.cookie("token", body.token, { httpOnly: true, secure: true });
    return {
      body,
      message: "User registered successfully",
    };
  };

  login = async (req: Request, res: Response): Promise<BaseResponse> => {
    const body = await this.userService.login(req.body);
    res.cookie("token", body.token, { httpOnly: true, secure: true });
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

  logout = async (
    req: RequestWithUser,
    res: Response
  ): Promise<BaseResponse> => {
    if (req.user) {
      res.clearCookie("token");
    }
    return {
      message: "User logged out successfully",
    };
  };

  getUsers = async (req: RequestWithUser): Promise<BaseResponse> => {
    return {
      body: await this.userService.findAllUsers(req.query.query, req.user?.id),
      message: "Successfully fetch all users",
    };
  };

  getUser = async (req: Request): Promise<BaseResponse> => {
    return {
      body: await this.userService.findLimitedUserById(BigInt(req.params.id)),
      message: "Successfully fetch user",
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
      this.authMiddleware.checkPublicUser,
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
    this.router.get(`${this.path}/user/:id(\\d+)`, handleRequest(this.getUser));
  }
}

export default AuthController;
