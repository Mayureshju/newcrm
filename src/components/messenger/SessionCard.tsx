import { useEffect, useState } from "react";
import type { SessionMetadata, ThreadItem } from "../../types/messenger";
import { Icon, IconButton, PlatformMeta, StatusPill } from "./primitives";
import { ThreadList } from "./ThreadItems";

function SessionSkeleton() {
  return (
    <div className="flex flex-col gap-3 px-5 py-5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`flex items-start gap-2 ${i % 2 === 1 ? "justify-end" : ""}`}
        >
          <div className="size-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="flex w-56 flex-col gap-1">
            <div className="h-3 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-8 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SessionCard({
  session,
  platformKey,
  items,
  loadItems,
}: {
  session: SessionMetadata;
  platformKey: keyof typeof PlatformMeta;
  items?: ThreadItem[];
  loadItems: (sessionIndex: number) => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const meta = PlatformMeta[platformKey];

  useEffect(() => {
    if (!open) return;
    if (items) return;
    let cancelled = false;
    setLoading(true);
    Promise.resolve(loadItems(session.index)).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [open, items, loadItems, session.index]);

  const descriptionParts: string[] = [];
  descriptionParts.push(`Summary: ${session.summary || "-"}`);
  if (session.resolutionTimeMinutes !== null) {
    descriptionParts.push(
      `Conversation resolved in ${session.resolutionTimeMinutes} minutes.`
    );
  }
  if (session.tags.length) {
    descriptionParts.push(`Tags: ${session.tags.join(", ")}`);
  }
  descriptionParts.push(`Assigned to: ${session.assignedTo}`);
  descriptionParts.push(`Last Assigned Agent: ${session.lastAssignedAgent}`);

  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-xs transition dark:border-gray-800 dark:bg-gray-900">
      <header className="flex items-start justify-between gap-3 px-5 py-4">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={`flex size-9 shrink-0 items-center justify-center rounded-full ${meta.bg} text-[13px] font-semibold text-white`}
            aria-hidden="true"
          >
            {meta.letter}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[14px] font-semibold text-gray-800 dark:text-white/90">
                {meta.label} - {session.closedBy ? session.closedBy : session.assignedTo}
              </span>
              <span className="inline-flex items-center rounded-md bg-gray-100 px-1.5 py-0.5 text-[10.5px] font-medium text-gray-600 dark:bg-white/[0.06] dark:text-gray-300">
                {meta.label}
              </span>
            </div>
            <p className="mt-0.5 text-[12px] text-gray-400 dark:text-gray-500">
              {session.createdLabel}
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-gray-500 dark:text-gray-400">
              {descriptionParts.join(" ; ")}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          {session.endStatus && (
            <StatusPill label={session.endStatus} tone="success" />
          )}
          {session.closedByEmail && (
            <p className="max-w-[220px] truncate text-[12px] text-gray-500 dark:text-gray-400">
              <span className="text-gray-400 dark:text-gray-500">Resolved by </span>
              <span className="font-medium text-gray-700 dark:text-gray-200">
                {session.closedByEmail}
              </span>
            </p>
          )}
          <div className="flex items-center gap-1">
            <IconButton ariaLabel="Session is locked" size="sm">
              <Icon name="lock" className="size-4" />
            </IconButton>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={`session-body-${session.index}`}
              className="inline-flex size-7 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/[0.06]"
            >
              <Icon
                name="chevron-down"
                className={`size-4 transition ${open ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          id={`session-body-${session.index}`}
          className="border-t border-gray-100 bg-gray-50/40 px-5 py-4 dark:border-gray-800 dark:bg-white/[0.02]"
        >
          {loading && !items ? (
            <SessionSkeleton />
          ) : items && items.length > 0 ? (
            <ThreadList items={items} />
          ) : (
            <p className="py-6 text-center text-[12.5px] text-gray-400 dark:text-gray-500">
              No messages in this session.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
