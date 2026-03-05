"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export interface VerticalBarChartProps {
  /** Labels do eixo X (ex: dias da semana) */
  labels: string[];
  /** Valores para cada label */
  data: number[];
  /** Titulo do grafico */
  title?: string;
  /** Icone ao lado do titulo */
  titleIcon?: React.ReactNode;
  /** Cor das barras (default: --dashboard-primary) */
  color?: string;
  /** Label do tooltip (ex: "vendas") */
  valueLabel?: string;
  /** Label no singular (ex: "venda") */
  valueLabelSingular?: string;
  /** Texto para melhor item (ex: "Melhor dia") */
  bestItemLabel?: string;
  /** Maximo de caracteres dos labels. Default: 3 */
  labelMaxChars?: number;
  className?: string;
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

export function VerticalBarChart({
  labels,
  data: values,
  title,
  titleIcon,
  color,
  valueLabel = "itens",
  valueLabelSingular,
  bestItemLabel = "Melhor item",
  labelMaxChars = 3,
  className,
}: VerticalBarChartProps) {
  const maxValue = Math.max(...values);
  const bestIndex = values.indexOf(maxValue);
  const bestLabel = labels[bestIndex];
  const singular = valueLabelSingular || valueLabel.replace(/s$/, "");

  const primaryColor =
    color ||
    (typeof document !== "undefined"
      ? getComputedStyle(document.documentElement)
          .getPropertyValue("--dashboard-primary")
          .trim()
      : "") ||
    "#37a501";

  const chartData = {
    labels,
    datasets: [
      {
        label: valueLabel,
        data: values,
        backgroundColor: primaryColor,
        borderRadius: { topLeft: 4, topRight: 4 },
        barThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(45, 45, 45, 0.95)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: primaryColor,
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        titleFont: { size: 12, weight: "bold" as const },
        bodyFont: { size: 11 },
        callbacks: {
          label: (context: { parsed: { y: number | null } }) => {
            const v = context.parsed.y ?? 0;
            return v === 1 ? `${v} ${singular}` : `${v} ${valueLabel}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "var(--dashboard-text-secondary, #6b7280)",
          font: { size: 11 },
          callback: (_value: number | string, index: number): string => {
            return labels[index]
              ? labels[index].substring(0, labelMaxChars)
              : String(_value);
          },
        },
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { display: false },
        ticks: { display: false },
      },
    },
  };

  return (
    <div
      className={cn(
        "bg-[var(--dashboard-surface,#ffffff)] rounded-lg shadow-sm border border-[var(--dashboard-text-secondary,#6b7280)]/20 p-6 flex-1 flex flex-col",
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

      {bestLabel && maxValue > 0 && (
        <div className="mb-4">
          <p className="text-sm text-[var(--dashboard-text-secondary,#6b7280)] mb-1">
            {bestItemLabel}
          </p>
          <p className="text-lg font-semibold text-[var(--dashboard-text-primary,#2d2d2d)]">
            {bestLabel}{" "}
            <span className="text-sm font-normal text-[var(--dashboard-text-secondary,#6b7280)]">
              {maxValue} {maxValue === 1 ? singular : valueLabel}
            </span>
          </p>
        </div>
      )}

      <div className="flex-1 min-h-0 relative">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
