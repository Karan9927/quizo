import { useState } from "react";
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
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "sonner";
import { API_URL } from "@/constant";

export default function CreateQuizPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Title and description are required");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User ID is required.");
        return;
      }

      await axios.post(`${API_URL}/api/quizzes`, {
        title,
        description,
        userId: userId,
      });

      setTitle("");
      setDescription("");

      toast.success("Quiz created successfully !");

      navigate("/");
    } catch (error) {
      console.error("Error creating quiz:", error);
      setError("Failed to create quiz. Please try again.");
    }
  };

  return (
    <DashboardLayout>
      <Card className="max-w-2xl mx-auto ">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl flex items-center">
            <PlusCircle className="mr-2" />
            Create New Quiz
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
              Create Quiz
            </Button>
          </CardFooter>
        </form>
      </Card>
    </DashboardLayout>
  );
}
