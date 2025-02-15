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
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB()
  .then(() => console.log("Database connected successfully"))
  .catch((error) => console.error("Database connection error:", error));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/api", quizRoutes);

app.all("/api/*", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

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

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

const handler = app;
export default handler;
