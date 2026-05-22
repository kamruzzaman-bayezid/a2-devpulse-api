import type { NextFunction, Request, Response } from "express";
import { sendError } from "../utils/sendResponse";
import { AppError } from "../utils/AppError";

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
  let statusCode = 500;
  let message = "Internal Server Error";
  let errorDetails: unknown = null;

  // JSON parse error
  if (
    err instanceof SyntaxError &&
    (err as any).type === "entity.parse.failed"
  ) {
    return sendError(
      res,
      "Invalid JSON format or empty request body",
      "Request body must be valid JSON",
      400,
    );
  }

  // App error
  if (err instanceof AppError) {
    return sendError(res, err.message, err.message, err.statusCode);
  }

  // Postgres error
  if (typeof err === "object" && err !== null && "code" in err) {
    const pgErr = err as IPostgresError;

    statusCode = 400;

    if (pgErr.code === "23505") {
      message = "Duplicate entry";
    } else if (pgErr.code === "23514") {
      message = "Validation failed";
    } else {
      message = "Database error";
    }

    errorDetails = pgErr.detail ?? pgErr.message;

    return sendError(res, message, errorDetails, statusCode);
  }

  // generic error
  if (err instanceof Error) {
    return sendError(res, err.message, err.message, 500);
  }

  return sendError(res, message, err, statusCode);
};
