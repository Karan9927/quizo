import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import quizRoutes from "./routes";
import { connectDB } from "./prisma";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "https://quizo-frontend-eight.vercel.app",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.options("*", cors());

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

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

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
