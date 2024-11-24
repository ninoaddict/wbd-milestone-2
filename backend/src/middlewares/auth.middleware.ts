import { RequestWithUser } from "@/domain/dtos/auth.dto";
import Unauthorized from "../errors/unauthorized.error";
import UserService from "../services/user.service";
import { Response, NextFunction } from "express";
import { jwtService } from "../services/jwt.service";

export class AuthMiddleware {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  extractToken = (req: RequestWithUser) => {
    const bearerHeader = req.headers["authorization"];

    if (!bearerHeader) {
      return "";
    }

    const bearer = bearerHeader.split(" ");

    if (bearer.length != 2 || bearer[0] != "Bearer") {
      return "";
    }
    return bearer[1];
  };

  checkUser = async (
    req: RequestWithUser,
    _res: Response,
    next: NextFunction
  ) => {
    try {
      const token = this.extractToken(req);
      if (token === "") {
        throw new Unauthorized();
      }
      const decoded = jwtService.decode(token);
      const validDecoded =
        decoded.id &&
        decoded.email &&
        decoded.username &&
        decoded.iat &&
        decoded.exp;
      if (!validDecoded) {
        throw new Unauthorized();
      }

      req.user = await this.userService.findUserByEmail(decoded.email);
      next();
    } catch (error) {
      next(error);
    }
  };

  checkUserUpload = async (
    req: RequestWithUser,
    _res: Response,
    next: NextFunction
  ) => {
    try {
      const token = this.extractToken(req);
      if (token === "") {
        throw new Unauthorized();
      }
      const decoded = jwtService.decode(token);
      const validDecoded =
        decoded.id &&
        decoded.email &&
        decoded.username &&
        decoded.iat &&
        decoded.exp;
      if (!validDecoded) {
        throw new Unauthorized();
      }

      const id = BigInt(req.params.userId);
      const user = await this.userService.findUserByEmail(decoded.email);

      if (id !== user.id) {
        throw new Unauthorized();
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };

  checkPublicUser = async (
    req: RequestWithUser,
    _res: Response,
    next: NextFunction
  ) => {
    try {
      const token = this.extractToken(req);
      if (token === "") {
        return next();
      }
      const decoded = jwtService.decode(token);
      const validDecoded =
        decoded.id &&
        decoded.email &&
        decoded.username &&
        decoded.iat &&
        decoded.exp;
      if (!validDecoded) {
        throw new Unauthorized();
      }

      req.user = await this.userService.findUserByEmail(decoded.email);
      next();
    } catch (error) {
      next(error);
    }
  };
}
