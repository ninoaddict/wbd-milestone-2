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
    const token = req.cookies["auth_token"];
    return token;
  };

  checkUser = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = this.extractToken(req);
      if (!token) {
        throw new Unauthorized();
      }
      const decoded = jwtService.decode(token);
      const validDecoded =
        decoded.id && decoded.email && decoded.iat && decoded.exp;
      if (!validDecoded) {
        throw new Unauthorized();
      }

      const currTime = Date.now();

      if (decoded.exp < currTime) {
        res.clearCookie("auth_token");
        throw new Unauthorized("Token expired");
      }

      if (currTime < decoded.iat) {
        res.clearCookie("auth_token");
        throw new Unauthorized("Token issued in the future");
      }

      req.user = await this.userService.findUserByEmail(decoded.email);
      next();
    } catch (error) {
      next(error);
    }
  };

  checkUserUpload = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = this.extractToken(req);
      if (!token) {
        throw new Unauthorized();
      }
      const decoded = jwtService.decode(token);
      const validDecoded =
        decoded.id && decoded.email && decoded.iat && decoded.exp;
      if (!validDecoded) {
        throw new Unauthorized();
      }

      const currTime = Date.now();

      if (decoded.exp < currTime) {
        res.clearCookie("auth_token");
        throw new Unauthorized("Token expired");
      }

      if (currTime < decoded.iat) {
        res.clearCookie("auth_token");
        throw new Unauthorized("Token issued in the future");
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

  checkAuthUser = (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const token = this.extractToken(req);
      if (!token) {
        return next();
      }

      const decoded = jwtService.decode(token);
      const validDecoded =
        decoded.id && decoded.email && decoded.iat && decoded.exp;

      const currTime = Date.now();

      if (!validDecoded || decoded.exp < currTime || currTime < decoded.iat) {
        res.clearCookie("auth_token");
        next();
      } else {
        throw new Unauthorized("You have to log out first");
      }
    } catch (error) {
      next(error);
    }
  };

  checkPublicUser = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = this.extractToken(req);
      if (!token) {
        return next();
      }
      const decoded = jwtService.decode(token);
      const validDecoded =
        decoded.id && decoded.email && decoded.iat && decoded.exp;
      if (!validDecoded) {
        throw new Unauthorized();
      }

      const currTime = Date.now();
      if (decoded.exp < currTime) {
        res.clearCookie("auth_token");
        return next();
      }

      if (currTime < decoded.iat) {
        res.clearCookie("auth_token");
        return next();
      }

      req.user = await this.userService.findUserByEmail(decoded.email);
      next();
    } catch (error) {
      next(error);
    }
  };
}
