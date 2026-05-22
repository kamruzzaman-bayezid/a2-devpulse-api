import { Router } from "express";
import { issueController } from "./issue.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../../types";

const router = Router();

router.post(
  "/",
  auth(UserRole.contributor, UserRole.maintainer),
  issueController.createIssueIntoDB,
);
router.get("/", issueController.getAllIssueFromDb);

export const issueRoutes = router;
