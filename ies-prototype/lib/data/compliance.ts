// FICTIONAL compliance data. Tax thresholds and rules are ILLUSTRATIVE — real rules must come from a
// maintained tax content source and be verified by a qualified professional.

export const FILINGS = [
  { id: 'f1', name: 'US sales & use tax · 14 states', entity: 'US', due: 'Oct 20', status: 'Prepared', autonomy: 'Approve', owner: 'Compliance Agent' },
  { id: 'f2', name: 'Canada GST/HST return (Q3)', entity: 'CA', due: 'Oct 31', status: 'Prepared', autonomy: 'Approve', owner: 'Compliance Agent' },
  { id: 'f3', name: 'UK VAT return (Jul–Sep)', entity: 'UK', due: 'Nov 7', status: 'Data collection', autonomy: 'Approve', owner: 'Compliance Agent' },
  { id: 'f4', name: 'Payroll tax deposits', entity: 'US', due: 'Oct 15', status: 'Scheduled', autonomy: 'Autopilot', owner: 'Payroll' },
  { id: 'f5', name: '1099 vendor readiness', entity: 'US', due: 'Jan 31', status: '92% of W-9s on file', autonomy: 'Assist', owner: 'Compliance Agent' },
];

export const NEXUS = [
  { state: 'Colorado', sales: 104200, threshold: 100000, status: 'crossed' },
  { state: 'Arizona', sales: 88400, threshold: 100000, status: 'watch' },
  { state: 'Georgia', sales: 71800, threshold: 100000, status: 'watch' },
  { state: 'Tennessee', sales: 42100, threshold: 100000, status: 'ok' },
  { state: 'Minnesota', sales: 38900, threshold: 100000, status: 'ok' },
];

export const CONTROLS = [
  { id: 'c1', name: 'Segregation of duties — vendor create vs. payment approve', result: '2 conflicts', tone: 'risk', detail: 'Two AP users can both create vendors and approve payments.' },
  { id: 'c2', name: 'Journal entry approval above $50K', result: '100% compliant', tone: 'ok', detail: '41 of 41 entries had an approver different from the preparer.' },
  { id: 'c3', name: 'Bank detail changes verified', result: '100% compliant', tone: 'ok', detail: '6 vendor bank changes, all call-back verified.' },
  { id: 'c4', name: 'Agent actions logged with evidence', result: '100% compliant', tone: 'ok', detail: '4,076 agent actions in September, each with evidence and policy reference.' },
];
