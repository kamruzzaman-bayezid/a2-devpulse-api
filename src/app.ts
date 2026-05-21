import express, { type Request, type Response } from "express";
import initDb from "./db";
const app = express();

// health check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    message:
      "A professional backend for DevPulse – Internal Tech Issue & Feature Tracker!",
  });
});

// initialize database
initDb();

export default app;
