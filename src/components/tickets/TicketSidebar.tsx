import { useState } from "react";
import type {
  Ticket,
  TicketPriority,
  TicketStatus,
  TicketTeamMember,
  TicketType,
} from "../../types/ticket";
import {
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  TEAM_MEMBERS,
  TEAM_OPTIONS,
  TYPE_OPTIONS,
} from "../../data/ticketMocks";
import { slaTone } from "./ticketHelpers";

interface Props {
  ticket: Ticket;
  onUpdate: <K extends keyof Ticket>(key: K, value: Ticket[K]) => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function TicketSidebar({ ticket, onUpdate, mobileOpen, onCloseMobile }: Props) {
  const [open, setOpen] = useState({
    contact: true,
    properties: true,
    sla: true,
    people: true,
    tags: false,
  });

  const fr = slaTone(ticket.sla.firstResponseStatus);
  const res = slaTone(ticket.sla.resolutionStatus);

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
          <h3 className="text-sm font-semibold text-gray-800">Ticket details</h3>
          <button
            type="button"
            aria-label="Close"
            onClick={onCloseMobile}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 lg:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
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
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${ticket.contact.avatarColor}`}
            >
              {ticket.contact.initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-800">{ticket.contact.name}</p>
              {ticket.contact.company && (
                <p className="text-xs text-gray-500">{ticket.contact.company}</p>
              )}
              <p className="mt-1 truncate text-xs text-gray-400">{ticket.contact.email}</p>
              {ticket.contact.phone && (
                <p className="text-xs text-gray-400">{ticket.contact.phone}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            className="mt-3 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Change contact
          </button>
        </Section>

        <Section
          title="Properties"
          open={open.properties}
          onToggle={() => setOpen((v) => ({ ...v, properties: !v.properties }))}
        >
          <div className="space-y-3">
            <Field label="Status">
              <SelectField
                value={ticket.status}
                onChange={(v) => onUpdate("status", v as TicketStatus)}
                options={STATUS_OPTIONS as readonly string[]}
              />
            </Field>
            <Field label="Priority">
              <SelectField
                value={ticket.priority}
                onChange={(v) => onUpdate("priority", v as TicketPriority)}
                options={PRIORITY_OPTIONS as readonly string[]}
              />
            </Field>
            <Field label="Type">
              <SelectField
                value={ticket.type}
                onChange={(v) => onUpdate("type", v as TicketType)}
                options={TYPE_OPTIONS as readonly string[]}
              />
            </Field>
            <Field label="Team">
              <SelectField
                value={ticket.team}
                onChange={(v) => onUpdate("team", v)}
                options={TEAM_OPTIONS}
              />
            </Field>
          </div>
        </Section>

        <Section
          title="People"
          open={open.people}
          onToggle={() => setOpen((v) => ({ ...v, people: !v.people }))}
        >
          <div className="space-y-3">
            <Field label="Assignee">
              <MemberSelect
                value={ticket.assignee}
                onChange={(member) => onUpdate("assignee", member)}
                allowUnassigned
              />
            </Field>
            <Field label="Owner">
              <MemberSelect
                value={ticket.owner}
                onChange={(member) => member && onUpdate("owner", member)}
              />
            </Field>
          </div>
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
              <p className="mt-1 text-sm font-medium text-gray-800">{ticket.sla.policy}</p>
            </div>
            <SlaRow
              title="First response"
              status={fr}
              dueLabel={ticket.sla.firstResponseDueLabel}
            />
            <SlaRow
              title="Resolution"
              status={res}
              dueLabel={ticket.sla.resolutionDueLabel}
            />
            <SlaProgressBar
              remainingMinutes={ticket.sla.remainingMinutes}
              status={ticket.sla.resolutionStatus}
            />
          </div>
        </Section>

        <Section
          title="Tags"
          open={open.tags}
          onToggle={() => setOpen((v) => ({ ...v, tags: !v.tags }))}
        >
          {ticket.tags.length === 0 ? (
            <p className="text-xs text-gray-400">No tags yet.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {ticket.tags.map((t) => (
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
        <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function MemberSelect({
  value,
  onChange,
  allowUnassigned,
}: {
  value: TicketTeamMember | null;
  onChange: (m: TicketTeamMember | null) => void;
  allowUnassigned?: boolean;
}) {
  return (
    <div className="relative">
      <select
        value={value?.id ?? ""}
        onChange={(e) => {
          const id = e.target.value;
          if (!id) {
            onChange(null);
            return;
          }
          const m = TEAM_MEMBERS.find((tm) => tm.id === id) ?? null;
          onChange(m);
        }}
        className="h-9 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 pr-8 text-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
      >
        {allowUnassigned && <option value="">Unassigned</option>}
        {TEAM_MEMBERS.map((m) => (
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
        <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
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

function SlaProgressBar({
  remainingMinutes,
  status,
}: {
  remainingMinutes: number;
  status: "on_track" | "at_risk" | "breached" | "met";
}) {
  if (status === "met") {
    return (
      <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
        Resolution SLA met.
      </div>
    );
  }
  const totalAssumed = 60 * 24 * 4;
  const used = Math.max(0, Math.min(100, ((totalAssumed - remainingMinutes) / totalAssumed) * 100));
  const barClass =
    status === "breached"
      ? "bg-rose-500"
      : status === "at_risk"
        ? "bg-amber-500"
        : "bg-emerald-500";
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px] text-gray-500">
        <span>Time used</span>
        <span>{Math.round(used)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div className={`h-full ${barClass}`} style={{ width: `${used}%` }} />
      </div>
    </div>
  );
}
