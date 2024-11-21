import { NextFunction, Request, Response } from "express";
import ApplicationError from "../errors/application.error";
import { BaseResponse } from "@interfaces/base-response";

export const handleRequest = (
  handler: (req: Request) => Promise<BaseResponse>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, message, data } = await handler(req);
      res
        .status(status || 200)
        .send({ message: message || "HTTP request OK", data });
      next();
    } catch (err) {
      console.log(err);
      if (err instanceof ApplicationError) {
        return next(err);
      }
      next(new ApplicationError());
    }
  };
};
