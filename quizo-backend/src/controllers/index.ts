import { Request, Response } from "express";
import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";

interface QuizInput {
  title: string;
  description: string;
  userId: string;
}

interface LoginInput {
  username: string;
  password: string;
}

const handleError = (error: unknown, res: Response, message: string) => {
  console.error(`${message}:`, error);
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Resource already exists",
      });
    }
  }
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password }: LoginInput = req.body;

  if (!username?.trim() || !password?.trim()) {
    res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username: username.trim() },
      select: {
        id: true,
        username: true,
        password: true,
      },
    });

    if (!user || user.password !== password) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        userId: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    handleError(error, res, "Login error");
  }
};

export const createQuiz = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description, userId }: QuizInput = req.body;

    if (!title?.trim() || !description?.trim() || !userId?.trim()) {
      res.status(400).json({
        success: false,
        message: "Title, description, and user ID are required",
      });
      return;
    }

    const quiz = await prisma.quiz.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        teacher: { connect: { id: userId.trim() } },
      },
    });

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      data: quiz,
    });
  } catch (error) {
    handleError(error, res, "Create quiz error");
  }
};

export const getQuizzes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== "string") {
      res.status(400).json({
        success: false,
        message: "Valid user ID is required",
      });
      return;
    }

    const quizzes = await prisma.quiz.findMany({
      where: { teacher_id: userId },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        created_at: true,
        teacher_id: true,
      },
    });

    res.json({
      success: true,
      data: quizzes,
    });
  } catch (error) {
    handleError(error, res, "Get quizzes error");
  }
};

export const getQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!id?.trim() || !userId || typeof userId !== "string") {
      res.status(400).json({
        success: false,
        message: "Valid quiz ID and user ID are required",
      });
      return;
    }

    const quiz = await prisma.quiz.findFirst({
      where: {
        id: id.trim(),
        teacher_id: userId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        created_at: true,
        teacher_id: true,
      },
    });

    if (!quiz) {
      res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
      return;
    }

    res.json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    handleError(error, res, "Get quiz error");
  }
};

export const updateQuiz = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, userId } = req.body;

    if (!id?.trim() || !userId?.trim()) {
      res.status(400).json({
        success: false,
        message: "Valid quiz ID and user ID are required",
      });
      return;
    }

    const existingQuiz = await prisma.quiz.findFirst({
      where: {
        id: id.trim(),
        teacher_id: userId.trim(),
      },
    });

    if (!existingQuiz) {
      res.status(404).json({
        success: false,
        message: "Quiz not found or unauthorized",
      });
      return;
    }

    const quiz = await prisma.quiz.update({
      where: { id: id.trim() },
      data: {
        ...(title && { title: title.trim() }),
        ...(description && { description: description.trim() }),
      },
    });

    res.json({
      success: true,
      message: "Quiz updated successfully",
      data: quiz,
    });
  } catch (error) {
    handleError(error, res, "Update quiz error");
  }
};

export const deleteQuiz = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!id?.trim() || !userId || typeof userId !== "string") {
      res.status(400).json({
        success: false,
        message: "Valid quiz ID and user ID are required",
      });
      return;
    }

    const quiz = await prisma.quiz.findFirst({
      where: {
        id: id.trim(),
        teacher_id: userId,
      },
    });

    if (!quiz) {
      res.status(404).json({
        success: false,
        message: "Quiz not found or unauthorized",
      });
      return;
    }

    await prisma.quiz.delete({
      where: { id: id.trim() },
    });

    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    handleError(error, res, "Delete quiz error");
  }
};
