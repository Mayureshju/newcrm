import type { StatusEvent } from "../../types/messenger";
import { Icon } from "./primitives";

export function SystemEvent({ event }: { event: StatusEvent }) {
  if (event.event === "sla_applied") {
    return (
      <div className="flex items-center justify-center py-1.5 text-[12px] text-brand-500 dark:text-brand-400">
        <span className="inline-flex items-center gap-1.5">
          <span className="font-semibold">&quot;{event.detail}&quot;</span>
          <span className="text-gray-500 dark:text-gray-400">SLA policy applied</span>
        </span>
      </div>
    );
  }
  if (event.event === "opened") {
    return (
      <div className="flex items-center justify-center py-1.5 text-[12px] text-gray-500 dark:text-gray-400">
        <span className="inline-flex items-center gap-1.5">
          <Icon name="eye" className="size-3.5 text-gray-400 dark:text-gray-500" />
          Open by <span className="font-medium text-gray-700 dark:text-gray-200">{event.actorName}</span>
        </span>
      </div>
    );
  }
  if (event.event === "assigned") {
    return (
      <div className="flex items-center justify-center py-1.5 text-[12px] text-gray-500 dark:text-gray-400">
        <span className="inline-flex items-center gap-1.5">
          <Icon name="user-check" className="size-3.5 text-gray-400 dark:text-gray-500" />
          Assigned to{" "}
          <span className="font-medium text-gray-700 dark:text-gray-200">{event.actorName}</span>
          {event.byName && (
            <>
              <span className="text-gray-400 dark:text-gray-500">by</span>
              <span className="font-medium text-gray-700 dark:text-gray-200">{event.byName}</span>
            </>
          )}
        </span>
      </div>
    );
  }
  if (event.event === "resolved" || event.event === "closed") {
    return (
      <div className="my-2 flex items-center gap-3 text-[12px] text-gray-500 dark:text-gray-400">
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
        <span className="inline-flex items-center gap-1.5">
          <Icon name="check-circle" className="size-3.5 text-emerald-500" />
          {event.event === "resolved" ? "Resolved by " : "Closed by "}
          <span className="font-medium text-gray-700 dark:text-gray-200">{event.actorName}</span>
        </span>
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }
  return null;
}
