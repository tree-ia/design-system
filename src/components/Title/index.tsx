import React from "react";

export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  weight?: "normal" | "medium" | "semibold" | "bold" | "extrabold";
  align?: "left" | "center" | "right";
  color?: string;
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

const defaultSizeByLevel: Record<number, string> = {
  1: "text-2xl",
  2: "text-xl",
  3: "text-lg",
  4: "text-base",
  5: "text-sm",
  6: "text-sm",
};

const customSizes: Record<string, string> = {
  xs: "text-sm",
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
  xl: "text-2xl",
  "2xl": "text-2xl",
  "3xl": "text-4xl",
};

const weightStyles: Record<string, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
};

const alignStyles: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export function Title({
  children,
  level = 1,
  size,
  weight = "semibold",
  align = "left",
  color,
  className,
  ...props
}: TitleProps) {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  const sizeClass = size ? customSizes[size] : defaultSizeByLevel[level];
  const colorClass = color || "text-[var(--dashboard-text-primary,#d7dae0)]";

  return (
    <Tag
      className={cn(
        sizeClass,
        weightStyles[weight],
        alignStyles[align],
        colorClass,
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
