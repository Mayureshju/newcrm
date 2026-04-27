import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PageMeta from "../components/common/PageMeta";
import { Composer } from "../components/messenger/Composer";
import { ConversationHeaderCard } from "../components/messenger/ConversationHeaderCard";
import { ConversationList } from "../components/messenger/ConversationList";
import { LiveThread } from "../components/messenger/LiveThread";
import { LoadMoreHistoryButton } from "../components/messenger/LoadMoreHistoryButton";
import { SessionCard } from "../components/messenger/SessionCard";
import { SummaryPanel } from "../components/messenger/SummaryPanel";
import {
  MOCK_CONVERSATIONS,
  MOCK_PROPERTIES,
  MOCK_SESSIONS,
  MOCK_SESSION_ITEMS,
} from "../data/messengerMocks";
import type {
  ComposerTab,
  Conversation,
  ConversationProperties,
  ConvStatus,
  FilterTabKey,
  Message,
  PlatformFilter,
  SessionMetadata,
  ThreadItem,
} from "../types/messenger";

const HISTORY_PAGE_SIZE = 2;

function formatTime(date: Date) {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export default function Messenger() {
  const [conversations, setConversations] =
    useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [sessionsByConversation] =
    useState<Record<string, SessionMetadata[]>>(MOCK_SESSIONS);
  const [sessionItems, setSessionItems] =
    useState<Record<number, ThreadItem[]>>(() => {
      const bag: Record<number, ThreadItem[]> = {};
      for (const [key, value] of Object.entries(MOCK_SESSION_ITEMS)) {
        bag[Number(key)] = value;
      }
      return bag;
    });
  const [properties, setProperties] =
    useState<Record<string, ConversationProperties>>(MOCK_PROPERTIES);

  const [activeId, setActiveId] = useState<string>(conversations[0].id);
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("all");
  const [activeTab, setActiveTab] = useState<FilterTabKey>("my_open");

  const [composerTab, setComposerTab] = useState<ComposerTab>("reply");
  const [draft, setDraft] = useState("");
  const [showSummary, setShowSummary] = useState(true);

  const [visibleHistoryCount, setVisibleHistoryCount] = useState<number>(
    HISTORY_PAGE_SIZE
  );

  const liveAnchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleHistoryCount(HISTORY_PAGE_SIZE);
  }, [activeId]);

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? conversations[0],
    [conversations, activeId]
  );

  const activeProps = properties[active.id] ?? {
    summary: "",
    tags: [],
    status: "Open" as ConvStatus,
    agent: "Unassigned",
  };

  const filteredConversations = useMemo(() => {
    const q = search.trim().toLowerCase();
    return conversations.filter((c) => {
      if (platformFilter !== "all" && c.platform !== platformFilter)
        return false;
      if (activeTab === "unresolved" && c.status === "Resolved") return false;
      if (activeTab === "resolved" && c.status !== "Resolved") return false;
      if (activeTab === "unassigned" && c.assignee && c.assignee !== "Unassigned")
        return false;
      if (q) {
        return (
          c.senderName.toLowerCase().includes(q) ||
          c.lastPreview.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [conversations, platformFilter, activeTab, search]);

  const allSessions = sessionsByConversation[active.id] ?? [];
  const resolvedSessions = useMemo(
    () => allSessions.filter((s) => s.endTime !== null),
    [allSessions]
  );
  const liveSession = useMemo(
    () => allSessions.find((s) => s.endTime === null) ?? null,
    [allSessions]
  );
  const liveItems = liveSession ? sessionItems[liveSession.index] ?? [] : [];

  const visibleResolved = useMemo(
    () => resolvedSessions.slice(-visibleHistoryCount),
    [resolvedSessions, visibleHistoryCount]
  );
  const hasMoreHistory = visibleResolved.length < resolvedSessions.length;

  useEffect(() => {
    const el = liveAnchorRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeId, liveItems.length]);

  const loadSessionItems = useCallback((sessionIndex: number) => {
    // UI-only: items are already in state; this is a placeholder for API-backed lazy load.
    setSessionItems((prev) =>
      prev[sessionIndex] ? prev : { ...prev, [sessionIndex]: [] }
    );
  }, []);

  const selectConversation = useCallback((id: string) => {
    setActiveId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  }, []);

  const sendMessage = useCallback(() => {
    const body = draft.trim();
    if (!body || !liveSession) return;
    const now = new Date();
    const agent = activeProps.agent || "You";
    const newMessage: Message = {
      id: `m-${liveSession.index}-${now.getTime()}`,
      conversationId: active.id,
      sessionIndex: liveSession.index,
      direction: "Outgoing",
      senderName: composerTab === "note" ? `${agent} · Private note` : agent,
      senderInitials: agent.charAt(0).toUpperCase(),
      senderColor: "bg-violet-500 text-white",
      body,
      timestamp: now.toISOString(),
      timeLabel: formatTime(now),
      contentType: "text",
      isPrivate: composerTab === "note",
      isRead: false,
      seenByCustomer: false,
    };
    setSessionItems((prev) => ({
      ...prev,
      [liveSession.index]: [...(prev[liveSession.index] ?? []), newMessage],
    }));
    setConversations((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? { ...c, lastPreview: body, updatedLabel: "just now" }
          : c
      )
    );
    setDraft("");
  }, [draft, liveSession, active.id, composerTab, activeProps.agent]);

  const updateProperty = useCallback(
    <K extends keyof ConversationProperties>(
      key: K,
      value: ConversationProperties[K]
    ) => {
      setProperties((prev) => ({
        ...prev,
        [active.id]: {
          ...(prev[active.id] ?? {
            summary: "",
            tags: [],
            status: "Open" as ConvStatus,
            agent: "Unassigned",
          }),
          [key]: value,
        },
      }));
    },
    [active.id]
  );

  const toggleTag = useCallback(
    (tag: string) => {
      const next = activeProps.tags.includes(tag)
        ? activeProps.tags.filter((t) => t !== tag)
        : [...activeProps.tags, tag];
      updateProperty("tags", next);
    },
    [activeProps.tags, updateProperty]
  );

  const applyProperties = useCallback(() => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? {
              ...c,
              status: activeProps.status,
              assignee: activeProps.agent,
              assigneeInitials: activeProps.agent.charAt(0).toUpperCase(),
              tags: activeProps.tags,
            }
          : c
      )
    );
  }, [active.id, activeProps]);

  const loadMoreHistory = useCallback(() => {
    setVisibleHistoryCount((n) =>
      Math.min(n + HISTORY_PAGE_SIZE, resolvedSessions.length)
    );
  }, [resolvedSessions.length]);

  return (
    <>
      <PageMeta
        title="Messenger | Dieture CRM"
        description="Unified inbox for WhatsApp, Messenger, Instagram and Email — now with session history."
      />
      <div className="flex h-[calc(100vh-4rem)] min-h-[560px] w-full overflow-hidden border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 lg:h-screen lg:border-t-0">
        <ConversationList
          conversations={filteredConversations}
          activeId={active.id}
          onSelect={selectConversation}
          platformFilter={platformFilter}
          onPlatformChange={setPlatformFilter}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          search={search}
          onSearchChange={setSearch}
        />

        <section className="flex min-w-0 flex-1 flex-col bg-gray-50/40 dark:bg-gray-950">
          <div className="border-b border-gray-200 bg-white px-5 py-2.5 dark:border-gray-800 dark:bg-gray-900">
            <ConversationHeaderCard conversation={active} />
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="flex flex-col gap-3 px-5 py-5 md:px-6">
              {hasMoreHistory ? (
                <LoadMoreHistoryButton
                  onClick={loadMoreHistory}
                  disabled={!hasMoreHistory}
                />
              ) : resolvedSessions.length > 0 ? (
                <LoadMoreHistoryButton onClick={() => {}} disabled />
              ) : null}

              {visibleResolved.map((session) => (
                <SessionCard
                  key={session.index}
                  session={session}
                  platformKey={active.platform}
                  items={sessionItems[session.index]}
                  loadItems={loadSessionItems}
                />
              ))}

              {liveSession && (
                <div className="rounded-xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
                  <LiveThread ref={liveAnchorRef} items={liveItems} />
                </div>
              )}
            </div>
          </div>

          <Composer
            tab={composerTab}
            onTabChange={setComposerTab}
            draft={draft}
            onDraftChange={setDraft}
            onSubmit={sendMessage}
          />
        </section>

        {showSummary && (
          <SummaryPanel
            conversation={active}
            properties={activeProps}
            onUpdateProperty={updateProperty}
            onToggleTag={toggleTag}
            onUpdate={applyProperties}
            onClose={() => setShowSummary(false)}
          />
        )}
      </div>
    </>
  );
}
