"use client";

import React from "react";
import type { ConversationSupportActionsProps } from "./types";
import { cn } from "./utils";

export function ConversationSupportActions({
  status,
  stats,
  reason,
  startLabel = "Assumir conversa",
  endLabel = "Encerrar atendimento",
  endSilentLabel = "Encerrar sem notificar",
  onStart,
  onEnd,
  onEndSilent,
  startDisabled,
  endDisabled,
  endSilentDisabled,
  activeActions,
  inactiveActions,
  className,
}: ConversationSupportActionsProps) {
  if (status === "active") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {activeActions}
        {onEndSilent && (
          <button
            type="button"
            onClick={onEndSilent}
            disabled={endSilentDisabled}
            className="rounded-lg bg-[var(--dashboard-text-secondary,#6b7280)] px-4 py-2 text-sm font-medium text-white transition-colors hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {endSilentLabel}
          </button>
        )}
        {onEnd && (
          <button
            type="button"
            onClick={onEnd}
            disabled={endDisabled}
            className="rounded-lg bg-[var(--dashboard-status-danger,#ef4444)] px-4 py-2 text-sm font-medium text-white transition-colors hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {endLabel}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {inactiveActions}
      {(stats || reason) && (
        <div className="text-right">
          {stats && (
            <>
              <p className="text-xs font-medium text-[var(--dashboard-primary,#37a501)]">
                {stats.total ?? 0} mensagens
              </p>
              <p className="text-xs text-[var(--dashboard-text-secondary,#6b7280)]">
                {stats.inbound ?? 0} recebidas · {stats.outbound ?? 0} enviadas
              </p>
            </>
          )}
          {reason && (
            <p className="mt-1 text-xs text-[var(--dashboard-status-warning,#f59e0b)]">
              {reason}
            </p>
          )}
        </div>
      )}
      {onStart && (
        <button
          type="button"
          onClick={onStart}
          disabled={startDisabled}
          className="rounded-lg bg-[var(--dashboard-primary,#37a501)] px-4 py-2 text-sm font-medium text-white transition-colors hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {startLabel}
        </button>
      )}
    </div>
  );
}
