import React, { ReactNode } from "react";
import {
  X,
  Info,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
} from "lucide-react";

export interface AlertProps {
  variant?: "info" | "success" | "warning" | "danger";
  title?: string;
  description?: ReactNode;
  onClose?: () => void;
  actions?: ReactNode;
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
    border: "border-[var(--dashboard-border,#3e4451)]",
    bg: "bg-[var(--dashboard-status-info,#3b82f6)]/5",
    text: "text-[var(--dashboard-status-info,#3b82f6)]",
    icon: <Info className="h-5 w-5" />,
  },
  success: {
    border: "border-[var(--dashboard-border,#3e4451)]",
    bg: "bg-[var(--dashboard-status-success,#10b981)]/5",
    text: "text-[var(--dashboard-status-success,#10b981)]",
    icon: <CheckCircle className="h-5 w-5" />,
  },
  warning: {
    border: "border-[var(--dashboard-border,#3e4451)]",
    bg: "bg-[var(--dashboard-status-warning,#f59e0b)]/5",
    text: "text-[var(--dashboard-status-warning,#f59e0b)]",
    icon: <AlertTriangle className="h-5 w-5" />,
  },
  danger: {
    border: "border-[var(--dashboard-border,#3e4451)]",
    bg: "bg-[var(--dashboard-status-danger,#ef4444)]/5",
    text: "text-[var(--dashboard-status-danger,#ef4444)]",
    icon: <AlertOctagon className="h-5 w-5" />,
  },
};

export function Alert({
  variant = "info",
  title,
  description,
  onClose,
  actions,
  icon,
  className,
}: AlertProps) {
  const config = variantConfig[variant];

  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        config.border,
        config.bg,
        className,
      )}
      role="alert"
    >
      <div className="flex gap-3">
        <div className={cn("flex-shrink-0 mt-0.5", config.text)}>
          {icon || config.icon}
        </div>

        <div className="flex-1 min-w-0">
          {title && (
            <h3
              className={cn(
                "text-sm font-semibold",
                "text-[var(--dashboard-text-primary,#d7dae0)]",
              )}
            >
              {title}
            </h3>
          )}
          {description && (
            <div
              className={cn(
                "text-sm text-[var(--dashboard-text-secondary,#9da5b3)]",
                title && "mt-1",
              )}
            >
              {description}
            </div>
          )}
          {actions && <div className="mt-3 flex gap-2">{actions}</div>}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-md p-1 text-[var(--dashboard-text-secondary,#9da5b3)] hover:bg-[var(--dashboard-text-secondary,#9da5b3)]/10 transition-colors cursor-pointer"
            aria-label="Fechar alerta"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
