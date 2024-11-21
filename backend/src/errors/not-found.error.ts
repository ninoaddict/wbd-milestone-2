import ApplicationError from "errors/application.error";

export default class NotFound extends ApplicationError {
  constructor(message?: string) {
    super(message || "Not found exception", 404);
  }
}
