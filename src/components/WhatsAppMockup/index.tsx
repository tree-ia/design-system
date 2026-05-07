"use client";

import React, { useEffect, useId, useState } from "react";
import {
  Camera,
  Check,
  CheckCheck,
  ChevronLeft,
  Mic,
  MoreVertical,
  Paperclip,
  Phone as PhoneIcon,
  Play,
  Smile,
  Video,
  Wifi,
} from "lucide-react";
import { IPhoneMockup, type IPhoneMockupProps } from "../IPhoneMockup";

export type WhatsAppProfileType = "business" | "personal";
export type WhatsAppMessageDirection = "incoming" | "outgoing";
export type WhatsAppMessageType = "text" | "audio" | "custom";
export type WhatsAppMockupTheme = "dark" | "light";

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
  style?: React.CSSProperties;
}

export interface WhatsAppMockupProps extends Pick<
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
  theme?: WhatsAppMockupTheme;
  headerBackgroundColor?: React.CSSProperties["backgroundColor"];
  profileAvatarBackgroundColor?: React.CSSProperties["backgroundColor"];
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

const FALLBACK_STATUS_TIME = "14:32";

const WHATSAPP_PALETTES = {
  dark: {
    frame: "#0a0d12",
    statusbar: "#111b21",
    statusText: "#e9edef",
    screen: "#0b141a",
    header: "#111b21",
    headerText: "#e9edef",
    mutedText: "#aebac1",
    subtleText: "#8696a0",
    action: "#00a884",
    wallpaperStroke: "#e9edef",
    wallpaperOpacity: 0.045,
    dateBg: "#182229",
    dateText: "#aebac1",
    noticeBg: "#182229",
    noticeText: "#d0b66b",
    incoming: "#202c33",
    incomingText: "#e9edef",
    outgoing: "#005c4b",
    outgoingText: "#e9edef",
    outgoingMeta: "#c7d4cf",
    read: "#53bdeb",
    avatarBg: "#60b531",
    composer: "#111b21",
    composerInput: "#202c33",
    composerText: "#8696a0",
    micBg: "#00a884",
    micIcon: "#07130f",
    audioWave: "#9ad8ca",
    audioButtonBg: "#00a884",
    audioPlayIcon: "#aebac1",
    audioWavePlayed: "#25d366",
    audioWaveMuted: "#3b4a52",
    audioAvatarBg: "#12b2ca",
    audioMicBadgeBg: "#25d366",
    shadow: "rgba(0, 0, 0, 0.22)",
  },
  light: {
    frame: "#0a0d12",
    statusbar: "#f7f5f0",
    statusText: "#111b21",
    screen: "#efe7db",
    header: "#f7f5f0",
    headerText: "#111b21",
    mutedText: "#667781",
    subtleText: "#667781",
    action: "#008069",
    wallpaperStroke: "#7d6f59",
    wallpaperOpacity: 0.075,
    dateBg: "rgba(255, 255, 255, 0.88)",
    dateText: "#6b6255",
    noticeBg: "#fff7d6",
    noticeText: "#7a6420",
    incoming: "#ffffff",
    incomingText: "#111b21",
    outgoing: "#d9fdd3",
    outgoingText: "#111b13",
    outgoingMeta: "#66756b",
    read: "#53bdeb",
    avatarBg: "#60b531",
    composer: "#f7f5f0",
    composerInput: "#ffffff",
    composerText: "#667781",
    micBg: "#00a884",
    micIcon: "#ffffff",
    audioWave: "#177866",
    audioButtonBg: "#00a884",
    audioPlayIcon: "#54656f",
    audioWavePlayed: "#25d366",
    audioWaveMuted: "#a4b0b6",
    audioAvatarBg: "#12b2ca",
    audioMicBadgeBg: "#25d366",
    shadow: "rgba(15, 23, 42, 0.11)",
  },
} as const;

type WhatsAppPalette = (typeof WHATSAPP_PALETTES)[WhatsAppMockupTheme];

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

export function WhatsAppMockup({
  contactName,
  profilePhoto,
  profilePhotoAlt,
  profileAvatar,
  profileType = "business",
  contactSubtitle,
  theme = "dark",
  headerBackgroundColor,
  profileAvatarBackgroundColor,
  messages = [],
  statusTime,
  dateLabel = "Hoje",
  encryptionNotice = "Mensagens e ligações são protegidas com criptografia de ponta a ponta.",
  composerPlaceholder = "Mensagem",
  composer,
  showComposer = true,
  showHeaderActions = true,
  showWallpaper = true,
  screenWidth = 266,
  frameColor,
  statusbarColor,
  containerStyle,
  frameOnly,
  hideStatusBar,
  className,
  phoneClassName,
  screenClassName,
  messagesClassName,
  "aria-label": ariaLabel,
}: WhatsAppMockupProps) {
  const palette = WHATSAPP_PALETTES[theme];
  const resolvedStatusTime = useResolvedStatusTime(statusTime);
  const resolvedFrameColor = frameColor ?? palette.frame;
  const resolvedStatusbarColor = statusbarColor ?? palette.statusbar;
  const subtitle =
    contactSubtitle === undefined
      ? profileType === "business"
        ? "WhatsApp Business"
        : undefined
      : contactSubtitle || undefined;

  return (
    <div
      className={cn("inline-block", className)}
      aria-label={ariaLabel ?? `Conversa no WhatsApp com ${contactName}`}
    >
      <IPhoneMockup
        screenWidth={screenWidth}
        screenType="island"
        frameColor={resolvedFrameColor}
        statusbarColor={resolvedStatusbarColor}
        hideNavBar
        frameOnly={frameOnly}
        hideStatusBar={hideStatusBar}
        containerStyle={containerStyle}
        className={phoneClassName}
      >
        <div
          className={cn("flex h-full w-full flex-col", screenClassName)}
          style={{ backgroundColor: palette.screen, color: palette.headerText }}
        >
          <StatusBar
            time={resolvedStatusTime}
            screenWidth={screenWidth}
            palette={palette}
          />
          <WhatsAppHeader
            contactName={contactName}
            subtitle={subtitle}
            profilePhoto={profilePhoto}
            profilePhotoAlt={profilePhotoAlt}
            profileAvatar={profileAvatar}
            showActions={showHeaderActions}
            backgroundColor={headerBackgroundColor ?? palette.header}
            avatarBackgroundColor={
              profileAvatarBackgroundColor ?? palette.avatarBg
            }
            palette={palette}
          />

          <div
            className={cn(
              "relative flex flex-1 flex-col gap-2 overflow-hidden px-2.5 py-2.5",
              messagesClassName,
            )}
          >
            {showWallpaper ? <WhatsAppWallpaper palette={palette} /> : null}

            {dateLabel ? (
              <div
                className="relative z-10 mx-auto rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase shadow-[0_1px_2px_rgba(15,23,42,0.08)]"
                style={{
                  backgroundColor: palette.dateBg,
                  color: palette.dateText,
                }}
              >
                {dateLabel}
              </div>
            ) : null}

            {encryptionNotice ? (
              <div
                className="relative z-10 mx-auto max-w-[92%] rounded-md px-2.5 py-1.5 text-center text-[9px] leading-snug shadow-[0_1px_2px_rgba(15,23,42,0.06)]"
                style={{
                  backgroundColor: palette.noticeBg,
                  color: palette.noticeText,
                }}
              >
                {encryptionNotice}
              </div>
            ) : null}

            {messages.map((message, index) => (
              <WhatsAppMessageBubble
                key={message.id ?? `${message.time}-${index}`}
                message={message}
                palette={palette}
              />
            ))}
          </div>

          {showComposer
            ? (composer ?? (
                <WhatsAppComposer
                  composerPlaceholder={composerPlaceholder}
                  palette={palette}
                />
              ))
            : null}
        </div>
      </IPhoneMockup>
    </div>
  );
}

interface StatusBarProps {
  time: string;
  screenWidth: number;
  palette: WhatsAppPalette;
}

function useResolvedStatusTime(statusTime?: string) {
  const [currentTime, setCurrentTime] = useState(FALLBACK_STATUS_TIME);

  useEffect(() => {
    if (statusTime) {
      return;
    }

    const updateCurrentTime = () => {
      setCurrentTime(formatStatusTime(new Date()));
    };

    updateCurrentTime();

    let interval: number | undefined;
    const now = new Date();
    const nextMinuteDelay =
      (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    const timeout = window.setTimeout(() => {
      updateCurrentTime();
      interval = window.setInterval(updateCurrentTime, 60_000);
    }, nextMinuteDelay);

    return () => {
      window.clearTimeout(timeout);
      if (interval !== undefined) {
        window.clearInterval(interval);
      }
    };
  }, [statusTime]);

  return statusTime ?? currentTime;
}

function formatStatusTime(date: Date) {
  return `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

function StatusBar({ time, screenWidth, palette }: StatusBarProps) {
  return (
    <div
      aria-hidden
      className="absolute left-0 right-0 top-0 z-50 flex items-center justify-between px-6 text-[11px] font-semibold tracking-tight"
      style={{ height: `${Math.floor((screenWidth * 59) / 390)}px` }}
    >
      <span className="tabular-nums" style={{ color: palette.statusText }}>
        {time}
      </span>
      <div
        className="flex items-center gap-1"
        style={{ color: palette.statusText }}
      >
        <IosSignal color={palette.statusText} />
        <Wifi className="h-3 w-3" strokeWidth={2.4} aria-hidden />
        <IosBattery color={palette.statusText} />
      </div>
    </div>
  );
}

function IosSignal({ color }: { color: string }) {
  return (
    <span className="flex h-3 w-3 items-end gap-[1px]" aria-hidden>
      {[4, 6, 8, 10].map((height) => (
        <span
          key={height}
          className="w-[2px] rounded-sm"
          style={{ height, backgroundColor: color }}
        />
      ))}
    </span>
  );
}

function IosBattery({ color }: { color: string }) {
  return (
    <span className="flex items-center gap-[1px]" aria-hidden>
      <span
        className="relative h-[8px] w-[16px] rounded-[2px] border"
        style={{ borderColor: color }}
      >
        <span
          className="absolute bottom-[1px] left-[1px] top-[1px] w-[10px] rounded-[1px]"
          style={{ backgroundColor: color }}
        />
      </span>
      <span
        className="h-[4px] w-[1.5px] rounded-r"
        style={{ backgroundColor: color }}
      />
    </span>
  );
}

interface WhatsAppHeaderProps {
  contactName: string;
  subtitle?: string;
  profilePhoto?: string;
  profilePhotoAlt?: string;
  profileAvatar?: React.ReactNode;
  showActions: boolean;
  backgroundColor: React.CSSProperties["backgroundColor"];
  avatarBackgroundColor: React.CSSProperties["backgroundColor"];
  palette: WhatsAppPalette;
}

function WhatsAppHeader({
  contactName,
  subtitle,
  profilePhoto,
  profilePhotoAlt,
  profileAvatar,
  showActions,
  backgroundColor,
  avatarBackgroundColor,
  palette,
}: WhatsAppHeaderProps) {
  return (
    <div
      className="relative shadow-[0_1px_0_rgba(17,27,33,0.08)]"
      style={{ backgroundColor, color: palette.headerText }}
    >
      <div className="flex items-center gap-2 px-2.5 pb-2 pt-2">
        <ChevronLeft
          className="h-5 w-5 shrink-0"
          strokeWidth={2.4}
          style={{ color: palette.action }}
          aria-hidden
        />
        <ProfileAvatar
          contactName={contactName}
          profilePhoto={profilePhoto}
          profilePhotoAlt={profilePhotoAlt}
          profileAvatar={profileAvatar}
          backgroundColor={avatarBackgroundColor}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold leading-tight">
            {contactName}
          </p>
          {subtitle ? (
            <p
              className="truncate text-[10px] leading-tight"
              style={{ color: palette.mutedText }}
            >
              {subtitle}
            </p>
          ) : null}
        </div>
        {showActions ? (
          <>
            <Video
              className="h-4 w-4 shrink-0"
              strokeWidth={2.2}
              style={{ color: palette.action }}
              aria-hidden
            />
            <PhoneIcon
              className="h-3.5 w-3.5 shrink-0"
              strokeWidth={2.2}
              style={{ color: palette.action }}
              aria-hidden
            />
            <MoreVertical
              className="h-4 w-4 shrink-0"
              strokeWidth={2.2}
              style={{ color: palette.action }}
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
  backgroundColor: React.CSSProperties["backgroundColor"];
}

function ProfileAvatar({
  contactName,
  profilePhoto,
  profilePhotoAlt,
  profileAvatar,
  backgroundColor,
}: ProfileAvatarProps) {
  if (profileAvatar) {
    return (
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full"
        style={{ backgroundColor }}
      >
        {profileAvatar}
      </div>
    );
  }

  if (profilePhoto) {
    return (
      <img
        src={profilePhoto}
        alt={profilePhotoAlt ?? contactName}
        className="h-8 w-8 shrink-0 rounded-full object-cover"
        style={{ backgroundColor }}
      />
    );
  }

  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold uppercase text-white"
      style={{ backgroundColor }}
    >
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
  palette: WhatsAppPalette;
}

function WhatsAppMessageBubble({
  message,
  palette,
}: WhatsAppMessageBubbleProps) {
  const direction = message.direction ?? "outgoing";
  const type = message.type ?? "text";
  const isOutgoing = direction === "outgoing";
  const isCustom = type === "custom";
  const isAudio = type === "audio";
  const bubbleColor = isOutgoing ? palette.outgoing : palette.incoming;

  // Custom bubbles render their own container — no background, padding,
  // tail, shadow, or auto meta from the design-system. Author owns the visual.
  if (isCustom) {
    return (
      <div
        className={cn(
          "relative z-10 max-w-[86%]",
          isOutgoing ? "ml-auto" : "mr-auto",
          message.className,
        )}
        style={message.style}
      >
        <div className={message.contentClassName}>{message.children}</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative z-10 max-w-[86%] rounded-[14px] px-2.5 py-2 shadow-[0_1px_1.5px_rgba(15,23,42,0.11)]",
        isOutgoing ? "ml-auto rounded-tr-[4px]" : "mr-auto rounded-tl-[4px]",
        // Audio bubbles host an absolute meta row at the bottom — reserve space.
        isAudio && "min-w-[210px] pb-[18px]",
        message.className,
      )}
      style={{
        backgroundColor: bubbleColor,
        color: isOutgoing ? palette.outgoingText : palette.incomingText,
        boxShadow: `0 1px 1.5px ${palette.shadow}`,
        ...message.style,
      }}
    >
      <BubbleTail
        side={isOutgoing ? "out" : "in"}
        color={message.style?.backgroundColor?.toString() ?? bubbleColor}
      />

      <div
        className={cn(
          // text size & leading set on the container so children (JSX) inherits
          "text-[10.5px] leading-snug",
          message.contentClassName,
        )}
      >
        {message.children ??
          (isAudio ? (
            <AudioMessage message={message} palette={palette} />
          ) : (
            <p className="max-w-[31ch]">{message.text}</p>
          ))}
      </div>

      {message.hideMeta ? null : isAudio ? (
        <AudioMeta
          duration={message.duration}
          time={message.time}
          direction={direction}
          read={message.read}
          palette={palette}
        />
      ) : (
        <MessageMeta
          time={message.time}
          direction={direction}
          read={message.read}
          palette={palette}
        />
      )}
    </div>
  );
}

interface AudioMessageProps {
  message: WhatsAppMockupMessage;
  palette: WhatsAppPalette;
}

function AudioMessage({ message, palette }: AudioMessageProps) {
  const waveform = message.waveform ?? DEFAULT_WAVEFORM;
  // First ~25% of the waveform is rendered as "played" (highlighted color).
  const playedThreshold = Math.max(1, Math.round(waveform.length * 0.22));

  return (
    <div className="flex items-center gap-2">
      {/* Avatar circular com badge de microfone */}
      <div className="relative shrink-0" aria-hidden>
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold uppercase text-white"
          style={{ backgroundColor: palette.audioAvatarBg }}
        >
          V
        </span>
        <span
          className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full"
          style={{ backgroundColor: palette.audioMicBadgeBg }}
        >
          <Mic
            className="h-2 w-2 text-white"
            strokeWidth={2.4}
            aria-hidden
          />
        </span>
      </div>

      {/* Botão play (sem círculo) */}
      <Play
        className="h-4 w-4 shrink-0 fill-current"
        strokeWidth={0}
        style={{ color: palette.audioPlayIcon }}
        aria-hidden
      />

      {/* Waveform: barras tocadas em destaque + restantes em cinza */}
      <div className="flex h-5 flex-1 items-center gap-[1.5px]" aria-hidden>
        {waveform.map((height, index) => (
          <span
            key={`${height}-${index}`}
            className="flex-1 rounded-[2px]"
            style={{
              backgroundColor:
                index < playedThreshold
                  ? palette.audioWavePlayed
                  : palette.audioWaveMuted,
              height: Math.max(4, Math.round(height * 0.5)),
            }}
          />
        ))}
      </div>
    </div>
  );
}

interface AudioMetaProps {
  duration?: string;
  time: string;
  direction: WhatsAppMessageDirection;
  read?: boolean;
  palette: WhatsAppPalette;
}

function AudioMeta({
  duration,
  time,
  direction,
  read,
  palette,
}: AudioMetaProps) {
  const isOutgoing = direction === "outgoing";
  const metaColor = isOutgoing ? palette.outgoingMeta : palette.subtleText;

  return (
    <div
      className="pointer-events-none absolute bottom-[5px] left-[44px] right-2.5 flex items-center justify-between text-[9px] font-medium leading-none tabular-nums"
      style={{ color: metaColor }}
    >
      <span>{duration}</span>
      <span className="inline-flex items-center gap-[3px] whitespace-nowrap">
        <span>{time}</span>
        {isOutgoing ? (
          read === undefined ? (
            <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden />
          ) : (
            <CheckCheck
              className="h-3 w-3"
              strokeWidth={2.5}
              style={{ color: read ? palette.read : undefined }}
              aria-hidden
            />
          )
        ) : null}
      </span>
    </div>
  );
}

interface MessageMetaProps {
  time: string;
  direction: WhatsAppMessageDirection;
  read?: boolean;
  palette: WhatsAppPalette;
}

function MessageMeta({ time, direction, read, palette }: MessageMetaProps) {
  const isOutgoing = direction === "outgoing";

  return (
    <div
      className="mt-1 flex items-center justify-end gap-1 text-[9px]"
      style={{ color: isOutgoing ? palette.outgoingMeta : palette.subtleText }}
    >
      <span>{time}</span>
      {isOutgoing ? (
        read === undefined ? (
          <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden />
        ) : (
          <CheckCheck
            className="h-3 w-3"
            strokeWidth={2.5}
            style={{ color: read ? palette.read : undefined }}
            aria-hidden
          />
        )
      ) : null}
    </div>
  );
}

interface BubbleTailProps {
  side: "in" | "out";
  color: string;
}

function BubbleTail({ side, color }: BubbleTailProps) {
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
      )}
      style={{ fill: color }}
      viewBox="0 0 14 12"
    >
      <path d={path} />
    </svg>
  );
}

function WhatsAppWallpaper({ palette }: { palette: WhatsAppPalette }) {
  const patternId = useId().replace(/:/g, "");

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <defs>
        <pattern
          id={patternId}
          width="46"
          height="46"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M8 11h12m-6-6v12M31 7c4 0 7 3 7 7 0 5-5 7-7 10-2-3-7-5-7-10 0-4 3-7 7-7Zm-14 25c4 0 6 2 6 5s-2 5-6 5-6-2-6-5 2-5 6-5Zm19 10 6-6m-6 0 6 6"
            stroke={palette.wallpaperStroke}
            strokeWidth="1"
            fill="none"
            opacity={palette.wallpaperOpacity}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M34 29c3 0 5 2 5 4s-2 4-5 4h-6v-4c0-2 3-4 6-4Z"
            stroke={palette.wallpaperStroke}
            strokeWidth="1"
            fill="none"
            opacity={palette.wallpaperOpacity}
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
  palette: WhatsAppPalette;
}

function WhatsAppComposer({
  composerPlaceholder,
  palette,
}: WhatsAppComposerProps) {
  return (
    <div
      className="flex items-center gap-1.5 px-2 pb-[22px] pt-2"
      style={{ backgroundColor: palette.composer }}
    >
      <div
        className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full px-2.5 py-1.5 shadow-[0_1px_1px_rgba(15,23,42,0.06)]"
        style={{
          backgroundColor: palette.composerInput,
          color: palette.composerText,
        }}
      >
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
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: palette.micBg, color: palette.micIcon }}
      >
        <Mic className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden />
      </span>
    </div>
  );
}
