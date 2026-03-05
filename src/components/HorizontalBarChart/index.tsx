"use client";

import React, { useState, useEffect } from "react";
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

export interface HorizontalBarChartTab {
  id: string;
  label: string;
}

export interface HorizontalBarChartProps {
  /** Labels do eixo Y (ex: horarios) */
  labels: string[];
  /** Dados por tab. Chave = tab.id, valor = array de numeros */
  datasets: Record<string, number[]>;
  /** Tabs para alternar entre datasets */
  tabs?: HorizontalBarChartTab[];
  /** Titulo do grafico */
  title?: string;
  /** Icone ao lado do titulo */
  titleIcon?: React.ReactNode;
  /** Cor das barras (default: --dashboard-primary) */
  color?: string;
  /** Label para tooltip (ex: "vendas", "pedidos") */
  valueLabel?: string;
  /** Label no singular (ex: "venda", "pedido") */
  valueLabelSingular?: string;
  /** Texto para melhor item (ex: "Melhor horário") */
  bestItemLabel?: string;
  className?: string;
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

export function HorizontalBarChart({
  labels,
  datasets,
  tabs,
  title,
  titleIcon,
  color,
  valueLabel = "itens",
  valueLabelSingular,
  bestItemLabel = "Melhor item",
  className,
}: HorizontalBarChartProps) {
  const tabKeys = tabs ? tabs.map((t) => t.id) : Object.keys(datasets);
  const [activeTab, setActiveTab] = useState(tabKeys[0]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const activeData = datasets[activeTab] || [];
  const maxValue = Math.max(...activeData);
  const bestIndex = activeData.indexOf(maxValue);
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

  const minBarValue = maxValue > 0 ? maxValue * 0.02 : 0.05;
  const displayData = activeData.map((v) => (v === 0 ? minBarValue : v));

  const chartData = {
    labels,
    datasets: [
      {
        label: valueLabel,
        data: displayData,
        backgroundColor: primaryColor,
        borderRadius: isMobile ? 8 : 4,
        barThickness: isMobile ? 36 : 24,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        right: isMobile ? 35 : 30,
        left: isMobile ? 10 : 0,
        top: isMobile ? 15 : 0,
        bottom: isMobile ? 15 : 0,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(45, 45, 45, 0.95)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: primaryColor,
        borderWidth: 1,
        padding: isMobile ? 6 : 12,
        displayColors: false,
        titleFont: { size: isMobile ? 10 : 12, weight: "bold" as const },
        bodyFont: { size: isMobile ? 9 : 11 },
        callbacks: {
          label: (context: { dataIndex: number }) => {
            const realValue = activeData[context.dataIndex];
            return realValue === 1
              ? `${realValue} ${singular}`
              : `${realValue} ${valueLabel}`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        border: { display: false },
        grid: { display: false },
        ticks: { display: false },
      },
      y: {
        grid: { display: false },
        ticks: {
          color: "var(--dashboard-text-secondary, #6b7280)",
          font: { size: isMobile ? 16 : 13 },
          padding: isMobile ? 12 : 4,
        },
      },
    },
  };

  return (
    <div
      className={cn(
        "bg-[var(--dashboard-surface,#ffffff)] rounded-lg shadow-sm border border-[var(--dashboard-text-secondary,#6b7280)]/20 p-5 sm:p-6 min-h-[850px] sm:h-full flex flex-col",
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

      {tabs && tabs.length > 1 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-3.5 py-2 sm:px-4 sm:py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer",
                activeTab === tab.id
                  ? "bg-[var(--dashboard-primary,#37a501)] text-white"
                  : "bg-[var(--dashboard-text-secondary,#6b7280)]/10 text-[var(--dashboard-text-secondary,#6b7280)] hover:bg-[var(--dashboard-text-secondary,#6b7280)]/20",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {maxValue > 0 && (
        <div className="mb-4">
          <p className="text-sm sm:text-base text-[var(--dashboard-text-secondary,#6b7280)] mb-1">
            {bestItemLabel}
          </p>
          <p className="text-xl sm:text-2xl font-semibold text-[var(--dashboard-text-primary,#2d2d2d)]">
            {bestLabel}{" "}
            <span className="text-base font-normal text-[var(--dashboard-text-secondary,#6b7280)]">
              {maxValue} {maxValue === 1 ? singular : valueLabel}
            </span>
          </p>
        </div>
      )}

      <div className="flex-1 min-h-0">
        <Bar key={`chart-${isMobile ? "m" : "d"}`} data={chartData} options={options} />
      </div>
    </div>
  );
}
