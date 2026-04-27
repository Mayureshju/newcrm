import type { Platform } from "../../types/messenger";

export function Avatar({
  initials,
  color,
  size = "md",
  online,
  indicator,
  className = "",
}: {
  initials: string;
  color: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  online?: boolean;
  indicator?: { letter: string; color: string };
  className?: string;
}) {
  const dims =
    size === "xl"
      ? "size-12 text-base"
      : size === "lg"
        ? "size-10 text-sm"
        : size === "sm"
          ? "size-8 text-[12px]"
          : size === "xs"
            ? "size-6 text-[10px]"
            : "size-9 text-[13px]";
  return (
    <span className={`relative inline-flex shrink-0 ${className}`}>
      <span
        className={`flex ${dims} items-center justify-center rounded-full font-semibold ${color}`}
      >
        {initials}
      </span>
      {online && (
        <span className="absolute bottom-0 right-0 size-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-gray-900" />
      )}
      {indicator && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full text-[9px] font-semibold ring-2 ring-white dark:ring-gray-900 ${indicator.color}`}
        >
          {indicator.letter}
        </span>
      )}
    </span>
  );
}

export function StatusPill({
  label,
  tone = "warning",
}: {
  label: string;
  tone?: "success" | "warning" | "danger" | "info" | "neutral";
}) {
  const palette =
    tone === "success"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
      : tone === "danger"
        ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300"
        : tone === "info"
          ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
          : tone === "neutral"
            ? "bg-gray-100 text-gray-600 dark:bg-white/[0.06] dark:text-gray-300"
            : "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300";
  const dot =
    tone === "success"
      ? "bg-emerald-500"
      : tone === "danger"
        ? "bg-rose-500"
        : tone === "info"
          ? "bg-brand-500"
          : tone === "neutral"
            ? "bg-gray-400"
            : "bg-amber-500";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${palette}`}
    >
      <span className={`size-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

export function SoftChip({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-white/[0.06] dark:text-gray-300 ${className}`}
    >
      {children}
    </span>
  );
}

export function IconButton({
  children,
  ariaLabel,
  onClick,
  tone = "default",
  size = "md",
  active = false,
  type = "button",
}: {
  children: React.ReactNode;
  ariaLabel: string;
  onClick?: () => void;
  tone?: "default" | "danger" | "primary";
  size?: "sm" | "md";
  active?: boolean;
  type?: "button" | "submit";
}) {
  const dims = size === "sm" ? "size-7" : "size-8";
  const toneClass = active
    ? "text-brand-600 bg-brand-50 dark:bg-brand-500/15 dark:text-brand-300"
    : tone === "danger"
      ? "text-rose-500 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
      : tone === "primary"
        ? "text-brand-500 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-500/10"
        : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.06] dark:hover:text-gray-200";
  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={active || undefined}
      className={`inline-flex ${dims} items-center justify-center rounded-md transition ${toneClass}`}
    >
      {children}
    </button>
  );
}

export const PlatformMeta: Record<
  Platform,
  { letter: string; bg: string; label: string }
> = {
  whatsapp: { letter: "W", bg: "bg-emerald-500", label: "WhatsApp" },
  messenger: { letter: "M", bg: "bg-blue-500", label: "Messenger" },
  instagram: { letter: "I", bg: "bg-pink-500", label: "Instagram" },
  email: { letter: "E", bg: "bg-gray-500", label: "Email" },
};

export function PlatformMiniBadge({ platform }: { platform: Platform }) {
  const meta = PlatformMeta[platform];
  return (
    <span
      className={`flex size-5 items-center justify-center rounded-full text-[10px] font-semibold text-white ${meta.bg}`}
      aria-label={meta.label}
      title={meta.label}
    >
      {meta.letter}
    </span>
  );
}

export function Icon({
  name,
  className = "",
}: {
  name:
    | "search"
    | "chevron-down"
    | "chevron-up"
    | "chevron-right"
    | "filter"
    | "plus"
    | "user-plus"
    | "history"
    | "slash"
    | "more-vertical"
    | "link"
    | "check-circle"
    | "close"
    | "paperclip"
    | "smiley"
    | "image"
    | "type"
    | "send"
    | "verified"
    | "share"
    | "refresh"
    | "lock"
    | "bolt"
    | "note"
    | "eye"
    | "check-double"
    | "clock"
    | "user-check";
  className?: string;
}) {
  const path = (() => {
    switch (name) {
      case "search":
        return (
          <>
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </>
        );
      case "chevron-down":
        return <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />;
      case "chevron-up":
        return <path d="m6 15 6-6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />;
      case "chevron-right":
        return <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />;
      case "filter":
        return <path d="M3 5h18M6 12h12M10 19h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />;
      case "plus":
        return <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />;
      case "user-plus":
        return <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm11-4v6m3-3h-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />;
      case "history":
        return <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />;
      case "slash":
        return (
          <>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
            <path d="m5 5 14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </>
        );
      case "more-vertical":
        return (
          <>
            <circle cx="12" cy="5" r="1.6" fill="currentColor" />
            <circle cx="12" cy="12" r="1.6" fill="currentColor" />
            <circle cx="12" cy="19" r="1.6" fill="currentColor" />
          </>
        );
      case "link":
        return <path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />;
      case "check-circle":
        return (
          <>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
            <path d="m8 12 3 3 5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );
      case "close":
        return <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />;
      case "paperclip":
        return <path d="m21 12-8.5 8.5a5.5 5.5 0 1 1-7.78-7.78l9.9-9.9a3.5 3.5 0 0 1 4.95 4.95L9.17 17.17a1.5 1.5 0 1 1-2.12-2.12l8.49-8.49" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />;
      case "smiley":
        return (
          <>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="9" cy="10" r="1" fill="currentColor" />
            <circle cx="15" cy="10" r="1" fill="currentColor" />
            <path d="M8.5 14.5a4 4 0 0 0 7 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </>
        );
      case "image":
        return (
          <>
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="9" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="m4 17 5-4 4 3 4-3 3 2" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          </>
        );
      case "type":
        return <path d="M4 5h16M12 5v14M8 19h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />;
      case "send":
        return (
          <>
            <path d="M4 12 20 5l-3 15-5-6-8-2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="m12 14 8-9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </>
        );
      case "verified":
        return (
          <>
            <path d="M12 2 14 4l2.8-.3.6 2.7L19.8 8 19 10.7l.7 2.7-2.4 1.6L16 17.7l-2.7-.3L12 20l-2-2.7-2.7.4L6 15l-2.4-1.6.7-2.7L3.5 8 6 6.4l.6-2.7 2.8.3L12 2Z" stroke="currentColor" strokeWidth="1.4" />
            <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );
      case "share":
        return (
          <>
            <circle cx="18" cy="5" r="2.2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="6" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="18" cy="19" r="2.2" stroke="currentColor" strokeWidth="1.5" />
            <path d="m8 11 8-5m-8 7 8 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </>
        );
      case "refresh":
        return <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.3L3 16M3 21v-5h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />;
      case "lock":
        return (
          <>
            <rect x="4" y="11" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M8 11V8a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </>
        );
      case "bolt":
        return <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />;
      case "note":
        return (
          <>
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M8 9h8M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </>
        );
      case "eye":
        return (
          <>
            <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
          </>
        );
      case "check-double":
        return <path d="m1 12 5 5L17 6M8 17 13 12m4 5L23 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />;
      case "clock":
        return (
          <>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );
      case "user-check":
        return (
          <>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="m17 11 2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );
    }
  })();
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      {path}
    </svg>
  );
}
