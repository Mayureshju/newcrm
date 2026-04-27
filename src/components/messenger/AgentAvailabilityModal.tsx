import { useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "../ui/modal";
import {
  AGENT_RECORDS,
  MOCK_CONVERSATIONS,
  type AgentRecord,
  type AgentStatus,
} from "../../data/messengerMocks";
import type { Conversation } from "../../types/messenger";
import { Avatar, Icon, PlatformMiniBadge, StatusPill } from "./primitives";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectConversation?: (id: string) => void;
}

const STATUS_META: Record<
  AgentStatus,
  { label: string; chip: string; dot: string }
> = {
  available: {
    label: "Available",
    chip:
      "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30",
    dot: "bg-emerald-500",
  },
  busy: {
    label: "Busy",
    chip:
      "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30",
    dot: "bg-amber-500",
  },
  offline: {
    label: "Offline",
    chip:
      "bg-gray-100 text-gray-600 ring-gray-200 dark:bg-white/[0.06] dark:text-gray-400 dark:ring-gray-700",
    dot: "bg-gray-400",
  },
};

export function AgentAvailabilityModal({
  isOpen,
  onClose,
  onSelectConversation,
}: Props) {
  const [agents, setAgents] = useState<AgentRecord[]>(AGENT_RECORDS);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setEditingId(null);
      setExpandedId(null);
    }
  }, [isOpen]);

  // Build a name → conversation[] map once per render
  const conversationsByAgent = useMemo(() => {
    const map = new Map<string, Conversation[]>();
    for (const c of MOCK_CONVERSATIONS) {
      const list = map.get(c.assignee) ?? [];
      list.push(c);
      map.set(c.assignee, list);
    }
    return map;
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (
        editingId &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setEditingId(null);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [editingId]);

  function setStatus(id: string, status: AgentStatus) {
    setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    setEditingId(null);
  }

  const filtered = agents.filter((a) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q)
    );
  });

  const counts = {
    available: agents.filter((a) => a.status === "available").length,
    busy: agents.filter((a) => a.status === "busy").length,
    offline: agents.filter((a) => a.status === "offline").length,
  };
  const totalActive = agents.reduce((acc, a) => acc + a.assignedCount, 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="mx-4 max-w-lg overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/10"
      showCloseButton={false}
    >
      <div className="flex flex-col">
        {/* Header */}
        <header className="relative flex items-start gap-4 border-b border-gray-100 px-6 py-5 dark:border-gray-800">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-emerald-50 via-white to-white dark:from-emerald-500/10 dark:via-gray-900 dark:to-gray-900" />
          <div className="relative flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/25">
            <UsersIcon />
          </div>
          <div className="relative min-w-0 flex-1">
            <h2 className="text-[16px] font-semibold tracking-tight text-gray-900 dark:text-white">
              Agent availability
            </h2>
            <p className="mt-0.5 text-[12.5px] text-gray-500 dark:text-gray-400">
              Live status of assignable agents · {totalActive} active conversations
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
              <StatChip label="Available" count={counts.available} status="available" />
              <StatChip label="Busy" count={counts.busy} status="busy" />
              <StatChip label="Offline" count={counts.offline} status="offline" />
            </div>
          </div>
          <div className="relative flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setAgents([...AGENT_RECORDS])}
              aria-label="Refresh"
              title="Refresh"
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 text-[11.5px] font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.06]"
            >
              <Icon name="refresh" className="size-3.5" />
              Refresh
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="inline-flex size-8 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-500 dark:hover:bg-white/[0.06] dark:hover:text-gray-200"
            >
              <Icon name="close" className="size-4" />
            </button>
          </div>
        </header>

        {/* Search */}
        <div className="border-b border-gray-100 px-6 py-3 dark:border-gray-800">
          <label className="relative block">
            <Icon
              name="search"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search agents…"
              className="block h-9 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 text-[13px] text-gray-700 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500"
            />
          </label>
        </div>

        {/* List */}
        <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
          {filtered.length === 0 ? (
            <p className="px-6 py-8 text-center text-[12.5px] text-gray-500 dark:text-gray-400">
              No agents match your search.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((a) => {
                const meta = STATUS_META[a.status];
                const editing = editingId === a.id;
                const expanded = expandedId === a.id;
                const conversations = conversationsByAgent.get(a.name) ?? [];
                const realCount = conversations.length || a.assignedCount;
                const canExpand = conversations.length > 0;
                return (
                  <li key={a.id}>
                    <div className="flex items-center gap-3 px-6 py-3 transition hover:bg-gray-50/60 dark:hover:bg-white/[0.02]">
                      <button
                        type="button"
                        onClick={() => canExpand && setExpandedId(expanded ? null : a.id)}
                        aria-expanded={expanded}
                        aria-label={canExpand ? "Toggle assigned conversations" : undefined}
                        disabled={!canExpand}
                        className="flex min-w-0 flex-1 items-center gap-3 text-left disabled:cursor-default"
                      >
                        <div className="relative">
                          <Avatar size="md" initials={a.initials} color={a.avatarColor} />
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full ring-2 ring-white dark:ring-gray-900 ${meta.dot}`}
                            aria-hidden="true"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="truncate text-[13.5px] font-medium text-gray-800 dark:text-white/90">
                              {a.name}
                            </p>
                            {a.isMe && (
                              <span className="rounded-full bg-brand-50 px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
                                You
                              </span>
                            )}
                          </div>
                          <p className="truncate text-[11.5px] text-gray-500 dark:text-gray-400">
                            {a.email}
                          </p>
                        </div>
                      </button>
                      <span
                        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide ring-1 ${meta.chip}`}
                      >
                        <span className={`size-1.5 rounded-full ${meta.dot}`} />
                        {meta.label}
                      </span>
                      {canExpand ? (
                        <button
                          type="button"
                          onClick={() => setExpandedId(expanded ? null : a.id)}
                          className="hidden items-center gap-1 whitespace-nowrap rounded-md border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-medium text-gray-600 transition hover:bg-gray-50 sm:inline-flex dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.06]"
                          aria-label="View assigned conversations"
                        >
                          {realCount} {realCount === 1 ? "case" : "cases"}
                          <Icon
                            name="chevron-down"
                            className={`size-3 transition ${expanded ? "rotate-180" : ""}`}
                          />
                        </button>
                      ) : (
                        <span className="hidden whitespace-nowrap text-[11.5px] text-gray-400 sm:inline dark:text-gray-500">
                          0 cases
                        </span>
                      )}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setEditingId(editing ? null : a.id)}
                          aria-label="Change status"
                          title="Change status"
                          className="inline-flex size-7 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/[0.06]"
                        >
                          <Icon name="more-vertical" className="size-4" />
                        </button>
                        {editing && (
                          <div
                            ref={popoverRef}
                            className="absolute right-0 top-8 z-10 w-44 rounded-lg border border-gray-200 bg-white p-1 shadow-lg ring-1 ring-black/5 dark:border-gray-700 dark:bg-gray-900 dark:ring-white/10"
                          >
                            {(Object.keys(STATUS_META) as AgentStatus[]).map(
                              (s) => {
                                const optMeta = STATUS_META[s];
                                const active = a.status === s;
                                return (
                                  <button
                                    key={s}
                                    type="button"
                                    onClick={() => setStatus(a.id, s)}
                                    className={`flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-left text-[12.5px] transition ${
                                      active
                                        ? "bg-gray-100 font-medium text-gray-900 dark:bg-white/[0.08] dark:text-white"
                                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/[0.04]"
                                    }`}
                                  >
                                    <span className="flex items-center gap-2">
                                      <span
                                        className={`size-2 rounded-full ${optMeta.dot}`}
                                      />
                                      {optMeta.label}
                                    </span>
                                    {active && (
                                      <Icon
                                        name="check-circle"
                                        className="size-3.5 text-brand-500"
                                      />
                                    )}
                                  </button>
                                );
                              }
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    {expanded && conversations.length > 0 && (
                      <div className="border-t border-gray-100 bg-gray-50/60 px-6 py-2 dark:border-gray-800 dark:bg-white/[0.02]">
                        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                          Assigned conversations
                        </p>
                        <ul className="flex flex-col gap-1">
                          {conversations.map((c) => (
                            <li key={c.id}>
                              <button
                                type="button"
                                onClick={() => {
                                  if (onSelectConversation) {
                                    onSelectConversation(c.id);
                                    onClose();
                                  }
                                }}
                                className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition hover:bg-white dark:hover:bg-white/[0.04]"
                              >
                                <PlatformMiniBadge platform={c.platform} size="xs" />
                                <span
                                  className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${c.senderColor}`}
                                >
                                  {c.senderInitials}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <p className="truncate text-[12.5px] font-medium text-gray-800 dark:text-white/90">
                                      {c.senderName}
                                    </p>
                                    <StatusPill
                                      label={c.status}
                                      tone={
                                        c.status === "Resolved"
                                          ? "success"
                                          : c.status === "Pending"
                                            ? "warning"
                                            : c.status === "Closed"
                                              ? "neutral"
                                              : "warning"
                                      }
                                    />
                                  </div>
                                  <p className="truncate text-[11px] text-gray-500 dark:text-gray-400">
                                    {c.lastPreview}
                                  </p>
                                </div>
                                <span className="shrink-0 whitespace-nowrap text-[10.5px] text-gray-400 dark:text-gray-500">
                                  {c.updatedLabel}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  );
}

function StatChip({
  label,
  count,
  status,
}: {
  label: string;
  count: number;
  status: AgentStatus;
}) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 ring-1 ${meta.chip}`}
    >
      <span className={`size-1.5 rounded-full ${meta.dot}`} />
      {count} {label}
    </span>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5">
      <circle cx="9" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M3 20a6 6 0 0 1 12 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M16 20a5 5 0 0 1 5-5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
