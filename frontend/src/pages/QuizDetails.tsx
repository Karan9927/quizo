import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Edit2 } from "lucide-react";
import axios from "axios";
import { Skeleton } from "../components/ui/skeleton";
import { useNavigate, useParams } from "react-router";
import { Quiz } from "../types";
import { Badge } from "@/components/ui/badge";
import { API_URL } from "@/constant";

export default function QuizDetailsPage() {
  const [quiz, setQuiz] = useState<Quiz>({
    id: 0,
    title: "",
    description: "",
    created_at: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          setError("User not logged in.");
          return;
        }

        const response = await axios.get(`${API_URL}/api/quizzes/${id}`, {
          params: { userId },
        });
        setQuiz(response.data.data);
      } catch (err) {
        console.error("Error fetching quiz data:", err);
        setError("Failed to load quiz. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [id]);

  const SkeletonCard = () => (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
        <Skeleton className="h-10 w-full sm:w-[100px]" />
        <Skeleton className="h-10 w-full sm:w-[100px]" />
        <Skeleton className="h-10 w-full sm:w-[100px]" />
      </CardFooter>
    </Card>
  );

  return (
    <DashboardLayout>
      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <SkeletonCard />
      ) : (
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/edit-quiz/${id}`)}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Quiz
              </Button>
            </div>
            <CardTitle className="text-2xl md:text-3xl">{quiz.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">{quiz.description}</p>
            <Badge variant="secondary">
              Created on: {new Date(quiz.created_at).toLocaleDateString()}
            </Badge>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}
