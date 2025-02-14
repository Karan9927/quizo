import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router";
import axios from "axios";
import { API_URL } from "@/constant";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(`${API_URL}/api/login`, {
        username,
        password,
      });

      if (response.status === 200) {
        const { userId } = response.data;

        localStorage.setItem("userId", userId);

        navigate("/");
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error && "response" in err
          ? (err as { response: { data: { error: string } } }).response.data
              .error
          : "Login failed"
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-4">
      <Card className="w-full max-w-[400px] shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <BookOpen size={48} className="text-blue-500" />
          </div>
          <CardTitle className="text-2xl text-center">Quizo</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the Quiz Management System
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
              type="submit"
            >
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
