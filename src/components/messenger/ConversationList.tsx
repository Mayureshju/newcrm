import type {
  Conversation,
  FilterTabKey,
  PlatformFilter,
} from "../../types/messenger";
import { Icon, IconButton } from "./primitives";
import { ConversationRow } from "./ConversationRow";

const FILTER_TABS: { key: FilterTabKey; label: string; count: number }[] = [
  { key: "unresolved", label: "Unresolved", count: 20 },
  { key: "my_open", label: "My Open", count: 40 },
  { key: "unassigned", label: "Unassigned", count: 50 },
  { key: "resolved", label: "Resolved", count: 12 },
];

const PLATFORM_OPTIONS: { value: PlatformFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "messenger", label: "Messenger" },
  { value: "instagram", label: "Instagram" },
  { value: "email", label: "Email" },
];

export function ConversationList({
  conversations,
  activeId,
  onSelect,
  platformFilter,
  onPlatformChange,
  activeTab,
  onTabChange,
  search,
  onSearchChange,
}: {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  platformFilter: PlatformFilter;
  onPlatformChange: (value: PlatformFilter) => void;
  activeTab: FilterTabKey;
  onTabChange: (tab: FilterTabKey) => void;
  search: string;
  onSearchChange: (value: string) => void;
}) {
  return (
    <aside className="flex w-full max-w-[320px] shrink-0 flex-col border-r border-gray-200">
      <div className="flex flex-col gap-3 border-b border-gray-200 px-4 pb-3 pt-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-[17px] font-semibold text-gray-800">Messages</h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Online
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <IconButton ariaLabel="Agent availability" size="sm">
              <Icon name="user-plus" className="size-4" />
            </IconButton>
            <IconButton ariaLabel="Recent" size="sm">
              <Icon name="history" className="size-4" />
            </IconButton>
            <IconButton ariaLabel="Blocked" tone="danger" size="sm">
              <Icon name="slash" className="size-4" />
            </IconButton>
            <IconButton ariaLabel="New conversation" tone="primary" size="sm">
              <Icon name="plus" className="size-4" />
            </IconButton>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <label className="relative inline-flex">
            <span className="sr-only">Filter by platform</span>
            <select
              value={platformFilter}
              onChange={(event) =>
                onPlatformChange(event.target.value as PlatformFilter)
              }
              className="h-8 appearance-none rounded-md border border-gray-200 bg-white pl-2.5 pr-7 text-[12px] text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
            >
              {PLATFORM_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Icon
              name="chevron-down"
              className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-gray-400"
            />
          </label>
          <button
            type="button"
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 text-[12px] font-medium text-gray-600 hover:bg-gray-50"
          >
            <Icon name="filter" className="size-3.5" />
            Filter
          </button>
        </div>
        <label className="relative block">
          <span className="sr-only">Search</span>
          <Icon
            name="search"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search"
            className="h-9 w-full rounded-md bg-gray-50 pl-9 pr-3 text-[13px] text-gray-700 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
          />
        </label>
      </div>
      <div className="no-scrollbar flex items-center gap-3 overflow-x-auto border-b border-gray-200 px-4">
        {FILTER_TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={`relative -mb-px shrink-0 whitespace-nowrap py-2.5 text-[12.5px] transition ${
                active
                  ? "font-semibold text-brand-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              <span className={active ? "ml-0.5" : "ml-0.5 text-gray-400"}>
                ({tab.count})
              </span>
              {active && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand-500" />
              )}
            </button>
          );
        })}
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2 custom-scrollbar">
        {conversations.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <Icon name="search" className="size-4" />
            </div>
            <p className="text-[13px] font-medium text-gray-700">
              No conversations found
            </p>
            <p className="text-[11px] text-gray-500">
              Try a different filter or search term.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-1">
            {conversations.map((c) => (
              <li key={c.id}>
                <ConversationRow
                  conversation={c}
                  active={c.id === activeId}
                  onClick={() => onSelect(c.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
