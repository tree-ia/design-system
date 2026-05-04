"use client";

import React from "react";
import type { ConversationEventSeparatorProps } from "./types";
import { cn } from "./utils";

export function ConversationEventSeparator({
  label,
  description,
  className,
}: ConversationEventSeparatorProps) {
  return (
    <div
      className={cn("group relative flex w-full items-center gap-3 py-1", className)}
      title={typeof description === "string" ? description : undefined}
    >
      <div className="h-px flex-1 bg-[var(--dashboard-text-secondary,#6b7280)]/25" />
      <span className="whitespace-nowrap text-xs text-[var(--dashboard-text-secondary,#6b7280)]">
        {label}
      </span>
      <div className="h-px flex-1 bg-[var(--dashboard-text-secondary,#6b7280)]/25" />
      {description && (
        <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 max-w-sm -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="rounded-lg bg-[var(--dashboard-text-primary,#2d2d2d)] px-3 py-2 text-xs text-[var(--dashboard-surface,#ffffff)] shadow-lg">
            {description}
          </div>
        </div>
      )}
    </div>
  );
}
