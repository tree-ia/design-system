"use client";

import React from "react";
import { Search, X } from "lucide-react";
import type { ConversationSearchProps } from "./types";
import { cn } from "./utils";

export function ConversationSearch({
  value = "",
  placeholder = "Buscar conversas...",
  onChange,
  onClear,
  className,
}: ConversationSearchProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--dashboard-primary,#37a501)]/60"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-[var(--dashboard-text-secondary,#6b7280)]/25 bg-[var(--dashboard-surface,#ffffff)] pl-10 pr-10 text-sm text-[var(--dashboard-text-primary,#2d2d2d)] outline-none transition-colors focus:border-[var(--dashboard-primary,#37a501)] focus:ring-2 focus:ring-[var(--dashboard-primary,#37a501)]/20"
      />
      {value && (
        <button
          type="button"
          onClick={onClear || (() => onChange?.(""))}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-[var(--dashboard-text-secondary,#6b7280)] transition-colors hover:bg-[var(--dashboard-text-secondary,#6b7280)]/10 hover:text-[var(--dashboard-text-primary,#2d2d2d)]"
          aria-label="Limpar busca"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
