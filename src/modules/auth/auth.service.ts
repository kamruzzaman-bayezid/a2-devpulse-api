import config from "../../config/env";
import { pool } from "../../db";
import { AppError } from "../../utils/AppError";
import type { ILoginInput, IRegisterInput, IUserResponse } from "./auth.types";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";

const registration = async (
  payload: IRegisterInput,
): Promise<IUserResponse> => {
  const { name, email, password, role } = payload;

  if (!name || !email || !password) {
    throw new AppError("Name, email and password are required", 400);
  }

  const userRoles = ["contributor", "maintainer"];

  if (role && !userRoles.includes(role)) {
    throw new AppError("Invalid role", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 8);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at, updated_at`,
    [name, email, hashedPassword, role],
  );

  return result.rows[0];
};

const login = async (payload: ILoginInput) => {
  const { email, password } = payload;

  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  const user = result.rows[0];

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const userData = {
    id: user?.id,
    name: user?.name,
    role: user?.role,
  };

  const token = jwt.sign(userData, config.jwt_secret, {
    expiresIn: config.jwt_expires_in,
  });

  const { password: _, ...userWithOutPassword } = user;

  return { token, user: userWithOutPassword };
};

export const authService = {
  registration,
  login,
};
