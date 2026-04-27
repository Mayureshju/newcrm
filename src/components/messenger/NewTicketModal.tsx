import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import { Icon } from "./primitives";

const TICKET_TYPES = [
  "Marketing",
  "Delivery",
  "Billing",
  "Technical",
  "Account",
  "Feedback",
] as const;

export type TicketType = (typeof TICKET_TYPES)[number];

export interface TicketDraft {
  id?: string;
  subject: string;
  type: TicketType;
  description: string;
  contactName?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (draft: TicketDraft) => void;
  contactName?: string;
}

export function NewTicketModal({ isOpen, onClose, onCreate, contactName }: Props) {
  const [subject, setSubject] = useState("");
  const [type, setType] = useState<TicketType>("Account");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSubject("");
      setType("Account");
      setDescription("");
    }
  }, [isOpen]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = subject.trim();
    if (!trimmed) return;
    onCreate({
      subject: trimmed,
      type,
      description: description.trim(),
      contactName,
    });
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      handleSubmit(event as unknown as React.FormEvent);
    }
  }

  const canSubmit = subject.trim().length > 0;
  const charCount = description.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="mx-4 max-w-lg overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/10"
      showCloseButton={false}
    >
      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="flex flex-col">
        {/* Header — gradient backdrop with icon, title, contact pill, close */}
        <header className="relative flex items-start gap-4 border-b border-gray-100 px-6 py-5 dark:border-gray-800">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-brand-50 via-white to-white dark:from-brand-500/10 dark:via-gray-900 dark:to-gray-900" />
          <div className="relative flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white shadow-md shadow-brand-500/25">
            <TicketIcon />
          </div>
          <div className="relative min-w-0 flex-1">
            <h2 className="text-[16px] font-semibold tracking-tight text-gray-900 dark:text-white">
              Create new ticket
            </h2>
            <p className="mt-0.5 text-[12.5px] text-gray-500 dark:text-gray-400">
              Capture the issue and route it to the right team.
            </p>
            {contactName && (
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700 dark:bg-white/[0.06] dark:text-gray-300">
                <Icon name="link" className="size-3" />
                Linked to {contactName}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="relative inline-flex size-8 shrink-0 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-500 dark:hover:bg-white/[0.06] dark:hover:text-gray-200"
          >
            <Icon name="close" className="size-4" />
          </button>
        </header>

        {/* Body */}
        <div className="flex flex-col gap-5 px-6 py-5">
          <Field
            label="Subject"
            required
            hint={subject.length > 0 ? `${subject.length} chars` : undefined}
          >
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              autoFocus
              maxLength={140}
              placeholder="e.g. Refund for spoiled meal box"
              className="block h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-[14px] text-gray-900 placeholder:text-gray-400 transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
            />
          </Field>

          <Field label="Ticket type">
            <div className="relative">
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TicketType)}
                className="block h-11 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 pr-10 text-[14px] text-gray-900 transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              >
                {TICKET_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <Icon
                name="chevron-down"
                className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
              />
            </div>
          </Field>

          <Field
            label="Description"
            hint={charCount > 0 ? `${charCount} chars` : "Optional"}
          >
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Add steps to reproduce, expected outcome, attached screenshots…"
              className="block w-full resize-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[14px] leading-relaxed text-gray-900 placeholder:text-gray-400 transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
            />
          </Field>
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/60 px-6 py-3.5 dark:border-gray-800 dark:bg-white/[0.02]">
          <span className="hidden items-center gap-1.5 text-[11px] text-gray-500 sm:inline-flex dark:text-gray-400">
            <kbd className="rounded border border-gray-200 bg-white px-1.5 py-0.5 font-mono text-[10px] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
              ⌘
            </kbd>
            <kbd className="rounded border border-gray-200 bg-white px-1.5 py-0.5 font-mono text-[10px] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
              Enter
            </kbd>
            to create
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 items-center rounded-md px-3.5 text-[13px] font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/[0.06]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-brand-500 px-4 text-[13px] font-medium text-white shadow-sm shadow-brand-500/20 transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none dark:disabled:bg-gray-700"
            >
              <Icon name="plus" className="size-3.5" />
              Create ticket
            </button>
          </div>
        </footer>
      </form>
    </Modal>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[12px] font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="ml-0.5 text-rose-500">*</span>}
        </span>
        {hint && (
          <span className="text-[10.5px] text-gray-400 dark:text-gray-500">{hint}</span>
        )}
      </div>
      {children}
    </label>
  );
}

function TicketIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5">
      <path
        d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M14 6v12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeDasharray="2 2"
      />
    </svg>
  );
}
