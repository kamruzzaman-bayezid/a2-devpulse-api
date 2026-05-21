export class AppError extends Error {
  public success: boolean;
  public statusCode: number;

  constructor(message: string, success: boolean, statusCode: number) {
    super(message);
    this.success = success;
    this.statusCode = statusCode;
  }
}
