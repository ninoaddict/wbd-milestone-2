import ApplicationError from "./application.error";

export default class BadRequest extends ApplicationError {
  constructor(message?: string, fieldErrors?: any) {
    super(message || "Bad request exception", 400, fieldErrors);
  }
}
