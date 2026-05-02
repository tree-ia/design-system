import React from "react";

export interface BadgeStatusProps {
  label: string;
  variant?: "success" | "warning" | "danger" | "info" | "neutral";
  color?: string;
  bgColor?: string;
  size?: "sm" | "md";
  className?: string;
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

const variantStyles: Record<string, { color: string; bgColor: string }> = {
  success: {
    color: "text-[var(--dashboard-status-success,#10b981)]",
    bgColor: "bg-[var(--dashboard-status-success,#10b981)]/15",
  },
  warning: {
    color: "text-[var(--dashboard-status-warning,#f59e0b)]",
    bgColor: "bg-[var(--dashboard-status-warning,#f59e0b)]/15",
  },
  danger: {
    color: "text-[var(--dashboard-status-danger,#ef4444)]",
    bgColor: "bg-[var(--dashboard-status-danger,#ef4444)]/15",
  },
  info: {
    color: "text-[var(--dashboard-status-info,#3b82f6)]",
    bgColor: "bg-[var(--dashboard-status-info,#3b82f6)]/15",
  },
  neutral: {
    color: "text-[var(--dashboard-status-neutral,#64748b)]",
    bgColor: "bg-[var(--dashboard-status-neutral,#64748b)]/15",
  },
};

const sizeClasses: Record<string, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-xs",
};

export function BadgeStatus({
  label,
  variant = "neutral",
  color,
  bgColor,
  size = "md",
  className,
}: BadgeStatusProps) {
  const styles = variantStyles[variant];
  const useCustomColors = color || bgColor;

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center justify-center rounded-md font-medium whitespace-nowrap",
        sizeClasses[size],
        !useCustomColors && styles.color,
        !useCustomColors && styles.bgColor,
        className,
      )}
      style={
        useCustomColors
          ? {
              color: color || undefined,
              backgroundColor: bgColor || undefined,
            }
          : undefined
      }
    >
      {label}
    </span>
  );
}
