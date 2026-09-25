// FICTIONAL experts. Pricing is an ILLUSTRATIVE ASSUMPTION, not Intuit pricing.

export const EXPERTS = [
  {
    id: 'elena',
    name: 'Elena Varga, CPA',
    initials: 'EV',
    specialty: 'Technical accounting · Revenue recognition',
    years: 14,
    rating: 4.9,
    cases: 312,
    sla: 'Typically responds in < 2 hrs',
    price: '$240 per case',
    match: 97,
    tags: ['ASC 606', 'Bill-and-hold', 'Distribution'],
  },
  {
    id: 'marcus',
    name: 'Marcus Hale, CPA',
    initials: 'MH',
    specialty: 'Multi-state sales & use tax',
    years: 11,
    rating: 4.8,
    cases: 468,
    sla: 'Typically responds in < 4 hrs',
    price: '$180 per case',
    match: 71,
    tags: ['Nexus', 'Registrations', 'VAT/GST'],
  },
  {
    id: 'sofia',
    name: 'Sofia Lindqvist',
    initials: 'SL',
    specialty: 'FP&A · Fractional CFO',
    years: 16,
    rating: 4.9,
    cases: 201,
    sla: 'Typically responds same day',
    price: '$300 per session',
    match: 64,
    tags: ['Cash planning', 'Covenants', 'Board reporting'],
  },
  {
    id: 'rahul',
    name: 'Rahul Mehta, CPA',
    initials: 'RM',
    specialty: 'Audit readiness · Internal controls',
    years: 12,
    rating: 4.7,
    cases: 155,
    sla: 'Typically responds in < 1 day',
    price: '$220 per case',
    match: 58,
    tags: ['SOX-lite', 'SoD', 'Audit prep'],
  },
];

export interface ContextPack {
  id: string;
  title: string;
  specialty: string;
  expertId: string;
  origin: string;
  itemId?: string;
  question: string;
  facts: string[];
  aiAnalysis: string;
  aiConfidence: number;
  priorActions: string[];
  attachments: string[];
  response: { summary: string; body: string; steps: string[]; minutes: number; applyLabel: string };
}

export const CONTEXT_PACKS: Record<string, ContextPack> = {
  harborview: {
    id: 'harborview',
    title: 'Revenue cut-off · Harborview Hotels bill-and-hold ($1.24M)',
    specialty: 'Technical accounting · Revenue recognition',
    expertId: 'elena',
    origin: 'Close Agent · September close',
    itemId: 'rev-harbor',
    question:
      'Can Cascadia recognize $1.24M of revenue in September for the Harborview Hotels bill-and-hold order, or should it be deferred to October?',
    facts: [
      'Invoice INV-104233 issued Sep 29 for $1,240,000 (net 60); recognized in 4000 Revenue – Wholesale.',
      'Customer emailed Sep 14 asking Cascadia to hold goods until their hotel opening (Nov 12).',
      'Goods sat in general inventory through Sep 30; a segregated bin was assigned Oct 2.',
      'Goods are complete and ready for shipment; this is a custom order not sold to other customers.',
    ],
    aiAnalysis:
      'Three bill-and-hold indicators appear to be met (substantive customer reason, product ready, not redirectable). Separate identification before period end is not evidenced. The agent leans toward deferral, but this is a judgment about transfer of control.',
    aiConfidence: 61,
    priorActions: [
      'Close Agent flagged the item during cut-off testing',
      'Agent withheld posting — policy R-01 (material revenue judgment)',
      'Controller Daniel Ortiz notified',
    ],
    attachments: ['INV-104233.pdf', 'Harborview_hold_request.eml', 'Pick_ticket_PT-55821.pdf', 'Bin_assignment_log.csv', 'Revenue_policy_v4.pdf'],
    response: {
      summary: 'Defer to October.',
      body:
        'Thanks — the context pack had everything I needed. Three of the four bill-and-hold criteria are supported. The separate-identification criterion is not met at Sep 30: the pick ticket and bin log show the goods were only segregated on Oct 2. Defer the revenue and recognize it in October, once the arrangement meets all criteria.',
      steps: [
        'Move $1,240,000 from September revenue to Deferred Revenue',
        'Recognize in October — segregation evidence now exists (Oct 2)',
        'Add a “segregation date” check to the cut-off policy so the agent can decide this pattern next time',
      ],
      minutes: 38,
      applyLabel: 'Apply guidance to close',
    },
  },
  covenant: {
    id: 'covenant',
    title: 'Covenant headroom plan for Q4 downside',
    specialty: 'FP&A · Fractional CFO',
    expertId: 'sofia',
    origin: 'Scenario Lab',
    question: 'Is the AI-recommended mitigation plan enough to stay above the $4.0M minimum-cash covenant in a Q4 downside, and what should we tell the lender?',
    facts: [
      'Base 13-week low: $3.71M (week of Nov 30); covenant floor $4.0M.',
      'Downside: Q4 revenue −8% and DSO +7 days.',
      'Recommended levers: collections acceleration, targeted price increase, hiring delay, discretionary opex trim.',
    ],
    aiAnalysis: 'Collections acceleration contributes most of the headroom. Price increase carries volume risk. The plan clears the covenant in the modelled downside but with thin headroom.',
    aiConfidence: 78,
    priorActions: ['Scenario run by Maya Chen', 'Collections sprint available in Command Center'],
    attachments: ['Scenario_model.xlsx', '13_week_forecast.csv', 'Credit_agreement_excerpt.pdf'],
    response: {
      summary: 'Plan is sound — pre-brief the lender.',
      body:
        'The levers are reasonable and sequenced correctly. I would not rely on the price increase in Q4. Start collections now, pre-brief the lender with this scenario, and ask for a temporary covenant cushion as a backstop.',
      steps: ['Start the collections sprint this week', 'Share the downside + mitigation view with the lender', 'Revisit pricing after holiday peak'],
      minutes: 52,
      applyLabel: 'Save as board-ready plan',
    },
  },
  nexus: {
    id: 'nexus',
    title: 'Colorado economic nexus · registration',
    specialty: 'Multi-state sales & use tax',
    expertId: 'marcus',
    origin: 'Compliance Agent',
    question: 'We crossed the Colorado threshold on Sep 22. When must we register and start collecting, and do we have exposure on past sales?',
    facts: ['Trailing-12-month Colorado DTC sales: $104,200.', 'No Colorado registration on file.', 'Storefront tax settings currently do not collect CO tax.'],
    aiAnalysis: 'Threshold appears crossed based on trailing sales. Timing rules and local-jurisdiction requirements vary; needs a qualified review.',
    aiConfidence: 72,
    priorActions: ['Compliance Agent detected crossing', 'Registration packet drafted (not submitted)'],
    attachments: ['CO_sales_by_month.csv', 'Registration_packet_draft.pdf'],
    response: {
      summary: 'Register now; no look-back exposure expected.',
      body: 'Register this month and enable collection before the next period. Based on the monthly data, exposure is limited to sales after the crossing date; I would confirm local jurisdiction set-up during registration.',
      steps: ['Submit the drafted registration', 'Enable CO collection in Storefront Sync', 'Add CO to the filing calendar'],
      minutes: 24,
      applyLabel: 'Approve registration plan',
    },
  },
};

export const PAST_CASES = [
  { id: 'past-1', title: 'UK VAT treatment of cross-border B2B samples', expert: 'Marcus Hale, CPA', outcome: 'Resolved in 3h · guidance applied', date: 'Aug 21' },
  { id: 'past-2', title: 'Covenant headroom review before Q3 board meeting', expert: 'Sofia Lindqvist', outcome: 'Resolved in 1 day · plan adopted', date: 'Jul 30' },
];
