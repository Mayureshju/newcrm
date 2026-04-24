import { useState } from "react";
import { Icon } from "./primitives";

export function TagPicker({
  selected,
  options,
  onToggle,
}: {
  selected: string[];
  options: string[];
  onToggle: (tag: string) => void;
}) {
  const [openList, setOpenList] = useState(false);
  return (
    <div>
      <span className="mb-1 block text-[11px] font-medium text-gray-500">
        Tags
      </span>
      <button
        type="button"
        onClick={() => setOpenList((v) => !v)}
        aria-expanded={openList}
        className="flex h-9 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 text-[13px] text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
      >
        <span className="truncate">
          {selected.length === 0 ? "—" : selected.join(", ")}
        </span>
        <Icon
          name="chevron-down"
          className={`size-4 text-gray-400 transition ${openList ? "rotate-180" : ""}`}
        />
      </button>
      {openList && (
        <div className="mt-1 rounded-md border border-gray-200 bg-white p-1 shadow-theme-sm">
          <ul className="max-h-48 overflow-auto">
            {options.map((opt) => {
              const checked = selected.includes(opt);
              return (
                <li key={opt}>
                  <button
                    type="button"
                    onClick={() => onToggle(opt)}
                    className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-[12.5px] ${
                      checked
                        ? "bg-brand-50 text-brand-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span>{opt}</span>
                    {checked && (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="size-3.5"
                        aria-hidden="true"
                      >
                        <path
                          d="m4 12 5 5L20 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selected.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700"
            >
              {tag}
              <button
                type="button"
                onClick={() => onToggle(tag)}
                aria-label={`Remove ${tag}`}
                className="text-brand-500 hover:text-brand-700"
              >
                <Icon name="close" className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
