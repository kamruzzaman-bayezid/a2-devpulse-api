import type { NextFunction, Request, Response } from "express";

const registration = (req: Request, res: Response, next: NextFunction) => {
  try {

      

  } catch (error) {
    next(error);
  }
};

export const authController = { registration };
