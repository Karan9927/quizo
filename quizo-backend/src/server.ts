import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import quizRoutes from "./routes";
import { connectDB } from "./prisma";
import path from "path";

dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

connectDB();

app.use("/api", quizRoutes);

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  }
);

export default app;
