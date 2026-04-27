import { useState } from "react";
import type { Lead, LeadOwner } from "../../types/lead";
import { LEAD_OWNERS, TEAM_OPTIONS } from "../../data/leadMocks";
import { aiTagClass, slaTone } from "./leadHelpers";
import LeadTasksList from "./LeadTasksList";

interface Props {
  lead: Lead;
  onUpdate: <K extends keyof Lead>(key: K, value: Lead[K]) => void;
  onToggleTask: (taskId: string) => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function LeadSidebar({
  lead,
  onUpdate,
  onToggleTask,
  mobileOpen,
  onCloseMobile,
}: Props) {
  const [open, setOpen] = useState({
    contact: true,
    properties: true,
    utm: true,
    tasks: true,
    sla: true,
    ai: true,
    tags: false,
  });

  const fr = slaTone(lead.sla.firstContactStatus);
  const cl = slaTone(lead.sla.closureStatus);

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close details"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-gray-900/40 lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-[320px] max-w-[90vw] shrink-0 flex-col border-l border-gray-200 bg-white transition-transform duration-200 lg:static lg:z-0 lg:w-[340px] lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <h3 className="text-sm font-semibold text-gray-800">Lead details</h3>
          <button
            type="button"
            aria-label="Close"
            onClick={onCloseMobile}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 lg:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path
                d="M6 6l12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <Section
            title="Contact"
            open={open.contact}
            onToggle={() => setOpen((v) => ({ ...v, contact: !v.contact }))}
          >
            <div className="flex items-start gap-3">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${lead.contact.avatarColor}`}
              >
                {lead.contact.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-800">{lead.contact.name}</p>
                {lead.contact.company && (
                  <p className="text-xs text-gray-500">{lead.contact.company}</p>
                )}
                <p className="mt-1 truncate text-xs text-gray-400">{lead.contact.email}</p>
                {lead.contact.phone && (
                  <p className="text-xs text-gray-400">{lead.contact.phone}</p>
                )}
                {lead.contact.city && (
                  <p className="text-xs text-gray-400">{lead.contact.city}</p>
                )}
              </div>
            </div>
          </Section>

          <Section
            title="People & Team"
            open={open.properties}
            onToggle={() => setOpen((v) => ({ ...v, properties: !v.properties }))}
          >
            <div className="space-y-3">
              <Field label="Owner">
                <OwnerSelect
                  value={lead.owner}
                  onChange={(o) => o && onUpdate("owner", o)}
                />
              </Field>
              <Field label="Team">
                <SelectField
                  value={lead.team}
                  onChange={(v) => onUpdate("team", v)}
                  options={TEAM_OPTIONS}
                />
              </Field>
              {lead.estimatedValue ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50/60 px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Estimated value
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-gray-800">
                    ₹{lead.estimatedValue.toLocaleString("en-IN")}
                  </p>
                </div>
              ) : null}
            </div>
          </Section>

          <Section
            title="UTM Attribution"
            open={open.utm}
            onToggle={() => setOpen((v) => ({ ...v, utm: !v.utm }))}
          >
            <div className="space-y-2">
              <UtmRow label="Source" value={lead.utm.source} />
              <UtmRow label="Medium" value={lead.utm.medium} />
              <UtmRow label="Campaign" value={lead.utm.campaign} />
              <p className="pt-1 text-[10px] text-gray-400">
                Attribution captured via AppsFlyer at lead creation.
              </p>
            </div>
          </Section>

          <Section
            title="Tasks"
            open={open.tasks}
            onToggle={() => setOpen((v) => ({ ...v, tasks: !v.tasks }))}
          >
            <LeadTasksList tasks={lead.tasks} onToggle={onToggleTask} />
          </Section>

          <Section
            title="SLA"
            open={open.sla}
            onToggle={() => setOpen((v) => ({ ...v, sla: !v.sla }))}
          >
            <div className="space-y-3">
              <div className="rounded-lg border border-gray-200 bg-gray-50/60 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Policy
                </p>
                <p className="mt-1 text-sm font-medium text-gray-800">{lead.sla.policy}</p>
              </div>
              <SlaRow
                title="First contact"
                status={fr}
                dueLabel={lead.sla.firstContactDueLabel}
              />
              <SlaRow title="Closure" status={cl} dueLabel={lead.sla.closureDueLabel} />
            </div>
          </Section>

          {lead.aiScore && (
            <Section
              title="AI Score"
              open={open.ai}
              onToggle={() => setOpen((v) => ({ ...v, ai: !v.ai }))}
            >
              <AiScoreBlock score={lead.aiScore} />
            </Section>
          )}

          <Section
            title="Tags"
            open={open.tags}
            onToggle={() => setOpen((v) => ({ ...v, tags: !v.tags }))}
          >
            {lead.tags.length === 0 ? (
              <p className="text-xs text-gray-400">No tags yet.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {lead.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-600"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </Section>
        </div>
      </aside>
    </>
  );
}

function Section({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-gray-200 px-5 py-3">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {title}
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={`h-4 w-4 text-gray-400 transition ${open ? "rotate-180" : ""}`}
        >
          <path
            d="m6 9 6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && <div className="pt-3">{children}</div>}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium text-gray-500">{label}</span>
      {children}
    </label>
  );
}

function SelectField({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 pr-8 text-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
      >
        <path
          d="m6 9 6 6 6-6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function OwnerSelect({
  value,
  onChange,
}: {
  value: LeadOwner;
  onChange: (m: LeadOwner | null) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value.id}
        onChange={(e) => {
          const id = e.target.value;
          const m = LEAD_OWNERS.find((tm) => tm.id === id) ?? null;
          onChange(m);
        }}
        className="h-9 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 pr-8 text-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
      >
        {LEAD_OWNERS.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
            {m.role ? ` — ${m.role}` : ""}
          </option>
        ))}
      </select>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
      >
        <path
          d="m6 9 6 6 6-6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function SlaRow({
  title,
  status,
  dueLabel,
}: {
  title: string;
  status: { label: string; className: string; dot: string };
  dueLabel: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2">
      <div>
        <p className="text-xs font-medium text-gray-500">{title}</p>
        <p className="mt-0.5 text-xs text-gray-700">{dueLabel}</p>
      </div>
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${status.className}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
        {status.label}
      </span>
    </div>
  );
}

function UtmRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-1.5">
      <span className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
        {label}
      </span>
      <span className="truncate text-xs font-medium text-gray-800">{value}</span>
    </div>
  );
}

function AiScoreBlock({
  score,
}: {
  score: NonNullable<Lead["aiScore"]>;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${aiTagClass(
            score.tag
          )}`}
        >
          {score.tag}
        </span>
        <span className="rounded-full bg-violet-50 px-1.5 py-0.5 text-[10px] font-medium text-violet-700 ring-1 ring-violet-100">
          Phase 2
        </span>
      </div>
      <ScoreBar label="Interest" value={score.interest} />
      <ScoreBar label="Conversion" value={score.conversion} />
      <p className="rounded-md bg-gray-50 px-3 py-2 text-[11px] leading-relaxed text-gray-600">
        {score.summary}
      </p>
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const tone =
    value >= 70 ? "bg-emerald-500" : value >= 40 ? "bg-amber-500" : "bg-rose-500";
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px] text-gray-600">
        <span>{label}</span>
        <span className="font-medium text-gray-800">{value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div className={`h-full ${tone}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}
