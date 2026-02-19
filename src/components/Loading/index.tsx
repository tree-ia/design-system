import React from "react";

export interface LoadingProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
  textColor?: string;
  color?: string;
  variant?: "spinner" | "border";
  fullscreen?: boolean;
}

const sizeMap = {
  sm: "dashboard-spinner-sm",
  md: "dashboard-spinner-md",
  lg: "dashboard-spinner-lg",
};

export function Loading({
  size = "md",
  className = "",
  text,
  textColor,
  color,
  variant = "spinner",
  fullscreen = false,
}: LoadingProps) {
  const variantClass = variant === "border" ? "dashboard-spinner-border" : "dashboard-spinner";

  const spinnerStyle = color ? { borderTopColor: color } : undefined;

  const spinner = (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${className}`}
    >
      <div
        className={`${variantClass} ${sizeMap[size]}`}
        style={spinnerStyle}
      />
      {text && (
        <p
          className="text-sm font-medium animate-pulse"
          style={{ color: textColor || color || "var(--dashboard-primary)" }}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--dashboard-background,#f2f2f2)]/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
}
