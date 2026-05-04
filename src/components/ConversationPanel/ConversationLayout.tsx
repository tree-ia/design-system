"use client";

import React from "react";
import type { ConversationLayoutProps, ConversationPanelProps } from "./types";
import { ConversationList } from "./ConversationList";
import { ConversationThread } from "./ConversationThread";
import { cn } from "./utils";

export function ConversationLayout({
  title = "Conversas",
  subtitle,
  hideHeader = false,
  connected,
  conversations,
  selectedId,
  selectedParticipant,
  messages,
  stats,
  searchValue,
  onSearchChange,
  onClearSearch,
  onSelectConversation,
  listLoading,
  threadLoading,
  threadActions,
  composer,
  supportStatus,
  supportLabel,
  unreadMessageId,
  unreadLabel,
  onBack,
  onSettingsClick,
  onMediaOpen,
  formatListDate,
  formatMessageTime,
  className,
}: ConversationLayoutProps) {
  return (
    <div
      className={cn(
        "conversation-panel flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-[var(--dashboard-text-secondary,#6b7280)]/20 bg-[var(--dashboard-surface,#ffffff)]",
        className,
      )}
    >
      <style>{`
        .conversation-panel .conversation-scrollbar {
          scrollbar-color: var(--dashboard-primary,#37a501) color-mix(in srgb, var(--dashboard-primary,#37a501) 12%, transparent);
          scrollbar-width: thin;
        }

        .conversation-panel .conversation-scrollbar::-webkit-scrollbar {
          width: 0.5rem;
          height: 0.5rem;
        }

        .conversation-panel .conversation-scrollbar::-webkit-scrollbar-track {
          background: color-mix(in srgb, var(--dashboard-primary,#37a501) 10%, transparent);
          border-radius: 999px;
        }

        .conversation-panel .conversation-scrollbar::-webkit-scrollbar-thumb {
          background: var(--dashboard-primary,#37a501);
          border-radius: 999px;
        }

        .conversation-panel .conversation-scrollbar::-webkit-scrollbar-thumb:hover {
          background: color-mix(in srgb, var(--dashboard-primary,#37a501) 84%, var(--dashboard-text-primary,#2d2d2d));
        }
      `}</style>
      {!hideHeader && (title || subtitle || typeof connected === "boolean") && (
        <div className="border-b border-[var(--dashboard-text-secondary,#6b7280)]/20 bg-[var(--dashboard-surface,#ffffff)] px-4 py-4 sm:px-6">
          {(title || typeof connected === "boolean") && (
            <div className="flex items-center gap-2">
              {title && (
                <h1 className="text-xl font-bold text-[var(--dashboard-text-primary,#2d2d2d)]">
                  {title}
                </h1>
              )}
              {typeof connected === "boolean" && (
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    connected
                      ? "bg-[var(--dashboard-primary,#37a501)]"
                      : "bg-[var(--dashboard-text-secondary,#6b7280)]/40",
                  )}
                  title={connected ? "Conectado em tempo real" : "Desconectado"}
                />
              )}
            </div>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-[var(--dashboard-text-secondary,#6b7280)]">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <ConversationList
          items={conversations}
          selectedId={selectedId}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          onClearSearch={onClearSearch}
          onSelect={onSelectConversation}
          loading={listLoading}
          formatDate={formatListDate}
          className={cn(
            "w-full md:flex md:w-80 lg:w-96",
            selectedParticipant ? "hidden md:flex" : "flex",
          )}
        />

        <ConversationThread
          participant={selectedParticipant}
          messages={messages}
          stats={stats}
          loading={threadLoading}
          headerActions={threadActions}
          composer={composer}
          supportStatus={supportStatus}
          supportLabel={supportLabel}
          unreadMessageId={unreadMessageId}
          unreadLabel={unreadLabel}
          onBack={onBack}
          onSettingsClick={onSettingsClick}
          onMediaOpen={onMediaOpen}
          formatTime={formatMessageTime}
          className={cn(selectedParticipant ? "flex" : "hidden md:flex")}
        />
      </div>
    </div>
  );
}

export function ConversationPanel(props: ConversationPanelProps) {
  return <ConversationLayout {...props} />;
}
