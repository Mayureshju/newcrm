import type { Message, SeenIndicator as SeenItem } from "../../types/messenger";
import { Avatar, Icon } from "./primitives";

interface MessageBubbleProps {
  message: Message;
  showAvatar?: boolean;
  showSenderLabel?: boolean;
  seenBy?: SeenItem | null;
}

function SeenAvatar({ seenBy }: { seenBy: SeenItem }) {
  return (
    <span className="group/seen relative inline-flex">
      <span
        className={`flex size-4 items-center justify-center rounded-full text-[8.5px] font-semibold ${seenBy.actorColor}`}
      >
        {seenBy.actorInitials}
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10.5px] font-medium text-white shadow-lg group-hover/seen:block"
      >
        Seen by {seenBy.actorName} · {seenBy.seenAtLabel}
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
      </span>
    </span>
  );
}

export function MessageBubble({
  message,
  showAvatar = true,
  showSenderLabel = true,
  seenBy = null,
}: MessageBubbleProps) {
  if (message.direction === "Incoming") {
    return (
      <div className="flex items-end gap-2">
        {showAvatar ? (
          <Avatar
            size="sm"
            initials={message.senderInitials}
            color={message.senderColor}
          />
        ) : (
          <span className="size-8 shrink-0" aria-hidden="true" />
        )}
        <div className="flex max-w-[72%] flex-col gap-1">
          <div className="rounded-2xl rounded-tl-md bg-sky-50 px-4 py-2.5 text-[13.5px] leading-relaxed text-gray-800 dark:bg-sky-500/15 dark:text-gray-100">
            {message.body.split("\n").map((line, idx) => (
              <span key={idx} className="block">
                {line}
              </span>
            ))}
          </div>
          {(showAvatar || seenBy) && (
            <span className="flex items-center gap-1 pl-1 text-[11px] text-gray-400 dark:text-gray-500">
              {message.timeLabel}
              {seenBy && <SeenAvatar seenBy={seenBy} />}
            </span>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-end justify-end gap-2">
      <div className="flex max-w-[72%] flex-col items-end gap-1">
        {showSenderLabel && (
          <span className="pr-1 text-[11.5px] font-medium text-gray-600 dark:text-gray-300">
            {message.senderName}
          </span>
        )}
        <div className="rounded-2xl rounded-tr-md border border-gray-200 bg-white px-4 py-2.5 text-[13.5px] leading-relaxed text-gray-800 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
          {message.body.split("\n").map((line, idx) => (
            <span key={idx} className="block">
              {line}
            </span>
          ))}
          <span className="mt-1 flex items-center justify-end gap-1 text-[11px] text-gray-400 dark:text-gray-500">
            {message.timeLabel}
            {message.seenByCustomer && (
              <Icon name="check-double" className="size-3.5 text-brand-500" />
            )}
            {seenBy && <SeenAvatar seenBy={seenBy} />}
          </span>
        </div>
      </div>
      {showAvatar ? (
        <Avatar
          size="sm"
          initials={message.senderInitials}
          color={message.senderColor}
        />
      ) : (
        <span className="size-8 shrink-0" aria-hidden="true" />
      )}
    </div>
  );
}

export function SeenIndicator({ item }: { item: SeenItem }) {
  return (
    <div className="flex items-center justify-end gap-1 pr-10">
      <span
        className="group/seen relative inline-flex items-center gap-1"
        title={`Seen by ${item.actorName} · ${item.seenAtLabel}`}
      >
        <Avatar size="xs" initials={item.actorInitials} color={item.actorColor} />
        <span className="text-[10.5px] font-medium text-gray-500 dark:text-gray-400">{item.label}</span>
        <span
          role="tooltip"
          className="pointer-events-none absolute bottom-full right-0 z-20 mb-1.5 hidden whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10.5px] font-medium text-white shadow-lg group-hover/seen:block"
        >
          Seen by {item.actorName} · {item.seenAtLabel}
        </span>
      </span>
    </div>
  );
}

export function PrivateNoteBubble({
  message,
  showAvatar = true,
  showSenderLabel = true,
}: MessageBubbleProps) {
  return (
    <div className="flex items-end justify-end gap-2">
      <div className="flex max-w-[72%] flex-col items-end gap-1">
        {showSenderLabel && (
          <span className="pr-1 text-[11.5px] font-medium text-amber-700 dark:text-amber-300">
            {message.senderName} · Private note
          </span>
        )}
        <div className="rounded-2xl rounded-tr-md border border-amber-200 bg-amber-50 px-4 py-2.5 text-[13.5px] leading-relaxed text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
          {message.body.split("\n").map((line, idx) => (
            <span key={idx} className="block">
              {line}
            </span>
          ))}
          <span className="mt-1 flex items-center justify-end gap-1 text-[11px] text-amber-600 dark:text-amber-300/70">
            {message.timeLabel}
          </span>
        </div>
      </div>
      {showAvatar ? (
        <Avatar
          size="sm"
          initials={message.senderInitials}
          color={message.senderColor}
        />
      ) : (
        <span className="size-8 shrink-0" aria-hidden="true" />
      )}
    </div>
  );
}
