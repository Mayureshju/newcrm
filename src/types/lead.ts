export type LeadStage =
  | "New"
  | "Assigned"
  | "Contacted"
  | "Qualified"
  | "Proposal"
  | "Closed";

export type LeadDisposition =
  | "Converted"
  | "Not Interested"
  | "Follow-up Scheduled"
  | "Unreachable"
  | "Junk";

export type LeadSource =
  | "Google"
  | "Meta"
  | "Referral"
  | "Organic"
  | "Email"
  | "WhatsApp"
  | "Manual";

export type LeadMedium = "CPC" | "Organic" | "Email" | "Social" | "Referral" | "Direct";

export interface LeadContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  initials: string;
  avatarColor: string;
  company?: string;
  city?: string;
}

export interface LeadOwner {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  role?: string;
}

export interface LeadUtm {
  source: LeadSource;
  medium: LeadMedium;
  campaign: string;
}

export type LeadActivityKind = "call" | "email" | "whatsapp" | "note" | "system";

export interface LeadActivity {
  id: string;
  kind: LeadActivityKind;
  authorId: string;
  authorName: string;
  authorInitials: string;
  authorColor: string;
  body: string;
  createdAt: string;
  timeLabel: string;
  durationLabel?: string;
}

export type LeadTaskStatus = "pending" | "done" | "overdue";
export type LeadTaskSource = "assignment" | "follow_up" | "sla_reminder" | "manual";

export interface LeadTask {
  id: string;
  title: string;
  dueAt: string;
  dueLabel: string;
  status: LeadTaskStatus;
  autoCreated: boolean;
  source: LeadTaskSource;
}

export interface LeadSla {
  policy: string;
  firstContactDueAt: string;
  firstContactDueLabel: string;
  firstContactStatus: "on_track" | "at_risk" | "breached" | "met";
  closureDueAt: string;
  closureDueLabel: string;
  closureStatus: "on_track" | "at_risk" | "breached" | "met";
  remainingMinutes: number;
}

export interface LeadAiScore {
  interest: number;
  conversion: number;
  tag: "High Potential" | "Needs Re-engagement" | "Low Intent" | "Cold";
  summary: string;
}

export interface Lead {
  id: string;
  number: string;
  contact: LeadContact;
  stage: LeadStage;
  disposition: LeadDisposition | null;
  dispositionAt: string | null;
  dispositionNotes: string | null;
  owner: LeadOwner;
  team: string;
  tags: string[];
  utm: LeadUtm;
  createdAt: string;
  createdLabel: string;
  lastActivityAt: string;
  lastActivityLabel: string;
  estimatedValue?: number;
  tasks: LeadTask[];
  activity: LeadActivity[];
  sla: LeadSla;
  aiScore?: LeadAiScore;
}

export type LeadFilterStage = "all" | LeadStage;
export type LeadFilterDisposition = "all" | LeadDisposition;
export type LeadFilterSource = "all" | LeadSource;
export type LeadFilterOwner = "all" | string;
