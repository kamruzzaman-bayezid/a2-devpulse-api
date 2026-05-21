import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { sendError } from "../utils/sendResponse";

interface IPostgresError extends Error {
  code: string;
  detail?: string;
  constraint?: string;
}

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let statusCode: number = 500;
  let message: string = "Internal Server Error";
  let errorDetails: unknown = err;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorDetails = err.message;
  } else if (err instanceof Error && "code" in err) {
    const postgresErr = err as IPostgresError;
    statusCode = 400;
    errorDetails = {
      detail: postgresErr.detail || null,
      message: postgresErr.message,
      constraint: postgresErr.constraint || null,
    };

    if (postgresErr.code === "23505") {
      message = "This email is already registered.";
    } else if (postgresErr.code === "23514") {
      message = "Validation failed: Database constraint violation.";
    } else {
      message = "A database error occurred while processing your request.";
    }
  } else if (err instanceof Error) {
    message = err.message;
  }

  sendError(res, message, errorDetails, statusCode);
};
