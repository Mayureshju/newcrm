import type { Ticket, TicketComment, CommentKind } from "../../types/ticket";

const KIND_LABEL: Record<CommentKind, string> = {
  reply: "Reply",
  note: "Internal note",
  email: "Email",
  system: "System",
};

const KIND_TONE: Record<CommentKind, string> = {
  reply: "bg-white",
  note: "bg-amber-50/70 ring-1 ring-amber-100",
  email: "bg-white",
  system: "bg-gray-50",
};

export default function TicketConversation({ ticket }: { ticket: Ticket }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-start gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${ticket.contact.avatarColor}`}
          >
            {ticket.contact.initials}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-2">
              <p className="text-sm font-semibold text-gray-800">
                {ticket.contact.name}
              </p>
              <span className="text-xs text-gray-400">via {ticket.channel}</span>
              <span className="text-xs text-gray-400">· {ticket.createdLabel}</span>
            </div>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-700">
              {ticket.description}
            </p>
            {ticket.attachments.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {ticket.attachments.map((a) => (
                  <Attachment key={a.id} name={a.name} size={a.size} thumbnail={a.thumbnail} type={a.type} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {ticket.comments.map((c) => (
          <CommentCard key={c.id} comment={c} />
        ))}
      </div>
    </div>
  );
}

export function TicketComposer({
  ticket,
  tab,
  onTabChange,
  draft,
  onDraftChange,
  onSubmit,
}: {
  ticket: Ticket;
  tab: "reply" | "note" | "email";
  onTabChange: (t: "reply" | "note" | "email") => void;
  draft: string;
  onDraftChange: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="mb-3 inline-flex rounded-lg bg-gray-100 p-1 text-xs">
        <TabButton active={tab === "reply"} onClick={() => onTabChange("reply")}>
          Reply
        </TabButton>
        <TabButton active={tab === "email"} onClick={() => onTabChange("email")}>
          Email
        </TabButton>
        <TabButton active={tab === "note"} onClick={() => onTabChange("note")}>
          Internal note
        </TabButton>
      </div>
      {tab === "email" && (
        <div className="mb-2 flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-500">
          <span className="font-medium text-gray-700">To:</span>
          <span className="truncate">{ticket.contact.email}</span>
        </div>
      )}
      <textarea
        value={draft}
        onChange={(e) => onDraftChange(e.target.value)}
        rows={3}
        placeholder={
          tab === "note"
            ? "Add a private note for the team…"
            : tab === "email"
              ? "Compose email reply…"
              : "Type your reply…"
        }
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            onSubmit();
          }
        }}
        className={`block w-full resize-none rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 ${
          tab === "note"
            ? "border-amber-200 bg-amber-50/40 text-amber-900"
            : "border-gray-200 bg-white text-gray-800"
        }`}
      />
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-1 text-gray-400">
          <IconButton ariaLabel="Attach">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path
                d="m21 12-8.5 8.5a5.5 5.5 0 1 1-7.78-7.78l9.9-9.9a3.5 3.5 0 0 1 4.95 4.95L9.17 17.17a1.5 1.5 0 1 1-2.12-2.12l8.49-8.49"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </IconButton>
          <IconButton ariaLabel="Image">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="9" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.6" />
              <path d="m4 17 5-4 4 3 4-3 3 2" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
          </IconButton>
          <IconButton ariaLabel="Emoji">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="9" cy="10" r="1" fill="currentColor" />
              <circle cx="15" cy="10" r="1" fill="currentColor" />
              <path d="M8.5 14.5a4 4 0 0 0 7 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </IconButton>
          <span className="ml-2 hidden text-[11px] text-gray-400 sm:inline">
            ⌘ + Enter to send
          </span>
        </div>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!draft.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <path
              d="M4 12 20 5l-3 15-5-6-8-2Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
          {tab === "note" ? "Add note" : tab === "email" ? "Send email" : "Send reply"}
        </button>
      </div>
    </div>
  );
}

function TabButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
        active ? "bg-white text-gray-800 shadow-theme-xs" : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {children}
    </button>
  );
}

function IconButton({
  ariaLabel,
  children,
}: {
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
    >
      {children}
    </button>
  );
}

function CommentCard({ comment }: { comment: TicketComment }) {
  if (comment.kind === "system") {
    return (
      <div className="flex items-center justify-center py-1">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-[11px] text-gray-500">
          {comment.body} · {comment.timeLabel}
        </span>
      </div>
    );
  }
  return (
    <div className={`rounded-2xl border border-gray-200 p-4 ${KIND_TONE[comment.kind]}`}>
      <div className="flex items-start gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${comment.authorColor}`}
        >
          {comment.authorInitials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-gray-800">{comment.authorName}</p>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-500">
              {KIND_LABEL[comment.kind]}
            </span>
            <span className="text-xs text-gray-400">{comment.timeLabel}</span>
          </div>
          {comment.recipients && comment.recipients.length > 0 && (
            <p className="mt-1 text-xs text-gray-400">To: {comment.recipients.join(", ")}</p>
          )}
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-700">
            {comment.body}
          </p>
          {comment.attachments && comment.attachments.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {comment.attachments.map((a) => (
                <Attachment key={a.id} name={a.name} size={a.size} thumbnail={a.thumbnail} type={a.type} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Attachment({
  name,
  size,
  thumbnail,
  type,
}: {
  name: string;
  size: string;
  thumbnail?: string;
  type: "image" | "file";
}) {
  if (type === "image" && thumbnail) {
    return (
      <a href={thumbnail} target="_blank" rel="noreferrer" className="group block">
        <div className="h-24 w-32 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
          <img src={thumbnail} alt={name} className="h-full w-full object-cover transition group-hover:scale-105" />
        </div>
        <p className="mt-1 max-w-[8rem] truncate text-[11px] text-gray-500">{name}</p>
      </a>
    );
  }
  return (
    <a
      href="#"
      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600 hover:bg-gray-50"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-gray-400">
        <path
          d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
      <span className="font-medium text-gray-700">{name}</span>
      <span className="text-gray-400">· {size}</span>
    </a>
  );
}
