"use client";

import React, { ReactNode } from "react";

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  label?: string;
  error?: string;
  children?: ReactNode;
  size?: "sm" | "md" | "lg";
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

const sizeStyles = {
  sm: "h-8 px-2.5 text-sm",
  md: "h-10 px-3 text-sm",
  lg: "h-12 px-4 text-base",
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      children,
      id,
      size = "md",
      ...props
    },
    ref,
  ) => {
    const inputId =
      id ||
      (label ? `input-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--dashboard-text-primary,#d7dae0)] mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          <input
            type={type}
            id={inputId}
            className={cn(
              "flex w-full rounded-md border border-[var(--dashboard-border,#3e4451)] bg-[var(--dashboard-surface,#272c33)] text-[var(--dashboard-text-primary,#d7dae0)] transition-colors duration-200 focus:border-[var(--dashboard-primary,#e74410)] placeholder:text-[var(--dashboard-text-secondary,#9da5b3)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              sizeStyles[size],
              error
                ? "border-[var(--dashboard-status-danger,#ef4444)] focus:border-[var(--dashboard-status-danger,#ef4444)]"
                : undefined,
              children ? "pr-10" : undefined,
              className,
            )}
            ref={ref}
            {...props}
          />
          {children && (
            <div className="absolute right-3 flex items-center">{children}</div>
          )}
        </div>
        {error && (
          <p className="text-[var(--dashboard-status-danger,#ef4444)] text-xs mt-1">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
