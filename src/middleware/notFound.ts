import type { NextFunction, Request, Response } from "express";

const notFound = async (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} - ${req.url} not found!!`,
  });
};

export default notFound;
