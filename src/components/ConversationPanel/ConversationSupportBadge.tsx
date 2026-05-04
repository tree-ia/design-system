"use client";

import React from "react";
import type { ConversationSupportBadgeProps } from "./types";
import { cn } from "./utils";

export function ConversationSupportBadge({
  status,
  label,
  className,
}: ConversationSupportBadgeProps) {
  if (!status || status === "none") return null;

  const classes =
    status === "requested"
      ? "bg-[var(--dashboard-status-warning,#f59e0b)] text-white"
      : "bg-[var(--dashboard-primary,#37a501)] text-white";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold",
        status === "requested" && "animate-pulse",
        classes,
        className,
      )}
    >
      {label || (status === "requested" ? "Aguardando" : "Em suporte")}
    </span>
  );
}
