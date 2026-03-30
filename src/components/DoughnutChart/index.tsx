"use client";

import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export interface DoughnutChartItem {
  label: string;
  value: number;
  color?: string;
}

export interface DoughnutChartProps {
  /** Dados do gráfico */
  items: DoughnutChartItem[];
  /** Titulo do grafico */
  title?: string;
  /** Icone ao lado do titulo */
  titleIcon?: React.ReactNode;
  /** Texto central (ex: total) */
  centerLabel?: string;
  /** Valor central */
  centerValue?: string;
  /** Mostrar legenda lateral? Default: true */
  showLegend?: boolean;
  /** Formato dos valores na legenda */
  formatValue?: (value: number) => string;
  /** Espessura do anel (cutout %). Default: 65 */
  cutout?: number;
  /** Altura do grafico em px. Default: 240 */
  height?: number;
  className?: string;
}

const DEFAULT_COLORS = [
  "#2563EB",
  "#059669",
  "#D97706",
  "#DC2626",
  "#7C3AED",
  "#0891B2",
  "#DB2777",
  "#65A30D",
  "#EA580C",
  "#4F46E5",
];

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

export function DoughnutChart({
  items,
  title,
  titleIcon,
  centerLabel,
  centerValue,
  showLegend = true,
  formatValue,
  cutout = 65,
  height = 240,
  className,
}: DoughnutChartProps) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const format = formatValue || ((v: number) => String(v));

  const colors = items.map(
    (item, i) => item.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
  );

  const chartData = {
    labels: items.map((i) => i.label),
    datasets: [
      {
        data: items.map((i) => i.value),
        backgroundColor: colors,
        borderColor: "var(--dashboard-surface, #ffffff)",
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: `${cutout}%`,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(45, 45, 45, 0.95)",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        displayColors: true,
        titleFont: { size: 12, weight: "bold" as const },
        bodyFont: { size: 11 },
        callbacks: {
          label: (context: { label: string; parsed: number }) => {
            const pct =
              total > 0 ? ((context.parsed / total) * 100).toFixed(1) : "0";
            return ` ${context.label}: ${format(context.parsed)} (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <div
      className={cn(
        "bg-[var(--dashboard-surface,#ffffff)] rounded-lg shadow-sm border border-[var(--dashboard-text-secondary,#6b7280)]/20 p-6",
        className,
      )}
    >
      {title && (
        <div className="flex items-center gap-2 mb-4">
          {titleIcon}
          <h3 className="text-base font-semibold text-[var(--dashboard-text-primary,#2d2d2d)]">
            {title}
          </h3>
        </div>
      )}

      <div
        className={cn(
          "flex items-center",
          showLegend ? "gap-6" : "justify-center",
        )}
      >
        {/* Chart */}
        <div className="relative flex-shrink-0" style={{ width: height, height }}>
          <Doughnut data={chartData} options={options} />
          {(centerLabel || centerValue) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              {centerValue && (
                <span className="text-2xl font-bold text-[var(--dashboard-text-primary,#2d2d2d)]">
                  {centerValue}
                </span>
              )}
              {centerLabel && (
                <span className="text-xs text-[var(--dashboard-text-secondary,#6b7280)]">
                  {centerLabel}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Legend */}
        {showLegend && items.length > 0 && (
          <div className="flex-1 min-w-0 space-y-2">
            {items.map((item, i) => {
              const pct =
                total > 0 ? ((item.value / total) * 100).toFixed(1) : "0";
              return (
                <div key={item.label} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: colors[i] }}
                  />
                  <span className="text-sm text-[var(--dashboard-text-secondary,#6b7280)] truncate flex-1">
                    {item.label}
                  </span>
                  <span className="text-sm font-medium text-[var(--dashboard-text-primary,#2d2d2d)] whitespace-nowrap">
                    {format(item.value)}
                  </span>
                  <span className="text-xs text-[var(--dashboard-text-secondary,#6b7280)] whitespace-nowrap">
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
