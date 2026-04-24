export type Platform = "whatsapp" | "messenger" | "instagram" | "email";

export type ConvStatus = "Open" | "Resolved" | "Closed" | "Pending";

export type SlaStatus =
  | "On Track"
  | "Breached First Response"
  | "Breached Resolution"
  | "Closed";

export type ComposerTab = "reply" | "note";

export type FilterTabKey =
  | "unresolved"
  | "my_open"
  | "unassigned"
  | "resolved"
  | "all";

export type PlatformFilter = "all" | Platform;

export interface SlaSessionLite {
  firstResponseBreached: boolean;
  resolutionBreached: boolean;
  firstResponseDue: string | null;
  firstResponseActual: string | null;
  resolutionDue: string | null;
  resolvedOn: string | null;
  priority: "Low" | "Normal" | "High" | "Urgent";
  policy: string;
}

export interface SessionMetadata {
  index: number;
  conversationId: string;
  startTime: string;
  endTime: string | null;
  endStatus: "Resolved" | "Closed" | null;
  messageCount: number;
  openedBy: string;
  closedBy: string | null;
  closedByEmail: string | null;
  createdLabel: string;
  resolutionTimeMinutes: number | null;
  summary: string;
  tags: string[];
  assignedTo: string;
  lastAssignedAgent: string;
  sla?: SlaSessionLite;
}

export type ContentType =
  | "text"
  | "image"
  | "file"
  | "audio"
  | "video"
  | "reaction";

export interface Message {
  id: string;
  conversationId: string;
  sessionIndex: number;
  direction: "Incoming" | "Outgoing";
  senderName: string;
  senderInitials: string;
  senderColor: string;
  body: string;
  timestamp: string;
  timeLabel: string;
  contentType: ContentType;
  isPrivate: boolean;
  isRead: boolean;
  seenByCustomer?: boolean;
  attach?: string | null;
  reaction?: string | null;
}

export interface StatusEvent {
  kind: "system";
  id: string;
  sessionIndex: number;
  event: "opened" | "assigned" | "resolved" | "closed" | "reassigned" | "sla_applied";
  actorName: string;
  actorInitials?: string;
  targetName?: string;
  byName?: string;
  timestamp: string;
  detail?: string;
}

export interface SlaBreachEvent {
  kind: "sla_breach";
  id: string;
  sessionIndex: number;
  stage: "first_response" | "resolution";
  policy: string;
  timestamp: string;
}

export interface BotSummary {
  kind: "bot_summary";
  id: string;
  sessionIndex: number;
  summary: string;
  resolutionNote: string;
  tags: string[];
  assignedTo: string;
  lastAssignedAgent: string;
  timestamp: string;
  timeLabel: string;
}

export interface DayDividerItem {
  kind: "day_divider";
  id: string;
  sessionIndex: number;
  label: string;
}

export interface SeenIndicator {
  kind: "seen";
  id: string;
  sessionIndex: number;
  actorInitials: string;
  actorColor: string;
  label: string;
}

export type ThreadItem =
  | Message
  | StatusEvent
  | SlaBreachEvent
  | BotSummary
  | DayDividerItem
  | SeenIndicator;

export function isMessage(item: ThreadItem): item is Message {
  return (item as Message).direction !== undefined;
}

export interface Conversation {
  id: string;
  platform: Platform;
  platformHandle: string;
  senderName: string;
  senderInitials: string;
  senderColor: string;
  senderId: string;
  assignee: string;
  assigneeInitials: string;
  status: ConvStatus;
  slaStatus: SlaStatus;
  priority: "Low" | "Normal" | "High" | "Urgent";
  firstResponseBreached: boolean;
  resolutionBreached: boolean;
  firstResponseDue: string | null;
  firstResponseActual: string | null;
  resolutionDue: string | null;
  resolutionActual: string | null;
  lastPreview: string;
  updatedLabel: string;
  unread: number;
  online: boolean;
  tags: string[];
  email?: string;
  phone?: string;
  contactStatus: string;
}

export interface ConversationProperties {
  summary: string;
  tags: string[];
  status: ConvStatus;
  agent: string;
}
