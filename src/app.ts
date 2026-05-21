import express, { type Request, type Response } from "express";
const app = express();




app.get("/", (req: Request, res: Response) => {
  res.send(
    "A professional backend for DevPulse – Internal Tech Issue & Feature Tracker!",
  );
});

export default app;
