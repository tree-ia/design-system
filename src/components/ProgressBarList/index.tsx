"use client";

import React, { ReactNode } from "react";

export interface ProgressBarListItem {
  /** Label do item */
  label: string;
  /** Valor numerico */
  value: number;
  /** Icone opcional */
  icon?: ReactNode;
}

export interface ProgressBarListProps {
  /** Itens da lista */
  items: ProgressBarListItem[];
  /** Titulo da lista */
  title?: string;
  /** Icone ao lado do titulo */
  titleIcon?: ReactNode;
  /** Cor da barra de progresso (default: --dashboard-primary) */
  color?: string;
  /** Label do valor (ex: "vendas") */
  valueLabel?: string;
  /** Label no singular (ex: "venda") */
  valueLabelSingular?: string;
  /** Ordenar automaticamente por valor desc. Default: true */
  sortByValue?: boolean;
  /** Formatar valor customizado */
  formatValue?: (value: number) => string;
  className?: string;
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

export function ProgressBarList({
  items,
  title,
  titleIcon,
  color,
  valueLabel = "itens",
  valueLabelSingular,
  sortByValue = true,
  formatValue,
  className,
}: ProgressBarListProps) {
  const sortedItems = sortByValue
    ? [...items].sort((a, b) => b.value - a.value)
    : items;
  const maxValue = Math.max(...items.map((i) => i.value));
  const singular = valueLabelSingular || valueLabel.replace(/s$/, "");

  const primaryColor =
    color ||
    (typeof document !== "undefined"
      ? getComputedStyle(document.documentElement)
          .getPropertyValue("--dashboard-primary")
          .trim()
      : "") ||
    "#37a501";

  const defaultFormat = (v: number) =>
    `${v} ${v === 1 ? singular : valueLabel}`;

  const fmt = formatValue || defaultFormat;

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

      <div className="space-y-6 flex-1 flex flex-col justify-center">
        {sortedItems.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="flex items-center gap-4 min-w-[180px]">
              {item.icon && (
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: primaryColor }}
                >
                  <div className="w-6 h-6 text-white">{item.icon}</div>
                </div>
              )}
              <span className="text-base font-medium text-[var(--dashboard-text-secondary,#6b7280)]">
                {item.label}
              </span>
            </div>
            <div className="flex items-center gap-4 flex-1">
              <div className="flex-1 bg-[var(--dashboard-text-secondary,#6b7280)]/10 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full transition-all duration-500 rounded-full"
                  style={{
                    width:
                      maxValue > 0
                        ? `${(item.value / maxValue) * 100}%`
                        : "0%",
                    backgroundColor: primaryColor,
                  }}
                />
              </div>
              <span
                className="text-base font-bold min-w-[90px] text-right"
                style={{ color: primaryColor }}
              >
                {fmt(item.value)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
