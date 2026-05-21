import type { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";
import { sendCreated, sendSuccess } from "../../utils/sendResponse";

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

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(req.body);
    sendSuccess(res, "Login successful", result, 200);
  } catch (error) {
    next(error);
  }
};

export const authController = { registration, login };
