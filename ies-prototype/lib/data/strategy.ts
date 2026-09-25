// Case Study / Strategy content. Tags: "Case" = stated in the Intuit case brief,
// "Assumption" = prototype assumption, "Research" = requires external validation.

export type SourceTag = 'Case' | 'Assumption' | 'Research';

export const PROBLEMS = {
  finance: {
    who: 'CFO / Controller / Owner at a 50–2,500-employee, multi-entity company',
    quote: '“I run a multi-entity business on spreadsheets stitched between five systems. By the time I see the numbers, the decision has already been made for me.”',
    quoteNote: 'Illustrative synthesis of case pain points — not a real customer quote.',
    pains: [
      { text: 'Data silos across accounting, payroll, HR and commerce tools', tag: 'Case' as SourceTag },
      { text: 'Weeks-long manual close', tag: 'Case' as SourceTag },
      { text: 'Limited access to specialized expertise without expensive hires or consultants', tag: 'Case' as SourceTag },
      { text: 'Juggling disconnected tools; multi-entity finance and compliance complexity', tag: 'Case' as SourceTag },
      { text: 'Hesitation to let AI touch the books without evidence, control and audit', tag: 'Assumption' as SourceTag },
    ],
    feel: 'Reactive, exposed, and always one step behind the business.',
  },
  developer: {
    who: 'Startups, fintechs, SaaS providers, consultants and independent developers',
    quote: '“I can build the agent in a weekend. Getting trusted data, permissions and customers takes a year.”',
    quoteNote: 'Illustrative synthesis of case pain points — not a real developer quote.',
    pains: [
      { text: 'Complex financial integrations', tag: 'Case' as SourceTag },
      { text: 'Data-thin, report-centric APIs', tag: 'Case' as SourceTag },
      { text: 'Limited monetization opportunities', tag: 'Case' as SourceTag },
      { text: 'Lack of AI agent frameworks and developer tools', tag: 'Case' as SourceTag },
      { text: 'No safe way to prove an agent is trustworthy to a finance buyer', tag: 'Assumption' as SourceTag },
    ],
    feel: 'Blocked by plumbing and trust, not by ideas.',
  },
};

export const VISION =
  'IES Helm turns Intuit Enterprise Suite from a system of record into a system of action: a trusted operating layer where AI agents, human experts and third-party developers work on one shared business context — and the finance leader stays at the helm.';

export const PILLARS = [
  { n: 1, name: 'Agentic Work', line: 'Agents do the work — close, collections, compliance — not just answer questions.', proof: 'Close Agent · Command Center' },
  { n: 2, name: 'Intelligence + Human Expertise', line: 'Real-time insight, and a one-click handoff to a vetted expert with full context.', proof: 'Scenario Lab · Expert Network' },
  { n: 3, name: 'Open Developer Platform', line: 'Semantic APIs, Agent SDK, sandbox, evaluation and a marketplace to reach IES customers.', proof: 'Agent Studio · Test Lab · Publish' },
  { n: 4, name: 'Trust & Governance', line: 'Every action carries permissions, confidence, evidence, policy, approval and an audit trail.', proof: 'Trust Center · Audit Log' },
];

export const LAYERS = [
  { name: 'Experience', items: ['Finance', 'Accounting', 'Workforce', 'Commerce', 'Marketplace', 'Experts'] },
  { name: 'Agents', items: ['First-party agents', 'Third-party agents', 'Expert-in-the-loop'] },
  { name: 'Orchestration', items: ['Context', 'Planning', 'Tool use', 'Policies', 'Approvals', 'Evaluation'] },
  { name: 'Data / API', items: ['Finance', 'Workforce', 'Commerce', 'Customer', 'Events', 'Semantic layer'] },
  { name: 'Developer', items: ['APIs', 'Agent SDK', 'Sandbox', 'Agent Studio', 'Eval tools', 'Marketplace'] },
  { name: 'Trust', items: ['Identity', 'Permissions', 'Governance', 'Audit', 'Security', 'Evidence'] },
];

export const FLYWHEEL = [
  'More business usage',
  'Richer context',
  'Better agents',
  'More customer value',
  'More developers',
  'More specialized solutions',
  'Stronger ecosystem',
];

export const OPERATING_MODEL = [
  { zone: 'Autonomous', rule: 'Low risk + high confidence + within limits', examples: 'Bank-fee entries, clearing reclasses, recurring accruals, low-value reminders', color: 'ok' },
  { zone: 'AI prepares, human approves', rule: 'Medium risk, above limits, or policy-gated', examples: 'Intercompany true-ups, large accruals, vendor disputes, consolidation', color: 'warn' },
  { zone: 'Human / expert decides', rule: 'High risk, judgment calls, or low confidence', examples: 'Revenue recognition judgments, tax positions, unclear spend', color: 'risk' },
];

export const MONETIZATION = [
  { stream: 'Core platform subscription', how: 'IES tiers by entities & users', note: 'Existing model (details: research)', tag: 'Research' as SourceTag },
  { stream: 'AI / agent usage', how: 'Included agent credits per tier; metered beyond (e.g., per close task)', note: 'Illustrative', tag: 'Assumption' as SourceTag },
  { stream: 'API consumption', how: 'Free sandbox; production tiers by call volume; semantic APIs premium', note: 'Illustrative', tag: 'Assumption' as SourceTag },
  { stream: 'Marketplace revenue share', how: 'Illustrative 80/20 developer/Intuit split; lower for certified early partners', note: 'Illustrative', tag: 'Assumption' as SourceTag },
  { stream: 'Embedded expert services', how: 'Per-case or per-session fees with expert payout; context pack reduces expert time', note: 'Illustrative', tag: 'Assumption' as SourceTag },
];

export const DEV_INCENTIVES = [
  'Free sandbox with realistic multi-entity data',
  'Developer credits (illustrative: $500 of API + agent runtime)',
  'Onboarding to first API call in < 5 minutes (target)',
  'Semantic, AI-ready APIs + typed agent tool registry',
  'Agent SDK with built-in approvals, escalation and audit',
  'Marketplace distribution to IES customers',
  'Certification badge (AI evaluation + security)',
  'Analytics: installs, outcomes, override rate, revenue',
  'Co-selling & partner support for top agents',
];

export const COMPETITION = {
  note: 'Hypotheses only. No competitor facts are asserted; every row needs external validation before use.',
  competitors: ['NetSuite', 'SAP Business ByDesign', 'Workday', 'Emerging AI-native entrants'],
  axes: [
    { axis: 'Mid-market simplicity', hypothesis: 'IES can win on time-to-value and usability for companies graduating from small-business tools.', research: 'Implementation time & TCO benchmarks; win/loss interviews' },
    { axis: 'Unified data context', hypothesis: 'Finance + workforce + commerce in one data model gives agents richer context than bolt-on integrations.', research: 'Compare data-model breadth and native modules per competitor' },
    { axis: 'Agentic execution', hypothesis: 'Agents that execute within policy (not just copilots) are a step-change for close and collections.', research: 'Audit competitors’ current and announced agent capabilities' },
    { axis: 'Human + AI expertise', hypothesis: 'Embedded expert network with context handoff is hard to copy for ERP vendors without a services network.', research: 'Map competitors’ partner/advisor models and embedded services' },
    { axis: 'Developer ecosystem', hypothesis: 'An AI-ready API + SDK + marketplace aimed at mid-market ISVs can attract builders who find enterprise ecosystems heavy.', research: 'Developer surveys; marketplace sizes and rev-share terms' },
    { axis: 'Trust & governance', hypothesis: 'Visible, per-action evidence and policy controls can be the deciding factor for finance buyers adopting AI.', research: 'Buyer interviews on AI adoption blockers' },
  ],
};

export const ROADMAP = [
  { phase: 'Validate', horizon: '0–3 months', items: ['Customer discovery with 15–20 finance leaders + 10 ISVs', 'Prototype usability tests (this prototype)', 'Wizard-of-Oz Close Agent on 3 design partners', 'Define trust thresholds with controllers'] },
  { phase: 'MVP', horizon: '3–9 months', items: ['Close Agent (recs, accruals, anomalies) with Assist/Approve', 'Trust Center v1 + audit log', 'Core semantic APIs + sandbox', 'Agent Studio (private beta)'] },
  { phase: 'Expand', horizon: '9–18 months', items: ['Scenario Lab & cash forecasting', 'Compliance Agent', 'Expert Network context handoff', 'Marketplace GA with certification'] },
  { phase: 'Platform', horizon: '18+ months', items: ['Third-party ecosystem at scale', 'Multi-agent workflows across domains', 'Vertical solutions (distribution, services, nonprofit…)', 'Autopilot for proven workflows'] },
];

export const PRIORITIZATION = [
  { item: 'Close Agent (Assist/Approve)', impact: 5, leverage: 4, feasibility: 4, learning: 5 },
  { item: 'Trust Center + audit', impact: 4, leverage: 5, feasibility: 4, learning: 4 },
  { item: 'Semantic APIs + sandbox', impact: 3, leverage: 5, feasibility: 4, learning: 4 },
  { item: 'Agent Studio + Test Lab', impact: 3, leverage: 5, feasibility: 3, learning: 5 },
  { item: 'Scenario Lab', impact: 4, leverage: 3, feasibility: 4, learning: 3 },
  { item: 'Expert context handoff', impact: 4, leverage: 3, feasibility: 4, learning: 4 },
  { item: 'Marketplace GA', impact: 3, leverage: 5, feasibility: 3, learning: 3 },
  { item: 'Autopilot mode', impact: 5, leverage: 4, feasibility: 2, learning: 4 },
];

export const LOFAS = [
  { area: 'AI trust', assumption: 'Controllers will approve agent-prepared entries if evidence and policy are visible.', test: 'Prototype test with 8 controllers: approve/reject 20 agent items; measure time-to-decision and stated trust.', signal: '≥ 70% approve without re-deriving; decision < 60s median' },
  { area: 'Autonomous finance', assumption: 'Customers will enable Autopilot for low-risk, recurring tasks after a shadow period.', test: 'Shadow mode for 2 closes at 3 design partners, then offer Autopilot for low-risk items.', signal: '≥ 2 of 3 enable; override rate < 5%' },
  { area: 'Developer adoption', assumption: 'Semantic APIs + Agent SDK cut time-to-first-agent enough to attract ISVs.', test: 'Hackathon / private beta with 20 developers; instrument time to first call and first passing eval.', signal: 'First call < 5 min; first agent < 1 day for ≥ 60%' },
  { area: 'Marketplace economics', assumption: 'Customers will pay for certified third-party agents inside IES.', test: 'Fake-door listings + waitlist pricing test across 3 price models.', signal: '≥ 8% listing-to-waitlist conversion' },
  { area: 'Human + AI experts', assumption: 'A context pack lets experts resolve issues faster and customers value it enough to pay.', test: 'Concierge test: 20 escalations with vs. without context pack.', signal: '≥ 40% less expert time; CSAT ≥ 4.5' },
];

export const METRICS = [
  { group: 'Customer value', items: ['Agent task completion rate', 'Hours saved per close', 'Close-cycle reduction (days)', 'Forecast accuracy'] },
  { group: 'Trust', items: ['AI override rate', 'Escalation precision', 'Incidents per 10K actions', 'Share of actions with complete evidence'] },
  { group: 'Ecosystem', items: ['Developers onboarded', 'Active agents & apps', 'API usage', 'Marketplace installs'] },
  { group: 'Business', items: ['Ecosystem revenue', 'Expert-service attach rate', 'Net revenue retention (research)', 'Agent-usage revenue'] },
];

export const RISKS = [
  { risk: 'Hallucination', mitigation: 'Evidence-required actions, grounding in IES data, escalation when data is insufficient, eval gates.' },
  { risk: 'Financial accuracy', mitigation: 'Deterministic calculations for postings; AI proposes, ledger rules validate; back-testing of estimates.' },
  { risk: 'Autonomous actions', mitigation: 'Risk × confidence × amount policy engine, approval gates, reversible entries, kill switch.' },
  { risk: 'Compliance', mitigation: 'Complete audit log, SoD checks, data residency, exportable evidence for auditors.' },
  { risk: 'Liability', mitigation: 'Clear responsibility model: customer approves; experts licensed; terms for third-party agents (legal research needed).' },
  { risk: 'Third-party quality', mitigation: 'Certification, scope enforcement, runtime monitoring, incident process, delisting.' },
  { risk: 'Platform adoption', mitigation: 'Start with first-party agents that prove value; design partners; developer credits and co-selling.' },
  { risk: 'Competition', mitigation: 'Differentiate on unified context, trust UX and embedded experts; validate with win/loss research.' },
];
