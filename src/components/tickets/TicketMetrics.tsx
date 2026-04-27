import type { Ticket } from "../../types/ticket";

interface MetricCardProps {
  label: string;
  value: number | string;
  delta?: string;
  tone: "blue" | "amber" | "emerald" | "rose" | "gray";
  icon: React.ReactNode;
}

const toneClasses: Record<MetricCardProps["tone"], { bg: string; text: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  amber: { bg: "bg-amber-50", text: "text-amber-600" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600" },
  rose: { bg: "bg-rose-50", text: "text-rose-600" },
  gray: { bg: "bg-gray-100", text: "text-gray-600" },
};

function MetricCard({ label, value, delta, tone, icon }: MetricCardProps) {
  const t = toneClasses[tone];
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${t.bg} ${t.text}`}>
        {icon}
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
          <h4 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">
            {value}
          </h4>
        </div>
        {delta ? (
          <span className={`text-xs font-medium ${t.text}`}>{delta}</span>
        ) : null}
      </div>
    </div>
  );
}

export default function TicketMetrics({ tickets }: { tickets: Ticket[] }) {
  const total = tickets.length;
  const open = tickets.filter((t) =>
    ["Open", "In Progress", "Pending"].includes(t.status)
  ).length;
  const resolved = tickets.filter((t) =>
    ["Resolved", "Closed"].includes(t.status)
  ).length;
  const breached = tickets.filter(
    (t) =>
      t.sla.firstResponseStatus === "breached" ||
      t.sla.resolutionStatus === "breached"
  ).length;
  const urgent = tickets.filter((t) => t.priority === "Urgent" || t.priority === "High").length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <MetricCard
        label="Total Tickets"
        value={total}
        delta="+12% wk"
        tone="blue"
        icon={<TicketIcon />}
      />
      <MetricCard
        label="Open"
        value={open}
        delta={`${total ? Math.round((open / total) * 100) : 0}% of total`}
        tone="amber"
        icon={<InboxIcon />}
      />
      <MetricCard
        label="Resolved"
        value={resolved}
        delta={`${total ? Math.round((resolved / total) * 100) : 0}% of total`}
        tone="emerald"
        icon={<CheckIcon />}
      />
      <MetricCard
        label="High / Urgent"
        value={urgent}
        delta="needs review"
        tone="rose"
        icon={<BoltIcon />}
      />
      <MetricCard
        label="SLA Breached"
        value={breached}
        delta={breached === 0 ? "All on track" : "Action needed"}
        tone={breached === 0 ? "gray" : "rose"}
        icon={<ClockIcon />}
      />
    </div>
  );
}

function TicketIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M14 6v12" stroke="currentColor" strokeWidth="1.6" strokeDasharray="2 2" />
    </svg>
  );
}

function InboxIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M3 13v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M7 13l-4-9h18l-4 9h-3a2 2 0 0 1-4 0H7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="m8 12 3 3 5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
