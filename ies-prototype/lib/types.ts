export type Role = 'business' | 'developer';
export type Autonomy = 'assist' | 'approve' | 'autopilot';
export type Risk = 'low' | 'medium' | 'high';

export type CloseItemStatus =
  | 'queued'
  | 'analyzing'
  | 'recommended'
  | 'awaiting_approval'
  | 'auto_executed'
  | 'approved'
  | 'rejected'
  | 'escalated'
  | 'resolved'
  | 'rolled_back';

export type Workstream =
  | 'Reconciliation'
  | 'Intercompany'
  | 'Anomaly detection'
  | 'Accruals'
  | 'Revenue'
  | 'Consolidation';

export interface EvidenceItem {
  kind: 'bank' | 'gl' | 'invoice' | 'contract' | 'payroll' | 'commerce' | 'email' | 'history' | 'warehouse';
  label: string;
  detail: string;
  source: string;
}

export interface JournalLine {
  account: string;
  debit?: number;
  credit?: number;
  entity: string;
}

export interface PolicyHit {
  id: string;
  name: string;
  effect: 'allows_autonomy' | 'requires_approval' | 'requires_escalation' | 'check_passed';
  detail: string;
}

export interface CloseItem {
  id: string;
  workstream: Workstream;
  title: string;
  summary: string;
  entity: string;
  amount: number; // USD
  confidence: number; // 0-100
  risk: Risk;
  proposedAction: string;
  journal?: JournalLine[];
  evidence: EvidenceItem[];
  trace: { phase: 'Understand' | 'Investigate' | 'Decide' | 'Act' | 'Verify'; text: string }[];
  policies: PolicyHit[];
  templateAutopilot?: boolean; // recurring template allows autopilot above the amount limit
  forceApproval?: boolean; // policy always requires human sign-off
  escalateTo?: string;
  reversible: boolean;
  weight: number; // contribution to close readiness
  minutesSaved: number;
}

export interface Thresholds {
  autoLimit: number; // max USD for autonomous execution
  minConfidence: number; // min confidence for autonomy
  escalateBelow: number; // below this confidence always escalates
}

export interface AuditEntry {
  id: string;
  ts: string; // display timestamp
  actor: string;
  actorType: 'agent' | 'human' | 'expert' | 'system';
  action: string;
  target: string;
  amount?: number;
  confidence?: number;
  policy?: string;
  approval: 'Autonomous' | 'Human approved' | 'Human rejected' | 'Escalated' | 'Recommendation' | 'Config change' | 'N/A';
  reversible?: boolean;
  itemId?: string;
  evidence?: string;
}

export type ExpertCaseStatus = 'draft' | 'sent' | 'in_review' | 'responded' | 'applied';

export interface ExpertCase {
  id: string;
  packId: string;
  expertId: string;
  status: ExpertCaseStatus;
  createdAt: string;
}

export interface MarketItem {
  id: string;
  name: string;
  kind: 'AI Agent' | 'App' | 'Integration' | 'Expert Service';
  publisher: string;
  publisherVerified: boolean;
  certified: boolean;
  tagline: string;
  description: string;
  category: string;
  rating: number;
  reviews: number;
  installs: string;
  price: string;
  priceNote: string;
  permissions: { scope: string; access: 'read' | 'write' | 'draft'; why: string }[];
  dataDomains: string[];
  defaultAutonomy?: Autonomy;
  evalScore?: number;
  highlights: string[];
  icon: string; // lucide icon name key
  color: string;
  isNew?: boolean;
}

export interface AgentRecord {
  id: string;
  name: string;
  publisher: string;
  firstParty: boolean;
  description: string;
  autonomy: Autonomy;
  paused: boolean;
  domains: string[];
  tasksMonth: number;
  successRate: number;
  overrideRate: number;
  hoursSaved: number;
  lastAction: string;
  risk: Risk;
}

export interface Toast {
  id: string;
  title: string;
  body?: string;
  tone: 'ok' | 'info' | 'warn' | 'agent';
}
