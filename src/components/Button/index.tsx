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
    "font-medium rounded-md transition-colors duration-200 ease-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dashboard-primary,#e74410)] active:scale-[0.98]";

  const variantStyles = {
    primary:
      "bg-[var(--dashboard-primary,#e74410)] text-white hover:bg-[var(--dashboard-primary-deep,#c63808)]",
    secondary:
      "bg-[var(--dashboard-surface,#272c33)] text-[var(--dashboard-text-primary,#d7dae0)] border border-[var(--dashboard-border,#3e4451)] hover:bg-[var(--dashboard-border,#3e4451)]",
    danger:
      "bg-[var(--dashboard-status-danger,#ef4444)] text-white hover:brightness-95",
    ghost:
      "bg-transparent hover:bg-[var(--dashboard-text-secondary,#9da5b3)]/8 text-[var(--dashboard-text-primary,#d7dae0)]",
  };

  const sizeStyles = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  const iconOnlySizeStyles = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
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
          {children || "Carregando..."}
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
