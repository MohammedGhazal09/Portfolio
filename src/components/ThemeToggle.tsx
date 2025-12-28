import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed top-8 right-8 z-50 w-14 h-14 rounded-2xl glass animate-pulse" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed top-8 right-8 z-50 p-4 rounded-2xl glass hover:glass-strong transition-all duration-300 hover:scale-110 hover:shadow-glow group"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-6 w-6 text-foreground group-hover:text-primary transition-colors duration-300 group-hover:rotate-180 transition-transform" />
      ) : (
        <Moon className="h-6 w-6 text-foreground group-hover:text-primary transition-colors duration-300 group-hover:-rotate-12 transition-transform" />
      )}
    </button>
  );
};
