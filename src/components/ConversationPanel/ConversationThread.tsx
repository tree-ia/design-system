"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { EmptyState } from "../EmptyState";
import { Loading } from "../Loading";
import type { ConversationThreadProps } from "./types";
import { ConversationMessageBubble } from "./ConversationMessageBubble";
import { ConversationThreadHeader } from "./ConversationThreadHeader";
import { ConversationUnreadMarker } from "./ConversationUnreadMarker";
import { cn } from "./utils";

export function ConversationThread({
  participant,
  messages = [],
  stats,
  loading = false,
  loadingLabel = "Carregando mensagens...",
  emptyTitle = "Selecione uma conversa",
  emptyDescription = "Escolha uma conversa na lista para visualizar as mensagens.",
  unreadMessageId,
  unreadLabel,
  headerActions,
  composer,
  supportStatus,
  supportLabel,
  onBack,
  onSettingsClick,
  onMediaOpen,
  formatTime,
  messagesContainerRef,
  className,
}: ConversationThreadProps) {
  if (!participant) {
    return (
      <section
        className={cn(
          "flex min-h-0 flex-1 flex-col bg-[var(--dashboard-background,#f2f2f2)]",
          className,
        )}
      >
        <EmptyState
          icon={<MessageCircle className="h-8 w-8 text-[var(--dashboard-primary,#37a501)]/60" />}
          title={emptyTitle}
          description={emptyDescription}
          className="h-full min-h-80 flex-1"
        />
      </section>
    );
  }

  return (
    <section
      className={cn(
        "flex min-h-0 flex-1 flex-col bg-[var(--dashboard-background,#f2f2f2)]",
        className,
      )}
    >
      <ConversationThreadHeader
        participant={participant}
        stats={stats}
        actions={headerActions}
        supportStatus={supportStatus}
        supportLabel={supportLabel}
        onBack={onBack}
        onSettingsClick={onSettingsClick}
      />

      <div
        ref={messagesContainerRef}
        className="conversation-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-6"
      >
        {loading ? (
          <div className="flex h-full min-h-64 items-center justify-center">
            <Loading size="md" text={loadingLabel} />
          </div>
        ) : messages.length === 0 ? (
          <EmptyState
            icon={<MessageCircle className="h-8 w-8 text-[var(--dashboard-text-secondary,#6b7280)]" />}
            title="Nenhuma mensagem nesta conversa"
          />
        ) : (
          messages.map((message) => (
            <React.Fragment key={message.id}>
              {unreadMessageId === message.id && (
                <ConversationUnreadMarker label={unreadLabel} />
              )}
              <ConversationMessageBubble
                message={message}
                onMediaOpen={onMediaOpen}
                formatTime={formatTime}
              />
            </React.Fragment>
          ))
        )}
      </div>

      {composer}
    </section>
  );
}
