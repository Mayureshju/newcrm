import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import TicketConversation, {
  TicketComposer,
} from "../../components/tickets/TicketConversation";
import TicketSidebar from "../../components/tickets/TicketSidebar";
import { MOCK_TICKETS } from "../../data/ticketMocks";
import {
  priorityBadgeClass,
  slaTone,
  statusBadgeClass,
  statusDotClass,
  typeBadgeClass,
} from "../../components/tickets/ticketHelpers";
import type { Ticket, TicketComment } from "../../types/ticket";

export default function TicketDetail() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();

  const initial = useMemo(
    () => MOCK_TICKETS.find((t) => t.id === ticketId) ?? null,
    [ticketId]
  );

  const [ticket, setTicket] = useState<Ticket | null>(initial);
  const [composerTab, setComposerTab] = useState<"reply" | "note" | "email">("reply");
  const [draft, setDraft] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [ticket?.comments.length]);

  if (!ticket) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h2 className="text-lg font-semibold text-gray-700">Ticket not found</h2>
        <p className="mt-1 text-sm text-gray-500">The ticket you're looking for doesn't exist.</p>
        <Link
          to="/tickets"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
        >
          Back to tickets
        </Link>
      </div>
    );
  }

  function update<K extends keyof Ticket>(key: K, value: Ticket[K]) {
    setTicket((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  function addComment() {
    const body = draft.trim();
    if (!body || !ticket) return;
    const now = new Date();
    const newComment: TicketComment = {
      id: `cmt-${now.getTime()}`,
      kind: composerTab,
      authorId: ticket.owner.id,
      authorName: ticket.owner.name,
      authorInitials: ticket.owner.initials,
      authorColor: ticket.owner.avatarColor,
      body,
      createdAt: now.toISOString(),
      timeLabel: "just now",
      recipients: composerTab === "email" ? [ticket.contact.email] : undefined,
    };
    setTicket((prev) =>
      prev
        ? {
            ...prev,
            comments: [...prev.comments, newComment],
            updatedLabel: "just now",
          }
        : prev
    );
    setDraft("");
  }

  const sla = slaTone(ticket.sla.resolutionStatus);

  return (
    <>
      <PageMeta
        title={`${ticket.number} — ${ticket.subject}`}
        description={`Ticket ${ticket.number} from ${ticket.contact.name}`}
      />
      <div className="flex h-screen min-h-[560px] w-full overflow-hidden bg-gray-50/40">
        <section className="flex min-w-0 flex-1 flex-col">
          <header className="shrink-0 border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-2 inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                <path
                  d="m15 6-6 6 6 6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              All tickets
            </button>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-gray-400">{ticket.number}</span>
                  <span className="h-3 w-px bg-gray-200" />
                  <span className="text-xs text-gray-500">Created {ticket.createdLabel}</span>
                  <span className="hidden text-xs text-gray-400 sm:inline">·</span>
                  <span className="hidden text-xs text-gray-500 sm:inline">
                    Updated {ticket.updatedLabel}
                  </span>
                </div>
                <h1 className="mt-1 line-clamp-2 text-lg font-bold text-gray-800 sm:text-xl">
                  {ticket.subject}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(
                      ticket.status
                    )}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${statusDotClass(ticket.status)}`} />
                    {ticket.status}
                  </span>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityBadgeClass(
                      ticket.priority
                    )}`}
                  >
                    {ticket.priority}
                  </span>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${typeBadgeClass(
                      ticket.type
                    )}`}
                  >
                    {ticket.type}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${sla.className}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${sla.dot}`} />
                    SLA {sla.label}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => update("status", "Resolved")}
                  className="inline-flex h-9 items-center rounded-lg bg-emerald-500 px-3 text-sm font-medium text-white transition hover:bg-emerald-600"
                >
                  Resolve
                </button>
                <button
                  type="button"
                  onClick={() => update("status", "Closed")}
                  className="hidden h-9 items-center rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:inline-flex"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open details"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 lg:hidden"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                    <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6">
              <TicketConversation ticket={ticket} />
              <div ref={bottomRef} />
            </div>
          </div>

          <div className="shrink-0">
            <TicketComposer
              ticket={ticket}
              tab={composerTab}
              onTabChange={setComposerTab}
              draft={draft}
              onDraftChange={setDraft}
              onSubmit={addComment}
            />
          </div>
        </section>

        <TicketSidebar
          ticket={ticket}
          onUpdate={update}
          mobileOpen={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
        />
      </div>
    </>
  );
}
