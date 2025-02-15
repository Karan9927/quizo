import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "../components/ui/badge";
import { Quiz } from "../types";
import { API_URL } from "@/constant";
import Spinner from "@/components/ui/spinner";
import { SkeletonCard } from "@/components/ui/skeleton-card";

export default function Dashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  interface QuizResponse {
    success: boolean;
    message: string;
    data: Quiz[];
  }

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!userId) {
        setError("User not logged in.");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get<QuizResponse>(
          `${API_URL}/api/quizzes`,
          {
            params: { userId },
          }
        );
        setQuizzes(response.data.data);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        if (err instanceof Error) {
          setError("Failed to load quizzes: " + err.message);
        } else {
          setError("Failed to load quizzes. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      setIsLoading(true);
      await axios.delete(`${API_URL}/api/quizzes/${id}`, {
        params: { userId },
      });
      toast.success("Quiz deleted successfully !");
      setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz.id !== id));
    } catch (err) {
      console.error("Error deleting quiz:", err);
      setError("Failed to delete quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/edit-quiz/${id}`);
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Your Quizzes</h2>

      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <SkeletonCard key={index} />
            ))}
        </div>
      )}

      {!loading && !error && quizzes.length === 0 && <p>No quizzes found.</p>}

      {!loading && quizzes.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <Card
              key={quiz.id}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">
                  <Link className="hover:underline" to={`/quiz/${quiz.id}`}>
                    {quiz.title}
                  </Link>
                </CardTitle>
                <CardDescription>{quiz.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">
                  Created on: {new Date(quiz.created_at).toLocaleDateString()}
                </Badge>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
                <Button
                  variant="outline"
                  onClick={() => handleEdit(quiz.id)}
                  className="w-full sm:w-auto flex items-center justify-center"
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(quiz.id)}
                  className="w-full sm:w-auto flex items-center justify-center"
                >
                  {isLoading ? (
                    <Spinner />
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
