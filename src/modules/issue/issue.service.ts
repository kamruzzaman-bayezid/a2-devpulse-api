import { pool } from "../../db";
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
  const result = await pool.query(`SELECT * FROM issues`);
  const issues = result.rows;

  const reporterIds = issues.map((issue) => issue.reporter_id);
  const uniqueIds = [...new Set(reporterIds)];

  const result2 = await pool.query(
    `SELECT id,name,role FROM users WHERE id=ANY($1)`,
    [uniqueIds],
  );
  const reporters = result2.rows;

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

export const issueService = { createIssueIntoDB, getAllIssueFromDb };
