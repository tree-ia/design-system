import React from "react";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  headerActions?: React.ReactNode;
  showDivider?: boolean;
}

export function Card({
  children,
  className = "",
  title,
  subtitle,
  icon,
  headerActions,
  showDivider = false,
}: CardProps) {
  return (
    <div
      className={`bg-[var(--dashboard-surface,#272c33)] rounded-xl border border-[var(--dashboard-border,#3e4451)] ${className}`}
    >
      <div className="p-5">
        {title && (
          <div className={showDivider ? "mb-5" : "mb-3"}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {icon && (
                  <div className="text-[var(--dashboard-text-secondary,#9da5b3)]">
                    {icon}
                  </div>
                )}
                <h3
                  className={`${showDivider ? "font-medium" : "text-base font-semibold"} text-[var(--dashboard-text-primary,#d7dae0)] truncate tracking-tight`}
                >
                  {title}
                </h3>
              </div>
              {headerActions && (
                <div className="flex gap-2">{headerActions}</div>
              )}
            </div>
            {subtitle && (
              <p className="text-sm text-[var(--dashboard-text-secondary,#9da5b3)] mt-1">
                {subtitle}
              </p>
            )}
            {showDivider && (
              <div className="w-full h-px bg-[var(--dashboard-border,#3e4451)] mt-5" />
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
