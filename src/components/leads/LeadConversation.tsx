import type { Lead, LeadActivity, LeadActivityKind } from "../../types/lead";

const KIND_LABEL: Record<LeadActivityKind, string> = {
  call: "Call",
  email: "Email",
  whatsapp: "WhatsApp",
  note: "Internal note",
  system: "System",
};

const KIND_TONE: Record<LeadActivityKind, string> = {
  call: "bg-white",
  email: "bg-white",
  whatsapp: "bg-emerald-50/60 ring-1 ring-emerald-100",
  note: "bg-amber-50/70 ring-1 ring-amber-100",
  system: "bg-gray-50",
};

export default function LeadConversation({ lead }: { lead: Lead }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-white/[0.03]">
        <UtmRow label="Source" value={lead.utm.source} />
        <UtmRow label="Medium" value={lead.utm.medium} />
        <UtmRow label="Campaign" value={lead.utm.campaign} />
      </div>
      <div className="flex flex-col gap-3">
        {lead.activity.map((a) => (
          <ActivityCard key={a.id} activity={a} />
        ))}
      </div>
    </div>
  );
}

export function LeadComposer({
  lead,
  tab,
  onTabChange,
  draft,
  onDraftChange,
  onSubmit,
}: {
  lead: Lead;
  tab: "call" | "email" | "whatsapp" | "note";
  onTabChange: (t: "call" | "email" | "whatsapp" | "note") => void;
  draft: string;
  onDraftChange: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="mb-3 inline-flex rounded-lg bg-gray-100 p-1 text-xs">
        <TabButton active={tab === "call"} onClick={() => onTabChange("call")}>
          Log call
        </TabButton>
        <TabButton active={tab === "email"} onClick={() => onTabChange("email")}>
          Email
        </TabButton>
        <TabButton active={tab === "whatsapp"} onClick={() => onTabChange("whatsapp")}>
          WhatsApp
        </TabButton>
        <TabButton active={tab === "note"} onClick={() => onTabChange("note")}>
          Internal note
        </TabButton>
      </div>
      {tab === "email" && (
        <div className="mb-2 flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-500">
          <span className="font-medium text-gray-700">To:</span>
          <span className="truncate">{lead.contact.email}</span>
        </div>
      )}
      {tab === "whatsapp" && lead.contact.phone && (
        <div className="mb-2 flex items-center gap-2 rounded-md border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-700">
          <span className="font-medium">WhatsApp:</span>
          <span className="truncate">{lead.contact.phone}</span>
        </div>
      )}
      <textarea
        value={draft}
        onChange={(e) => onDraftChange(e.target.value)}
        rows={3}
        placeholder={
          tab === "note"
            ? "Add a private note for the team…"
            : tab === "call"
              ? "Summarise this call…"
              : tab === "email"
                ? "Compose email…"
                : "Type your WhatsApp message…"
        }
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            onSubmit();
          }
        }}
        className={`block w-full resize-none rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 ${
          tab === "note"
            ? "border-amber-200 bg-amber-50/40 text-amber-900"
            : "border-gray-200 bg-white text-gray-800"
        }`}
      />
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[11px] text-gray-400">⌘ + Enter to log</span>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!draft.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {tab === "note"
            ? "Add note"
            : tab === "call"
              ? "Save call log"
              : tab === "email"
                ? "Send email"
                : "Send WhatsApp"}
        </button>
      </div>
    </div>
  );
}

function TabButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
        active ? "bg-white text-gray-800 shadow-theme-xs" : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {children}
    </button>
  );
}

function ActivityCard({ activity }: { activity: LeadActivity }) {
  if (activity.kind === "system") {
    return (
      <div className="flex items-center justify-center py-1">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-[11px] text-gray-500">
          {activity.body} · {activity.timeLabel}
        </span>
      </div>
    );
  }
  return (
    <div className={`rounded-2xl border border-gray-200 p-4 ${KIND_TONE[activity.kind]}`}>
      <div className="flex items-start gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${activity.authorColor}`}
        >
          {activity.authorInitials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-gray-800">{activity.authorName}</p>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-500">
              {KIND_LABEL[activity.kind]}
            </span>
            {activity.durationLabel && (
              <span className="text-[11px] text-gray-400">· {activity.durationLabel}</span>
            )}
            <span className="text-xs text-gray-400">{activity.timeLabel}</span>
          </div>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-700">
            {activity.body}
          </p>
        </div>
      </div>
    </div>
  );
}

function UtmRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/60 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-0.5 truncate text-xs font-medium text-gray-800">{value}</p>
    </div>
  );
}
