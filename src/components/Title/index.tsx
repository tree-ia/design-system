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
  1: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
  2: "text-xl sm:text-2xl md:text-3xl lg:text-4xl",
  3: "text-lg sm:text-xl md:text-2xl lg:text-3xl",
  4: "text-base sm:text-lg md:text-xl lg:text-2xl",
  5: "text-sm sm:text-base md:text-lg lg:text-xl",
  6: "text-xs sm:text-sm md:text-base lg:text-lg",
};

const customSizes: Record<string, string> = {
  xs: "text-xs sm:text-sm",
  sm: "text-sm sm:text-base",
  md: "text-base sm:text-lg",
  lg: "text-lg sm:text-xl md:text-2xl",
  xl: "text-xl sm:text-2xl md:text-3xl",
  "2xl": "text-2xl sm:text-3xl md:text-4xl",
  "3xl": "text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
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
  weight = "bold",
  align = "left",
  color,
  className,
  ...props
}: TitleProps) {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  const sizeClass = size ? customSizes[size] : defaultSizeByLevel[level];
  const colorClass = color || "text-[var(--dashboard-text-primary,#2d2d2d)]";

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
