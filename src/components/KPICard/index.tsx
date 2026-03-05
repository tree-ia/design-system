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
      "text-[var(--dashboard-status-success,#10B981)] bg-[var(--dashboard-status-success,#10B981)]/10",
  },
  down: {
    icon: "\u2193",
    color:
      "text-[var(--dashboard-status-danger,#EF4444)] bg-[var(--dashboard-status-danger,#EF4444)]/10",
  },
  stable: {
    icon: "\u2192",
    color:
      "text-[var(--dashboard-text-secondary,#6b7280)] bg-[var(--dashboard-text-secondary,#6b7280)]/10",
  },
};

export function KPICard({
  title,
  value,
  variation,
  trend,
  format = "number",
  benchmark,
  isLoading,
  className,
}: KPICardProps) {
  if (isLoading) return <KPICardSkeleton className={className} />;

  const trendConfig = trendConfigs[trend];

  return (
    <div
      className={cn(
        "h-full w-full bg-[var(--dashboard-surface,#ffffff)] rounded-lg shadow-sm p-6 border border-[var(--dashboard-text-secondary,#6b7280)]/20 hover:shadow-md transition-all duration-200 flex flex-col",
        className,
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-[var(--dashboard-text-secondary,#6b7280)] whitespace-nowrap">
          {title}
        </h3>
        {benchmark && (
          <span
            className="text-xs text-[var(--dashboard-text-secondary,#6b7280)]/60 ml-2 whitespace-nowrap flex-shrink-0"
            title="Benchmark de referência"
          >
            {benchmark}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 flex-1">
        <p className="text-3xl font-bold text-[var(--dashboard-text-primary,#2d2d2d)] whitespace-nowrap">
          {formatValue(value, format)}
        </p>
        <div
          className={cn(
            "inline-flex items-center gap-1 px-2 py-1 rounded-md flex-shrink-0",
            trendConfig.color,
          )}
        >
          <span className="text-lg">{trendConfig.icon}</span>
          <span className="text-sm font-medium whitespace-nowrap">
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
        "h-full bg-[var(--dashboard-surface,#ffffff)] rounded-lg shadow-sm p-6 border border-[var(--dashboard-text-secondary,#6b7280)]/20 animate-pulse flex flex-col",
        className,
      )}
    >
      <div className="h-4 bg-[var(--dashboard-text-secondary,#6b7280)]/20 rounded w-2/3 mb-4" />
      <div className="flex items-center gap-3 flex-1">
        <div className="h-8 bg-[var(--dashboard-text-secondary,#6b7280)]/20 rounded w-1/2" />
        <div className="h-6 bg-[var(--dashboard-text-secondary,#6b7280)]/20 rounded w-1/4" />
      </div>
    </div>
  );
}
