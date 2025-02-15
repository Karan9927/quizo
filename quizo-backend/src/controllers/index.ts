// controllers/index.ts
import { Request, Response } from "express";
import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";

// Type definitions for better type safety
interface QuizInput {
  title: string;
  description: string;
  userId: string;
}

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username },
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
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createQuiz = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description, userId }: QuizInput = req.body;

    if (!title?.trim() || !description?.trim() || !userId) {
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
        teacher: { connect: { id: userId } },
      },
    });

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      data: quiz,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        res.status(409).json({
          success: false,
          message: "A quiz with this title already exists",
        });
        return;
      }
    }
    console.error("Create quiz error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating quiz",
    });
  }
};

export const getQuizzes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.query;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
      });
      return;
    }

    const quizzes = await prisma.quiz.findMany({
      where: { teacher_id: userId as string },
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
    console.error("Get quizzes error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving quizzes",
    });
  }
};

export const getQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!id || !userId) {
      res.status(400).json({
        success: false,
        message: "Quiz ID and User ID are required",
      });
      return;
    }

    const quiz = await prisma.quiz.findFirst({
      where: {
        id,
        teacher_id: userId as string,
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
    console.error("Get quiz error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving quiz",
    });
  }
};

export const updateQuiz = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, userId } = req.body;

    if (!id || !userId) {
      res.status(400).json({
        success: false,
        message: "Quiz ID and User ID are required",
      });
      return;
    }

    // First check if quiz exists and belongs to user
    const existingQuiz = await prisma.quiz.findFirst({
      where: {
        id,
        teacher_id: userId,
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
      where: { id },
      data: {
        title: title?.trim(),
        description: description?.trim(),
      },
    });

    res.json({
      success: true,
      message: "Quiz updated successfully",
      data: quiz,
    });
  } catch (error) {
    console.error("Update quiz error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating quiz",
    });
  }
};

export const deleteQuiz = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!id || !userId) {
      res.status(400).json({
        success: false,
        message: "Quiz ID and User ID are required",
      });
      return;
    }

    const quiz = await prisma.quiz.findFirst({
      where: {
        id,
        teacher_id: userId as string,
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
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    console.error("Delete quiz error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting quiz",
    });
  }
};
