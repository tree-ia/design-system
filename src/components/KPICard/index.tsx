"use client";

import React from "react";

export type KPIValueFormat = "currency" | "number" | "percentage" | "rating";

export interface KPICardProps {
  title: string;
  value: number;
  variation: number;
  trend: "up" | "down" | "stable";
  format?: KPIValueFormat;
  benchmark?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

function formatValue(value: number, format: KPIValueFormat): string {
  switch (format) {
    case "currency":
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);
    case "percentage":
      return `${value.toFixed(1)}%`;
    case "rating":
      return `${value.toFixed(1)}/5.0`;
    default:
      return new Intl.NumberFormat("pt-BR").format(value);
  }
}

const trendConfigs = {
  up: {
    icon: "\u2191",
    color:
      "text-[var(--dashboard-status-success,#059669)] bg-[var(--dashboard-status-success,#059669)]/8",
  },
  down: {
    icon: "\u2193",
    color:
      "text-[var(--dashboard-status-danger,#DC2626)] bg-[var(--dashboard-status-danger,#DC2626)]/8",
  },
  stable: {
    icon: "\u2192",
    color:
      "text-[var(--dashboard-text-secondary,#64748B)] bg-[var(--dashboard-text-secondary,#64748B)]/8",
  },
};

export function KPICard({
  title,
  value,
  variation,
  trend,
  format = "number",
  benchmark,
  icon,
  isLoading,
  className,
}: KPICardProps) {
  if (isLoading) return <KPICardSkeleton className={className} />;

  const trendConfig = trendConfigs[trend];

  return (
    <div
      className={cn(
        "dashboard-kpi-card h-full w-full min-w-0 bg-[var(--dashboard-surface,#ffffff)] rounded-xl p-4 md:p-5 border border-[var(--dashboard-text-secondary,#64748B)]/12 transition-all duration-200 ease-out dashboard-shadow-sm hover:dashboard-shadow-md flex flex-col",
        className,
      )}
    >
      <style>{`
        .dashboard-kpi-card {
          container-type: inline-size;
        }

        @container (max-width: 13.5rem) {
          .dashboard-kpi-card__content {
            gap: 0.45rem;
          }

          .dashboard-kpi-card__value {
            font-size: 1.55rem;
            line-height: 1;
          }

          .dashboard-kpi-card__trend {
            padding-inline: 0.5rem;
            gap: 0.2rem;
          }

          .dashboard-kpi-card__trend-value {
            font-size: 0.75rem;
            line-height: 1rem;
          }
        }

        @container (max-width: 11.5rem) {
          .dashboard-kpi-card__value {
            font-size: 1.4rem;
          }

          .dashboard-kpi-card__trend {
            padding-inline: 0.4rem;
            padding-block: 0.2rem;
          }

          .dashboard-kpi-card__trend-value {
            font-size: 0.7rem;
          }
        }

        @container (max-width: 9.75rem) {
          .dashboard-kpi-card__content {
            gap: 0.35rem;
          }

          .dashboard-kpi-card__value {
            font-size: 1.25rem;
          }

          .dashboard-kpi-card__trend {
            padding-inline: 0.32rem;
          }

          .dashboard-kpi-card__trend-icon {
            font-size: 0.9rem;
          }

          .dashboard-kpi-card__trend-value {
            font-size: 0.625rem;
            line-height: 0.875rem;
          }
        }
      `}</style>
      <div className="flex justify-between items-start mb-4 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {icon && (
            <span
              className="shrink-0 text-[var(--dashboard-text-secondary,#64748B)]"
              aria-hidden="true"
            >
              {icon}
            </span>
          )}
          <h3 className="min-w-0 truncate text-xs font-semibold uppercase tracking-wider text-[var(--dashboard-text-secondary,#64748B)]">
            {title}
          </h3>
        </div>
        {benchmark && (
          <span
            className="text-xs text-[var(--dashboard-text-secondary,#64748B)]/50 ml-2 whitespace-nowrap flex-shrink-0"
            title="Benchmark de referência"
          >
            {benchmark}
          </span>
        )}
      </div>

      <div className="dashboard-kpi-card__content flex min-w-0 items-end gap-3 flex-1">
        <p className="dashboard-kpi-card__value min-w-0 text-3xl font-bold text-[var(--dashboard-text-primary,#0F172A)] whitespace-nowrap tracking-tight">
          {formatValue(value, format)}
        </p>
        <div
          className={cn(
            "dashboard-kpi-card__trend inline-flex items-center gap-1 px-2 py-1 rounded-full flex-shrink-0 mb-1",
            trendConfig.color,
          )}
        >
          <span className="dashboard-kpi-card__trend-icon text-sm leading-none">{trendConfig.icon}</span>
          <span className="dashboard-kpi-card__trend-value text-xs font-semibold whitespace-nowrap">
            {Math.abs(variation).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}

function KPICardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-full bg-[var(--dashboard-surface,#ffffff)] rounded-xl p-4 md:p-5 border border-[var(--dashboard-text-secondary,#64748B)]/12 dashboard-shadow-sm animate-pulse flex flex-col",
        className,
      )}
    >
      <div className="h-3 bg-[var(--dashboard-text-secondary,#64748B)]/10 rounded w-2/3 mb-4" />
      <div className="flex items-end gap-3 flex-1">
        <div className="h-8 bg-[var(--dashboard-text-secondary,#64748B)]/10 rounded w-1/2" />
        <div className="h-5 bg-[var(--dashboard-text-secondary,#64748B)]/10 rounded-full w-1/4" />
      </div>
    </div>
  );
}
