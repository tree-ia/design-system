"use client";

import React from "react";
import type {
  ConversationListItemProps,
  ConversationPreviewCardProps,
} from "./types";
import { ConversationAvatar } from "./ConversationAvatar";
import { ConversationSupportBadge } from "./ConversationSupportBadge";
import { cn, defaultConversationDateFormatter } from "./utils";

export function ConversationPreviewCard({
  item,
  selected = item.selected,
  onSelect,
  formatDate = defaultConversationDateFormatter,
  variant = "card",
  showContact = true,
  showMeta = true,
  showSupportBadge = true,
  showUnreadBadge = true,
  contentClassName,
  className,
}: ConversationPreviewCardProps) {
  const timeLabel =
    item.lastMessageLabel ||
    (item.lastMessageAt ? formatDate(item.lastMessageAt) : undefined);
  const compact = variant === "compact";
  const list = variant === "list";

  const content = (
    <div
      className={cn(
        "flex gap-3",
        compact ? "px-3 py-3" : "px-4 py-4",
        contentClassName,
      )}
    >
      <ConversationAvatar participant={item.participant} size={compact ? "md" : "lg"} />

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-[var(--dashboard-text-primary,#2d2d2d)]">
              {item.participant.name}
            </h3>
            {showContact && (item.participant.phone || item.participant.email) && (
              <p className="truncate text-xs text-[var(--dashboard-text-secondary,#6b7280)]">
                {item.participant.phone || item.participant.email}
              </p>
            )}
          </div>
          {timeLabel && (
            <span className="flex-shrink-0 text-xs text-[var(--dashboard-text-secondary,#6b7280)]">
              {timeLabel}
            </span>
          )}
        </div>

        {item.lastMessage && (
          <p
            className={cn(
              "text-[var(--dashboard-text-secondary,#6b7280)]",
              compact ? "truncate text-xs" : "truncate text-sm",
            )}
          >
            {item.lastMessage}
          </p>
        )}

        {(showMeta || showSupportBadge || showUnreadBadge) && (
          <div className="mt-2 flex items-center justify-between gap-2">
            {showMeta ? (
              <span className="text-xs text-[var(--dashboard-text-secondary,#6b7280)]">
                {typeof item.messageCount === "number"
                  ? `${item.messageCount} mensagens`
                  : item.meta}
              </span>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-2">
              {showSupportBadge && (
                <ConversationSupportBadge
                  status={item.supportStatus}
                  label={item.supportLabel}
                />
              )}
              {showUnreadBadge && !!item.unreadCount && item.unreadCount > 0 && (
                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--dashboard-primary,#37a501)] px-1.5 py-0.5 text-xs font-semibold text-white">
                  {item.unreadCount}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const itemClassName = cn(
    "group w-full text-left transition-colors",
    onSelect && "hover:bg-[var(--dashboard-primary,#37a501)]/8",
    list
      ? selected
        ? "border-l-4 border-[var(--dashboard-primary,#37a501)] bg-[var(--dashboard-primary,#37a501)]/10"
        : item.supportStatus === "requested"
          ? "border-l-4 border-[var(--dashboard-status-warning,#f59e0b)] bg-[var(--dashboard-status-warning,#f59e0b)]/8"
          : item.supportStatus === "active"
            ? "border-l-4 border-[var(--dashboard-primary,#37a501)] bg-[var(--dashboard-primary,#37a501)]/5"
            : "border-l-4 border-transparent"
      : cn(
          "rounded-lg border bg-[var(--dashboard-surface,#ffffff)] shadow-sm",
          compact
            ? "border-[var(--dashboard-text-secondary,#6b7280)]/15"
            : "border-[var(--dashboard-text-secondary,#6b7280)]/20",
          selected
            ? "border-[var(--dashboard-primary,#37a501)] ring-2 ring-[var(--dashboard-primary,#37a501)]/15"
            : item.supportStatus === "requested"
              ? "border-[var(--dashboard-status-warning,#f59e0b)]/35"
              : "hover:border-[var(--dashboard-primary,#37a501)]/35",
        ),
    item.disabled && "cursor-not-allowed opacity-60",
    className,
  );

  if (onSelect) {
    return (
      <button
        type="button"
        disabled={item.disabled}
        onClick={() => onSelect(item)}
        className={itemClassName}
      >
        {content}
      </button>
    );
  }

  return <div className={itemClassName}>{content}</div>;
}

export function ConversationListItem(props: ConversationListItemProps) {
  return <ConversationPreviewCard {...props} variant="list" />;
}
