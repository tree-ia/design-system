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
      className={`bg-[var(--dashboard-surface,#ffffff)] rounded-lg shadow-sm border border-[var(--dashboard-text-secondary,#6b7280)]/20 ${className}`}
    >
      <div className="p-4">
        {title && (
          <div className={showDivider ? "mb-4" : "mb-3"}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {icon && (
                  <div className="text-[var(--dashboard-text-secondary,#6b7280)]">{icon}</div>
                )}
                <h3
                  className={`${showDivider ? "font-medium" : "text-base font-semibold"} text-[var(--dashboard-text-primary,#2d2d2d)] truncate`}
                >
                  {title}
                </h3>
              </div>
              {headerActions && (
                <div className="flex gap-2">{headerActions}</div>
              )}
            </div>
            {subtitle && (
              <p className="text-sm text-[var(--dashboard-text-secondary,#6b7280)] mt-1">
                {subtitle}
              </p>
            )}
            {showDivider && (
              <div className="w-full h-px bg-[var(--dashboard-text-secondary,#6b7280)]/20 mt-4" />
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
