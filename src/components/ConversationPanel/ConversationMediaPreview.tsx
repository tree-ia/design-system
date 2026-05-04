"use client";

import React from "react";
import { FileText, Loader2, Paperclip } from "lucide-react";
import type { ConversationMediaPreviewProps } from "./types";
import { cn } from "./utils";

export function ConversationMediaPreview({
  message,
  onMediaOpen,
  className,
}: ConversationMediaPreviewProps) {
  const { media, kind } = message;

  if (kind === "loading-media") {
    return (
      <div className={cn("flex items-center gap-2 py-2 text-sm opacity-75", className)}>
        <Loader2 size={16} className="animate-spin" />
        <span>{message.pendingLabel || "Carregando midia..."}</span>
      </div>
    );
  }

  if (!media?.url) return null;

  if (kind === "image") {
    return (
      <button
        type="button"
        onClick={() => onMediaOpen?.(message)}
        className={cn("block overflow-hidden rounded-md text-left", className)}
      >
        <img
          src={media.url}
          alt={media.alt || media.fileName || "Imagem da conversa"}
          className="max-h-64 max-w-full rounded-md object-contain"
          loading="lazy"
        />
      </button>
    );
  }

  if (kind === "audio") {
    return (
      <div className={cn("space-y-2", className)}>
        <audio controls className="max-w-full min-w-60">
          <source src={media.url} type={media.mimeType || "audio/ogg"} />
        </audio>
        {message.content && (
          <p className="text-xs italic opacity-70">{message.content}</p>
        )}
      </div>
    );
  }

  if (kind === "video") {
    return (
      <video controls className={cn("max-h-64 max-w-full rounded-md", className)}>
        <source src={media.url} type={media.mimeType || "video/mp4"} />
      </video>
    );
  }

  return (
    <a
      href={media.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-2 rounded-md bg-current/10 px-3 py-2 transition-colors hover:bg-current/15",
        className,
      )}
    >
      {kind === "file" ? <FileText size={18} /> : <Paperclip size={18} />}
      <span className="max-w-52 truncate text-sm">
        {media.fileName || "Documento"}
      </span>
    </a>
  );
}
