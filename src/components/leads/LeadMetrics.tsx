import type { Lead } from "../../types/lead";

interface MetricCardProps {
  label: string;
  value: number | string;
  delta?: string;
  tone: "blue" | "amber" | "emerald" | "rose" | "gray" | "violet";
  icon: React.ReactNode;
}

const toneClasses: Record<MetricCardProps["tone"], { bg: string; text: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  amber: { bg: "bg-amber-50", text: "text-amber-600" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600" },
  rose: { bg: "bg-rose-50", text: "text-rose-600" },
  gray: { bg: "bg-gray-100", text: "text-gray-600" },
  violet: { bg: "bg-violet-50", text: "text-violet-600" },
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
          <h4 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">{value}</h4>
        </div>
        {delta ? <span className={`text-xs font-medium ${t.text}`}>{delta}</span> : null}
      </div>
    </div>
  );
}

export default function LeadMetrics({ leads }: { leads: Lead[] }) {
  const total = leads.length;
  const newLeads = leads.filter((l) => l.stage === "New" || l.stage === "Assigned").length;
  const contacted = leads.filter((l) =>
    ["Contacted", "Qualified", "Proposal"].includes(l.stage)
  ).length;
  const converted = leads.filter((l) => l.disposition === "Converted").length;
  const breached = leads.filter(
    (l) => l.sla.firstContactStatus === "breached" || l.sla.closureStatus === "breached"
  ).length;

  const conversionRate = total ? Math.round((converted / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <MetricCard
        label="Total Leads"
        value={total}
        delta="+8% wk"
        tone="blue"
        icon={<UsersIcon />}
      />
      <MetricCard
        label="New"
        value={newLeads}
        delta={`${total ? Math.round((newLeads / total) * 100) : 0}% of total`}
        tone="violet"
        icon={<SparkleIcon />}
      />
      <MetricCard
        label="In Pipeline"
        value={contacted}
        delta={`${total ? Math.round((contacted / total) * 100) : 0}% engaged`}
        tone="amber"
        icon={<FunnelIcon />}
      />
      <MetricCard
        label="Converted"
        value={converted}
        delta={`${conversionRate}% rate`}
        tone="emerald"
        icon={<CheckIcon />}
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

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle cx="9" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 20a6 6 0 0 1 12 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 20a5 5 0 0 1 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FunnelIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M4 5h16l-6 8v6l-4-2v-4L4 5Z"
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
      <path
        d="m8 12 3 3 5-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
