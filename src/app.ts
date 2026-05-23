import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import notFoundHandler from "./middleware/notFoundHandler";
import { authRoutes } from "./modules/auth/auth.routes";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { issueRoutes } from "./modules/issue/issue.routes";

const app: Application = express();

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send(
    "A professional backend for DevPulse – Internal Tech Issue & Feature Tracker!",
  );
});

// Auth Related Routes
app.use("/api/auth", authRoutes);

// Issue Related Route
app.use("/api/issues", issueRoutes);

// Handle Not Found Routes
app.use(notFoundHandler);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
