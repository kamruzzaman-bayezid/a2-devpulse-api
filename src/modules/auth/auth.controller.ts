import type { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";
import { sendCreated } from "../../utils/sendResponse";

const registration = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await authService.registration(req.body);
    sendCreated(res, "User registered successfully", result);
  } catch (error) {
    next(error);
  }
};

export const authController = { registration };
