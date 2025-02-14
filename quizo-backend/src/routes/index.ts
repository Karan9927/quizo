import { Router, RequestHandler } from "express";
import {
  createQuiz,
  getQuizzes,
  getQuiz,
  updateQuiz,
  deleteQuiz,
  login,
} from "../controllers";

const router = Router();

const loginHandler: RequestHandler = async (req, res, next) => {
  try {
    await login(req, res);
  } catch (error) {
    next(error);
  }
};

const createQuizHandler: RequestHandler = async (req, res, next) => {
  try {
    await createQuiz(req, res);
  } catch (error) {
    next(error);
  }
};

const getQuizzesHandler: RequestHandler = async (req, res, next) => {
  try {
    await getQuizzes(req, res);
  } catch (error) {
    next(error);
  }
};

const getQuizHandler: RequestHandler = async (req, res, next) => {
  try {
    await getQuiz(req, res);
  } catch (error) {
    next(error);
  }
};

const updateQuizHandler: RequestHandler = async (req, res, next) => {
  try {
    await updateQuiz(req, res);
  } catch (error) {
    next(error);
  }
};

const deleteQuizHandler: RequestHandler = async (req, res, next) => {
  try {
    await deleteQuiz(req, res);
  } catch (error) {
    next(error);
  }
};

// Routes
router.post("/login", loginHandler);

// router.use(authMiddleware);
router.post("/quizzes", createQuizHandler);
router.get("/quizzes", getQuizzesHandler);
router.get("/quizzes/:id", getQuizHandler);
router.put("/quizzes/:id", updateQuizHandler);
router.delete("/quizzes/:id", deleteQuizHandler);

export default router;
