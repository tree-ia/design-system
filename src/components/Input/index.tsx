"use client";

import React, { ReactNode } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  children?: ReactNode;
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, children, id, ...props }, ref) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--dashboard-text-primary,#2d2d2d)] mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          <input
            type={type}
            id={inputId}
            className={cn(
              "flex h-10 w-full rounded-md border border-[var(--dashboard-text-secondary,#6b7280)]/30 bg-[var(--dashboard-surface,#ffffff)] px-3 py-2 text-sm text-[var(--dashboard-text-primary,#2d2d2d)] shadow-sm transition-colors duration-200 focus:border-[var(--dashboard-primary,#37a501)] placeholder:text-[var(--dashboard-text-secondary,#6b7280)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              error ? "border-[var(--dashboard-status-danger,#EF4444)] focus:border-[var(--dashboard-status-danger,#EF4444)]" : undefined,
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
          <p className="text-[var(--dashboard-status-danger,#EF4444)] text-xs mt-1">{error}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
