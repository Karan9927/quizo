import { Router, Request, Response, NextFunction } from "express";
import {
  createQuiz,
  getQuizzes,
  getQuiz,
  updateQuiz,
  deleteQuiz,
  login,
} from "../controllers";

const router = Router();

const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      console.error("Route error:", error);
      next(error);
    });
  };
};

router.post("/login", asyncHandler(login));

router.post("/quizzes", asyncHandler(createQuiz));
router.get("/quizzes", asyncHandler(getQuizzes));
router.get("/quizzes/:id", asyncHandler(getQuiz));
router.put("/quizzes/:id", asyncHandler(updateQuiz));
router.delete("/quizzes/:id", asyncHandler(deleteQuiz));

export default router;
