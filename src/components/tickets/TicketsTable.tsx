import { Link } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import type { Ticket } from "../../types/ticket";
import {
  priorityBadgeClass,
  slaTone,
  statusBadgeClass,
  statusDotClass,
  typeBadgeClass,
} from "./ticketHelpers";

interface Props {
  tickets: Ticket[];
}

export default function TicketsTable({ tickets }: Props) {
  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-gray-400">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-700">No tickets match your filters</p>
        <p className="mt-1 text-xs text-gray-400">
          Try clearing search or selecting a different status.
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
              <TableCell isHeader className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wide text-gray-500">
                Ticket
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wide text-gray-500">
                Contact
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wide text-gray-500">
                Priority
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wide text-gray-500">
                Type
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wide text-gray-500">
                Assignee
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wide text-gray-500">
                SLA
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wide text-gray-500">
                Updated
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tickets.map((ticket) => {
              const sla = slaTone(ticket.sla.resolutionStatus);
              return (
                <TableRow key={ticket.id} className="transition hover:bg-gray-50/60 dark:hover:bg-white/[0.02]">
                  <TableCell className="px-5 py-4">
                    <Link to={`/tickets/${ticket.id}`} className="block">
                      <span className="text-xs font-mono text-gray-400">
                        {ticket.number}
                      </span>
                      <p className="mt-0.5 line-clamp-1 max-w-md text-sm font-medium text-gray-800 hover:text-brand-600 dark:text-white/90">
                        {ticket.subject}
                      </p>
                    </Link>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${ticket.contact.avatarColor}`}
                      >
                        {ticket.contact.initials}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-700">
                          {ticket.contact.name}
                        </p>
                        <p className="truncate text-xs text-gray-400">
                          {ticket.channel}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(
                        ticket.status
                      )}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${statusDotClass(ticket.status)}`} />
                      {ticket.status}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityBadgeClass(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${typeBadgeClass(
                        ticket.type
                      )}`}
                    >
                      {ticket.type}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    {ticket.assignee ? (
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold ${ticket.assignee.avatarColor}`}
                        >
                          {ticket.assignee.initials}
                        </span>
                        <span className="text-sm text-gray-700">{ticket.assignee.name}</span>
                      </div>
                    ) : (
                      <span className="text-xs italic text-gray-400">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${sla.className}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${sla.dot}`} />
                        {sla.label}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {ticket.sla.resolutionDueLabel}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <span className="text-xs text-gray-500">{ticket.updatedLabel}</span>
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
