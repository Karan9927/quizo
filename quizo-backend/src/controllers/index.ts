import { Request, Response } from "express";
import { prisma } from "../prisma";

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || user.password !== password) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    res.status(200).json({ message: "Login successful", userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const createQuiz = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description, userId } = req.body;

    if (!title || !description || !userId) {
      res
        .status(400)
        .json({ error: "Title, description, and user ID are required" });
      return;
    }

    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        teacher: { connect: { id: userId } },
      },
    });

    res.status(201).json(quiz);
  } catch (error) {
    console.error("Create quiz error:", error);
    res.status(500).json({ error: "Error creating quiz" });
  }
};

export const getQuizzes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.query;

    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    const quizzes = await prisma.quiz.findMany({
      where: { teacher_id: userId as string },
      orderBy: { created_at: "desc" },
    });

    res.json(quizzes);
  } catch (error) {
    console.error("Get quizzes error:", error);
    res.status(500).json({ error: "Error retrieving quizzes" });
  }
};

export const getQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!id || !userId) {
      res.status(400).json({ error: "Quiz ID and User ID are required" });
      return;
    }

    const quiz = await prisma.quiz.findFirst({
      where: { id, teacher_id: userId as string },
    });

    if (!quiz) {
      res.status(404).json({ error: "Quiz not found" });
      return;
    }

    res.json(quiz);
  } catch (error) {
    console.error("Get quiz error:", error);
    res.status(500).json({ error: "Error retrieving quiz" });
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
      res.status(400).json({ error: "Quiz ID and User ID are required" });
      return;
    }

    const quiz = await prisma.quiz.update({
      where: { id },
      data: { title, description },
    });

    res.json(quiz);
  } catch (error) {
    console.error("Update quiz error:", error);
    res.status(500).json({ error: "Error updating quiz" });
  }
};

export const deleteQuiz = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!id) {
      res.status(400).json({ error: "Quiz ID is required" });
      return;
    }

    await prisma.quiz.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Delete quiz error:", error);
    res.status(500).json({ error: "Error deleting quiz" });
  }
};
