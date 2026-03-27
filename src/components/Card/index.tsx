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
      className={`bg-[var(--dashboard-surface,#ffffff)] rounded-xl border border-[var(--dashboard-text-secondary,#64748B)]/12 transition-shadow duration-200 ease-out dashboard-shadow-sm hover:dashboard-shadow-md ${className}`}
    >
      <div className="p-5">
        {title && (
          <div className={showDivider ? "mb-5" : "mb-3"}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {icon && (
                  <div className="text-[var(--dashboard-text-secondary,#64748B)]">{icon}</div>
                )}
                <h3
                  className={`${showDivider ? "font-medium" : "text-base font-semibold"} text-[var(--dashboard-text-primary,#0F172A)] truncate tracking-tight`}
                >
                  {title}
                </h3>
              </div>
              {headerActions && (
                <div className="flex gap-2">{headerActions}</div>
              )}
            </div>
            {subtitle && (
              <p className="text-sm text-[var(--dashboard-text-secondary,#64748B)] mt-1">
                {subtitle}
              </p>
            )}
            {showDivider && (
              <div className="w-full h-px bg-[var(--dashboard-text-secondary,#64748B)]/10 mt-5" />
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
