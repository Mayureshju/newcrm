import type { Message, SeenIndicator as SeenItem } from "../../types/messenger";
import { Avatar, Icon } from "./primitives";

export function MessageBubble({ message }: { message: Message }) {
  if (message.direction === "Incoming") {
    return (
      <div className="flex items-start gap-2">
        <Avatar
          size="sm"
          initials={message.senderInitials}
          color={message.senderColor}
        />
        <div className="flex max-w-[72%] flex-col gap-1">
          <div className="rounded-2xl rounded-tl-md bg-sky-50 px-4 py-2.5 text-[13.5px] leading-relaxed text-gray-800">
            {message.body.split("\n").map((line, idx) => (
              <span key={idx} className="block">
                {line}
              </span>
            ))}
          </div>
          <span className="pl-1 text-[11px] text-gray-400">
            {message.timeLabel}
          </span>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start justify-end gap-2">
      <div className="flex max-w-[72%] flex-col items-end gap-1">
        <span className="pr-1 text-[11.5px] font-medium text-gray-600">
          {message.senderName}
        </span>
        <div className="rounded-2xl rounded-tr-md border border-gray-200 bg-white px-4 py-2.5 text-[13.5px] leading-relaxed text-gray-800 shadow-theme-xs">
          {message.body.split("\n").map((line, idx) => (
            <span key={idx} className="block">
              {line}
            </span>
          ))}
          <span className="mt-1 flex items-center justify-end gap-1 text-[11px] text-gray-400">
            {message.timeLabel}
            {message.seenByCustomer && (
              <Icon name="check-double" className="size-3.5 text-brand-500" />
            )}
          </span>
        </div>
      </div>
      <Avatar
        size="sm"
        initials={message.senderInitials}
        color={message.senderColor}
      />
    </div>
  );
}

export function SeenIndicator({ item }: { item: SeenItem }) {
  return (
    <div className="flex items-center justify-end gap-2 pr-10 pt-0.5">
      <Avatar
        size="xs"
        initials={item.actorInitials}
        color={`${item.actorColor} ring-2 ring-violet-200`}
      />
      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10.5px] font-medium text-gray-600">
        {item.label}
      </span>
    </div>
  );
}

export function PrivateNoteBubble({ message }: { message: Message }) {
  return (
    <div className="flex items-start justify-end gap-2">
      <div className="flex max-w-[72%] flex-col items-end gap-1">
        <span className="pr-1 text-[11.5px] font-medium text-amber-700">
          {message.senderName} · Private note
        </span>
        <div className="rounded-2xl rounded-tr-md border border-amber-200 bg-amber-50 px-4 py-2.5 text-[13.5px] leading-relaxed text-amber-900">
          {message.body.split("\n").map((line, idx) => (
            <span key={idx} className="block">
              {line}
            </span>
          ))}
          <span className="mt-1 flex items-center justify-end gap-1 text-[11px] text-amber-600">
            {message.timeLabel}
          </span>
        </div>
      </div>
      <Avatar
        size="sm"
        initials={message.senderInitials}
        color={message.senderColor}
      />
    </div>
  );
}
