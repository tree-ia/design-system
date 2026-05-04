"use client";

import React from "react";
import type { ConversationUnreadMarkerProps } from "./types";
import { cn } from "./utils";

export function ConversationUnreadMarker({
  label = "Novas mensagens",
  className,
}: ConversationUnreadMarkerProps) {
  return (
    <div className={cn("flex w-full items-center gap-3", className)}>
      <div className="h-px flex-1 bg-[var(--dashboard-primary,#37a501)]" />
      <span className="whitespace-nowrap text-xs font-medium text-[var(--dashboard-primary,#37a501)]">
        {label}
      </span>
      <div className="h-px flex-1 bg-[var(--dashboard-primary,#37a501)]" />
    </div>
  );
}
