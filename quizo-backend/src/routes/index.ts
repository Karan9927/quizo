// routes/index.ts
import { Router } from "express";
import {
  createQuiz,
  getQuizzes,
  getQuiz,
  updateQuiz,
  deleteQuiz,
  login,
} from "../controllers";

const router = Router();

const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/login", asyncHandler(login));

router.post("/quizzes", asyncHandler(createQuiz));
router.get("/quizzes", asyncHandler(getQuizzes));
router.get("/quizzes/:id", asyncHandler(getQuiz));
router.put("/quizzes/:id", asyncHandler(updateQuiz));
router.delete("/quizzes/:id", asyncHandler(deleteQuiz));

export default router;
