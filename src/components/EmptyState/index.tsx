import React, { ReactNode } from "react";
import { Inbox } from "lucide-react";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-6 text-center",
        className,
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--dashboard-text-secondary,#6b7280)]/10 mb-4">
        {icon || (
          <Inbox className="h-8 w-8 text-[var(--dashboard-text-secondary,#6b7280)]" />
        )}
      </div>

      <h3 className="text-lg font-semibold text-[var(--dashboard-text-primary,#2d2d2d)]">
        {title}
      </h3>

      {description && (
        <p className="mt-2 max-w-sm text-sm text-[var(--dashboard-text-secondary,#6b7280)]">
          {description}
        </p>
      )}

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
