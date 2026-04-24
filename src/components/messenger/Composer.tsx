import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent as ReactKeyboardEvent,
} from "react";
import type { ComposerTab } from "../../types/messenger";
import { Icon, IconButton } from "./primitives";

const TABS: { key: ComposerTab; label: string }[] = [
  { key: "reply", label: "Reply" },
  { key: "note", label: "Private Note" },
];

export function Composer({
  tab,
  onTabChange,
  draft,
  onDraftChange,
  onSubmit,
}: {
  tab: ComposerTab;
  onTabChange: (tab: ComposerTab) => void;
  draft: string;
  onDraftChange: (value: string) => void;
  onSubmit: () => void;
}) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-200 bg-white px-5 py-3"
    >
      <div className="mb-2 flex items-center gap-0">
        {TABS.map((item) => {
          const active = tab === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onTabChange(item.key)}
              className={`rounded-t-md px-3 py-1.5 text-[12.5px] font-medium transition ${
                active
                  ? item.key === "note"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-gray-100 text-gray-800"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div
        className={`rounded-md border transition ${
          tab === "note"
            ? "border-amber-200 bg-amber-50/40 focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-100"
            : "border-gray-200 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10"
        }`}
      >
        <label className="block">
          <span className="sr-only">Message</span>
          <textarea
            value={draft}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
              onDraftChange(event.target.value)
            }
            onKeyDown={handleKeyDown}
            rows={3}
            placeholder={
              tab === "note"
                ? "Write a private note visible only to your team…"
                : "Type your message here…"
            }
            className="block w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-[13.5px] text-gray-800 placeholder:text-gray-400 focus:outline-none"
          />
        </label>
        <div className="flex items-center justify-between border-t border-gray-100 px-2 py-1.5">
          <div className="flex items-center gap-0.5">
            <IconButton ariaLabel="Attach file" size="sm">
              <Icon name="paperclip" className="size-4" />
            </IconButton>
            <IconButton ariaLabel="Insert emoji" size="sm">
              <Icon name="smiley" className="size-4" />
            </IconButton>
            <IconButton ariaLabel="Attach image" size="sm">
              <Icon name="image" className="size-4" />
            </IconButton>
            <IconButton ariaLabel="Formatting" size="sm">
              <Icon name="type" className="size-4" />
            </IconButton>
          </div>
          <button
            type="submit"
            disabled={!draft.trim()}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-gray-900 px-3.5 text-[12.5px] font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {tab === "note" ? "Save note" : "Send"}
            <Icon name="send" className="size-3.5" />
          </button>
        </div>
      </div>
      <p className="mt-1.5 pl-1 text-[10.5px] text-gray-400">
        <kbd className="rounded border border-gray-200 bg-gray-50 px-1 font-mono text-[10px]">
          Enter
        </kbd>{" "}
        to send ·{" "}
        <kbd className="rounded border border-gray-200 bg-gray-50 px-1 font-mono text-[10px]">
          Shift
        </kbd>{" "}
        +{" "}
        <kbd className="rounded border border-gray-200 bg-gray-50 px-1 font-mono text-[10px]">
          Enter
        </kbd>{" "}
        for a new line
      </p>
    </form>
  );
}
