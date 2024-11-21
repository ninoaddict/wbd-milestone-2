import ApplicationError from "errors/application.error";

export default class Unauthorized extends ApplicationError {
  constructor(message?: string) {
    super(message || "Unauthorized exception", 401);
  }
}
