"use client";

import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
  ChartData,
  ChartOptions,
  TooltipModel,
} from "chart.js";
import { KPICard, KPIValueFormat } from "../KPICard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
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

export interface MetricPanelTooltipConfig {
  enabled: boolean;
  showButton?: boolean;
  buttonLabel?: string;
  onButtonClick?: (dataIndex: number, date: string) => void;
  customContent?: (params: {
    value: number;
    previousValue: number;
    variation: number;
    date: string;
    dayName: string;
    previousDate: string;
    formattedValue: string;
    formattedPrevious: string;
    metricUnit: string;
  }) => string;
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
  /** Configuracao do tooltip interativo do grafico */
  tooltipConfig?: MetricPanelTooltipConfig;
  /** Estado de loading */
  isLoading?: boolean;
  className?: string;
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

function formatMetricValue(value: number, format: KPIValueFormat) {
  switch (format) {
    case "currency":
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);
    case "percentage":
      return `${value.toFixed(2)}%`;
    case "rating":
      return value.toFixed(2);
    case "number":
    default:
      return new Intl.NumberFormat("pt-BR").format(Math.round(value));
  }
}

function calculateVariation(current: number, previous: number) {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getTooltipDateInfo(label: string) {
  const dayNames = [
    "Domingo",
    "Segunda",
    "Terca",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sabado",
  ];
  const [day, month] = label.split("/").map(Number);

  if (!day || !month) {
    return {
      dayName: "",
      previousDate: "",
    };
  }

  const date = new Date(new Date().getFullYear(), month - 1, day);
  const previousDate = new Date(date);
  previousDate.setDate(previousDate.getDate() - 7);

  return {
    dayName: dayNames[date.getDay()],
    previousDate: `${String(previousDate.getDate()).padStart(2, "0")}/${String(
      previousDate.getMonth() + 1,
    ).padStart(2, "0")}`,
  };
}

export function MetricPanel({
  title,
  titleIcon: TitleIcon,
  metrics,
  chartData,
  color,
  secondaryColor,
  onActionClick,
  actionLabel,
  tooltipConfig,
  isLoading = false,
  className,
}: MetricPanelProps) {
  const [selectedMetricKey, setSelectedMetricKey] = useState(metrics[0]?.key);
  const [isMobile, setIsMobile] = useState(false);
  const hideTooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const isTooltipHoveredRef = useRef(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("resize", check);
      if (hideTooltipTimeoutRef.current) {
        clearTimeout(hideTooltipTimeoutRef.current);
      }
    };
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

  const renderExternalTooltip = (context: {
    chart: ChartJS;
    tooltip: TooltipModel<"line">;
  }) => {
    const { chart, tooltip } = context;
    const parent = chart.canvas.parentElement;
    if (!parent) return;

    let tooltipEl = parent.querySelector<HTMLDivElement>(
      ":scope > .metric-panel-chart-tooltip",
    );

    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.className = "metric-panel-chart-tooltip";
      tooltipEl.style.position = "absolute";
      tooltipEl.style.pointerEvents = "auto";
      tooltipEl.style.transition = "opacity 0.2s ease";
      tooltipEl.style.zIndex = "100";
      tooltipEl.style.opacity = "0";
      const createdTooltipEl = tooltipEl;
      createdTooltipEl.addEventListener("mouseenter", () => {
        isTooltipHoveredRef.current = true;
        if (hideTooltipTimeoutRef.current) {
          clearTimeout(hideTooltipTimeoutRef.current);
          hideTooltipTimeoutRef.current = null;
        }
      });
      createdTooltipEl.addEventListener("mouseleave", () => {
        isTooltipHoveredRef.current = false;
        createdTooltipEl.style.opacity = "0";
      });
      parent.appendChild(createdTooltipEl);
    }

    if (hideTooltipTimeoutRef.current) {
      clearTimeout(hideTooltipTimeoutRef.current);
      hideTooltipTimeoutRef.current = null;
    }

    if (tooltip.opacity === 0) {
      hideTooltipTimeoutRef.current = setTimeout(() => {
        if (!isTooltipHoveredRef.current && tooltipEl) {
          tooltipEl.style.opacity = "0";
        }
      }, 300);
      return;
    }

    const dataPoint = tooltip.dataPoints?.find(
      (point) => point.datasetIndex === 0,
    );

    if (!dataPoint) {
      tooltipEl.style.opacity = "0";
      return;
    }

    const dataIndex = dataPoint.dataIndex;
    const label = dataPoint.label;
    const currentValue =
      typeof dataPoint.parsed.y === "number" ? dataPoint.parsed.y : 0;
    const previousValue =
      chartData.metrics[currentMetric.key]?.previousPeriod[dataIndex] || 0;
    const variation = calculateVariation(currentValue, previousValue);
    const formattedValue = formatMetricValue(
      currentValue,
      currentMetric.format,
    );
    const formattedPrevious = formatMetricValue(
      previousValue,
      currentMetric.format,
    );
    const { dayName, previousDate } = getTooltipDateInfo(label);
    const metricUnit = currentMetric.unit || "";
    const isButtonDisabled = currentValue === 0;
    const safeLabel = escapeHtml(label);
    const safeDayName = escapeHtml(dayName);
    const safePreviousDate = escapeHtml(previousDate);
    const safeMetricUnit = escapeHtml(metricUnit);
    const variationSign = variation > 0 ? "+" : "";
    const variationIcon = variation >= 0 ? "▲" : "▼";
    const variationColor =
      variation >= 0
        ? "var(--dashboard-status-success,#10B981)"
        : "var(--dashboard-status-danger,#EF4444)";

    if (tooltipConfig?.customContent) {
      tooltipEl.innerHTML = tooltipConfig.customContent({
        value: currentValue,
        previousValue,
        variation,
        date: label,
        dayName,
        previousDate,
        formattedValue,
        formattedPrevious,
        metricUnit,
      });
    } else {
      tooltipEl.innerHTML = `
        <div style="
          background: var(--dashboard-surface,#ffffff);
          border-radius: 8px;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.14);
          border: 1px solid rgba(93, 114, 128, 0.2);
          color: var(--dashboard-text-primary,#2d2d2d);
          padding: 12px;
          min-width: 220px;
          max-width: 250px;
          font-family: inherit;
        ">
          <div style="
            font-size: 11px;
            font-weight: 500;
            color: var(--dashboard-text-secondary,#6b7280);
            margin-bottom: 8px;
          ">
            ${safeDayName ? `${safeDayName} ` : ""}${safeLabel}
          </div>
          <div style="
            display: flex;
            align-items: baseline;
            gap: 6px;
            margin-bottom: 10px;
          ">
            <div style="
              font-size: 22px;
              font-weight: 700;
              color: ${primaryColor};
              line-height: 1;
            ">
              ${escapeHtml(formattedValue)}${safeMetricUnit ? ` ${safeMetricUnit}` : ""}
            </div>
            <div style="
              display: flex;
              align-items: center;
              gap: 3px;
              color: ${variationColor};
              font-size: 13px;
              font-weight: 600;
            ">
              <span style="font-size: 10px;">${variationIcon}</span>
              <span>${variationSign}${Math.abs(variation).toFixed(2)}%</span>
            </div>
          </div>
          <div style="
            font-size: 11px;
            color: var(--dashboard-text-secondary,#6b7280);
            line-height: 1.35;
            margin-bottom: ${tooltipConfig?.showButton ? "10px" : "0"};
            padding-bottom: ${tooltipConfig?.showButton ? "10px" : "0"};
            border-bottom: ${tooltipConfig?.showButton ? "1px solid rgba(93, 114, 128, 0.2)" : "none"};
          ">
            em relacao aos <strong style="color: var(--dashboard-text-primary,#2d2d2d);">${escapeHtml(
              formattedPrevious,
            )}${safeMetricUnit ? ` ${safeMetricUnit}` : ""}</strong>${
              safePreviousDate
                ? ` do dia <strong style="color: var(--dashboard-text-primary,#2d2d2d);">${safePreviousDate}</strong>`
                : ""
            }
          </div>
          ${
            tooltipConfig?.showButton && tooltipConfig.buttonLabel
              ? `
            <button type="button" data-tooltip-action ${isButtonDisabled ? "disabled" : ""} style="
              width: 100%;
              padding: 8px 12px;
              background: ${isButtonDisabled ? "rgba(93, 114, 128, 0.08)" : "var(--dashboard-surface,#ffffff)"};
              color: ${isButtonDisabled ? "var(--dashboard-text-secondary,#6b7280)" : primaryColor};
              border: 2px solid ${isButtonDisabled ? "rgba(93, 114, 128, 0.2)" : primaryColor};
              border-radius: 6px;
              font-size: 13px;
              font-weight: 600;
              font-family: inherit;
              cursor: ${isButtonDisabled ? "not-allowed" : "pointer"};
              opacity: ${isButtonDisabled ? "0.65" : "1"};
            ">
              ${escapeHtml(tooltipConfig.buttonLabel)}
            </button>
          `
              : ""
          }
        </div>
      `;
    }

    const actionButton = tooltipEl.querySelector<HTMLButtonElement>(
      "[data-tooltip-action]",
    );
    if (actionButton && !isButtonDisabled) {
      actionButton.onclick = () =>
        tooltipConfig?.onButtonClick?.(dataIndex, label);
      actionButton.onmouseenter = () => {
        actionButton.style.background = primaryColor;
        actionButton.style.color = "#ffffff";
      };
      actionButton.onmouseleave = () => {
        actionButton.style.background = "var(--dashboard-surface,#ffffff)";
        actionButton.style.color = primaryColor;
      };
    }

    const tooltipWidth = 250;
    const tooltipHeight = tooltipConfig?.showButton ? 180 : 140;
    const offsetX = 15;
    const centerY = Math.max(0, (chart.height - tooltipHeight) / 2);
    const isNearRightEdge =
      tooltip.caretX > chart.width - tooltipWidth - offsetX;

    tooltipEl.style.opacity = "1";
    tooltipEl.style.top = `${centerY}px`;

    if (isNearRightEdge) {
      tooltipEl.style.left = "auto";
      tooltipEl.style.right = `${chart.width - tooltip.caretX + offsetX}px`;
    } else {
      tooltipEl.style.left = `${tooltip.caretX + offsetX}px`;
      tooltipEl.style.right = "auto";
    }
  };

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
        ...(tooltipConfig
          ? {
              enabled: false,
              position: "nearest" as const,
              external: tooltipConfig.enabled
                ? renderExternalTooltip
                : undefined,
            }
          : {
              backgroundColor: "rgba(45, 45, 45, 0.95)",
              titleColor: "#fff",
              bodyColor: "#fff",
              borderColor: primaryColor,
              borderWidth: 1,
              padding: 12,
            }),
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
        <h2 className="flex items-center gap-2 text-base md:text-lg font-bold text-[var(--dashboard-text-primary,#2d2d2d)]">
          <TitleIcon className="w-5 h-5" />
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
