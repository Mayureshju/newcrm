import type {
  LeadDisposition,
  LeadSla,
  LeadSource,
  LeadStage,
  LeadAiScore,
} from "../../types/lead";

export function stageBadgeClass(stage: LeadStage): string {
  switch (stage) {
    case "New":
      return "bg-blue-50 text-blue-600 ring-1 ring-blue-100";
    case "Assigned":
      return "bg-sky-50 text-sky-700 ring-1 ring-sky-100";
    case "Contacted":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-100";
    case "Qualified":
      return "bg-violet-50 text-violet-700 ring-1 ring-violet-100";
    case "Proposal":
      return "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100";
    case "Closed":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100";
  }
}

export function stageDotClass(stage: LeadStage): string {
  switch (stage) {
    case "New":
      return "bg-blue-500";
    case "Assigned":
      return "bg-sky-500";
    case "Contacted":
      return "bg-amber-500";
    case "Qualified":
      return "bg-violet-500";
    case "Proposal":
      return "bg-indigo-500";
    case "Closed":
      return "bg-emerald-500";
  }
}

export function dispositionBadgeClass(disposition: LeadDisposition | null): string {
  if (!disposition) return "bg-gray-100 text-gray-500 ring-1 ring-gray-200";
  switch (disposition) {
    case "Converted":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100";
    case "Not Interested":
      return "bg-rose-50 text-rose-700 ring-1 ring-rose-100";
    case "Follow-up Scheduled":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-100";
    case "Unreachable":
      return "bg-orange-50 text-orange-700 ring-1 ring-orange-100";
    case "Junk":
      return "bg-gray-100 text-gray-600 ring-1 ring-gray-200";
  }
}

export function sourceBadgeClass(source: LeadSource): string {
  switch (source) {
    case "Google":
      return "bg-sky-50 text-sky-700 ring-1 ring-sky-100";
    case "Meta":
      return "bg-blue-50 text-blue-700 ring-1 ring-blue-100";
    case "Referral":
      return "bg-violet-50 text-violet-700 ring-1 ring-violet-100";
    case "Organic":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100";
    case "Email":
      return "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100";
    case "WhatsApp":
      return "bg-green-50 text-green-700 ring-1 ring-green-100";
    case "Manual":
      return "bg-gray-100 text-gray-600 ring-1 ring-gray-200";
  }
}

export function slaTone(status: LeadSla["closureStatus"]): {
  label: string;
  className: string;
  dot: string;
} {
  switch (status) {
    case "met":
      return {
        label: "Met",
        className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
        dot: "bg-emerald-500",
      };
    case "on_track":
      return {
        label: "On track",
        className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
        dot: "bg-emerald-500",
      };
    case "at_risk":
      return {
        label: "At risk",
        className: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
        dot: "bg-amber-500",
      };
    case "breached":
      return {
        label: "Breached",
        className: "bg-rose-50 text-rose-700 ring-1 ring-rose-100",
        dot: "bg-rose-500",
      };
  }
}

export function aiTagClass(tag: LeadAiScore["tag"]): string {
  switch (tag) {
    case "High Potential":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100";
    case "Needs Re-engagement":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-100";
    case "Low Intent":
      return "bg-gray-100 text-gray-600 ring-1 ring-gray-200";
    case "Cold":
      return "bg-rose-50 text-rose-700 ring-1 ring-rose-100";
  }
}

export function taskStatusClass(status: "pending" | "done" | "overdue"): {
  label: string;
  className: string;
  dot: string;
} {
  switch (status) {
    case "done":
      return {
        label: "Done",
        className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
        dot: "bg-emerald-500",
      };
    case "overdue":
      return {
        label: "Overdue",
        className: "bg-rose-50 text-rose-700 ring-1 ring-rose-100",
        dot: "bg-rose-500",
      };
    case "pending":
      return {
        label: "Pending",
        className: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
        dot: "bg-amber-500",
      };
  }
}
