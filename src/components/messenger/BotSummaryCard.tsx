import type { BotSummary } from "../../types/messenger";
import { Avatar } from "./primitives";

export function BotSummaryCard({ summary }: { summary: BotSummary }) {
  return (
    <div className="flex items-start justify-end gap-2 pt-2">
      <div className="flex max-w-[70%] flex-col items-end gap-1">
        <span className="pr-1 text-[11.5px] font-medium text-gray-600 dark:text-gray-300">Bot</span>
        <div className="rounded-2xl rounded-tr-md bg-rose-100/80 px-4 py-3 text-[13px] leading-relaxed text-gray-800 dark:bg-rose-500/15 dark:text-gray-100">
          <p>Summary: {summary.summary || "-"}</p>
          <p>{summary.resolutionNote}</p>
          <p>Tags: {summary.tags.join(", ") || "—"}</p>
          <p>Assigned to: {summary.assignedTo}</p>
          <p>Last Assigned Agent: {summary.lastAssignedAgent}</p>
        </div>
        <span className="pr-1 text-[11px] text-gray-400 dark:text-gray-500">
          {summary.timeLabel}
        </span>
      </div>
      <Avatar size="sm" initials="B" color="bg-rose-400 text-white" />
    </div>
  );
}
