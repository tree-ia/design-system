"use client";

import React from "react";
import type { ConversationMessageBubbleProps } from "./types";
import { ConversationEventSeparator } from "./ConversationEventSeparator";
import { ConversationMediaPreview } from "./ConversationMediaPreview";
import { cn, defaultConversationTimeFormatter } from "./utils";

export function ConversationMessageBubble({
  message,
  onMediaOpen,
  formatTime = defaultConversationTimeFormatter,
  className,
}: ConversationMessageBubbleProps) {
  const kind = message.kind || "text";
  const timeLabel =
    message.timestampLabel ||
    (message.createdAt ? formatTime(message.createdAt) : undefined);

  if (kind === "event") {
    return (
      <ConversationEventSeparator
        label={message.eventLabel || message.content}
        description={message.eventDescription}
        className={className}
      />
    );
  }

  if (message.direction === "system") {
    return (
      <div className={cn("flex justify-center", className)}>
        <div className="max-w-lg rounded-lg border border-[var(--dashboard-text-secondary,#6b7280)]/20 bg-[var(--dashboard-text-secondary,#6b7280)]/10 px-4 py-2 text-[var(--dashboard-text-primary,#2d2d2d)]">
          <p className="mb-1 text-xs font-medium text-[var(--dashboard-text-secondary,#6b7280)]">
            {message.authorLabel || "Sistema"}
          </p>
          <div className="text-sm">{message.content}</div>
          {timeLabel && (
            <p className="mt-1 text-xs text-[var(--dashboard-text-secondary,#6b7280)]">
              {timeLabel}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (kind === "interactive") {
    return (
      <div
        className={cn(
          "flex",
          message.direction === "outbound" ? "justify-end" : "justify-start",
          className,
        )}
      >
        <div className="max-w-lg rounded-lg border border-[var(--dashboard-primary,#37a501)]/25 bg-[var(--dashboard-primary,#37a501)]/10 px-4 py-2">
          <p className="mb-1 text-xs font-medium text-[var(--dashboard-primary,#37a501)]">
            {message.interactiveLabel || "Resposta"}
          </p>
          <p className="text-sm font-medium text-[var(--dashboard-text-primary,#2d2d2d)]">
            {message.interactiveTitle || message.content}
          </p>
          {timeLabel && (
            <p className="mt-1 text-xs text-[var(--dashboard-text-secondary,#6b7280)]">
              {timeLabel}
            </p>
          )}
        </div>
      </div>
    );
  }

  const outbound = message.direction === "outbound";

  return (
    <div
      className={cn(
        "flex",
        outbound ? "justify-end" : "justify-start",
        className,
      )}
    >
      <div
        className={cn(
          "max-w-[78%] rounded-lg px-4 py-3 text-sm shadow-sm",
          outbound
            ? "bg-[var(--dashboard-primary,#37a501)] text-white"
            : "border border-[var(--dashboard-text-secondary,#6b7280)]/18 bg-[var(--dashboard-surface,#ffffff)] text-[var(--dashboard-text-primary,#2d2d2d)]",
        )}
      >
        {message.authorLabel && (
          <p
            className={cn(
              "mb-1 text-xs font-medium",
              outbound
                ? "text-white/75"
                : "text-[var(--dashboard-text-secondary,#6b7280)]",
            )}
          >
            {message.authorLabel}
          </p>
        )}

        {kind !== "text" && (
          <ConversationMediaPreview message={message} onMediaOpen={onMediaOpen} />
        )}

        {kind === "text" && message.content && (
          <div className="whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
          </div>
        )}

        {timeLabel && (
          <p
            className={cn(
              "mt-1 text-xs",
              outbound
                ? "text-white/75"
                : "text-[var(--dashboard-text-secondary,#6b7280)]",
            )}
          >
            {timeLabel}
          </p>
        )}
      </div>
    </div>
  );
}
