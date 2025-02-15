import { type ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, LayoutDashboard, PlusCircle, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(
    !!localStorage.getItem("userId") ||
      localStorage.getItem("userId") === undefined
  );
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setAuthenticated(false);
    navigate("/login");
  };

  useEffect(() => {
    if (!authenticated) {
      navigate("/login");
    }
  }, [authenticated]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <header className="bg-white p-4 flex justify-between items-center md:hidden">
        <div className="flex items-center space-x-2">
          <BookOpen size={32} className="text-blue-500" />
          <span className="text-xl font-bold">Quizo</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="relative w-10 h-10 flex items-center justify-center"
        >
          <div
            className={`w-6 h-0.5 bg-gray-600 transition-all duration-300 ${
              sidebarOpen ? "rotate-45 translate-y-0.5" : ""
            }`}
          ></div>
          <div
            className={`w-6 h-0.5 bg-gray-600 transition-all duration-300 absolute ${
              sidebarOpen ? "opacity-0" : "opacity-100"
            }`}
          ></div>
          <div
            className={`w-6 h-0.5 bg-gray-600 transition-all duration-300 ${
              sidebarOpen ? "-rotate-45 -translate-y-0.5" : ""
            }`}
          ></div>
        </Button>
      </header>

      <aside
        className={`w-64 bg-white shadow-md ${
          sidebarOpen ? "block" : "hidden"
        } md:block fixed inset-y-0 left-0 z-50 overflow-y-auto transition-all duration-300 ease-in-out transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="p-4 flex items-center space-x-2">
          <BookOpen size={32} className="text-blue-500" />
          <span className="text-xl font-bold">Quizo</span>
        </div>
        <nav className="mt-8">
          <Button
            variant="ghost"
            className="w-full justify-start"
            asChild
            onClick={() => setSidebarOpen(false)}
          >
            <Link to="/">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            asChild
            onClick={() => setSidebarOpen(false)}
          >
            <Link to="/create-quiz">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Quiz
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-700"
            onClick={() => {
              handleLogout();
              setSidebarOpen(false);
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
