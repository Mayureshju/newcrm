import type {
  LeadFilterDisposition,
  LeadFilterOwner,
  LeadFilterSource,
  LeadFilterStage,
} from "../../types/lead";
import {
  DISPOSITION_OPTIONS,
  LEAD_OWNERS,
  SOURCE_OPTIONS,
  STAGE_OPTIONS,
} from "../../data/leadMocks";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  stage: LeadFilterStage;
  onStageChange: (v: LeadFilterStage) => void;
  disposition: LeadFilterDisposition;
  onDispositionChange: (v: LeadFilterDisposition) => void;
  source: LeadFilterSource;
  onSourceChange: (v: LeadFilterSource) => void;
  owner: LeadFilterOwner;
  onOwnerChange: (v: LeadFilterOwner) => void;
  onReset: () => void;
}

export default function LeadFilters({
  search,
  onSearchChange,
  stage,
  onStageChange,
  disposition,
  onDispositionChange,
  source,
  onSourceChange,
  owner,
  onOwnerChange,
  onReset,
}: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] md:flex-row md:items-center md:justify-between">
      <div className="relative flex-1 md:max-w-sm">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
          <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search leads, contacts, IDs…"
          className="block h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={stage}
          onChange={(v) => onStageChange(v as LeadFilterStage)}
          options={[
            { label: "All stages", value: "all" },
            ...STAGE_OPTIONS.map((s) => ({ label: s, value: s })),
          ]}
        />
        <Select
          value={disposition}
          onChange={(v) => onDispositionChange(v as LeadFilterDisposition)}
          options={[
            { label: "All dispositions", value: "all" },
            ...DISPOSITION_OPTIONS.map((d) => ({ label: d, value: d })),
          ]}
        />
        <Select
          value={source}
          onChange={(v) => onSourceChange(v as LeadFilterSource)}
          options={[
            { label: "All sources", value: "all" },
            ...SOURCE_OPTIONS.map((s) => ({ label: s, value: s })),
          ]}
        />
        <Select
          value={owner}
          onChange={(v) => onOwnerChange(v as LeadFilterOwner)}
          options={[
            { label: "All owners", value: "all" },
            ...LEAD_OWNERS.map((o) => ({ label: o.name, value: o.id })),
          ]}
        />
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-10 items-center rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-600 hover:bg-gray-50"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-8 text-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
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
