export interface DemoStep {
  id: string;
  title: string;
  route: string;
  role: 'business' | 'developer';
  minutes: string;
  say: string;
  doThis: string[];
  moment: string;
}

export const DEMO_STEPS: DemoStep[] = [
  {
    id: 'command',
    title: 'AI Command Center',
    route: '/command-center',
    role: 'business',
    minutes: '1.5 min',
    say: 'Maya, CFO of Cascadia Supply Group, starts her Monday. Instead of reports, agents have already investigated overnight and surfaced what needs her.',
    doThis: ['Point at the covenant risk card — confidence and evidence are visible', 'Click “Start collections sprint” — the forecast updates with the mitigated line', 'Note the live agent activity feed on the right'],
    moment: 'From reports to a system of action.',
  },
  {
    id: 'close',
    title: 'Financial Close Agent',
    route: '/close',
    role: 'business',
    minutes: '2 min',
    say: 'The flagship: the Close Agent runs reconciliation, intercompany, anomalies, accruals and consolidation — at the autonomy level the CFO chooses.',
    doThis: ['Set autonomy to Autopilot', 'Click “Run Close Agent” and watch Understand → Investigate → Decide → Act → Verify', 'Low-risk items auto-post; medium risk wait for approval; high risk escalates'],
    moment: 'Risk-based automation, not all-or-nothing AI.',
  },
  {
    id: 'approve',
    title: 'Human approval & evidence',
    route: '/close',
    role: 'business',
    minutes: '1.5 min',
    say: 'Open any item to see exactly what the agent found, the evidence, its confidence, the policy it hit and the audit trail.',
    doThis: ['Open the Intercompany FX item → Evidence and Policy tabs', 'Approve it — readiness rises and the audit log records it', 'Roll back an auto-posted item to show reversibility'],
    moment: 'Trust made visible in the UX.',
  },
  {
    id: 'scenario',
    title: 'Scenario Lab',
    route: '/scenarios',
    role: 'business',
    minutes: '1.5 min',
    say: 'Maya asks a plain-English question. The agent shows what it understood, runs base, downside and mitigated cases, and recommends actions.',
    doThis: ['Ask: “What if Q4 revenue drops 8% and customers pay 7 days slower?”', 'Toggle recommended levers and watch the covenant line', 'Open “How this was calculated”'],
    moment: 'Decision-ready insight in seconds, not weeks.',
  },
  {
    id: 'expert',
    title: 'Expert escalation',
    route: '/experts',
    role: 'business',
    minutes: '1.5 min',
    say: 'The $1.24M bill-and-hold question is a judgment call. The agent escalates with a complete context pack, so the expert never asks Maya to re-explain.',
    doThis: ['Review the auto-built context pack', 'Send to the top-matched CPA', 'Apply the expert’s guidance — the close item resolves'],
    moment: 'Human + AI, with zero re-explaining.',
  },
  {
    id: 'market',
    title: 'App + Agent Marketplace',
    route: '/marketplace',
    role: 'business',
    minutes: '1 min',
    say: 'The Canada margin issue has a certified third-party agent. Maya installs it with explicit permissions and an autonomy level.',
    doThis: ['Open FreightAudit AI', 'Review permissions → set autonomy → install', 'It now appears in Agent Workflows and the Trust Center'],
    moment: 'An ecosystem inside IES, governed by IES.',
  },
  {
    id: 'studio',
    title: 'Developer Agent Studio',
    route: '/developer/studio',
    role: 'developer',
    minutes: '1.5 min',
    say: 'Switch to Priya, a developer at Ledgerline Labs. She describes an agent in plain English and Studio generates the workflow, tools, permissions and guardrails.',
    doThis: ['Click “Generate agent from description”', 'Click the Approval gate node to inspect rules', 'Review guardrails — note one is off'],
    moment: 'From idea to governed agent in minutes.',
  },
  {
    id: 'test',
    title: 'Agent Test & Evaluation',
    route: '/developer/test',
    role: 'developer',
    minutes: '1.5 min',
    say: 'Before anything ships, the agent runs a sandbox evaluation suite, including adversarial and insufficient-data cases.',
    doThis: ['Run all tests — watch tool calls and policy checks', 'Open the insufficient-data case: it escalates instead of guessing', 'Fix the failing currency case with one click and re-run'],
    moment: 'Agents earn trust with evidence, not claims.',
  },
  {
    id: 'trust',
    title: 'Trust Center',
    route: '/trust',
    role: 'business',
    minutes: '1 min',
    say: 'Back to the business: every agent, first- or third-party, is governed in one place — permissions, autonomy, thresholds, quality and incidents.',
    doThis: ['Change the autonomy limit and see the risk matrix update', 'Pause an agent with the kill switch', 'Open the audit log — every action from this demo is there'],
    moment: 'Responsible AI as a product surface.',
  },
  {
    id: 'vision',
    title: 'The platform vision',
    route: '/vision',
    role: 'business',
    minutes: '1 min',
    say: 'IES Helm: one trusted operating layer connecting businesses, agents, experts and developers — powered by a flywheel of shared context.',
    doThis: ['Walk the six platform layers', 'Close on the flywheel and roadmap'],
    moment: 'From system of record to system of action.',
  },
];
