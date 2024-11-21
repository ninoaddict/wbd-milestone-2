import { NextFunction, Request, Response } from "express";
import ApplicationError from "../errors/application.error";

export const errorMiddleware = (
  err: ApplicationError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.log(err);
  const { status, message, fieldErrors } = err;
  res.status(status).json({ message, fieldErrors });
};
