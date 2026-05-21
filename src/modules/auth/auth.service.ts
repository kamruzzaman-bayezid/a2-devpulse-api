import { pool } from "../../db";
import type { IRegisterInput, TUserRole } from "./auth.types";
import bcrypt from "bcryptjs";

const registration = async (payload: IRegisterInput) => {
  const { name, email, password, role } = payload;

  const hashedPassword = await bcrypt.hash(password, 8);
  const userRole: TUserRole = role;

  const result = await pool.query(
    `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at, updated_at`,
    [name, email, hashedPassword, userRole],
  );

  return result.rows[0];
};

export const authService = {
  registration,
};
