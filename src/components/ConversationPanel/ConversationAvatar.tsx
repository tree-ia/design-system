"use client";

import React from "react";
import type { ConversationAvatarProps } from "./types";
import { cn, getConversationInitials } from "./utils";

export function ConversationAvatar({
  participant,
  size = "md",
  className,
}: ConversationAvatarProps) {
  const sizeClass = {
    sm: "h-9 w-9 text-sm",
    md: "h-11 w-11 text-base",
    lg: "h-12 w-12 text-lg",
  }[size];

  if (participant.avatarUrl) {
    return (
      <img
        src={participant.avatarUrl}
        alt={participant.name}
        className={cn("flex-shrink-0 rounded-full object-cover", sizeClass, className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex flex-shrink-0 items-center justify-center rounded-full bg-[var(--dashboard-primary,#37a501)]/12 font-semibold text-[var(--dashboard-primary,#37a501)]",
        sizeClass,
        className,
      )}
    >
      {getConversationInitials(participant)}
    </div>
  );
}
