import ApplicationError from "./application.error";

export default class ForbiddenError extends ApplicationError {
  constructor(message?: string) {
    super(message || "Forbidden resource exception", 403);
  }
}
