import type { ReactNode, Ref } from "react";

export type ConversationSupportStatus = "none" | "requested" | "active";
export type ConversationMessageDirection = "inbound" | "outbound" | "system";
export type ConversationPreviewVariant = "list" | "card" | "compact";
export type ConversationMessageKind =
  | "text"
  | "image"
  | "audio"
  | "video"
  | "file"
  | "interactive"
  | "event"
  | "loading-media";

export interface ConversationParticipant {
  id: string;
  name: string;
  subtitle?: string;
  phone?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  initials?: string;
}

export interface ConversationListItemData {
  id: string;
  participant: ConversationParticipant;
  lastMessage?: string | null;
  lastMessageAt?: string | Date | null;
  lastMessageLabel?: string;
  messageCount?: number;
  unreadCount?: number;
  supportStatus?: ConversationSupportStatus;
  supportLabel?: string;
  selected?: boolean;
  disabled?: boolean;
  meta?: ReactNode;
}

export interface ConversationStats {
  total?: number;
  inbound?: number;
  outbound?: number;
}

export interface ConversationMessageMedia {
  url?: string;
  fileName?: string;
  mimeType?: string;
  alt?: string;
}

export interface ConversationMessageData {
  id: string;
  direction: ConversationMessageDirection;
  kind?: ConversationMessageKind;
  authorLabel?: string;
  content?: ReactNode;
  createdAt?: string | Date | null;
  timestampLabel?: string;
  media?: ConversationMessageMedia;
  interactiveLabel?: string;
  interactiveTitle?: string;
  eventLabel?: string;
  eventDescription?: string;
  pendingLabel?: string;
}

export interface ConversationAvatarProps {
  participant: ConversationParticipant;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export interface ConversationSupportBadgeProps {
  status?: ConversationSupportStatus;
  label?: string;
  className?: string;
}

export interface ConversationSearchProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  className?: string;
}

export interface ConversationListItemProps {
  item: ConversationListItemData;
  selected?: boolean;
  onSelect?: (item: ConversationListItemData) => void;
  formatDate?: (value: string | Date) => string;
  className?: string;
}

export interface ConversationPreviewCardProps
  extends ConversationListItemProps {
  variant?: ConversationPreviewVariant;
  showContact?: boolean;
  showMeta?: boolean;
  showSupportBadge?: boolean;
  showUnreadBadge?: boolean;
  contentClassName?: string;
}

export interface ConversationListProps {
  items: ConversationListItemData[];
  selectedId?: string | null;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  onClearSearch?: () => void;
  onSelect?: (item: ConversationListItemData) => void;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  formatDate?: (value: string | Date) => string;
  className?: string;
}

export interface ConversationSupportActionsProps {
  status?: ConversationSupportStatus;
  stats?: ConversationStats;
  reason?: ReactNode;
  startLabel?: ReactNode;
  endLabel?: ReactNode;
  endSilentLabel?: ReactNode;
  onStart?: () => void;
  onEnd?: () => void;
  onEndSilent?: () => void;
  startDisabled?: boolean;
  endDisabled?: boolean;
  endSilentDisabled?: boolean;
  activeActions?: ReactNode;
  inactiveActions?: ReactNode;
  className?: string;
}

export interface ConversationThreadHeaderProps {
  participant: ConversationParticipant;
  stats?: ConversationStats;
  subtitle?: string;
  supportStatus?: ConversationSupportStatus;
  supportLabel?: string;
  onBack?: () => void;
  onSettingsClick?: () => void;
  actions?: ReactNode;
  className?: string;
}

export interface ConversationEventSeparatorProps {
  label?: ReactNode;
  description?: ReactNode;
  className?: string;
}

export interface ConversationMediaPreviewProps {
  message: ConversationMessageData;
  onMediaOpen?: (message: ConversationMessageData) => void;
  className?: string;
}

export interface ConversationMessageBubbleProps {
  message: ConversationMessageData;
  onMediaOpen?: (message: ConversationMessageData) => void;
  formatTime?: (value: string | Date) => string;
  className?: string;
}

export interface ConversationUnreadMarkerProps {
  label?: string;
  className?: string;
}

export interface ConversationComposerProps {
  value?: string;
  onChange?: (value: string) => void;
  onSend?: () => void;
  onAttachClick?: () => void;
  onFileSelect?: (file: File) => void | Promise<void>;
  acceptedFileTypes?: string;
  placeholder?: string;
  disabled?: boolean;
  sending?: boolean;
  uploading?: boolean;
  status?: "active" | "ai" | "expired" | "disabled";
  inactiveLabel?: string;
  expiredLabel?: string;
  attachLabel?: string;
  sendLabel?: string;
  className?: string;
}

export interface ConversationThreadProps {
  participant?: ConversationParticipant | null;
  messages?: ConversationMessageData[];
  stats?: ConversationStats;
  loading?: boolean;
  loadingLabel?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  unreadMessageId?: string | null;
  unreadLabel?: string;
  headerActions?: ReactNode;
  composer?: ReactNode;
  supportStatus?: ConversationSupportStatus;
  supportLabel?: string;
  onBack?: () => void;
  onSettingsClick?: () => void;
  onMediaOpen?: (message: ConversationMessageData) => void;
  formatTime?: (value: string | Date) => string;
  messagesContainerRef?: Ref<HTMLDivElement>;
  className?: string;
}

export interface ConversationPanelProps {
  title?: string;
  subtitle?: string;
  /** Oculta a faixa superior interna quando o layout ja possui titulo fora do painel. */
  hideHeader?: boolean;
  connected?: boolean;
  conversations: ConversationListItemData[];
  selectedId?: string | null;
  selectedParticipant?: ConversationParticipant | null;
  messages?: ConversationMessageData[];
  stats?: ConversationStats;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onClearSearch?: () => void;
  onSelectConversation?: (item: ConversationListItemData) => void;
  listLoading?: boolean;
  threadLoading?: boolean;
  threadActions?: ReactNode;
  composer?: ReactNode;
  supportStatus?: ConversationSupportStatus;
  supportLabel?: string;
  unreadMessageId?: string | null;
  unreadLabel?: string;
  onBack?: () => void;
  onSettingsClick?: () => void;
  onMediaOpen?: (message: ConversationMessageData) => void;
  formatListDate?: (value: string | Date) => string;
  formatMessageTime?: (value: string | Date) => string;
  className?: string;
}

export type ConversationLayoutProps = ConversationPanelProps;
