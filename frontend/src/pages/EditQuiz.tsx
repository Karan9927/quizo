import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { toast } from "sonner";
import { API_URL } from "@/constant";

export default function EditQuizPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

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

        setTitle(response.data.title);
        setDescription(response.data.description);
      } catch (err) {
        console.error("Error fetching quiz data:", err);
        setError("Failed to load quiz. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Title and description are required");
      return;
    }

    const userId = localStorage.getItem("userId");

    try {
      const response = await axios.put(`${API_URL}/api/quizzes/${id}`, {
        title,
        description,
        userId,
      });

      if (response.status === 200) {
        toast.success("Quiz updated successfully !");
        navigate("/");
      }
    } catch (error) {
      console.error("Error updating quiz:", error);
      setError("Failed to update quiz. Please try again.");
    }
  };

  return (
    <DashboardLayout>
      {loading ? (
        <p>loading...</p>
      ) : (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl flex items-center">
              <Edit2 className="mr-2" />
              Edit Quiz
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Quiz Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter quiz title"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Quiz Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter quiz description"
                  className="min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
              >
                Update Quiz
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </DashboardLayout>
  );
}
