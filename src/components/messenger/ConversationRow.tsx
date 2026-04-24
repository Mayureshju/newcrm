import type { Conversation } from "../../types/messenger";
import { Avatar, PlatformMiniBadge, StatusPill } from "./primitives";

export function ConversationRow({
  conversation,
  active,
  onClick,
}: {
  conversation: Conversation;
  active: boolean;
  onClick: () => void;
}) {
  const statusTone =
    conversation.status === "Open"
      ? "warning"
      : conversation.status === "Resolved"
        ? "success"
        : conversation.status === "Pending"
          ? "warning"
          : "neutral";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition ${
        active
          ? "bg-indigo-50/80 ring-1 ring-indigo-100"
          : "hover:bg-gray-50"
      }`}
    >
      <Avatar
        initials={conversation.senderInitials}
        color={conversation.senderColor}
        size="md"
        online={conversation.online}
      />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 truncate">
            <span className="truncate text-[14px] font-semibold text-gray-800">
              {conversation.senderName}
            </span>
            <StatusPill label={conversation.status} tone={statusTone} />
          </span>
          <span className="shrink-0 text-[11px] text-gray-400">
            {conversation.updatedLabel}
          </span>
        </span>
        <span className="truncate text-[12px] text-gray-500">
          {conversation.lastPreview}
        </span>
        <span className="flex items-center justify-between gap-2 pt-0.5">
          <span className="truncate text-[11px] text-gray-400">
            {conversation.senderId}
          </span>
          <PlatformMiniBadge platform={conversation.platform} />
        </span>
      </span>
      {conversation.unread > 0 && !active && (
        <span className="absolute right-3 top-3 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
          {conversation.unread}
        </span>
      )}
    </button>
  );
}
