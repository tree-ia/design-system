"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

export interface ThemeSwitcherProps {
  className?: string;
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const { resolvedTheme, setTheme } = useTheme();

  const toggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "relative inline-flex items-center justify-center h-9 w-9 rounded-md border border-[var(--dashboard-text-secondary,#6b7280)]/30 bg-[var(--dashboard-surface,#ffffff)] shadow-sm transition-colors cursor-pointer hover:bg-[var(--dashboard-text-secondary,#6b7280)]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dashboard-primary,#37a501)] focus-visible:ring-offset-2",
        className,
      )}
      aria-label="Alternar tema"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Alternar tema</span>
    </button>
  );
}
