"use client";

import React, { useRef } from "react";
import { AlertTriangle, Bot, Loader2, Paperclip, Send } from "lucide-react";
import type { ConversationComposerProps } from "./types";
import { cn } from "./utils";

export function ConversationComposer({
  value = "",
  onChange,
  onSend,
  onAttachClick,
  onFileSelect,
  acceptedFileTypes,
  placeholder = "Digite sua mensagem...",
  disabled = false,
  sending = false,
  uploading = false,
  status = "active",
  inactiveLabel = "IA esta respondendo esta conversa",
  expiredLabel = "Janela de atendimento expirada. Envie um template para reabrir a conversa.",
  attachLabel = "Enviar arquivo",
  sendLabel = "Enviar mensagem",
  className,
}: ConversationComposerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isExpired = status === "expired";
  const isAi = status === "ai";
  const isDisabled = disabled || status === "disabled" || isExpired || isAi;
  const canAttach = !!onAttachClick || !!onFileSelect;

  if (isAi) {
    return (
      <div
        className={cn(
          "flex items-center justify-center gap-2 border-t border-[var(--dashboard-text-secondary,#6b7280)]/20 bg-[var(--dashboard-surface,#ffffff)] px-4 py-4 text-xs text-[var(--dashboard-text-secondary,#6b7280)]",
          className,
        )}
      >
        <Bot size={16} className="text-[var(--dashboard-primary,#37a501)]" />
        {inactiveLabel}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border-t border-[var(--dashboard-text-secondary,#6b7280)]/20 bg-[var(--dashboard-surface,#ffffff)] px-4 py-3 sm:px-6",
        className,
      )}
    >
      {isExpired && (
        <div className="mb-2 flex items-center gap-2 rounded-lg border border-[var(--dashboard-status-warning,#f59e0b)]/30 bg-[var(--dashboard-status-warning,#f59e0b)]/10 p-2 text-xs text-[var(--dashboard-status-warning,#f59e0b)]">
          <AlertTriangle size={16} className="flex-shrink-0" />
          <p>{expiredLabel}</p>
        </div>
      )}

      {onFileSelect && (
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={acceptedFileTypes}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void onFileSelect(file);
            event.target.value = "";
          }}
        />
      )}

      <div className="flex items-center gap-2">
        {canAttach && (
          <button
            type="button"
            onClick={() => {
              onAttachClick?.();
              if (onFileSelect) fileInputRef.current?.click();
            }}
            disabled={disabled || sending || uploading}
            className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-[var(--dashboard-text-secondary,#6b7280)] transition-colors hover:bg-[var(--dashboard-primary,#37a501)]/10 hover:text-[var(--dashboard-primary,#37a501)] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={attachLabel}
          >
            {uploading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Paperclip size={18} />
            )}
          </button>
        )}

        <input
          type="text"
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              if (!isDisabled && value.trim() && !sending) onSend?.();
            }
          }}
          placeholder={isExpired ? "Mensagens livres indisponiveis" : placeholder}
          disabled={isDisabled || sending}
          className="h-10 min-w-0 flex-1 rounded-lg border border-[var(--dashboard-text-secondary,#6b7280)]/25 bg-[var(--dashboard-surface,#ffffff)] px-4 text-sm text-[var(--dashboard-text-primary,#2d2d2d)] outline-none transition-colors focus:border-[var(--dashboard-primary,#37a501)] focus:ring-2 focus:ring-[var(--dashboard-primary,#37a501)]/20 disabled:cursor-not-allowed disabled:bg-[var(--dashboard-text-secondary,#6b7280)]/8 disabled:opacity-60"
        />

        <button
          type="button"
          onClick={onSend}
          disabled={isDisabled || sending || !value.trim()}
          className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--dashboard-primary,#37a501)] text-white transition-colors hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={sendLabel}
        >
          {sending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
    </div>
  );
}
