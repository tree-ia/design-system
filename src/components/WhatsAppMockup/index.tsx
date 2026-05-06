"use client";

import React, { useId } from "react";
import {
  Battery,
  Camera,
  Check,
  CheckCheck,
  ChevronLeft,
  Mic,
  MoreVertical,
  Paperclip,
  Phone as PhoneIcon,
  Play,
  Signal,
  Smile,
  Video,
  Wifi,
} from "lucide-react";
import { IPhoneMockup, type IPhoneMockupProps } from "../IPhoneMockup";

export type WhatsAppProfileType = "business" | "personal";
export type WhatsAppMessageDirection = "incoming" | "outgoing";
export type WhatsAppMessageType = "text" | "audio" | "custom";

export interface WhatsAppMockupMessage {
  id?: string;
  direction?: WhatsAppMessageDirection;
  type?: WhatsAppMessageType;
  text?: string;
  time: string;
  read?: boolean;
  duration?: string;
  waveform?: readonly number[];
  hideMeta?: boolean;
  children?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export interface WhatsAppMockupProps
  extends Pick<
    IPhoneMockupProps,
    | "frameColor"
    | "statusbarColor"
    | "containerStyle"
    | "frameOnly"
    | "hideStatusBar"
  > {
  screenWidth?: IPhoneMockupProps["screenWidth"];
  contactName: string;
  profilePhoto?: string;
  profilePhotoAlt?: string;
  profileAvatar?: React.ReactNode;
  profileType?: WhatsAppProfileType;
  contactSubtitle?: string | null;
  messages?: readonly WhatsAppMockupMessage[];
  statusTime?: string;
  dateLabel?: string | false;
  encryptionNotice?: string | false;
  composerPlaceholder?: string;
  composer?: React.ReactNode;
  showComposer?: boolean;
  showHeaderActions?: boolean;
  showWallpaper?: boolean;
  className?: string;
  phoneClassName?: string;
  screenClassName?: string;
  messagesClassName?: string;
  "aria-label"?: string;
}

const DEFAULT_WAVEFORM = [
  10, 18, 27, 14, 31, 23, 38, 17, 29, 21, 12, 25, 15, 32, 19, 11, 23, 15, 29,
  17,
] as const;

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

export function WhatsAppMockup({
  contactName,
  profilePhoto,
  profilePhotoAlt,
  profileAvatar,
  profileType = "business",
  contactSubtitle,
  messages = [],
  statusTime = "14:32",
  dateLabel = "Hoje",
  encryptionNotice = "Mensagens e ligações são protegidas com criptografia de ponta a ponta.",
  composerPlaceholder = "Mensagem",
  composer,
  showComposer = true,
  showHeaderActions = true,
  showWallpaper = true,
  screenWidth = 266,
  frameColor = "#0a0d12",
  statusbarColor = "#111b21",
  containerStyle,
  frameOnly,
  hideStatusBar,
  className,
  phoneClassName,
  screenClassName,
  messagesClassName,
  "aria-label": ariaLabel,
}: WhatsAppMockupProps) {
  const subtitle =
    contactSubtitle === undefined
      ? profileType === "business"
        ? "WhatsApp Business"
        : undefined
      : contactSubtitle || undefined;

  return (
    <div
      className={cn(
        "rounded-[2.65rem] shadow-[0_34px_74px_-34px_rgba(15,23,42,0.58)] dark:shadow-[0_34px_86px_-34px_rgba(10,13,18,0.82)]",
        className,
      )}
      aria-label={ariaLabel ?? `Conversa no WhatsApp com ${contactName}`}
    >
      <IPhoneMockup
        screenWidth={screenWidth}
        screenType="island"
        frameColor={frameColor}
        statusbarColor={statusbarColor}
        hideNavBar
        frameOnly={frameOnly}
        hideStatusBar={hideStatusBar}
        containerStyle={containerStyle}
        className={phoneClassName}
      >
        <div
          className={cn(
            "flex h-full w-full flex-col bg-[#efe7db] text-[#111b21] dark:bg-[#0b141a] dark:text-white/90",
            screenClassName,
          )}
        >
          <StatusBar time={statusTime} screenWidth={screenWidth} />
          <WhatsAppHeader
            contactName={contactName}
            subtitle={subtitle}
            profilePhoto={profilePhoto}
            profilePhotoAlt={profilePhotoAlt}
            profileAvatar={profileAvatar}
            showActions={showHeaderActions}
          />

          <div
            className={cn(
              "relative flex flex-1 flex-col gap-2 overflow-hidden px-2.5 py-2.5",
              messagesClassName,
            )}
          >
            {showWallpaper ? <WhatsAppWallpaper /> : null}

            {dateLabel ? (
              <div className="relative z-10 mx-auto rounded-full bg-white/82 px-2.5 py-0.5 text-[9px] font-semibold uppercase text-[#6b6255] shadow-[0_1px_2px_rgba(15,23,42,0.08)] dark:bg-[#1f2c33] dark:text-white/58">
                {dateLabel}
              </div>
            ) : null}

            {encryptionNotice ? (
              <div className="relative z-10 mx-auto max-w-[92%] rounded-md bg-[#fff7d6] px-2.5 py-1.5 text-center text-[9px] leading-snug text-[#7a6420] shadow-[0_1px_2px_rgba(15,23,42,0.06)] dark:bg-[#182229] dark:text-[#d0b66b]">
                {encryptionNotice}
              </div>
            ) : null}

            {messages.map((message, index) => (
              <WhatsAppMessageBubble
                key={message.id ?? `${message.time}-${index}`}
                message={message}
              />
            ))}
          </div>

          {showComposer ? (
            composer ?? (
              <WhatsAppComposer composerPlaceholder={composerPlaceholder} />
            )
          ) : null}
        </div>
      </IPhoneMockup>
    </div>
  );
}

interface StatusBarProps {
  time: string;
  screenWidth: number;
}

function StatusBar({ time, screenWidth }: StatusBarProps) {
  return (
    <div
      aria-hidden
      className="absolute left-0 right-0 top-0 z-50 flex items-center justify-between px-6 text-[11px] font-semibold tracking-tight text-[#111b21] dark:text-white/88"
      style={{ height: `${Math.floor((screenWidth * 59) / 390)}px` }}
    >
      <span className="tabular-nums">{time}</span>
      <div className="flex items-center gap-1">
        <Signal className="h-3 w-3" strokeWidth={2.4} aria-hidden />
        <Wifi className="h-3 w-3" strokeWidth={2.4} aria-hidden />
        <Battery className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden />
      </div>
    </div>
  );
}

interface WhatsAppHeaderProps {
  contactName: string;
  subtitle?: string;
  profilePhoto?: string;
  profilePhotoAlt?: string;
  profileAvatar?: React.ReactNode;
  showActions: boolean;
}

function WhatsAppHeader({
  contactName,
  subtitle,
  profilePhoto,
  profilePhotoAlt,
  profileAvatar,
  showActions,
}: WhatsAppHeaderProps) {
  return (
    <div className="relative bg-[#f7f5f0] text-[#111b21] shadow-[0_1px_0_rgba(17,27,33,0.08)] dark:bg-[#111b21] dark:text-white/90">
      <div className="flex items-center gap-2 px-2.5 pb-2 pt-2">
        <ChevronLeft
          className="h-5 w-5 shrink-0 text-[#008069] dark:text-[#00a884]"
          strokeWidth={2.4}
          aria-hidden
        />
        <ProfileAvatar
          contactName={contactName}
          profilePhoto={profilePhoto}
          profilePhotoAlt={profilePhotoAlt}
          profileAvatar={profileAvatar}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold leading-tight">
            {contactName}
          </p>
          {subtitle ? (
            <p className="truncate text-[10px] leading-tight text-[#667781] dark:text-white/52">
              {subtitle}
            </p>
          ) : null}
        </div>
        {showActions ? (
          <>
            <Video
              className="h-4 w-4 shrink-0 text-[#008069] dark:text-[#00a884]"
              strokeWidth={2.2}
              aria-hidden
            />
            <PhoneIcon
              className="h-3.5 w-3.5 shrink-0 text-[#008069] dark:text-[#00a884]"
              strokeWidth={2.2}
              aria-hidden
            />
            <MoreVertical
              className="h-4 w-4 shrink-0 text-[#008069] dark:text-[#00a884]"
              strokeWidth={2.2}
              aria-hidden
            />
          </>
        ) : null}
      </div>
    </div>
  );
}

interface ProfileAvatarProps {
  contactName: string;
  profilePhoto?: string;
  profilePhotoAlt?: string;
  profileAvatar?: React.ReactNode;
}

function ProfileAvatar({
  contactName,
  profilePhoto,
  profilePhotoAlt,
  profileAvatar,
}: ProfileAvatarProps) {
  if (profileAvatar) {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#60b531]">
        {profileAvatar}
      </div>
    );
  }

  if (profilePhoto) {
    return (
      <img
        src={profilePhoto}
        alt={profilePhotoAlt ?? contactName}
        className="h-8 w-8 shrink-0 rounded-full bg-[#60b531] object-cover"
      />
    );
  }

  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#60b531] text-[11px] font-bold uppercase text-white">
      {getInitials(contactName)}
    </div>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "W";
  const second = parts.length > 1 ? parts[parts.length - 1]?.[0] : undefined;
  return `${first}${second ?? ""}`;
}

interface WhatsAppMessageBubbleProps {
  message: WhatsAppMockupMessage;
}

function WhatsAppMessageBubble({ message }: WhatsAppMessageBubbleProps) {
  const direction = message.direction ?? "outgoing";
  const type = message.type ?? "text";
  const isOutgoing = direction === "outgoing";

  return (
    <div
      className={cn(
        "relative z-10 max-w-[86%] rounded-[14px] px-2.5 py-2 shadow-[0_1px_1.5px_rgba(15,23,42,0.11)]",
        isOutgoing
          ? "ml-auto rounded-tr-[4px] bg-[#d9fdd3] text-[#111b13] dark:bg-[#005c4b] dark:text-white/92"
          : "mr-auto rounded-tl-[4px] bg-white text-[#111b21] dark:bg-[#202c33] dark:text-white/92",
        message.className,
      )}
    >
      <BubbleTail
        side={isOutgoing ? "out" : "in"}
        className={
          isOutgoing
            ? "fill-[#d9fdd3] dark:fill-[#005c4b]"
            : "fill-white dark:fill-[#202c33]"
        }
      />

      <div className={message.contentClassName}>
        {message.children ??
          (type === "audio" ? (
            <AudioMessage message={message} />
          ) : type === "custom" ? null : (
            <p className="max-w-[31ch] text-[10.5px] leading-snug">
              {message.text}
            </p>
          ))}
      </div>

      {message.hideMeta ? null : (
        <MessageMeta
          time={message.time}
          direction={direction}
          read={message.read}
        />
      )}
    </div>
  );
}

interface AudioMessageProps {
  message: WhatsAppMockupMessage;
}

function AudioMessage({ message }: AudioMessageProps) {
  const waveform = message.waveform ?? DEFAULT_WAVEFORM;

  return (
    <>
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00a884] text-white">
          <Play
            className="ml-0.5 h-3.5 w-3.5 fill-current"
            strokeWidth={2.2}
            aria-hidden
          />
        </span>
        <div className="flex h-7 flex-1 items-center gap-[2px]" aria-hidden>
          {waveform.map((height, index) => (
            <span
              key={`${height}-${index}`}
              className="origin-center rounded-full bg-[#177866]/75 dark:bg-[#bcebdc]/80"
              style={{
                height: Math.max(8, Math.round(height * 0.78)),
                width: 2,
              }}
            />
          ))}
        </div>
        {message.duration ? (
          <span className="text-[10px] font-medium text-[#53665c] dark:text-white/68">
            {message.duration}
          </span>
        ) : null}
      </div>
      {message.text ? (
        <p className="mt-1.5 max-w-[29ch] text-[9.5px] leading-snug text-[#53665c] dark:text-white/68">
          {message.text}
        </p>
      ) : null}
    </>
  );
}

interface MessageMetaProps {
  time: string;
  direction: WhatsAppMessageDirection;
  read?: boolean;
}

function MessageMeta({ time, direction, read }: MessageMetaProps) {
  const isOutgoing = direction === "outgoing";

  return (
    <div className="mt-1 flex items-center justify-end gap-1 text-[9px] text-[#66756b] dark:text-white/58">
      <span>{time}</span>
      {isOutgoing ? (
        read === undefined ? (
          <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden />
        ) : (
          <CheckCheck
            className={cn("h-3 w-3", read ? "text-[#53bdeb]" : undefined)}
            strokeWidth={2.5}
            aria-hidden
          />
        )
      ) : null}
    </div>
  );
}

interface BubbleTailProps {
  side: "in" | "out";
  className: string;
}

function BubbleTail({ side, className }: BubbleTailProps) {
  const path =
    side === "out"
      ? "M0 0H14C10 1.8 7.4 4.7 6.4 8.3L5.3 12C4.2 7 2.4 2.9 0 0Z"
      : "M14 0H0C4 1.8 6.6 4.7 7.6 8.3L8.7 12C9.8 7 11.6 2.9 14 0Z";

  return (
    <svg
      aria-hidden
      className={cn(
        "pointer-events-none absolute top-0 h-3.5 w-3.5",
        side === "out" ? "-right-[7px]" : "-left-[7px]",
        className,
      )}
      viewBox="0 0 14 12"
    >
      <path d={path} />
    </svg>
  );
}

function WhatsAppWallpaper() {
  const patternId = useId().replace(/:/g, "");

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full text-[#7d6f59]/16 dark:text-white/7"
    >
      <defs>
        <pattern
          id={patternId}
          width="76"
          height="76"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M12 18h18m-9-9v18M49 12c7 0 12 5 12 11 0 8-8 11-12 16-4-5-12-8-12-16 0-6 5-11 12-11Zm-22 42c6 0 10 4 10 9s-4 9-10 9-10-4-10-9 4-9 10-9Zm27 43 10-10m-10 0 10 10"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M58 53c5 0 8 3 8 7s-3 7-8 7h-9v-7c0-4 4-7 9-7Z"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

interface WhatsAppComposerProps {
  composerPlaceholder: string;
}

function WhatsAppComposer({ composerPlaceholder }: WhatsAppComposerProps) {
  return (
    <div className="flex items-center gap-1.5 bg-[#f7f5f0] px-2 pb-[22px] pt-2 dark:bg-[#111b21]">
      <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full bg-white px-2.5 py-1.5 text-[#667781] shadow-[0_1px_1px_rgba(15,23,42,0.06)] dark:bg-[#202c33] dark:text-white/52">
        <Smile className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
        <span className="flex-1 truncate text-[10px]">
          {composerPlaceholder}
        </span>
        <Paperclip
          className="h-3.5 w-3.5 shrink-0"
          strokeWidth={2}
          aria-hidden
        />
        <Camera className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
      </div>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00a884] text-white">
        <Mic className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden />
      </span>
    </div>
  );
}
