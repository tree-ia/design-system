import React from "react";

export interface SkeletonProps {
  variant?: "text" | "circle" | "rectangle" | "card";
  width?: string | number;
  height?: string | number;
  animate?: boolean;
  className?: string;
  lines?: number;
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

export function Skeleton({
  variant = "text",
  width,
  height,
  animate = true,
  className,
  lines = 1,
}: SkeletonProps) {
  const baseStyles =
    "bg-[var(--dashboard-text-secondary,#6b7280)]/10 relative overflow-hidden";
  const shimmerStyles = animate
    ? "after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-[var(--dashboard-text-secondary,#6b7280)]/5 after:to-transparent dashboard-animate-shimmer after:content-['']"
    : "";

  const variantStyles: Record<string, string> = {
    text: "h-4 rounded",
    circle: "rounded-full",
    rectangle: "rounded-lg",
    card: "rounded-lg",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  if (variant === "circle" && !height) {
    style.height = style.width || "40px";
    if (!width) style.width = "40px";
  }

  if (variant === "card" && !height) {
    style.height = "120px";
  }

  if (variant === "text" && lines > 1) {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(baseStyles, shimmerStyles, variantStyles.text)}
            style={{
              ...style,
              width: i === lines - 1 ? "75%" : style.width || "100%",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseStyles, shimmerStyles, variantStyles[variant], className)}
      style={style}
    />
  );
}
