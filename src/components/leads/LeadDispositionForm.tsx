import { useState } from "react";
import type { Lead, LeadDisposition } from "../../types/lead";
import { DISPOSITION_OPTIONS } from "../../data/leadMocks";
import { dispositionBadgeClass } from "./leadHelpers";

interface Props {
  lead: Lead;
  onSubmit: (disposition: LeadDisposition, notes: string) => void;
}

export default function LeadDispositionForm({ lead, onSubmit }: Props) {
  const [disposition, setDisposition] = useState<LeadDisposition | "">(lead.disposition ?? "");
  const [notes, setNotes] = useState(lead.dispositionNotes ?? "");

  const isClosed = lead.stage === "Closed" && lead.disposition !== null;
  const hasContactActivity = lead.activity.some(
    (a) => a.kind === "call" || a.kind === "email" || a.kind === "whatsapp"
  );
  const blockingReason = isClosed
    ? "This lead is closed."
    : !hasContactActivity
      ? "Log at least one call, email, or WhatsApp before setting an outcome."
      : null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!disposition || blockingReason) return;
    onSubmit(disposition as LeadDisposition, notes.trim());
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
            Set Lead Outcome
          </h3>
          <p className="mt-0.5 text-xs text-gray-500">
            Agents only set the final disposition. Intermediate stages (Contacted, Qualified) are
            handled automatically by the system.
          </p>
        </div>
        {lead.disposition && (
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${dispositionBadgeClass(
              lead.disposition
            )}`}
          >
            Current: {lead.disposition}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
        <div>
          <label className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-gray-500">
            Disposition
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {DISPOSITION_OPTIONS.map((d) => {
              const active = disposition === d;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDisposition(d)}
                  disabled={Boolean(blockingReason)}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    active
                      ? "border-brand-500 bg-brand-50 text-brand-600 ring-2 ring-brand-500/20"
                      : "border-gray-200 bg-white text-gray-700 hover:border-brand-300 hover:bg-brand-50/40"
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-gray-500">
            Outcome notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            disabled={Boolean(blockingReason)}
            placeholder="Capture context for this outcome — pricing objections, follow-up date, why disqualified, etc."
            className="block w-full resize-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:bg-gray-50"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          {blockingReason ? (
            <p className="text-xs text-amber-600">{blockingReason}</p>
          ) : (
            <p className="text-xs text-gray-400">
              Submitting will auto-close the lead and append a system event.
            </p>
          )}
          <button
            type="submit"
            disabled={!disposition || Boolean(blockingReason)}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path
                d="m5 12 4 4 10-10"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Set outcome & close
          </button>
        </div>
      </form>
    </section>
  );
}
