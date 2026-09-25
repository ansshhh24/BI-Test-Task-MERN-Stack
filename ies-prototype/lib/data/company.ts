// All company, people and financial data below is FICTIONAL demo data created for this prototype.

export const PRODUCT = {
  name: 'IES Helm',
  full: 'Intuit Enterprise Suite · Helm',
  tagline: 'The AI operating layer for the mid-market.',
  promise: 'Agents that understand, decide and act — with you at the helm.',
};

export const COMPANY = {
  name: 'Cascadia Supply Group',
  short: 'Cascadia',
  industry: 'Omnichannel distributor · outdoor & home goods',
  employees: 640,
  hq: 'Portland, OR',
  entities: [
    { code: 'US', name: 'Cascadia Supply US Inc.', currency: 'USD', flag: '🇺🇸' },
    { code: 'CA', name: 'Cascadia Supply Canada Ltd.', currency: 'CAD', flag: '🇨🇦' },
    { code: 'UK', name: 'Cascadia Supply UK Ltd.', currency: 'GBP', flag: '🇬🇧' },
  ],
  demoDate: 'Mon, Oct 5, 2026',
  closePeriod: 'September 2026',
};

export const PEOPLE = {
  cfo: { name: 'Maya Chen', title: 'CFO', initials: 'MC' },
  controller: { name: 'Daniel Ortiz', title: 'Controller', initials: 'DO' },
  fpa: { name: 'Tom Reyes', title: 'FP&A Lead', initials: 'TR' },
  dev: { name: 'Priya Raman', title: 'Founder, Ledgerline Labs', initials: 'PR', company: 'Ledgerline Labs' },
};

export const KPIS = [
  { id: 'cash', label: 'Cash on hand', value: '$6.82M', delta: '−$0.41M WoW', tone: 'neutral', sub: 'Consolidated · 3 entities' },
  { id: 'low', label: '13-week cash low', value: '$3.71M', delta: 'Below $4.0M covenant', tone: 'risk', sub: 'Week of Nov 30' },
  { id: 'rev', label: 'September revenue', value: '$12.9M', delta: '+6.2% YoY', tone: 'ok', sub: 'Wholesale 64% · DTC 36%' },
  { id: 'gm', label: 'Gross margin', value: '40.8%', delta: '−0.9 pts MoM', tone: 'warn', sub: 'Canada −2.1 pts' },
  { id: 'dso', label: 'DSO', value: '48 days', delta: 'Target 41', tone: 'warn', sub: '$2.9M > 30 days overdue' },
];

// 13-week cash forecast ($M). "mitigated" appears once the collections sprint is started.
export const CASH_FORECAST = [
  { wk: 'Oct 5', base: 6.82, mitigated: 6.82 },
  { wk: 'Oct 12', base: 6.41, mitigated: 6.55 },
  { wk: 'Oct 19', base: 6.05, mitigated: 6.33 },
  { wk: 'Oct 26', base: 5.62, mitigated: 6.02 },
  { wk: 'Nov 2', base: 5.3, mitigated: 5.79 },
  { wk: 'Nov 9', base: 4.88, mitigated: 5.46 },
  { wk: 'Nov 16', base: 4.42, mitigated: 5.1 },
  { wk: 'Nov 23', base: 3.95, mitigated: 4.72 },
  { wk: 'Nov 30', base: 3.71, mitigated: 4.51 },
  { wk: 'Dec 7', base: 3.98, mitigated: 4.7 },
  { wk: 'Dec 14', base: 4.61, mitigated: 5.25 },
  { wk: 'Dec 21', base: 5.2, mitigated: 5.78 },
  { wk: 'Dec 28', base: 5.84, mitigated: 6.3 },
];

export const MARGIN_BY_ENTITY = [
  { m: 'Apr', US: 41.9, CA: 40.2, UK: 38.8 },
  { m: 'May', US: 42.1, CA: 40.6, UK: 39.1 },
  { m: 'Jun', US: 41.7, CA: 40.1, UK: 39.4 },
  { m: 'Jul', US: 41.8, CA: 40.4, UK: 39.0 },
  { m: 'Aug', US: 41.6, CA: 40.3, UK: 39.2 },
  { m: 'Sep', US: 41.5, CA: 38.2, UK: 39.3 },
];

export type InsightAction =
  | { kind: 'nav'; label: string; href: string; primary?: boolean }
  | { kind: 'job'; label: string; jobId: string; primary?: boolean }
  | { kind: 'drawer'; label: string; primary?: boolean };

export interface Insight {
  id: string;
  domain: 'Cash' | 'Close' | 'Profitability' | 'Workforce' | 'Commerce' | 'Compliance';
  severity: 'high' | 'medium' | 'low';
  title: string;
  body: string;
  agent: string;
  confidence: number;
  evidence: string[];
  impact: string;
  actions: InsightAction[];
}

export const INSIGHTS: Insight[] = [
  {
    id: 'cash-covenant',
    domain: 'Cash',
    severity: 'high',
    title: 'Cash is projected to dip below the $4.0M covenant floor in late November',
    body:
      'Q4 inventory buys ($3.8M) land before holiday receipts, while DSO has drifted from 41 to 48 days. The 13-week low is $3.71M in the week of Nov 30.',
    agent: 'Cash Forecast Agent',
    confidence: 88,
    evidence: [
      '13-week forecast built from AR aging, AP schedule, payroll calendar and open POs',
      '$2.9M of receivables are > 30 days overdue across 41 customers',
      'Harborview Hotels ($1.24M) invoice due Nov 30 — historically pays 9 days late',
    ],
    impact: '−$290K below covenant at the low point',
    actions: [
      { kind: 'job', label: 'Start collections sprint', jobId: 'collections-sprint', primary: true },
      { kind: 'nav', label: 'Model in Scenario Lab', href: '/scenarios?q=What if Q4 revenue drops 8% and customers pay 7 days slower?' },
    ],
  },
  {
    id: 'close-status',
    domain: 'Close',
    severity: 'medium',
    title: 'September close is 62% ready on day 3 — the Close Agent has work queued',
    body:
      'Bank feeds for all 3 entities are in. Reconciliation, intercompany, accrual and anomaly checks are ready to run. One revenue cut-off question needs a technical accounting judgment.',
    agent: 'Close Agent',
    confidence: 95,
    evidence: ['48-task close checklist · 30 complete', 'All bank feeds synced 06:10 PT', 'Target: close on business day 5'],
    impact: 'Target day 5 vs 9-day historical average',
    actions: [{ kind: 'nav', label: 'Open Close Agent', href: '/close', primary: true }],
  },
  {
    id: 'margin-ca',
    domain: 'Profitability',
    severity: 'medium',
    title: 'Canada gross margin fell 2.1 pts in September',
    body:
      'The new 3PL contract started Sep 1. Freight cost per order rose from CAD 9.80 to CAD 12.60, and 14% of invoices include accessorial fees not in the rate card.',
    agent: 'Profitability Agent',
    confidence: 84,
    evidence: ['3PL invoices vs contracted rate card (412 invoices)', 'Order volume flat (+1.2%) — mix is not the driver', 'Accessorial fees: $38.1K in September'],
    impact: '≈ $61K margin per month if unaddressed',
    actions: [
      { kind: 'drawer', label: 'See drill-down', primary: true },
      { kind: 'nav', label: 'Find a freight audit agent', href: '/marketplace?focus=freightaudit' },
    ],
  },
  {
    id: 'workforce-ot',
    domain: 'Workforce',
    severity: 'low',
    title: 'Reno DC overtime is up 38% while 6 warehouse roles sit unfilled',
    body:
      'Overtime cost $96K in September vs $70K in August. Six open requisitions have been open 45+ days; peak season starts in 5 weeks.',
    agent: 'Workforce Insights Agent',
    confidence: 91,
    evidence: ['Payroll: 2,310 overtime hours in Reno DC', 'Requisitions open 45–71 days', 'Peak volume forecast +34% for Nov'],
    impact: 'Hiring 6 roles saves ≈ $18K/month in overtime',
    actions: [{ kind: 'nav', label: 'Model hiring plan', href: '/scenarios?q=What if we delay 12 hires and raise prices 2%?', primary: true }],
  },
  {
    id: 'commerce-returns',
    domain: 'Commerce',
    severity: 'low',
    title: 'Trail Pro jacket returns hit 11.4% on DTC — nearly 2× the catalog average',
    body: 'Return reasons cluster on "runs small" (63%). Margin at risk this quarter is about $182K including reverse logistics.',
    agent: 'Commerce Insights Agent',
    confidence: 86,
    evidence: ['1,904 DTC orders · 217 returns', 'Return reason text clustering', 'Wholesale returns unchanged at 3.1%'],
    impact: '$182K margin at risk in Q4',
    actions: [{ kind: 'job', label: 'Create merchandising task', jobId: 'merch-task', primary: true }],
  },
  {
    id: 'compliance-nexus',
    domain: 'Compliance',
    severity: 'medium',
    title: 'Sales crossed an economic-nexus threshold in Colorado',
    body: 'DTC sales into Colorado passed the state threshold on Sep 22. Registration and collection set-up should happen before the next filing period.',
    agent: 'Compliance Agent',
    confidence: 93,
    evidence: ['Trailing-12-month CO sales from commerce orders', 'Threshold rule from tax content library (illustrative)', 'No existing CO registration on file'],
    impact: 'Avoids uncollected-tax exposure on Q4 sales',
    actions: [{ kind: 'nav', label: 'Open Compliance Agent', href: '/compliance', primary: true }],
  },
];

export const AGENT_JOBS: Record<string, { title: string; body: string; audit: string; agent: string }> = {
  'collections-sprint': {
    title: 'Collections sprint started',
    body: 'Collections Agent queued 23 reminders ($2.1M). 4 accounts over $25K are waiting for your approval.',
    audit: 'Queued 23 payment reminders; 4 high-value accounts routed for approval',
    agent: 'Collections Agent',
  },
  'freight-disputes': {
    title: '3 freight disputes sent',
    body: 'FreightAudit AI sent the disputes you approved. Credits will be matched automatically when they arrive.',
    audit: 'Sent 3 approved dispute requests ($23.4K) to 3PL vendor',
    agent: 'FreightAudit AI',
  },
  'merch-task': {
    title: 'Task created for merchandising',
    body: 'Sizing-guide update and supplier quality review assigned to the DTC merchandising team with evidence attached.',
    audit: 'Created merchandising task with return-reason evidence pack',
    agent: 'Commerce Insights Agent',
  },
};

export const ACTIVITY_SEED = [
  { t: '06:10', agent: 'Bank Feed Sync', text: 'Synced 3 entities · 1,302 US, 418 CA, 276 UK transactions', tone: 'agent' },
  { t: '06:14', agent: 'Collections Agent', text: 'Sent 12 low-risk reminders under $5K (autopilot policy C-01)', tone: 'ok' },
  { t: '06:31', agent: 'Cash Forecast Agent', text: 'Refreshed 13-week forecast · flagged covenant risk', tone: 'warn' },
  { t: '07:02', agent: 'Compliance Agent', text: 'Detected nexus threshold crossing in Colorado', tone: 'warn' },
  { t: '07:15', agent: 'Spend Agent', text: 'Blocked a duplicate card charge of $1,180 (policy S-04)', tone: 'ok' },
];
