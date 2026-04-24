import { useState } from "react";
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
  const [expanded, setExpanded] = useState(false);
  const platform = PlatformMeta[conversation.platform];
  const statusTone =
    conversation.status === "Open"
      ? "success"
      : conversation.status === "Resolved"
        ? "success"
        : conversation.status === "Pending"
          ? "warning"
          : "neutral";
  const anyBreach =
    conversation.firstResponseBreached || conversation.resolutionBreached;
  const hasSla =
    !!(
      conversation.firstResponseDue ||
      conversation.resolutionDue ||
      conversation.firstResponseActual ||
      conversation.resolutionActual
    );

  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-theme-xs sm:px-5">
      {/* Compact row — always visible */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <Avatar
            size="md"
            initials={conversation.senderInitials}
            color={conversation.senderColor}
            indicator={{
              letter: platform.letter,
              color: `${platform.bg} text-white`,
            }}
          />
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0">
            <span className="text-[12px] text-gray-500">
              {conversation.platformHandle}
            </span>
            <span className="text-gray-300">—</span>
            <span className="truncate text-[14px] font-semibold text-gray-800">
              {conversation.senderName}
            </span>
            <span className="text-[12px] text-gray-400">
              {conversation.senderId}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <StatusPill label={conversation.status} tone={statusTone} />
          {hasSla && anyBreach && !expanded && (
            <StatusPill label="SLA Breached" tone="danger" />
          )}
          {hasSla && !anyBreach && !expanded && (
            <StatusPill label="On Track" tone="success" />
          )}
          <span className="hidden items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-medium text-gray-700 sm:inline-flex">
            <Avatar
              size="xs"
              initials={conversation.assigneeInitials}
              color={conversation.senderColor}
            />
            <span className="truncate max-w-[120px]">
              {conversation.assignee}
            </span>
          </span>
          <div className="mx-0.5 h-5 w-px bg-gray-200" />
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
          {hasSla && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              aria-label={expanded ? "Hide details" : "Show details"}
              className="inline-flex size-7 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            >
              <Icon
                name="chevron-down"
                className={`size-4 transition ${expanded ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="mt-2 border-t border-gray-100 pt-2">
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <a
              href="#agent"
              className="text-[12.5px] font-medium text-brand-500 hover:underline"
            >
              {conversation.assignee}
            </a>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">
              <Icon name="eye" className="size-3" />
              {conversation.assigneeInitials}
            </span>
          </div>
          {hasSla && (
            <div className="flex flex-col gap-1">
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
      )}
    </div>
  );
}
