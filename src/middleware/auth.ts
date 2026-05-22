import type { NextFunction, Request, Response } from "express";
import { sendError } from "../utils/sendResponse";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config/env";
import { pool } from "../db";
import type { TUserRole } from "../modules/auth/auth.types";

const auth = (...roles: TUserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return sendError(res, "Unauthorized Access", null, 401);
      }

      const decoded = jwt.verify(token, config.jwt_secret) as JwtPayload;

      const isUserExist = await pool.query(`SELECT * FROM users WHERE id=$1`, [
        decoded.id,
      ]);

      if (isUserExist.rows.length === 0) {
        return sendError(res, "Unauthorized Access",null,401);
      }

      const user = isUserExist.rows[0];

      if (roles.length && !roles.includes(user.role)) {
        return sendError(res, "Forbidden Access", null, 403);
      }

      req.user = decoded;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
