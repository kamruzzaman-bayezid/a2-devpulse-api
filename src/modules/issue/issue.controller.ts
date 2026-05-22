import type { NextFunction, Request, Response } from "express";
import { issueService } from "./issue.service";
import { sendCreated, sendSuccess } from "../../utils/sendResponse";
import type { JwtPayload } from "jsonwebtoken";

const createIssueIntoDB = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const reporter_id = Number(req.user?.id);
    const result = await issueService.createIssueIntoDB(req.body, reporter_id);

    sendCreated(res, "Issue created successfully", result);
  } catch (error) {
    next(error);
  }
};

const getAllIssueFromDb = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await issueService.getAllIssueFromDb();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleIssueFromDb = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await issueService.getSingleIssueFromDb(
      Number(req.params.id),
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateIssueFromDb = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await issueService.updateIssueFromDb(
      Number(req.params.id),
      req.body,
      req.user as JwtPayload,
    );
    console.log("result:", result);
    sendSuccess(res, "Issue updated successfully", result, 200);
  } catch (error) {
    next(error);
  }
};

export const issueController = {
  createIssueIntoDB,
  getAllIssueFromDb,
  getSingleIssueFromDb,
  updateIssueFromDb,
};
