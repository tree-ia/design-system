import React from "react";

export interface StatusBadgeProps {
  status: string;
  colorMap?: Record<string, string>;
  size?: "sm" | "md" | "lg";
  label?: string;
  dot?: boolean;
  className?: string;
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

const defaultColorMap: Record<string, string> = {
  ACTIVE: "var(--dashboard-status-success,#10B981)",
  APPROVED: "var(--dashboard-status-success,#10B981)",
  COMPLETED: "var(--dashboard-status-success,#10B981)",
  DELIVERED: "var(--dashboard-status-success,#10B981)",
  SUCCESS: "var(--dashboard-status-success,#10B981)",
  PENDING: "var(--dashboard-status-warning,#f59e0b)",
  IN_REVIEW: "var(--dashboard-status-warning,#f59e0b)",
  AWAITING: "var(--dashboard-status-warning,#f59e0b)",
  DRAFT: "var(--dashboard-status-warning,#f59e0b)",
  PROCESSING: "var(--dashboard-status-info,#3b82f6)",
  IN_PROGRESS: "var(--dashboard-status-info,#3b82f6)",
  SENT: "var(--dashboard-status-info,#3b82f6)",
  QUOTED: "var(--dashboard-status-info,#3b82f6)",
  CANCELLED: "var(--dashboard-status-danger,#EF4444)",
  REJECTED: "var(--dashboard-status-danger,#EF4444)",
  EXPIRED: "var(--dashboard-status-danger,#EF4444)",
  ERROR: "var(--dashboard-status-danger,#EF4444)",
  INACTIVE: "var(--dashboard-text-secondary,#6b7280)",
  ARCHIVED: "var(--dashboard-text-secondary,#6b7280)",
};

const sizeClasses: Record<string, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
  lg: "px-3 py-1 text-sm",
};

const dotSizeClasses: Record<string, string> = {
  sm: "h-1.5 w-1.5",
  md: "h-2 w-2",
  lg: "h-2.5 w-2.5",
};

function formatLabel(status: string): string {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function StatusBadge({
  status,
  colorMap,
  size = "md",
  label,
  dot = true,
  className,
}: StatusBadgeProps) {
  const merged = { ...defaultColorMap, ...colorMap };
  const normalizedStatus = status.toUpperCase().replace(/[\s-]/g, "_");
  const color = merged[normalizedStatus] || "var(--dashboard-text-secondary,#6b7280)";
  const displayLabel = label || formatLabel(status);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap",
        sizeClasses[size],
        className,
      )}
      style={{
        color,
        backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
      }}
    >
      {dot && (
        <span
          className={cn("rounded-full flex-shrink-0", dotSizeClasses[size])}
          style={{ backgroundColor: color }}
        />
      )}
      {displayLabel}
    </span>
  );
}
