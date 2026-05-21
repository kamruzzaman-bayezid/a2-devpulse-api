import type { NextFunction, Request, Response } from "express";

const globalErrorHandler = (
  err: unknown = null,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  
};

export default globalErrorHandler;
