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
    "font-medium rounded-lg transition-all duration-200 ease-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dashboard-primary,#2563EB)] active:scale-[0.97]";

  const variantStyles = {
    primary:
      "bg-[var(--dashboard-primary,#2563EB)] text-white hover:brightness-110 hover:shadow-md",
    secondary:
      "bg-[var(--dashboard-text-secondary,#64748B)]/10 text-[var(--dashboard-text-primary,#0F172A)] border border-[var(--dashboard-text-secondary,#64748B)]/20 hover:bg-[var(--dashboard-text-secondary,#64748B)]/15 hover:border-[var(--dashboard-text-secondary,#64748B)]/30",
    danger:
      "bg-[var(--dashboard-status-danger,#DC2626)] text-white hover:brightness-110 hover:shadow-md",
    ghost:
      "bg-transparent hover:bg-[var(--dashboard-text-secondary,#64748B)]/8 text-[var(--dashboard-text-primary,#0F172A)]",
  };

  const sizeStyles = {
    sm: "h-8 px-2 text-xs sm:px-3 sm:text-sm",
    md: "h-9 px-3 text-sm sm:px-4 sm:text-base",
    lg: "h-10 px-4 text-base sm:px-6 sm:text-lg",
  };

  const iconOnlySizeStyles = {
    sm: "h-8 w-8",
    md: "h-9 w-9",
    lg: "h-10 w-10",
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
