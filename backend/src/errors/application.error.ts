export default class ApplicationError extends Error {
  public status = 500;
  public message: string = "Internal server error";
  public fieldErrors: any;

  constructor(message?: string, status?: number, fieldErrors?: any) {
    super();
    if (message != null) {
      this.message = message;
    }

    if (status != null) {
      this.status = status;
    }

    if (fieldErrors) {
      this.fieldErrors = fieldErrors;
    }
  }
}
