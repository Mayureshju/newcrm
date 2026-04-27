import type {
  Message,
  SeenIndicator as SeenItem,
  ThreadItem,
} from "../../types/messenger";
import { BotSummaryCard } from "./BotSummaryCard";
import { DayDivider } from "./DayDivider";
import { MessageBubble, PrivateNoteBubble, SeenIndicator } from "./MessageBubble";
import { SLABreachMarker } from "./SLABreachMarker";
import { SystemEvent } from "./SystemEvent";

function isMsg(item: ThreadItem): item is Message {
  return "direction" in item;
}

function sameSender(a: Message, b: Message) {
  return (
    a.direction === b.direction &&
    a.senderName === b.senderName &&
    a.isPrivate === b.isPrivate
  );
}

export function ThreadList({ items }: { items: ThreadItem[] }) {
  // Pre-compute, for each visible item:
  //  - showAvatar: only on the LAST message in a consecutive same-sender run
  //  - showSenderLabel: only on the FIRST outgoing message in a consecutive same-sender run
  //  - seenBy: a "seen" indicator that immediately follows an outgoing message
  //    is folded into that bubble's footer instead of rendering as its own row
  const skipIndexes = new Set<number>();
  const showAvatarMap = new Map<string, boolean>();
  const showSenderLabelMap = new Map<string, boolean>();
  const seenByMap = new Map<string, SeenItem>();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!isMsg(item)) continue;

    const next = items[i + 1];
    const prev = items[i - 1];

    const nextIsSame = next && isMsg(next) && sameSender(item, next);
    const prevIsSame = prev && isMsg(prev) && sameSender(item, prev);

    showAvatarMap.set(item.id, !nextIsSame);
    showSenderLabelMap.set(item.id, !prevIsSame);

    // Fold a following "seen" indicator into this message's footer
    if (next && !isMsg(next) && next.kind === "seen") {
      seenByMap.set(item.id, next);
      skipIndexes.add(i + 1);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      {items.map((item, idx) => {
        if (skipIndexes.has(idx)) return null;
        if (isMsg(item)) {
          const showAvatar = showAvatarMap.get(item.id) ?? true;
          const showSenderLabel = showSenderLabelMap.get(item.id) ?? true;
          const seenBy = seenByMap.get(item.id) ?? null;
          if (item.isPrivate) {
            return (
              <PrivateNoteBubble
                key={item.id}
                message={item}
                showAvatar={showAvatar}
                showSenderLabel={showSenderLabel}
              />
            );
          }
          return (
            <MessageBubble
              key={item.id}
              message={item}
              showAvatar={showAvatar}
              showSenderLabel={showSenderLabel}
              seenBy={seenBy}
            />
          );
        }
        switch (item.kind) {
          case "day_divider":
            return <DayDivider key={item.id} label={item.label} />;
          case "sla_breach":
            return <SLABreachMarker key={item.id} event={item} />;
          case "system":
            return <SystemEvent key={item.id} event={item} />;
          case "bot_summary":
            return <BotSummaryCard key={item.id} summary={item} />;
          case "seen":
            // Orphan seen indicator (not adjacent to an outgoing message): render compact
            return <SeenIndicator key={item.id} item={item} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
