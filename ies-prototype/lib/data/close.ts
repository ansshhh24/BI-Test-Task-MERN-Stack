import type { Autonomy, CloseItem, CloseItemStatus, Thresholds } from '../types';

// FICTIONAL close findings for Cascadia Supply Group, September 2026 close.
// The "AI" is simulated deterministically: every finding, trace and confidence value is scripted.

export const BASE_READINESS = 62;

export const DEFAULT_THRESHOLDS: Thresholds = {
  autoLimit: 10000,
  minConfidence: 95,
  escalateBelow: 70,
};

export const CLOSE_ITEMS: CloseItem[] = [
  {
    id: 'rec-us',
    workstream: 'Reconciliation',
    title: 'US operating account: 3 unrecorded bank fees',
    summary: '1,284 of 1,302 bank lines auto-matched. 15 timing items clear in October; 3 bank service fees are not in the GL.',
    entity: 'US',
    amount: 412.6,
    confidence: 99,
    risk: 'low',
    proposedAction: 'Post 3 bank-fee entries ($412.60) and certify the reconciliation.',
    journal: [
      { account: '6120 Bank Service Charges', debit: 412.6, entity: 'US' },
      { account: '1010 Cash – Operating ••4410', credit: 412.6, entity: 'US' },
    ],
    evidence: [
      { kind: 'bank', label: 'Bank statement lines', detail: 'Sep 30 · ANALYSIS FEE $318.40 · WIRE FEE $45.00 · WIRE FEE $49.20', source: 'First Pacific Bank feed ••4410' },
      { kind: 'gl', label: 'GL search', detail: 'No matching entries in 6120 or 1010 for Sep 28–Oct 2', source: 'IES General Ledger' },
      { kind: 'history', label: 'Pattern', detail: 'Identical fee types posted in 11 of the last 12 months', source: 'IES journal history' },
    ],
    trace: [
      { phase: 'Understand', text: 'Pulled 1,302 bank lines and 1,297 GL cash entries for Sep 1–30.' },
      { phase: 'Investigate', text: 'Matched 1,284 lines on amount, date window ±3 days and reference similarity.' },
      { phase: 'Decide', text: '15 outstanding checks are normal timing items. 3 bank fees have no GL entry and match a recurring pattern.' },
      { phase: 'Act', text: 'Prepare JE for $412.60 to 6120 Bank Service Charges.' },
      { phase: 'Verify', text: 'Adjusted GL cash ties to the bank statement: difference $0.00.' },
    ],
    policies: [
      { id: 'P-03', name: 'Bank fees ≤ autonomy limit', effect: 'allows_autonomy', detail: 'Low-risk, recurring, below the autonomous amount limit.' },
      { id: 'SOD-1', name: 'Segregation of duties', effect: 'check_passed', detail: 'Preparer (agent) differs from reviewer role.' },
    ],
    reversible: true,
    weight: 4,
    minutesSaved: 95,
  },
  {
    id: 'rec-ca',
    workstream: 'Reconciliation',
    title: 'Canada: storefront payout in transit at period end',
    summary: 'CAD 12,214 storefront payout was initiated Sep 30 and settled Oct 1. It sits in the payments clearing account.',
    entity: 'CA',
    amount: 8940,
    confidence: 97,
    risk: 'low',
    proposedAction: 'Reclassify CAD 12,214 ($8,940) from clearing to Cash in Transit.',
    journal: [
      { account: '1150 Cash in Transit', debit: 8940, entity: 'CA' },
      { account: '1190 Payments Clearing', credit: 8940, entity: 'CA' },
    ],
    evidence: [
      { kind: 'commerce', label: 'Payout report', detail: 'Payout #PO-77120 initiated Sep 30 23:10 · CAD 12,214.00', source: 'Storefront commerce connector' },
      { kind: 'bank', label: 'Bank deposit', detail: 'Oct 1 · deposit CAD 12,214.00 · ref PO-77120', source: 'Northern Maple Bank feed ••0087' },
      { kind: 'gl', label: 'Clearing balance', detail: '1190 Payments Clearing balance CAD 12,214.00 at Sep 30', source: 'IES General Ledger' },
    ],
    trace: [
      { phase: 'Understand', text: 'Clearing account 1190 should be zero at month end; balance is CAD 12,214.' },
      { phase: 'Investigate', text: 'Matched balance to payout PO-77120 and the Oct 1 bank deposit (exact amount + reference).' },
      { phase: 'Decide', text: 'Timing difference, not an error. Reclass to Cash in Transit per policy.' },
      { phase: 'Act', text: 'Prepare reclass JE for CAD 12,214.' },
      { phase: 'Verify', text: 'Clearing account balance becomes 0.00 after reclass.' },
    ],
    policies: [
      { id: 'P-05', name: 'Clearing reclass ≤ autonomy limit', effect: 'allows_autonomy', detail: 'Exact 3-way match (payout, deposit, GL).' },
    ],
    reversible: true,
    weight: 3,
    minutesSaved: 40,
  },
  {
    id: 'ic-us-uk',
    workstream: 'Intercompany',
    title: 'Intercompany US ↔ UK: $1,215 FX mismatch on management fee',
    summary: 'US booked a $42,380 receivable; UK booked a £32,650 payable at the Sep 1 rate ($41,164.60). Policy requires the month-end rate.',
    entity: 'US ↔ UK',
    amount: 1215.4,
    confidence: 94,
    risk: 'medium',
    proposedAction: 'Post FX true-up on UK books at the Sep 30 rate so the pair eliminates cleanly.',
    journal: [
      { account: '7810 FX Loss – Intercompany', debit: 1215.4, entity: 'UK' },
      { account: '2310 Due to US Inc.', credit: 1215.4, entity: 'UK' },
    ],
    evidence: [
      { kind: 'invoice', label: 'IC invoice', detail: 'ICI-2026-09 · Management fee · $42,380.00', source: 'US Inc. AR subledger' },
      { kind: 'gl', label: 'UK payable', detail: '£32,650.00 translated at 1.2608 (Sep 1)', source: 'UK Ltd. AP subledger' },
      { kind: 'history', label: 'Rate table', detail: 'Sep 30 GBP/USD month-end rate 1.2980', source: 'IES FX rates service' },
    ],
    trace: [
      { phase: 'Understand', text: 'Compared 14 intercompany pairs across US, CA and UK. 13 net to zero.' },
      { phase: 'Investigate', text: 'US↔UK management fee differs by $1,215.40. Root cause: UK used the Sep 1 rate.' },
      { phase: 'Decide', text: 'IC policy IC-02 requires month-end rate. The adjustment belongs on UK books.' },
      { phase: 'Act', text: 'Prepare FX true-up JE on UK Ltd.' },
      { phase: 'Verify', text: 'Pair nets to $0.00 after adjustment; elimination ready.' },
    ],
    policies: [
      { id: 'IC-02', name: 'Intercompany adjustments', effect: 'requires_approval', detail: 'Any change to an intercompany balance needs controller approval.' },
    ],
    reversible: true,
    weight: 5,
    minutesSaved: 120,
  },
  {
    id: 'anom-dup',
    workstream: 'Anomaly detection',
    title: 'Duplicate payment to Apex Freight Partners ($27,650)',
    summary: 'Invoice AFP-88213 was paid on Sep 12 (ACH) and again on Sep 19 (check) after a vendor re-send with a different PDF.',
    entity: 'US',
    amount: 27650,
    confidence: 96,
    risk: 'medium',
    proposedAction: 'Put vendor on payment hold, request a credit memo, and reclass $27,650 to Vendor Receivable.',
    journal: [
      { account: '1320 Vendor Receivable', debit: 27650, entity: 'US' },
      { account: '5200 Freight-In', credit: 27650, entity: 'US' },
    ],
    evidence: [
      { kind: 'invoice', label: 'Invoice images', detail: 'Same invoice number, amount, PO and line items; PDF hash differs (re-sent)', source: 'AP document inbox' },
      { kind: 'bank', label: 'Payments', detail: 'ACH Sep 12 $27,650.00 · Check #20814 Sep 19 $27,650.00 (cleared Sep 24)', source: 'First Pacific Bank feed ••4410' },
      { kind: 'email', label: 'Vendor email', detail: '"Resending invoice AFP-88213 — please confirm receipt" (Sep 15)', source: 'AP shared mailbox' },
    ],
    trace: [
      { phase: 'Understand', text: 'Scanned 2,114 September AP payments for duplicates and unusual patterns.' },
      { phase: 'Investigate', text: 'Invoice number, amount, PO and line items match exactly across two payments.' },
      { phase: 'Decide', text: 'High likelihood duplicate. Amount exceeds autonomy limit and involves vendor contact.' },
      { phase: 'Act', text: 'Draft vendor credit request + reclass JE; hold future payments to vendor.' },
      { phase: 'Verify', text: 'Vendor balance will show $27,650 debit until credit memo received.' },
    ],
    policies: [
      { id: 'AP-07', name: 'Vendor communications', effect: 'requires_approval', detail: 'Agent may draft but not send vendor correspondence without approval.' },
      { id: 'P-01', name: 'Autonomy amount limit', effect: 'requires_approval', detail: 'Amount above the autonomous limit.' },
    ],
    reversible: true,
    weight: 4,
    minutesSaved: 180,
  },
  {
    id: 'anom-spend',
    workstream: 'Anomaly detection',
    title: 'Canada marketing software spend +212% vs 6-month average',
    summary: '$58,300 charged to 6420 Marketing Software. It could be an annual prepayment (should be amortized) or a genuine spend increase.',
    entity: 'CA',
    amount: 58300,
    confidence: 64,
    risk: 'medium',
    proposedAction: 'Ask the budget owner to confirm term; if annual, reclass to Prepaid and amortize over 12 months.',
    evidence: [
      { kind: 'gl', label: 'Spend trend', detail: '6-month avg $18,700/mo · September $58,300', source: 'IES General Ledger' },
      { kind: 'invoice', label: 'Invoice', detail: 'Vendor invoice text: "Subscription — Growth plan". No service period stated.', source: 'AP document inbox' },
    ],
    trace: [
      { phase: 'Understand', text: 'Flagged account 6420 in CA: +212% vs trailing 6-month average.' },
      { phase: 'Investigate', text: 'Single invoice drives the spike. No contract on file; invoice omits service period.' },
      { phase: 'Decide', text: 'Evidence is insufficient to choose between prepaid and expense. Confidence 64% — below escalation floor.' },
      { phase: 'Act', text: 'Do not post. Route question to budget owner and controller with evidence.' },
      { phase: 'Verify', text: 'Item held open on close checklist until answered.' },
    ],
    policies: [
      { id: 'Q-01', name: 'Low-confidence escalation', effect: 'requires_escalation', detail: 'Confidence below the escalation floor — a human decides.' },
    ],
    escalateTo: 'Controller review',
    reversible: false,
    weight: 3,
    minutesSaved: 35,
  },
  {
    id: 'acc-freight',
    workstream: 'Accruals',
    title: 'Accrue unbilled 3PL freight: $186,400',
    summary: '312 goods receipts in September have no matching freight invoice yet. Estimate uses contracted lane rates.',
    entity: 'US',
    amount: 186400,
    confidence: 92,
    risk: 'medium',
    proposedAction: 'Post accrual of $186,400 with automatic reversal on Oct 1.',
    journal: [
      { account: '5200 Freight-In', debit: 186400, entity: 'US' },
      { account: '2110 Accrued Liabilities', credit: 186400, entity: 'US' },
    ],
    evidence: [
      { kind: 'warehouse', label: 'Goods receipts', detail: '312 receipts Sep 1–30 without freight invoice', source: 'Warehouse / 3PL connector' },
      { kind: 'contract', label: 'Rate card', detail: 'Lane rates from 3PL master agreement (effective Sep 1)', source: 'Contract repository' },
      { kind: 'history', label: 'Back-test', detail: 'Same method was within 2.8% of actuals in each of the last 6 months', source: 'IES accrual history' },
    ],
    trace: [
      { phase: 'Understand', text: 'Found 312 receipts without matched freight bills.' },
      { phase: 'Investigate', text: 'Applied contracted lane rates by origin/destination/weight.' },
      { phase: 'Decide', text: 'Estimate $186,400 (±3%). Above autonomy limit; not a templated accrual.' },
      { phase: 'Act', text: 'Prepare accrual JE with auto-reversal Oct 1.' },
      { phase: 'Verify', text: 'Freight % of revenue moves to 4.9%, in line with the 6-month trend.' },
    ],
    policies: [
      { id: 'P-01', name: 'Autonomy amount limit', effect: 'requires_approval', detail: 'Amount above the autonomous limit.' },
      { id: 'ACC-2', name: 'Estimate documentation', effect: 'check_passed', detail: 'Method and back-test attached as support.' },
    ],
    reversible: true,
    weight: 5,
    minutesSaved: 150,
  },
  {
    id: 'acc-payroll',
    workstream: 'Accruals',
    title: 'Payroll accrual for Sep 27–30: $412,900',
    summary: 'Four working days earned but unpaid, from time and payroll data in IES Workforce. Variance vs prior month +1.2%.',
    entity: 'US · CA · UK',
    amount: 412900,
    confidence: 98,
    risk: 'low',
    proposedAction: 'Post recurring payroll accrual with automatic reversal on Oct 1.',
    journal: [
      { account: '6010 Salaries & Wages', debit: 412900, entity: 'Consolidated' },
      { account: '2150 Accrued Payroll', credit: 412900, entity: 'Consolidated' },
    ],
    evidence: [
      { kind: 'payroll', label: 'Time data', detail: '640 employees · approved timesheets through Sep 30', source: 'IES Workforce' },
      { kind: 'history', label: 'Prior month', detail: 'August accrual $408,000 (variance +1.2%)', source: 'IES journal history' },
    ],
    trace: [
      { phase: 'Understand', text: 'Payroll period ends Oct 2; Sep 27–30 is earned in September.' },
      { phase: 'Investigate', text: 'Computed wages + employer taxes from approved time for 640 employees.' },
      { phase: 'Decide', text: 'Recurring accrual template P-07 applies (variance < 3%).' },
      { phase: 'Act', text: 'Post accrual JE and schedule reversal.' },
      { phase: 'Verify', text: 'Accrued payroll balance reconciles to workforce report.' },
    ],
    policies: [
      { id: 'P-07', name: 'Recurring accrual template', effect: 'allows_autonomy', detail: 'Templated accrual up to $500K with < 3% variance vs prior month.' },
    ],
    templateAutopilot: true,
    reversible: true,
    weight: 4,
    minutesSaved: 60,
  },
  {
    id: 'rev-harbor',
    workstream: 'Revenue',
    title: 'Revenue cut-off: $1.24M bill-and-hold order for Harborview Hotels',
    summary: 'Invoiced Sep 29 and recognized as revenue, but goods remain in the Reno DC. Bill-and-hold criteria need a judgment.',
    entity: 'US',
    amount: 1240000,
    confidence: 61,
    risk: 'high',
    proposedAction: 'Tentative: defer $1.24M to October until bill-and-hold criteria are evidenced. Needs expert judgment.',
    journal: [
      { account: '4000 Revenue – Wholesale', debit: 1240000, entity: 'US' },
      { account: '2400 Deferred Revenue', credit: 1240000, entity: 'US' },
    ],
    evidence: [
      { kind: 'contract', label: 'Customer request', detail: 'Email Sep 14: Harborview asks Cascadia to hold goods until hotel opening', source: 'CRM / email connector' },
      { kind: 'warehouse', label: 'Inventory location', detail: 'Pick ticket shows goods in general inventory until Oct 2; segregated bin assigned Oct 2', source: 'Warehouse connector' },
      { kind: 'invoice', label: 'Invoice', detail: 'INV-104233 · Sep 29 · $1,240,000 · net 60', source: 'IES AR' },
    ],
    trace: [
      { phase: 'Understand', text: 'Cut-off test on invoices in the last 3 days of the period > $250K.' },
      { phase: 'Investigate', text: 'Goods not shipped. Customer requested hold. Segregation date is after period end.' },
      { phase: 'Decide', text: 'Revenue timing depends on bill-and-hold criteria — a judgment call. Confidence 61%.' },
      { phase: 'Act', text: 'Do not post. Assemble context pack for a technical accounting expert.' },
      { phase: 'Verify', text: 'Close readiness held until expert guidance is applied.' },
    ],
    policies: [
      { id: 'R-01', name: 'Material revenue judgment', effect: 'requires_escalation', detail: 'Revenue judgments > $250K always go to a qualified human.' },
      { id: 'Q-01', name: 'Low-confidence escalation', effect: 'requires_escalation', detail: 'Confidence below the escalation floor.' },
    ],
    escalateTo: 'Expert network · Technical accounting',
    reversible: true,
    weight: 6,
    minutesSaved: 240,
  },
  {
    id: 'cons',
    workstream: 'Consolidation',
    title: 'Draft consolidation: 3 entities, $2.18M eliminations',
    summary: 'Translated CA and UK at Sep 30 rates, eliminated 14 intercompany pairs, CTA −$38.2K. Ready for controller sign-off.',
    entity: 'Consolidated',
    amount: 2180000,
    confidence: 95,
    risk: 'medium',
    proposedAction: 'Controller reviews and signs off the draft consolidated trial balance.',
    evidence: [
      { kind: 'gl', label: 'Entity trial balances', detail: 'US, CA, UK TBs as of Sep 30 · all balanced', source: 'IES General Ledger' },
      { kind: 'history', label: 'FX rates', detail: 'CAD/USD 0.7319 · GBP/USD 1.2980 (Sep 30)', source: 'IES FX rates service' },
    ],
    trace: [
      { phase: 'Understand', text: 'Consolidate 3 entities into USD reporting currency.' },
      { phase: 'Investigate', text: 'Translated balance sheets at closing rate, P&L at average rate.' },
      { phase: 'Decide', text: 'Eliminations of $2.18M; CTA −$38.2K within expected range.' },
      { phase: 'Act', text: 'Generate draft consolidated TB and flux commentary.' },
      { phase: 'Verify', text: 'Consolidated TB balances; flux > 10% annotated with drivers.' },
    ],
    policies: [
      { id: 'CON-1', name: 'Consolidation sign-off', effect: 'requires_approval', detail: 'Consolidated results always require controller sign-off.' },
    ],
    forceApproval: true,
    reversible: true,
    weight: 4,
    minutesSaved: 210,
  },
];

export type Outcome = 'recommend' | 'approval' | 'auto' | 'escalate';

/** Risk-based automation policy engine (deterministic). */
export function decideOutcome(item: CloseItem, mode: Autonomy, t: Thresholds): Outcome {
  if (item.risk === 'high' || item.confidence < t.escalateBelow) return 'escalate';
  if (item.forceApproval) return mode === 'assist' ? 'recommend' : 'approval';
  if (mode === 'assist') return 'recommend';
  if (mode === 'approve') return 'approval';
  const withinAmount = item.amount <= t.autoLimit || (item.templateAutopilot && item.amount <= 500000);
  if (item.risk === 'low' && item.confidence >= t.minConfidence && withinAmount) return 'auto';
  return 'approval';
}

export function outcomeToStatus(o: Outcome): CloseItemStatus {
  return o === 'auto' ? 'auto_executed' : o === 'approval' ? 'awaiting_approval' : o === 'escalate' ? 'escalated' : 'recommended';
}

export function outcomeReason(item: CloseItem, mode: Autonomy, t: Thresholds): string {
  const o = decideOutcome(item, mode, t);
  if (o === 'escalate') {
    if (item.risk === 'high') return 'High-risk judgment — routed to a qualified human.';
    return `Confidence ${item.confidence}% is below the ${t.escalateBelow}% escalation floor.`;
  }
  if (item.forceApproval) return 'Policy always requires human sign-off.';
  if (mode === 'assist') return 'Assist mode — the agent recommends, you execute.';
  if (mode === 'approve') return 'Approve mode — the agent prepares, you approve.';
  if (o === 'auto') return item.templateAutopilot ? 'Recurring template allows autonomous posting.' : `Low risk, ${item.confidence}% confidence, under $${t.autoLimit.toLocaleString()} limit.`;
  if (item.risk !== 'low') return `${item.risk === 'medium' ? 'Medium' : 'High'} risk — agent prepares, human approves.`;
  if (item.confidence < t.minConfidence) return `Confidence below the ${t.minConfidence}% autonomy bar.`;
  return `Amount above the $${t.autoLimit.toLocaleString()} autonomy limit.`;
}

export const DONE_STATUSES: CloseItemStatus[] = ['auto_executed', 'approved', 'resolved'];

export function readiness(statuses: Record<string, CloseItemStatus>): number {
  const add = CLOSE_ITEMS.reduce((s, it) => s + (DONE_STATUSES.includes(statuses[it.id]) ? it.weight : 0), 0);
  return BASE_READINESS + add;
}

export const CLOSE_CHECKLIST = [
  { name: 'Bank feeds synced (3 entities)', done: true },
  { name: 'AP cut-off & subledger close', done: true },
  { name: 'AR cut-off & subledger close', done: true },
  { name: 'Payroll & workforce data locked', done: true },
  { name: 'Inventory count reconciled', done: true },
  { name: 'Fixed asset depreciation run', done: true },
];
