import { Link } from "react-router";
import type { Lead, LeadStage } from "../../types/lead";
import { STAGE_OPTIONS } from "../../data/leadMocks";
import {
  dispositionBadgeClass,
  slaTone,
  sourceBadgeClass,
  stageDotClass,
} from "./leadHelpers";

interface Props {
  leads: Lead[];
}

export default function LeadKanban({ leads }: Props) {
  const grouped: Record<LeadStage, Lead[]> = {
    New: [],
    Assigned: [],
    Contacted: [],
    Qualified: [],
    Proposal: [],
    Closed: [],
  };
  for (const l of leads) grouped[l.stage].push(l);

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {STAGE_OPTIONS.map((stage) => (
        <div
          key={stage}
          className="flex w-[280px] shrink-0 flex-col rounded-2xl border border-gray-200 bg-gray-50/40 dark:border-gray-800 dark:bg-white/[0.02]"
        >
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${stageDotClass(stage)}`} />
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                {stage}
              </span>
            </div>
            <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-gray-500 ring-1 ring-gray-200 dark:bg-white/5 dark:ring-gray-700">
              {grouped[stage].length}
            </span>
          </div>
          <div className="flex flex-col gap-2 p-3">
            {grouped[stage].length === 0 ? (
              <p className="py-4 text-center text-xs text-gray-400">No leads</p>
            ) : (
              grouped[stage].map((lead) => <KanbanCard key={lead.id} lead={lead} />)
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function KanbanCard({ lead }: { lead: Lead }) {
  const sla = slaTone(lead.sla.closureStatus);
  return (
    <Link
      to={`/leads/${lead.id}`}
      className="block rounded-xl border border-gray-200 bg-white p-3 transition hover:border-brand-300 hover:shadow-sm dark:border-gray-800 dark:bg-white/[0.04]"
    >
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-mono text-gray-400">{lead.number}</span>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${sla.className}`}
        >
          <span className={`h-1 w-1 rounded-full ${sla.dot}`} />
          {sla.label}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${lead.contact.avatarColor}`}
        >
          {lead.contact.initials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-800 dark:text-white/90">
            {lead.contact.name}
          </p>
          {lead.contact.company && (
            <p className="truncate text-[11px] text-gray-400">{lead.contact.company}</p>
          )}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${sourceBadgeClass(
            lead.utm.source
          )}`}
        >
          {lead.utm.source}
        </span>
        {lead.disposition && (
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${dispositionBadgeClass(
              lead.disposition
            )}`}
          >
            {lead.disposition}
          </span>
        )}
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
        <span className="flex items-center gap-1">
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold ${lead.owner.avatarColor}`}
          >
            {lead.owner.initials}
          </span>
          {lead.owner.name.split(" ")[0]}
        </span>
        {lead.estimatedValue ? (
          <span className="font-medium text-gray-700">
            ₹{lead.estimatedValue.toLocaleString("en-IN")}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
