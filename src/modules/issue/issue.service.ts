import type { JwtPayload } from "jsonwebtoken";
import { pool } from "../../db";
import { AppError } from "../../utils/AppError";
import type { IIssueInput } from "./issue.types";
import { UserRole } from "../../types";

const createIssueIntoDB = async (payload: IIssueInput, reporter_id: number) => {
  if (Object.keys(payload).length === 0) {
    throw new AppError(
      "Required fields are missing. Request body cannot be empty.",
      400,
    );
  }

  const { title, description, type } = payload;
  const result = await pool.query(
    `
            INSERT INTO issues (title, description, type, reporter_id) VALUES ($1, $2, $3, $4) RETURNING *
            `,
    [title, description, type, reporter_id],
  );

  return result.rows[0];
};

const getAllIssueFromDb = async () => {
  const issueResult = await pool.query(`SELECT * FROM issues`);
  const issues = issueResult.rows;

  const reporterIds = issues.map((issue) => issue.reporter_id);
  const uniqueIds = [...new Set(reporterIds)];

  const reporterResult = await pool.query(
    `SELECT id,name,role FROM users WHERE id=ANY($1)`,
    [uniqueIds],
  );
  const reporters = reporterResult.rows;

  const reporterMap = new Map(
    reporters.map((reporter) => [reporter.id, reporter]),
  );

  const issueData = issues.map((issue) => {
    return {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,
      reporter: reporterMap.get(issue.reporter_id),
      created_at: issue.created_at,
      updated_at: issue.updated_at,
    };
  });

  return issueData;
};

const getSingleIssueFromDb = async (id: number) => {
  const issueResult = await pool.query(`SELECT * FROM issues WHERE id=$1`, [
    id,
  ]);

  if (issueResult.rows.length === 0) {
    throw new AppError("Issue not found", 404);
  }

  const issue = issueResult.rows[0];

  const reporterResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id=$1`,
    [issue?.reporter_id],
  );

  const reporter = reporterResult.rows[0];

  const issueData = {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: reporter,
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };

  return issueData;
};

const updateIssueFromDb = async (
  id: number,
  payload: IIssueInput,
  user: JwtPayload,
) => {
  // Checked is payload is empty or not
  if (Object.keys(payload).length === 0) {
    throw new AppError("Request body cannot be empty", 400);
  }

  // Check is issue exists in db
  const issueResult = await pool.query(`SELECT * FROM issues WHERE id=$1`, [
    id,
  ]);

  if (issueResult.rows.length === 0) {
    throw new AppError("Issue is not found", 404);
  }

  const issue = issueResult.rows[0];

  // Validation For Contributor
  if (user.role === UserRole.contributor) {
    if (user.id !== issue.reporter_id) {
      throw new AppError("Forbidden Access", 403);
    }
    if (issue.status !== "open") {
      throw new AppError("You can only update open issues", 403);
    }

    if (payload.status) {
      throw new AppError("Contributors cannot update status", 403);
    }
  }

  const allowedFields =
    user.role === UserRole.maintainer
      ? ["title", "description", "type", "status"]
      : ["title", "description", "type"];

  const keys = Object.keys(payload).filter((key) =>
    allowedFields.includes(key),
  );

  if (keys.length === 0) {
    throw new AppError("No valid fields provided to update", 400);
  }

  const values = keys.map((key) => payload[key as keyof IIssueInput]);
  const queryValues = [...values, id];

  const setClause = keys.map((key, index) => `${key}=$${index + 1}`).join(",");

  const res = await pool.query(
    `UPDATE issues SET ${setClause} WHERE id=$${queryValues.length} RETURNING *`,
    queryValues,
  );

  return res.rows[0];
};

const deleteIssueFromDb = async (id: number) => {
  const res = await pool.query(`SELECT * FROM issues WHERE id=$1`, [id]);
  
  if (res.rows.length === 0) {
    throw new AppError("Issue not found", 404);
  }

  await pool.query(`DELETE FROM issues WHERE id=$1`, [id]);
};

export const issueService = {
  createIssueIntoDB,
  getAllIssueFromDb,
  getSingleIssueFromDb,
  updateIssueFromDb,
  deleteIssueFromDb,
};
