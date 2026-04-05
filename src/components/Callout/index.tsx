import React, { ReactNode } from "react";
import { Info, AlertTriangle, Lightbulb, ShieldAlert } from "lucide-react";

export interface CalloutProps {
  variant?: "info" | "warning" | "tip" | "danger";
  title?: string;
  children?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

const variantConfig: Record<
  string,
  { border: string; bg: string; text: string; icon: ReactNode }
> = {
  info: {
    border: "border-[var(--dashboard-status-info,#3b82f6)]",
    bg: "bg-[var(--dashboard-status-info,#3b82f6)]/5",
    text: "text-[var(--dashboard-status-info,#3b82f6)]",
    icon: <Info className="h-4 w-4" />,
  },
  warning: {
    border: "border-[var(--dashboard-status-warning,#f59e0b)]",
    bg: "bg-[var(--dashboard-status-warning,#f59e0b)]/5",
    text: "text-[var(--dashboard-status-warning,#f59e0b)]",
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  tip: {
    border: "border-[var(--dashboard-status-success,#10B981)]",
    bg: "bg-[var(--dashboard-status-success,#10B981)]/5",
    text: "text-[var(--dashboard-status-success,#10B981)]",
    icon: <Lightbulb className="h-4 w-4" />,
  },
  danger: {
    border: "border-[var(--dashboard-status-danger,#EF4444)]",
    bg: "bg-[var(--dashboard-status-danger,#EF4444)]/5",
    text: "text-[var(--dashboard-status-danger,#EF4444)]",
    icon: <ShieldAlert className="h-4 w-4" />,
  },
};

export function Callout({
  variant = "info",
  title,
  children,
  icon,
  className,
}: CalloutProps) {
  const config = variantConfig[variant];

  return (
    <div
      className={cn(
        "rounded-lg border-l-4 p-4 my-4",
        config.border,
        config.bg,
        className,
      )}
      role="note"
    >
      <div className="flex gap-3">
        <div className={cn("flex-shrink-0 mt-0.5", config.text)}>
          {icon || config.icon}
        </div>

        <div className="flex-1 min-w-0">
          {title && (
            <p
              className={cn(
                "text-sm font-semibold",
                "text-[var(--dashboard-text-primary,#2d2d2d)]",
              )}
            >
              {title}
            </p>
          )}
          {children && (
            <div
              className={cn(
                "text-sm text-[var(--dashboard-text-secondary,#6b7280)]",
                title && "mt-1",
              )}
            >
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
