import { useMemo, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import TicketMetrics from "../../components/tickets/TicketMetrics";
import TicketAnalytics from "../../components/tickets/TicketAnalytics";
import TicketsTable from "../../components/tickets/TicketsTable";
import TicketFilters from "../../components/tickets/TicketFilters";
import { MOCK_TICKETS } from "../../data/ticketMocks";
import type {
  TicketFilterPriority,
  TicketFilterStatus,
  TicketFilterType,
} from "../../types/ticket";

export default function Tickets() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TicketFilterStatus>("all");
  const [priority, setPriority] = useState<TicketFilterPriority>("all");
  const [type, setType] = useState<TicketFilterType>("all");
  const [view, setView] = useState<"all" | "open" | "resolved" | "mine">("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MOCK_TICKETS.filter((t) => {
      if (view === "open" && !["Open", "In Progress", "Pending"].includes(t.status)) return false;
      if (view === "resolved" && !["Resolved", "Closed"].includes(t.status)) return false;
      if (view === "mine" && t.assignee?.id !== "tm-1") return false;
      if (status !== "all" && t.status !== status) return false;
      if (priority !== "all" && t.priority !== priority) return false;
      if (type !== "all" && t.type !== type) return false;
      if (q) {
        return (
          t.subject.toLowerCase().includes(q) ||
          t.contact.name.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          t.number.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, status, priority, type, view]);

  const counts = useMemo(
    () => ({
      all: MOCK_TICKETS.length,
      open: MOCK_TICKETS.filter((t) => ["Open", "In Progress", "Pending"].includes(t.status))
        .length,
      resolved: MOCK_TICKETS.filter((t) => ["Resolved", "Closed"].includes(t.status)).length,
      mine: MOCK_TICKETS.filter((t) => t.assignee?.id === "tm-1").length,
    }),
    []
  );

  function reset() {
    setSearch("");
    setStatus("all");
    setPriority("all");
    setType("all");
  }

  return (
    <>
      <PageMeta
        title="Support Tickets | Dieture CRM"
        description="Ticket dashboard, analytics, and queue with SLA tracking."
      />
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
              Support Tickets
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Track, triage, and resolve customer requests across every channel.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 self-start rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            New ticket
          </button>
        </header>

        <TicketMetrics tickets={MOCK_TICKETS} />
        <TicketAnalytics tickets={MOCK_TICKETS} />

        <div className="flex flex-col gap-3">
          <div className="inline-flex w-fit rounded-lg border border-gray-200 bg-white p-1">
            <ViewTab active={view === "all"} onClick={() => setView("all")}>
              All <span className="ml-1.5 text-gray-400">{counts.all}</span>
            </ViewTab>
            <ViewTab active={view === "open"} onClick={() => setView("open")}>
              Open <span className="ml-1.5 text-gray-400">{counts.open}</span>
            </ViewTab>
            <ViewTab active={view === "resolved"} onClick={() => setView("resolved")}>
              Resolved <span className="ml-1.5 text-gray-400">{counts.resolved}</span>
            </ViewTab>
            <ViewTab active={view === "mine"} onClick={() => setView("mine")}>
              Assigned to me <span className="ml-1.5 text-gray-400">{counts.mine}</span>
            </ViewTab>
          </div>

          <TicketFilters
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            priority={priority}
            onPriorityChange={setPriority}
            type={type}
            onTypeChange={setType}
            onReset={reset}
          />

          <TicketsTable tickets={filtered} />
        </div>
      </div>
    </>
  );
}

function ViewTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-brand-50 text-brand-600"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
      }`}
    >
      {children}
    </button>
  );
}
