import express, { type Request, type Response } from "express";
import notFound from "./middleware/notFound";
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

// Handle Not Found Routes
app.use(notFound);

export default app;
