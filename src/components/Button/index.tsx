import React from "react";
import { Loading } from "../Loading";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  iconPosition = "left",
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "font-medium rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center";

  const variantStyles = {
    primary: "bg-[var(--dashboard-primary,#37a501)] text-white hover:opacity-90",
    secondary:
      "bg-[var(--dashboard-text-secondary,#6b7280)]/20 text-[var(--dashboard-text-primary,#2d2d2d)] hover:bg-[var(--dashboard-text-secondary,#6b7280)]/30",
    danger: "bg-[var(--dashboard-status-danger,#EF4444)] text-white hover:opacity-90",
    ghost:
      "bg-transparent hover:bg-[var(--dashboard-text-secondary,#6b7280)]/10 text-[var(--dashboard-text-primary,#2d2d2d)]",
  };

  const sizeStyles = {
    sm: "px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm",
    md: "px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base",
    lg: "px-4 py-2 text-base sm:px-6 sm:py-3 sm:text-lg",
  };

  const iconOnlySizeStyles = {
    sm: "w-7 h-7 sm:w-8 sm:h-8",
    md: "w-9 h-9 sm:w-10 sm:h-10",
    lg: "w-10 h-10 sm:w-12 sm:h-12",
  };

  const isIconOnly =
    !!icon &&
    (children === undefined ||
      children === null ||
      (typeof children === "string" && children.trim() === ""));

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        isIconOnly ? iconOnlySizeStyles[size] : sizeStyles[size],
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loading size="sm" color="currentColor" />
          Carregando...
        </span>
      ) : isIconOnly ? (
        icon
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span className="mr-2">{icon}</span>
          )}
          {children}
          {icon && iconPosition === "right" && (
            <span className="ml-2">{icon}</span>
          )}
        </>
      )}
    </button>
  );
}
