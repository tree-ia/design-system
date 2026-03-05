"use client";

import React, { ReactNode } from "react";

export interface FilterBarProps {
  /** Valor do campo de busca */
  searchValue?: string;
  /** Callback de mudanca do campo de busca */
  onSearchChange?: (value: string) => void;
  /** Placeholder do campo de busca */
  searchPlaceholder?: string;
  /** Slot para dropdowns, date pickers e outros filtros */
  children?: ReactNode;
  /** Slot para acoes extras (ex: botao de exportar) */
  actions?: ReactNode;
  className?: string;
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  children,
  actions,
  className,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap",
        className,
      )}
    >
      {onSearchChange !== undefined && (
        <div className="flex-1 min-w-[200px]">
          <div className="relative flex items-center w-full">
            <svg
              className="absolute left-3 h-4 w-4 text-[var(--dashboard-text-secondary,#6b7280)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchValue || ""}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="flex h-10 w-full rounded-md border border-[var(--dashboard-text-secondary,#6b7280)]/30 bg-[var(--dashboard-surface,#ffffff)] pl-10 pr-3 py-2 text-sm text-[var(--dashboard-text-primary,#2d2d2d)] shadow-sm transition-colors duration-200 focus:border-[var(--dashboard-primary,#37a501)] placeholder:text-[var(--dashboard-text-secondary,#6b7280)] focus-visible:outline-none"
            />
          </div>
        </div>
      )}

      {children && (
        <div className="flex flex-wrap items-center gap-2">{children}</div>
      )}

      {actions && (
        <div className="flex items-center gap-2 sm:ml-auto">{actions}</div>
      )}
    </div>
  );
}
