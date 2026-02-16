"use client";

import { useTheme } from "../hooks/useTheme";
import { Moon, Sun } from "lucide-react";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-surface-card hover:bg-surface-hover active:bg-surface-active
        border border-border-subtle
        transition-all duration-200 active:scale-98"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-text-secondary" />
      ) : (
        <Sun className="w-5 h-5 text-text-secondary" />
      )}
    </button>
  );
}
