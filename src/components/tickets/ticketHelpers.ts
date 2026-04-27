import type {
  TicketPriority,
  TicketStatus,
  TicketType,
  SlaTarget,
} from "../../types/ticket";

export function statusBadgeClass(status: TicketStatus): string {
  switch (status) {
    case "Open":
      return "bg-blue-50 text-blue-600 ring-1 ring-blue-100";
    case "In Progress":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-100";
    case "Pending":
      return "bg-violet-50 text-violet-700 ring-1 ring-violet-100";
    case "Resolved":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100";
    case "Closed":
      return "bg-gray-100 text-gray-600 ring-1 ring-gray-200";
  }
}

export function statusDotClass(status: TicketStatus): string {
  switch (status) {
    case "Open":
      return "bg-blue-500";
    case "In Progress":
      return "bg-amber-500";
    case "Pending":
      return "bg-violet-500";
    case "Resolved":
      return "bg-emerald-500";
    case "Closed":
      return "bg-gray-400";
  }
}

export function priorityBadgeClass(priority: TicketPriority): string {
  switch (priority) {
    case "Urgent":
      return "bg-rose-50 text-rose-700 ring-1 ring-rose-100";
    case "High":
      return "bg-orange-50 text-orange-700 ring-1 ring-orange-100";
    case "Medium":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-100";
    case "Low":
      return "bg-gray-100 text-gray-600 ring-1 ring-gray-200";
  }
}

export function typeBadgeClass(type: TicketType): string {
  switch (type) {
    case "Marketing":
      return "bg-pink-50 text-pink-700 ring-1 ring-pink-100";
    case "Delivery":
      return "bg-sky-50 text-sky-700 ring-1 ring-sky-100";
    case "Billing":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100";
    case "Technical":
      return "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100";
    case "Account":
      return "bg-violet-50 text-violet-700 ring-1 ring-violet-100";
    case "Feedback":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-100";
  }
}

export function slaTone(status: SlaTarget["resolutionStatus"]): {
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
