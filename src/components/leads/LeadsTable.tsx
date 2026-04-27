import { Link } from "react-router";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import type { Lead } from "../../types/lead";
import {
  dispositionBadgeClass,
  slaTone,
  sourceBadgeClass,
  stageBadgeClass,
  stageDotClass,
} from "./leadHelpers";

interface Props {
  leads: Lead[];
}

export default function LeadsTable({ leads }: Props) {
  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-gray-400">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-700">No leads match your filters</p>
        <p className="mt-1 text-xs text-gray-400">
          Try clearing search or selecting a different stage.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 bg-gray-50/60 dark:border-gray-800 dark:bg-white/[0.02]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Lead
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Email / Phone
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Stage
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Disposition
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Source
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Owner
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                SLA
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Updated
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {leads.map((lead) => {
              const sla = slaTone(lead.sla.closureStatus);
              return (
                <TableRow
                  key={lead.id}
                  className="transition hover:bg-gray-50/60 dark:hover:bg-white/[0.02]"
                >
                  <TableCell className="px-5 py-4">
                    <Link to={`/leads/${lead.id}`} className="flex items-center gap-3">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${lead.contact.avatarColor}`}
                      >
                        {lead.contact.initials}
                      </span>
                      <div className="min-w-0">
                        <span className="text-[11px] font-mono text-gray-400">
                          {lead.number}
                        </span>
                        <p className="truncate text-sm font-medium text-gray-800 hover:text-brand-600 dark:text-white/90">
                          {lead.contact.name}
                        </p>
                        {lead.contact.company && (
                          <p className="truncate text-[11px] text-gray-400">
                            {lead.contact.company}
                          </p>
                        )}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm text-gray-700">{lead.contact.email}</p>
                      <p className="truncate text-xs text-gray-400">
                        {lead.contact.phone ?? lead.contact.city ?? "—"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${stageBadgeClass(
                        lead.stage
                      )}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${stageDotClass(lead.stage)}`} />
                      {lead.stage}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${dispositionBadgeClass(
                        lead.disposition
                      )}`}
                    >
                      {lead.disposition ?? "—"}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${sourceBadgeClass(
                        lead.utm.source
                      )}`}
                    >
                      {lead.utm.source}
                    </span>
                    <p className="mt-0.5 truncate text-[11px] text-gray-400">
                      {lead.utm.campaign}
                    </p>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold ${lead.owner.avatarColor}`}
                      >
                        {lead.owner.initials}
                      </span>
                      <span className="text-sm text-gray-700">{lead.owner.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ${sla.className}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${sla.dot}`} />
                        {sla.label}
                      </span>
                      <span className="whitespace-nowrap text-[11px] text-gray-400">
                        {lead.sla.closureDueLabel}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <span className="text-xs text-gray-500">{lead.lastActivityLabel}</span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
