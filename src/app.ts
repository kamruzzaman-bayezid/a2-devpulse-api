import express, { type Request, type Response } from "express";
import notFoundHandler from "./middleware/notFoundHandler";
import { authRoutes } from "./modules/auth/auth.routes";
const app = express();

app.use(express.json());

// Health Check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    message:
      "A professional backend for DevPulse – Internal Tech Issue & Feature Tracker!",
  });
});

// Auth Routes
app.use("/api/auth", authRoutes);

// Handle Not Found Routes
app.use(notFoundHandler);

export default app;
