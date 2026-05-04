import {
  FileText,
  Image as ImageIcon,
  Mic,
  PlaySquare,
} from "lucide-react";

export { ConversationAvatar } from "./ConversationAvatar";
export { ConversationComposer } from "./ConversationComposer";
export { ConversationEventSeparator } from "./ConversationEventSeparator";
export { ConversationLayout, ConversationPanel } from "./ConversationLayout";
export { ConversationList } from "./ConversationList";
export {
  ConversationListItem,
  ConversationPreviewCard,
} from "./ConversationPreviewCard";
export { ConversationMediaPreview } from "./ConversationMediaPreview";
export { ConversationMessageBubble } from "./ConversationMessageBubble";
export { ConversationSearch } from "./ConversationSearch";
export { ConversationSupportActions } from "./ConversationSupportActions";
export { ConversationSupportBadge } from "./ConversationSupportBadge";
export { ConversationThread } from "./ConversationThread";
export { ConversationThreadHeader } from "./ConversationThreadHeader";
export { ConversationUnreadMarker } from "./ConversationUnreadMarker";

export type {
  ConversationAvatarProps,
  ConversationComposerProps,
  ConversationEventSeparatorProps,
  ConversationLayoutProps,
  ConversationListItemData,
  ConversationListItemProps,
  ConversationListProps,
  ConversationMediaPreviewProps,
  ConversationMessageBubbleProps,
  ConversationMessageData,
  ConversationMessageDirection,
  ConversationMessageKind,
  ConversationMessageMedia,
  ConversationPanelProps,
  ConversationParticipant,
  ConversationPreviewCardProps,
  ConversationPreviewVariant,
  ConversationSearchProps,
  ConversationStats,
  ConversationSupportActionsProps,
  ConversationSupportBadgeProps,
  ConversationSupportStatus,
  ConversationThreadHeaderProps,
  ConversationThreadProps,
  ConversationUnreadMarkerProps,
} from "./types";

export const conversationMessageIcons = {
  image: ImageIcon,
  audio: Mic,
  video: PlaySquare,
  file: FileText,
};
