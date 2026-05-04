"use client";

import React from "react";
import { ArrowLeft, Settings } from "lucide-react";
import type { ConversationThreadHeaderProps } from "./types";
import { ConversationAvatar } from "./ConversationAvatar";
import { ConversationSupportBadge } from "./ConversationSupportBadge";
import { cn } from "./utils";

export function ConversationThreadHeader({
  participant,
  stats,
  subtitle,
  supportStatus,
  supportLabel,
  onBack,
  onSettingsClick,
  actions,
  className,
}: ConversationThreadHeaderProps) {
  return (
    <div
      className={cn(
        "flex h-20 shrink-0 items-center border-b border-[var(--dashboard-text-secondary,#6b7280)]/20 bg-[var(--dashboard-surface,#ffffff)] px-4 sm:px-6",
        className,
      )}
    >
      <div className="flex w-full items-center gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--dashboard-primary,#37a501)] transition-colors hover:bg-[var(--dashboard-primary,#37a501)]/10 md:hidden"
            aria-label="Voltar para lista"
          >
            <ArrowLeft size={18} />
          </button>
        )}

        <ConversationAvatar participant={participant} />

        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-2">
            <h2 className="truncate text-sm font-semibold text-[var(--dashboard-text-primary,#2d2d2d)] sm:text-base">
              {participant.name}
            </h2>
            {(participant.phone || participant.email) && (
              <span className="truncate text-xs text-[var(--dashboard-text-secondary,#6b7280)]">
                {participant.phone || participant.email}
              </span>
            )}
          </div>
          {(subtitle || stats) && (
            <p className="mt-0.5 text-xs text-[var(--dashboard-text-secondary,#6b7280)]">
              {subtitle ||
                `${stats?.total ?? 0} mensagens · ${stats?.inbound ?? 0} recebidas · ${stats?.outbound ?? 0} enviadas`}
            </p>
          )}
        </div>

        {onSettingsClick && (
          <button
            type="button"
            onClick={onSettingsClick}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--dashboard-text-secondary,#6b7280)] transition-colors hover:bg-[var(--dashboard-text-secondary,#6b7280)]/10 hover:text-[var(--dashboard-text-primary,#2d2d2d)]"
            aria-label="Configurar conversa"
          >
            <Settings size={16} />
          </button>
        )}

        <div className="ml-auto flex items-center gap-3">
          <ConversationSupportBadge status={supportStatus} label={supportLabel} />
          {actions}
        </div>
      </div>
    </div>
  );
}
