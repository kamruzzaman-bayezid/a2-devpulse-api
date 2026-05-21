import type { Response } from "express";

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data: T,
  statusCode: number = 200,
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendCreated = <T>(
  res: Response,
  message: string,
  data: T,
): void => {
  sendSuccess(res, message, data, 201);
};

export const sendError = (
  res: Response,
  message: string,
  errors: unknown = null,
  statusCode: number = 500,
): void => {
  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
