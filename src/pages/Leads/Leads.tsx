import { useMemo, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import LeadMetrics from "../../components/leads/LeadMetrics";
import LeadAnalytics from "../../components/leads/LeadAnalytics";
import LeadsTable from "../../components/leads/LeadsTable";
import LeadFilters from "../../components/leads/LeadFilters";
import LeadKanban from "../../components/leads/LeadKanban";
import { MOCK_LEADS } from "../../data/leadMocks";
import type {
  LeadFilterDisposition,
  LeadFilterOwner,
  LeadFilterSource,
  LeadFilterStage,
} from "../../types/lead";

type View = "all" | "new" | "active" | "mine";
type Layout = "list" | "kanban";

const ME_OWNER_ID = "lo-1";

export default function Leads() {
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState<LeadFilterStage>("all");
  const [disposition, setDisposition] = useState<LeadFilterDisposition>("all");
  const [source, setSource] = useState<LeadFilterSource>("all");
  const [owner, setOwner] = useState<LeadFilterOwner>("all");
  const [view, setView] = useState<View>("all");
  const [layout, setLayout] = useState<Layout>("list");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MOCK_LEADS.filter((l) => {
      if (view === "new" && !["New", "Assigned"].includes(l.stage)) return false;
      if (
        view === "active" &&
        !["Contacted", "Qualified", "Proposal"].includes(l.stage)
      )
        return false;
      if (view === "mine" && l.owner.id !== ME_OWNER_ID) return false;
      if (stage !== "all" && l.stage !== stage) return false;
      if (disposition !== "all" && l.disposition !== disposition) return false;
      if (source !== "all" && l.utm.source !== source) return false;
      if (owner !== "all" && l.owner.id !== owner) return false;
      if (q) {
        return (
          l.contact.name.toLowerCase().includes(q) ||
          l.contact.email.toLowerCase().includes(q) ||
          l.id.toLowerCase().includes(q) ||
          l.number.toLowerCase().includes(q) ||
          l.utm.campaign.toLowerCase().includes(q) ||
          (l.contact.company?.toLowerCase().includes(q) ?? false)
        );
      }
      return true;
    });
  }, [search, stage, disposition, source, owner, view]);

  const counts = useMemo(
    () => ({
      all: MOCK_LEADS.length,
      newLeads: MOCK_LEADS.filter((l) => ["New", "Assigned"].includes(l.stage)).length,
      active: MOCK_LEADS.filter((l) =>
        ["Contacted", "Qualified", "Proposal"].includes(l.stage)
      ).length,
      mine: MOCK_LEADS.filter((l) => l.owner.id === ME_OWNER_ID).length,
    }),
    []
  );

  function reset() {
    setSearch("");
    setStage("all");
    setDisposition("all");
    setSource("all");
    setOwner("all");
  }

  return (
    <>
      <PageMeta
        title="Leads | Dieture CRM"
        description="Lead pipeline, dispositions, UTM attribution, and SLA tracking."
      />
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Leads</h1>
            <p className="mt-1 text-sm text-gray-500">
              Capture, qualify, and convert leads with SLA-driven automation.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path
                  d="M3 3h7v7H3zM14 3h7v4h-7zM14 10h7v11h-7zM3 14h7v7H3z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
              Open in Insight BI
            </a>
            <button
              type="button"
              className="inline-flex items-center gap-2 self-start rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              New lead
            </button>
          </div>
        </header>

        <LeadMetrics leads={MOCK_LEADS} />
        <LeadAnalytics leads={MOCK_LEADS} />

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex w-fit rounded-lg border border-gray-200 bg-white p-1">
              <ViewTab active={view === "all"} onClick={() => setView("all")}>
                All <span className="ml-1.5 text-gray-400">{counts.all}</span>
              </ViewTab>
              <ViewTab active={view === "new"} onClick={() => setView("new")}>
                New <span className="ml-1.5 text-gray-400">{counts.newLeads}</span>
              </ViewTab>
              <ViewTab active={view === "active"} onClick={() => setView("active")}>
                Active <span className="ml-1.5 text-gray-400">{counts.active}</span>
              </ViewTab>
              <ViewTab active={view === "mine"} onClick={() => setView("mine")}>
                Assigned to me <span className="ml-1.5 text-gray-400">{counts.mine}</span>
              </ViewTab>
            </div>
            <div className="inline-flex w-fit rounded-lg border border-gray-200 bg-white p-1">
              <LayoutTab active={layout === "list"} onClick={() => setLayout("list")}>
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                List
              </LayoutTab>
              <LayoutTab active={layout === "kanban"} onClick={() => setLayout("kanban")}>
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <rect x="3" y="4" width="5" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                  <rect x="10" y="4" width="5" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                  <rect x="17" y="4" width="4" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                Kanban
              </LayoutTab>
            </div>
          </div>

          <LeadFilters
            search={search}
            onSearchChange={setSearch}
            stage={stage}
            onStageChange={setStage}
            disposition={disposition}
            onDispositionChange={setDisposition}
            source={source}
            onSourceChange={setSource}
            owner={owner}
            onOwnerChange={setOwner}
            onReset={reset}
          />

          {layout === "list" ? (
            <LeadsTable leads={filtered} />
          ) : (
            <LeadKanban leads={filtered} />
          )}
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

function LayoutTab({
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
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-brand-50 text-brand-600"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
      }`}
    >
      {children}
    </button>
  );
}
