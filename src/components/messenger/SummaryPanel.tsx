import { useState } from "react";
import type {
  Conversation,
  ConversationProperties,
  ConvStatus,
} from "../../types/messenger";
import { AGENT_OPTIONS, TAG_OPTIONS } from "../../data/messengerMocks";
import { Avatar, Icon, IconButton } from "./primitives";
import { TagPicker } from "./TagPicker";

const STATUS_OPTIONS: ConvStatus[] = ["Open", "Pending", "Resolved", "Closed"];

function CollapsibleSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-gray-200 px-4 py-3 dark:border-gray-800">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <span className="text-[12.5px] font-semibold text-gray-700 dark:text-gray-200">
          {title}
        </span>
        <Icon
          name="chevron-down"
          className={`size-4 text-gray-400 transition dark:text-gray-500 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="pt-2">{children}</div>}
    </section>
  );
}

export function SummaryPanel({
  conversation,
  properties,
  onUpdateProperty,
  onToggleTag,
  onUpdate,
  onClose,
}: {
  conversation: Conversation;
  properties: ConversationProperties;
  onUpdateProperty: <K extends keyof ConversationProperties>(
    key: K,
    value: ConversationProperties[K]
  ) => void;
  onToggleTag: (tag: string) => void;
  onUpdate: () => void;
  onClose: () => void;
}) {
  const [open, setOpen] = useState({
    contact: true,
    tickets: false,
    properties: true,
  });
  const summaryChars = properties.summary.length;
  return (
    <aside className="hidden w-80 shrink-0 flex-col border-l border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 xl:flex">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <h3 className="text-[14px] font-semibold text-gray-800 dark:text-white/90">Summary</h3>
        <IconButton ariaLabel="Close summary" onClick={onClose} size="sm">
          <Icon name="close" className="size-4" />
        </IconButton>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <CollapsibleSection
          title="Contact info"
          open={open.contact}
          onToggle={() => setOpen((v) => ({ ...v, contact: !v.contact }))}
        >
          <div className="flex items-start gap-3 py-2">
            <Avatar
              size="md"
              initials={conversation.senderInitials}
              color={conversation.senderColor}
            />
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-semibold text-gray-800 dark:text-white/90">
                {conversation.senderName}
              </p>
              <p className="text-[11.5px] text-gray-400 dark:text-gray-500">
                {conversation.contactStatus}
              </p>
              <div className="mt-2 flex items-center gap-1">
                <IconButton ariaLabel="Copy link" size="sm">
                  <Icon name="link" className="size-3.5" />
                </IconButton>
                <IconButton ariaLabel="Refresh" size="sm">
                  <Icon name="refresh" className="size-3.5" />
                </IconButton>
                <IconButton ariaLabel="Share" size="sm">
                  <Icon name="share" className="size-3.5" />
                </IconButton>
              </div>
            </div>
          </div>
          <div className="mt-2 space-y-2">
            <label className="block">
              <span className="mb-1 block text-[11px] font-medium text-gray-500 dark:text-gray-400">
                Phone Number
              </span>
              <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
                <span className="flex-1 truncate">
                  {conversation.phone || "—"}
                </span>
                <Icon name="verified" className="size-4 text-brand-500" />
              </div>
            </label>
            <button
              type="button"
              className="mt-2 w-full rounded-md bg-gray-900 px-3 py-2 text-[12.5px] font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              Manage
            </button>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="Tickets"
          open={open.tickets}
          onToggle={() => setOpen((v) => ({ ...v, tickets: !v.tickets }))}
        >
          <div className="py-3 text-[12px] text-gray-500 dark:text-gray-400">
            No tickets linked to this conversation.
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="Conversation properties"
          open={open.properties}
          onToggle={() =>
            setOpen((v) => ({ ...v, properties: !v.properties }))
          }
        >
          <div className="space-y-3 py-1">
            <label className="block">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                  Summary
                </span>
                <span className="text-[10.5px] text-gray-400 dark:text-gray-500">
                  {summaryChars} Chars
                </span>
              </div>
              <textarea
                value={properties.summary}
                onChange={(event) =>
                  onUpdateProperty("summary", event.target.value)
                }
                rows={3}
                placeholder="Summary"
                className="block w-full resize-none rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
              />
            </label>

            <TagPicker
              selected={properties.tags}
              options={TAG_OPTIONS}
              onToggle={onToggleTag}
            />

            <label className="block">
              <span className="mb-1 block text-[11px] font-medium text-gray-500 dark:text-gray-400">
                Status
              </span>
              <div className="relative">
                <select
                  value={properties.status}
                  onChange={(event) =>
                    onUpdateProperty(
                      "status",
                      event.target.value as ConvStatus
                    )
                  }
                  className="h-9 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 pr-8 text-[13px] text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <Icon
                  name="chevron-down"
                  className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1 block text-[11px] font-medium text-gray-500 dark:text-gray-400">
                Agent
              </span>
              <div className="relative">
                <select
                  value={properties.agent}
                  onChange={(event) =>
                    onUpdateProperty("agent", event.target.value)
                  }
                  className="h-9 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 pr-8 text-[13px] text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                >
                  {AGENT_OPTIONS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
                <Icon
                  name="chevron-down"
                  className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                />
              </div>
            </label>

            <button
              type="button"
              onClick={onUpdate}
              className="mt-1 w-full rounded-md bg-gray-900 px-3 py-2 text-[12.5px] font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              Update
            </button>
          </div>
        </CollapsibleSection>
      </div>
    </aside>
  );
}
