import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-8 rounded-full bg-secondary border border-border transition-all duration-300 hover:shadow-md hover:scale-105 group"
      aria-label="Toggle theme"
    >
      <div
        className={`absolute top-0.5 left-0.5 w-7 h-7 rounded-full bg-card shadow-sm transition-all duration-300 flex items-center justify-center border border-border/50 group-hover:border-border ${
          theme === "dark" ? "translate-x-6" : "translate-x-0"
        }`}
      >
        {theme === "light" ? (
          <Sun className="h-4 w-4 text-accent transition-all duration-300" />
        ) : (
          <Moon className="h-4 w-4 text-accent transition-all duration-300" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
