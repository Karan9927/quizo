import { Request, Response } from "express";
import { supabase } from "../supabaseClient";

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, username, password")
      .eq("username", username)
      .single();

    if (error || !data) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    if (password !== data.password) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    res.status(200).json({
      message: "Login successful",
      userId: data.id,
    });
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

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .single();

    if (userError || !userData) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const { data, error } = await supabase
      .from("quizzes")
      .insert([{ title, description, userId }])
      .select();

    if (error) throw error;

    res.status(201).json(data?.[0]);
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

    const { data, error } = await supabase
      .from("quizzes")
      .select("*")
      .eq("teacher_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
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

    const { data, error } = await supabase
      .from("quizzes")
      .select("*")
      .eq("id", id)
      .eq("teacher_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        res.status(404).json({ error: "Quiz not found" });
        return;
      }
      throw error;
    }

    res.json(data);
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

    if (!id) {
      res.status(400).json({ error: "Quiz ID is required" });
      return;
    }

    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    if (!title && !description) {
      res
        .status(400)
        .json({ error: "At least one field to update is required" });
      return;
    }

    const { data, error } = await supabase
      .from("quizzes")
      .update({ title, description })
      .eq("teacher_id", userId)
      .eq("id", id)
      .select();

    if (error) throw error;

    if (!data?.length) {
      res.status(404).json({ error: "Quiz not found" });
      return;
    }

    res.json(data[0]);
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

    const { error } = await supabase
      .from("quizzes")
      .delete()
      .eq("id", id)
      .eq("teacher_id", userId);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    console.error("Delete quiz error:", error);
    res.status(500).json({ error: "Error deleting quiz" });
  }
};
