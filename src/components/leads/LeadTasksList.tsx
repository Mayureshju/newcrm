import type { LeadTask } from "../../types/lead";
import { taskStatusClass } from "./leadHelpers";

interface Props {
  tasks: LeadTask[];
  onToggle?: (taskId: string) => void;
}

const SOURCE_LABEL: Record<LeadTask["source"], string> = {
  assignment: "Auto · Assignment",
  follow_up: "Auto · Follow-up",
  sla_reminder: "Auto · SLA reminder",
  manual: "Manual",
};

export default function LeadTasksList({ tasks, onToggle }: Props) {
  if (tasks.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50/40 px-3 py-3 text-center text-xs text-gray-400">
        No tasks yet.
      </p>
    );
  }
  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task) => {
        const tone = taskStatusClass(task.status);
        const isDone = task.status === "done";
        return (
          <li
            key={task.id}
            className={`group flex items-start gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 ${
              isDone ? "opacity-60" : ""
            }`}
          >
            <button
              type="button"
              onClick={() => onToggle?.(task.id)}
              aria-label={isDone ? "Mark task pending" : "Mark task done"}
              className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                isDone
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-gray-300 bg-white text-transparent hover:border-emerald-500"
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3">
                <path
                  d="m5 12 4 4 10-10"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <p
                  className={`text-sm font-medium text-gray-800 ${
                    isDone ? "line-through" : ""
                  }`}
                >
                  {task.title}
                </p>
                {task.autoCreated && (
                  <span className="inline-flex rounded-full bg-violet-50 px-1.5 py-0.5 text-[10px] font-medium text-violet-700 ring-1 ring-violet-100">
                    Auto
                  </span>
                )}
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500">
                <span>{task.dueLabel}</span>
                <span>·</span>
                <span>{SOURCE_LABEL[task.source]}</span>
              </div>
            </div>
            <span
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${tone.className}`}
            >
              <span className={`h-1 w-1 rounded-full ${tone.dot}`} />
              {tone.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
