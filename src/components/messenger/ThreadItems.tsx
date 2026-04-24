import type { ThreadItem } from "../../types/messenger";
import { BotSummaryCard } from "./BotSummaryCard";
import { DayDivider } from "./DayDivider";
import { MessageBubble, PrivateNoteBubble, SeenIndicator } from "./MessageBubble";
import { SLABreachMarker } from "./SLABreachMarker";
import { SystemEvent } from "./SystemEvent";

export function ThreadItemView({ item }: { item: ThreadItem }) {
  if ("direction" in item) {
    if (item.isPrivate) return <PrivateNoteBubble message={item} />;
    return <MessageBubble message={item} />;
  }
  switch (item.kind) {
    case "day_divider":
      return <DayDivider label={item.label} />;
    case "sla_breach":
      return <SLABreachMarker event={item} />;
    case "system":
      return <SystemEvent event={item} />;
    case "bot_summary":
      return <BotSummaryCard summary={item} />;
    case "seen":
      return <SeenIndicator item={item} />;
    default:
      return null;
  }
}

export function ThreadList({ items }: { items: ThreadItem[] }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <ThreadItemView key={item.id} item={item} />
      ))}
    </div>
  );
}
