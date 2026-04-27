export type TicketStatus = "Open" | "In Progress" | "Pending" | "Resolved" | "Closed";
export type TicketPriority = "Low" | "Medium" | "High" | "Urgent";
export type TicketType =
  | "Marketing"
  | "Delivery"
  | "Billing"
  | "Technical"
  | "Account"
  | "Feedback";

export type TicketChannel = "Email" | "WhatsApp" | "Messenger" | "Instagram" | "Phone" | "Web";

export interface TicketContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarColor: string;
  initials: string;
  company?: string;
}

export interface TicketTeamMember {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  role?: string;
}

export interface TicketAttachment {
  id: string;
  name: string;
  size: string;
  url: string;
  type: "image" | "file";
  thumbnail?: string;
}

export type CommentKind = "reply" | "note" | "email" | "system";

export interface TicketComment {
  id: string;
  kind: CommentKind;
  authorId: string;
  authorName: string;
  authorInitials: string;
  authorColor: string;
  body: string;
  createdAt: string;
  timeLabel: string;
  attachments?: TicketAttachment[];
  recipients?: string[];
}

export interface SlaTarget {
  policy: string;
  firstResponseDueAt: string;
  firstResponseDueLabel: string;
  firstResponseStatus: "on_track" | "at_risk" | "breached" | "met";
  resolutionDueAt: string;
  resolutionDueLabel: string;
  resolutionStatus: "on_track" | "at_risk" | "breached" | "met";
  remainingMinutes: number;
}

export interface Ticket {
  id: string;
  number: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  type: TicketType;
  channel: TicketChannel;
  contact: TicketContact;
  assignee: TicketTeamMember | null;
  owner: TicketTeamMember;
  team: string;
  tags: string[];
  createdAt: string;
  createdLabel: string;
  updatedAt: string;
  updatedLabel: string;
  attachments: TicketAttachment[];
  comments: TicketComment[];
  sla: SlaTarget;
}

export type TicketFilterStatus = "all" | TicketStatus;
export type TicketFilterPriority = "all" | TicketPriority;
export type TicketFilterType = "all" | TicketType;
