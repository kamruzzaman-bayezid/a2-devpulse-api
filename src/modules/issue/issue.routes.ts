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
router.get("/:id", issueController.getSingleIssueFromDb);
router.patch("/:id",auth(), issueController.updateIssueFromDb);

export const issueRoutes = router;
