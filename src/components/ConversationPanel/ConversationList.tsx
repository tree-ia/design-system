"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { EmptyState } from "../EmptyState";
import { Loading } from "../Loading";
import type { ConversationListProps } from "./types";
import { ConversationPreviewCard } from "./ConversationPreviewCard";
import { ConversationSearch } from "./ConversationSearch";
import { cn } from "./utils";

export function ConversationList({
  items,
  selectedId,
  searchValue = "",
  searchPlaceholder = "Buscar conversas...",
  onSearchChange,
  onClearSearch,
  onSelect,
  loading = false,
  emptyTitle = "Nenhuma conversa encontrada",
  emptyDescription,
  formatDate,
  className,
}: ConversationListProps) {
  return (
    <aside
      className={cn(
        "flex min-h-0 flex-col overflow-hidden border-r border-[var(--dashboard-text-secondary,#6b7280)]/20 bg-[var(--dashboard-surface,#ffffff)]",
        className,
      )}
    >
      {(onSearchChange || searchValue) && (
        <div className="flex h-20 shrink-0 items-center border-b border-[var(--dashboard-text-secondary,#6b7280)]/20 px-4">
          <ConversationSearch
            value={searchValue}
            placeholder={searchPlaceholder}
            onChange={onSearchChange}
            onClear={onClearSearch}
            className="w-full"
          />
        </div>
      )}

      <div className="conversation-scrollbar min-h-0 flex-1 overflow-y-auto divide-y divide-[var(--dashboard-text-secondary,#6b7280)]/15">
        {loading ? (
          <div className="flex h-full min-h-64 items-center justify-center p-6">
            <Loading size="md" text="Carregando conversas..." />
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={<MessageCircle className="h-8 w-8 text-[var(--dashboard-text-secondary,#6b7280)]" />}
            title={emptyTitle}
            description={emptyDescription}
          />
        ) : (
          items.map((item) => (
            <ConversationPreviewCard
              key={item.id}
              item={item}
              selected={item.id === selectedId || item.selected}
              onSelect={onSelect}
              formatDate={formatDate}
              variant="list"
            />
          ))
        )}
      </div>
    </aside>
  );
}
