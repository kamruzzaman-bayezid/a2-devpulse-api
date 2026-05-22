import { pool } from "../../db";
import { AppError } from "../../utils/AppError";
import type { IIssueInput } from "./issue.types";

const createIssueIntoDB = async (payload: IIssueInput, reporter_id: number) => {
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

  const issue = issueResult.rows[0] ?? null;

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

export const issueService = {
  createIssueIntoDB,
  getAllIssueFromDb,
  getSingleIssueFromDb,
};
