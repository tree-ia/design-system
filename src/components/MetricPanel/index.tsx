"use client";

import React, { useState, useEffect } from "react";
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
  ChartData,
  ChartOptions,
} from "chart.js";
import { KPICard, KPIValueFormat } from "../KPICard";

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

export interface MetricPanelMetric {
  /** Chave unica da metrica */
  key: string;
  /** Label exibida na tab e KPI */
  label: string;
  /** Icone da tab */
  icon: React.ComponentType<{ className?: string }>;
  /** Label da legenda do periodo atual */
  currentLabel: string;
  /** Label da legenda do periodo anterior */
  previousLabel: string;
  /** Formato do valor */
  format: KPIValueFormat;
  /** Unidade opcional (ex: "pedidos") */
  unit?: string;
  /** Valores do KPI */
  kpiValue: {
    current: number;
    previous: number;
    variation: number;
    trend: "up" | "down" | "stable";
  };
}

export interface MetricPanelChartData {
  labels: string[];
  metrics: Record<
    string,
    { currentPeriod: number[]; previousPeriod: number[] }
  >;
}

export interface MetricPanelProps {
  /** Titulo do painel */
  title: string;
  /** Icone do titulo */
  titleIcon: React.ComponentType<{ className?: string }>;
  /** Configuracoes das metricas */
  metrics: MetricPanelMetric[];
  /** Dados do grafico */
  chartData: MetricPanelChartData;
  /** Cor principal */
  color?: string;
  /** Cor secundaria (periodo anterior) */
  secondaryColor?: string;
  /** Callback do botao de acao */
  onActionClick?: () => void;
  /** Label do botao de acao */
  actionLabel?: string;
  /** Estado de loading */
  isLoading?: boolean;
  className?: string;
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

export function MetricPanel({
  title,
  titleIcon: TitleIcon,
  metrics,
  chartData,
  color,
  secondaryColor,
  onActionClick,
  actionLabel,
  isLoading = false,
  className,
}: MetricPanelProps) {
  const [selectedMetricKey, setSelectedMetricKey] = useState(metrics[0]?.key);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const currentMetric =
    metrics.find((m) => m.key === selectedMetricKey) || metrics[0];

  const primaryColor =
    color ||
    (typeof document !== "undefined"
      ? getComputedStyle(document.documentElement)
          .getPropertyValue("--dashboard-primary")
          .trim()
      : "") ||
    "#37a501";

  const secColor = secondaryColor || `${primaryColor}66`;

  const data: ChartData<"line"> = {
    labels: chartData.labels,
    datasets: [
      {
        label: currentMetric.currentLabel,
        data: chartData.metrics[currentMetric.key]?.currentPeriod || [],
        borderColor: primaryColor,
        borderWidth: isMobile ? 3.5 : 3,
        tension: 0,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: isMobile ? 10 : 8,
        pointHoverBackgroundColor: primaryColor,
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 3,
      },
      {
        label: currentMetric.previousLabel,
        data: chartData.metrics[currentMetric.key]?.previousPeriod || [],
        borderColor: secColor,
        borderWidth: isMobile ? 3.5 : 3,
        tension: 0,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 0,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: isMobile ? 10 : 50,
        right: isMobile ? 10 : 50,
        top: isMobile ? 20 : 40,
        bottom: isMobile ? 10 : 20,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        onClick: () => {},
        labels: {
          usePointStyle: true,
          boxWidth: isMobile ? 8 : 6,
          boxHeight: isMobile ? 8 : 6,
          padding: isMobile ? 12 : 15,
          font: {
            size: isMobile ? 13 : 11,
            weight: isMobile ? "bold" : "normal",
          },
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
      },
    },
    scales: {
      x: {
        border: { display: false },
        grid: { display: false },
        ticks: {
          color: "var(--dashboard-text-secondary, #6b7280)",
          font: { size: isMobile ? 12 : 11 },
        },
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: "rgba(0, 0, 0, 0.05)" },
        ticks: { display: false, count: 5 },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };

  return (
    <div
      className={cn(
        "bg-[var(--dashboard-surface,#ffffff)] rounded-lg shadow-sm border border-[var(--dashboard-text-secondary,#6b7280)]/20",
        className,
      )}
      style={{ overflow: "visible" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6 pb-3 md:pb-4 border-b border-[var(--dashboard-text-secondary,#6b7280)]/10">
        <h2 className="flex items-center gap-2 text-lg md:text-xl font-bold text-[var(--dashboard-text-primary,#2d2d2d)]">
          <TitleIcon className="w-5 h-5 md:w-6 md:h-6" />
          {title}
        </h2>
        {onActionClick && actionLabel && (
          <button
            onClick={onActionClick}
            className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium border rounded-lg transition-colors cursor-pointer"
            style={{
              color: primaryColor,
              borderColor: primaryColor,
            }}
          >
            {actionLabel}
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="p-4 md:p-6 pb-3 md:pb-4">
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4"
          style={{
            gridTemplateColumns:
              !isMobile && metrics.length <= 4
                ? `repeat(${metrics.length}, minmax(min-content, 1fr))`
                : undefined,
          }}
        >
          {metrics.map((metric) => (
            <KPICard
              key={metric.key}
              title={metric.label}
              value={metric.kpiValue.current}
              variation={metric.kpiValue.variation}
              trend={metric.kpiValue.trend}
              format={metric.format}
              isLoading={isLoading}
            />
          ))}
        </div>
      </div>

      {/* Metric Tabs */}
      <div className="px-4 md:px-6 pt-3 md:pt-4">
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <button
                key={metric.key}
                onClick={() => setSelectedMetricKey(metric.key)}
                className={cn(
                  "flex items-center gap-2 px-4 md:px-6 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer",
                  selectedMetricKey === metric.key
                    ? "bg-[var(--dashboard-surface,#ffffff)] border-2 text-[var(--dashboard-primary,#37a501)]"
                    : "bg-[var(--dashboard-surface,#ffffff)] border border-[var(--dashboard-text-secondary,#6b7280)]/30 text-[var(--dashboard-text-secondary,#6b7280)] hover:border-[var(--dashboard-text-secondary,#6b7280)]/50",
                )}
                style={
                  selectedMetricKey === metric.key
                    ? { borderColor: primaryColor, color: primaryColor }
                    : undefined
                }
              >
                <Icon className="w-4 h-4" />
                {metric.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <div
        className="px-4 md:px-6 pb-4 md:pb-6"
        style={{ overflow: "visible", position: "relative", zIndex: 10 }}
      >
        <div
          className="h-[260px]"
          style={{ overflow: "visible", position: "relative", zIndex: 10 }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div
                  className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
                  style={{ borderColor: primaryColor }}
                />
                <p className="text-[var(--dashboard-text-secondary,#6b7280)]">
                  Carregando gráfico...
                </p>
              </div>
            </div>
          ) : (
            <Line data={data} options={options} />
          )}
        </div>
      </div>
    </div>
  );
}
