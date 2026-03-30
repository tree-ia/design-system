"use client";

import React from "react";
import { Moon, Sun, Monitor } from "lucide-react";

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeSwitcherProps {
  /** Current theme mode */
  mode: ThemeMode;
  /** Called when the user selects a different mode */
  onModeChange: (mode: ThemeMode) => void;
  className?: string;
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

const modes: {
  value: ThemeMode;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
}[] = [
  { value: "light", icon: Sun, label: "Claro" },
  { value: "dark", icon: Moon, label: "Escuro" },
  { value: "system", icon: Monitor, label: "Sistema" },
];

export function ThemeSwitcher({
  mode,
  onModeChange,
  className,
}: ThemeSwitcherProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-lg bg-[var(--dashboard-background,#f2f2f2)] p-1",
        className,
      )}
    >
      {modes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => onModeChange(value)}
          className={cn(
            "flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            mode === value
              ? "bg-[var(--dashboard-surface,#ffffff)] text-[var(--dashboard-text-primary,#2d2d2d)] shadow-sm"
              : "text-[var(--dashboard-text-secondary,#6b7280)] hover:text-[var(--dashboard-text-primary,#2d2d2d)]",
          )}
          title={label}
        >
          <Icon size={14} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
