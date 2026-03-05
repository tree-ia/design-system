"use client";

import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export interface ComparisonLineChartProps {
  /** Labels do eixo X (ex: datas) */
  labels: string[];
  /** Dados do periodo atual */
  currentPeriodData: number[];
  /** Dados do periodo anterior */
  previousPeriodData: number[];
  /** Label da legenda do periodo atual */
  currentPeriodLabel?: string;
  /** Label da legenda do periodo anterior */
  previousPeriodLabel?: string;
  /** Titulo do grafico */
  title?: string;
  /** Cor principal (default: --dashboard-primary) */
  color?: string;
  /** Altura do container do grafico em px. Default: 300 */
  height?: number;
  className?: string;
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

export function ComparisonLineChart({
  labels,
  currentPeriodData,
  previousPeriodData,
  currentPeriodLabel = "Período atual",
  previousPeriodLabel = "Período anterior",
  title,
  color,
  height = 300,
  className,
}: ComparisonLineChartProps) {
  const primaryColor =
    color ||
    (typeof document !== "undefined"
      ? getComputedStyle(document.documentElement)
          .getPropertyValue("--dashboard-primary")
          .trim()
      : "") ||
    "#37a501";

  const data = {
    labels,
    datasets: [
      {
        label: currentPeriodLabel,
        data: currentPeriodData,
        borderColor: primaryColor,
        backgroundColor: `${primaryColor}1a`,
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: primaryColor,
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
      },
      {
        label: previousPeriodLabel,
        data: previousPeriodData,
        borderColor: `${primaryColor}66`,
        backgroundColor: `${primaryColor}0d`,
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: `${primaryColor}66`,
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          boxHeight: 6,
          padding: 15,
          font: { size: 11 },
          color: "var(--dashboard-text-secondary, #6b7280)",
        },
      },
      tooltip: {
        backgroundColor: "rgba(45, 45, 45, 0.95)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: primaryColor,
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        usePointStyle: true,
        boxWidth: 6,
        boxHeight: 6,
        titleFont: { size: 12, weight: "bold" as const },
        bodyFont: { size: 11 },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "var(--dashboard-text-secondary, #6b7280)",
          font: { size: 11 },
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0, 0, 0, 0.05)", drawBorder: false },
        ticks: {
          color: "var(--dashboard-text-secondary, #6b7280)",
          font: { size: 11 },
          precision: 0,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
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
        <h3 className="text-base font-semibold mb-4 text-[var(--dashboard-text-primary,#2d2d2d)]">
          {title}
        </h3>
      )}
      <div style={{ height }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
