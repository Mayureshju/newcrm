import type { Conversation } from "../../types/messenger";
import {
  Avatar,
  Icon,
  IconButton,
  PlatformMeta,
  SoftChip,
  StatusPill,
} from "./primitives";

function SlaRow({
  label,
  dueLabel,
  actualLabel,
  breached,
  variant = "due",
}: {
  label: string;
  dueLabel: string | null;
  actualLabel: string | null;
  breached: boolean;
  variant?: "due" | "resolution";
}) {
  if (!dueLabel && !actualLabel) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] text-gray-700">
      {variant === "due" ? (
        breached ? (
          <StatusPill label="Breached" tone="danger" />
        ) : (
          <StatusPill label="On Track" tone="success" />
        )
      ) : (
        <SoftChip>On Track</SoftChip>
      )}
      <span className="min-w-0 break-words">
        <span className="font-semibold text-gray-800">{label}:</span>{" "}
        <span className="font-medium">{dueLabel}</span>
        {actualLabel && (
          <>
            {" · "}
            <span className="text-gray-500">Actual:</span>{" "}
            <span className="font-medium">{actualLabel}</span>
          </>
        )}
      </span>
    </div>
  );
}

export function ConversationHeaderCard({
  conversation,
}: {
  conversation: Conversation;
}) {
  const platform = PlatformMeta[conversation.platform];
  const statusTone =
    conversation.status === "Open"
      ? "success"
      : conversation.status === "Resolved"
        ? "success"
        : conversation.status === "Pending"
          ? "warning"
          : "neutral";
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-theme-xs sm:px-5 sm:py-4">
      {/* Row 1: identity + compact action icons */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <Avatar
            size="lg"
            initials={conversation.senderInitials}
            color={conversation.senderColor}
            indicator={{
              letter: platform.letter,
              color: `${platform.bg} text-white`,
            }}
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-[13px] text-gray-500">
                {conversation.platformHandle}
              </span>
              <span className="text-gray-300">—</span>
              <span className="truncate text-[15px] font-semibold text-gray-800">
                {conversation.senderName}
              </span>
              <span className="text-[12.5px] text-gray-400">
                {conversation.senderId}
              </span>
            </div>
            <a
              href="#agent"
              className="mt-0.5 inline-block text-[12.5px] font-medium text-brand-500 hover:underline"
            >
              {conversation.assignee}
            </a>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <IconButton ariaLabel="Add collaborator" size="sm">
            <Icon name="user-plus" className="size-4" />
          </IconButton>
          <IconButton ariaLabel="Quick actions" size="sm">
            <Icon name="bolt" className="size-4" />
          </IconButton>
          <IconButton ariaLabel="Notes" size="sm">
            <Icon name="note" className="size-4" />
          </IconButton>
          <IconButton ariaLabel="More options" size="sm">
            <Icon name="more-vertical" className="size-4" />
          </IconButton>
        </div>
      </div>

      {/* Row 2: status chips (wrap safely, never overlap SLA) */}
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <StatusPill label={conversation.status} tone={statusTone} />
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">
          <Icon name="eye" className="size-3" />
          {conversation.assigneeInitials}
        </span>
        <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-medium text-gray-700">
          <Avatar
            size="xs"
            initials={conversation.assigneeInitials}
            color={conversation.senderColor}
          />
          <span className="truncate max-w-[140px]">{conversation.assignee}</span>
        </span>
      </div>

      {/* Row 3: SLA rows, free to take full width */}
      {(conversation.firstResponseDue ||
        conversation.resolutionDue ||
        conversation.firstResponseActual ||
        conversation.resolutionActual) && (
        <div className="mt-2 flex flex-col gap-1 border-t border-gray-100 pt-2">
          <SlaRow
            label="First response"
            dueLabel={conversation.firstResponseDue}
            actualLabel={conversation.firstResponseActual}
            breached={conversation.firstResponseBreached}
            variant="due"
          />
          <SlaRow
            label="Resolution"
            dueLabel={conversation.resolutionDue}
            actualLabel={conversation.resolutionActual}
            breached={conversation.resolutionBreached}
            variant="resolution"
          />
        </div>
      )}
    </div>
  );
}
