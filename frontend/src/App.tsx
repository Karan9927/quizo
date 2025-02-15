import { Route, Routes } from "react-router";
import Login from "./pages/Login";
import EditQuizPage from "./pages/EditQuiz";
import CreateQuizPage from "./pages/CreateQuiz";
import { Toaster } from "sonner";
import QuizDetailsPage from "./pages/QuizDetails";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/edit-quiz/:id" element={<EditQuizPage />} />
        <Route path="/create-quiz" element={<CreateQuizPage />} />
        <Route path="/quiz/:id" element={<QuizDetailsPage />} />
      </Routes>
    </>
  );
}

export default App;
