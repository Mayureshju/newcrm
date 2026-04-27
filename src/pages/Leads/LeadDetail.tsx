import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import LeadConversation, {
  LeadComposer,
} from "../../components/leads/LeadConversation";
import LeadSidebar from "../../components/leads/LeadSidebar";
import LeadDispositionForm from "../../components/leads/LeadDispositionForm";
import { MOCK_LEADS } from "../../data/leadMocks";
import {
  dispositionBadgeClass,
  slaTone,
  sourceBadgeClass,
  stageBadgeClass,
  stageDotClass,
} from "../../components/leads/leadHelpers";
import type {
  Lead,
  LeadActivity,
  LeadActivityKind,
  LeadDisposition,
} from "../../types/lead";

type ComposerTab = "call" | "email" | "whatsapp" | "note";

const COMPOSER_TO_KIND: Record<ComposerTab, LeadActivityKind> = {
  call: "call",
  email: "email",
  whatsapp: "whatsapp",
  note: "note",
};

export default function LeadDetail() {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();

  const initial = useMemo(
    () => MOCK_LEADS.find((l) => l.id === leadId) ?? null,
    [leadId]
  );

  const [lead, setLead] = useState<Lead | null>(initial);
  const [composerTab, setComposerTab] = useState<ComposerTab>("call");
  const [draft, setDraft] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [lead?.activity.length]);

  if (!lead) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h2 className="text-lg font-semibold text-gray-700">Lead not found</h2>
        <p className="mt-1 text-sm text-gray-500">The lead you're looking for doesn't exist.</p>
        <Link
          to="/leads"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
        >
          Back to leads
        </Link>
      </div>
    );
  }

  function update<K extends keyof Lead>(key: K, value: Lead[K]) {
    setLead((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  function addActivity() {
    const body = draft.trim();
    if (!body || !lead) return;
    const now = new Date();
    const newEntry: LeadActivity = {
      id: `la-${now.getTime()}`,
      kind: COMPOSER_TO_KIND[composerTab],
      authorId: lead.owner.id,
      authorName: lead.owner.name,
      authorInitials: lead.owner.initials,
      authorColor: lead.owner.avatarColor,
      body,
      createdAt: now.toISOString(),
      timeLabel: "just now",
    };
    setLead((prev) => {
      if (!prev) return prev;
      const isContact =
        composerTab === "call" || composerTab === "email" || composerTab === "whatsapp";
      const next: Lead = {
        ...prev,
        activity: [...prev.activity, newEntry],
        lastActivityAt: now.toISOString(),
        lastActivityLabel: "just now",
      };
      // Auto-advance stage to "Contacted" on first contact activity
      if (isContact && (prev.stage === "New" || prev.stage === "Assigned")) {
        next.stage = "Contacted";
        next.activity = [
          ...next.activity,
          {
            id: `la-sys-${now.getTime()}`,
            kind: "system",
            authorId: "system",
            authorName: "System",
            authorInitials: "SY",
            authorColor: "bg-gray-400 text-white",
            body: "Stage auto-updated to Contacted.",
            createdAt: now.toISOString(),
            timeLabel: "just now",
          },
        ];
      }
      return next;
    });
    setDraft("");
  }

  function applyDisposition(disposition: LeadDisposition, notes: string) {
    if (!lead) return;
    const now = new Date();
    setLead((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        stage: "Closed",
        disposition,
        dispositionAt: now.toISOString(),
        dispositionNotes: notes || null,
        lastActivityAt: now.toISOString(),
        lastActivityLabel: "just now",
        tasks: prev.tasks.map((t) =>
          t.status === "pending" || t.status === "overdue" ? { ...t, status: "done" } : t
        ),
        activity: [
          ...prev.activity,
          {
            id: `la-sys-${now.getTime()}`,
            kind: "system",
            authorId: "system",
            authorName: "System",
            authorInitials: "SY",
            authorColor: "bg-gray-400 text-white",
            body: `Disposition set to ${disposition}. Stage auto-updated to Closed.`,
            createdAt: now.toISOString(),
            timeLabel: "just now",
          },
        ],
      };
    });
  }

  function toggleTask(taskId: string) {
    setLead((prev) =>
      prev
        ? {
            ...prev,
            tasks: prev.tasks.map((t) =>
              t.id === taskId
                ? { ...t, status: t.status === "done" ? "pending" : "done" }
                : t
            ),
          }
        : prev
    );
  }

  const sla = slaTone(lead.sla.closureStatus);

  return (
    <>
      <PageMeta
        title={`${lead.number} — ${lead.contact.name}`}
        description={`Lead ${lead.number} from ${lead.contact.name}`}
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
              All leads
            </button>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-gray-400">{lead.number}</span>
                  <span className="h-3 w-px bg-gray-200" />
                  <span className="text-xs text-gray-500">Created {lead.createdLabel}</span>
                  <span className="hidden text-xs text-gray-400 sm:inline">·</span>
                  <span className="hidden text-xs text-gray-500 sm:inline">
                    Last activity {lead.lastActivityLabel}
                  </span>
                </div>
                <h1 className="mt-1 line-clamp-2 text-lg font-bold text-gray-800 sm:text-xl">
                  {lead.contact.name}
                  {lead.contact.company ? (
                    <span className="text-gray-400"> · {lead.contact.company}</span>
                  ) : null}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${stageBadgeClass(
                      lead.stage
                    )}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${stageDotClass(lead.stage)}`}
                    />
                    {lead.stage}
                  </span>
                  {lead.disposition && (
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${dispositionBadgeClass(
                        lead.disposition
                      )}`}
                    >
                      {lead.disposition}
                    </span>
                  )}
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${sourceBadgeClass(
                      lead.utm.source
                    )}`}
                  >
                    {lead.utm.source} · {lead.utm.campaign}
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
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open details"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 lg:hidden"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                    <path
                      d="M3 6h18M3 12h18M3 18h18"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-5 sm:px-6">
              <LeadConversation lead={lead} />
              <LeadDispositionForm lead={lead} onSubmit={applyDisposition} />
              <div ref={bottomRef} />
            </div>
          </div>

          <div className="shrink-0">
            <LeadComposer
              lead={lead}
              tab={composerTab}
              onTabChange={setComposerTab}
              draft={draft}
              onDraftChange={setDraft}
              onSubmit={addActivity}
            />
          </div>
        </section>

        <LeadSidebar
          lead={lead}
          onUpdate={update}
          onToggleTask={toggleTask}
          mobileOpen={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
        />
      </div>
    </>
  );
}
