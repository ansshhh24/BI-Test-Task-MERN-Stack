// Deterministic scenario engine for the Scenario Lab.
// Baseline is FICTIONAL. Model mechanics (loaded cost per hire, price elasticity, etc.) are ILLUSTRATIVE ASSUMPTIONS.

export const MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
const BASE_REV = [12.6, 14.1, 15.8, 10.2, 10.6, 11.9, 12.3, 12.8, 13.1, 12.7, 12.9, 13.2]; // $M
const INVENTORY_WC = [-1.65, -1.3, 1.1, 1.4, 0.5, 0.2, 0, -0.3, -0.4, -0.2, 0, 0]; // $M working-capital swing
const PRIOR_REV = 12.9;
const GM = 0.408;
const PAYROLL = 2.95; // $M / month
const OTHER_OPEX = 1.62; // $M / month
const DEBT_CAPEX = 0.28;
const LOADED_COST_PER_HIRE = 0.0085; // $M / month (assumption)
const PLANNED_HIRES = [6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const BASE_DSO = 48;
const CREDIT_SHARE = 0.64; // wholesale share of revenue sold on terms (DTC is paid at checkout)
export const START_CASH = 6.82;
export const COVENANT = 4.0;
const ELASTICITY = 0.6; // share of a price increase lost to volume (assumption)

export interface Levers {
  revenuePct: number; // change in revenue, %
  revenueScope: 'q4' | 'year';
  costPct: number; // change in non-payroll opex, %
  hires: number; // + adds hires, − delays planned hires
  pricePct: number; // price change, %
  dsoDays: number; // change in DSO, days
}

export const ZERO: Levers = { revenuePct: 0, revenueScope: 'year', costPct: 0, hires: 0, pricePct: 0, dsoDays: 0 };

export interface ScenarioResult {
  cash: number[];
  ebitda: number[];
  revenue: number[];
  minCash: number;
  minMonth: string;
  breach: boolean;
  ebitdaYear: number;
  revenueYear: number;
  endCash: number;
}

export function runScenario(l: Levers): ScenarioResult {
  let cash = START_CASH;
  let prevAR = (PRIOR_REV * CREDIT_SHARE * BASE_DSO) / 30.4;
  const out: ScenarioResult = { cash: [], ebitda: [], revenue: [], minCash: Infinity, minMonth: '', breach: false, ebitdaYear: 0, revenueYear: 0, endCash: 0 };
  let cumHires = 0;
  const hireDelta = l.hires; // spread across Q4 like the plan
  MONTHS.forEach((m, i) => {
    const revShock = l.revenueScope === 'q4' && i > 2 ? 0 : l.revenuePct / 100;
    const priceEffect = (l.pricePct / 100) * (1 - ELASTICITY);
    const rev = BASE_REV[i] * (1 + revShock) * (1 + priceEffect);
    // price increases flow mostly to margin
    const gm = GM + (l.pricePct / 100) * 0.55;
    if (i < 3) cumHires += PLANNED_HIRES[i] + hireDelta / 3;
    const payroll = PAYROLL + Math.max(0, cumHires) * LOADED_COST_PER_HIRE;
    const opex = payroll + OTHER_OPEX * (1 + l.costPct / 100);
    const ebitda = rev * gm - opex;
    // DSO change phases in over 2 months
    const dso = BASE_DSO + l.dsoDays * Math.min(1, (i + 1) / 2);
    const ar = (rev * CREDIT_SHARE * dso) / 30.4;
    const cfo = ebitda - (ar - prevAR) + INVENTORY_WC[i] - DEBT_CAPEX;
    prevAR = ar;
    cash += cfo;
    out.cash.push(round(cash));
    out.ebitda.push(round(ebitda));
    out.revenue.push(round(rev));
    if (cash < out.minCash) {
      out.minCash = round(cash);
      out.minMonth = m;
    }
  });
  out.breach = out.minCash < COVENANT;
  out.ebitdaYear = round(out.ebitda.reduce((a, b) => a + b, 0));
  out.revenueYear = round(out.revenue.reduce((a, b) => a + b, 0));
  out.endCash = out.cash[out.cash.length - 1];
  return out;
}

const round = (n: number) => Math.round(n * 100) / 100;

export function combine(a: Levers, b: Levers): Levers {
  return {
    revenuePct: a.revenuePct + b.revenuePct,
    revenueScope: a.revenueScope === 'q4' && b.revenuePct === 0 ? 'q4' : a.revenueScope,
    costPct: a.costPct + b.costPct,
    hires: a.hires + b.hires,
    pricePct: a.pricePct + b.pricePct,
    dsoDays: a.dsoDays + b.dsoDays,
  };
}

export interface ParsedQuestion {
  shock: Levers;
  mitigation: Levers;
  chips: string[];
  understood: boolean;
}

/** Deterministic natural-language parser: extracts business drivers from a CFO's question. */
export function parseQuestion(q: string): ParsedQuestion {
  const s = q.toLowerCase();
  const shock: Levers = { ...ZERO };
  const mitigation: Levers = { ...ZERO };
  const chips: string[] = [];
  const num = (re: RegExp) => {
    const m = s.match(re);
    return m ? parseFloat(m[1]) : null;
  };

  const revDown = num(/revenue[^%\d]{0,30}?(?:drop|drops|fall|falls|decline|declines|down|decrease|decreases|shrink|shrinks)[^%\d]{0,12}(\d+(?:\.\d+)?)\s*%/) ?? num(/(\d+(?:\.\d+)?)\s*%\s*(?:drop|decline|decrease|fall)\s*in\s*revenue/);
  const revUp = num(/revenue[^%\d]{0,30}?(?:grow|grows|rise|rises|up|increase|increases)[^%\d]{0,12}(\d+(?:\.\d+)?)\s*%/);
  if (revDown !== null) shock.revenuePct = -revDown;
  if (revUp !== null) shock.revenuePct = revUp;
  if (/\bq4\b|holiday|this quarter/.test(s)) shock.revenueScope = 'q4';
  if (shock.revenuePct !== 0) chips.push(`Revenue ${shock.revenuePct > 0 ? '+' : '−'}${Math.abs(shock.revenuePct)}% · ${shock.revenueScope === 'q4' ? 'Q4 only' : 'next 12 months'}`);

  const slower = num(/(?:pay|paying|collections?|dso)[^\d]{0,30}?(\d+)\s*days?\s*(?:slower|later|late|longer)/) ?? num(/(\d+)\s*days?\s*(?:slower|later|late)/);
  const faster = num(/(\d+)\s*days?\s*faster/);
  if (slower !== null) shock.dsoDays = /largest customer/.test(s) ? Math.round(slower / 4) : slower;
  if (faster !== null) mitigation.dsoDays = -faster;
  if (shock.dsoDays) chips.push(`DSO +${shock.dsoDays} days${/largest customer/.test(s) ? ' (largest customer ≈ 25% of AR)' : ''}`);
  if (mitigation.dsoDays) chips.push(`DSO −${Math.abs(mitigation.dsoDays)} days`);

  const hiresN = num(/(\d+)\s*(?:new\s+|warehouse\s+|planned\s+)*hires?/);
  if (hiresN !== null) {
    if (/delay|freeze|pause|postpone|defer|cut/.test(s)) {
      mitigation.hires = -hiresN;
      chips.push(`Delay ${hiresN} planned hires`);
    } else {
      shock.hires = hiresN;
      chips.push(`Add ${hiresN} hires`);
    }
  }

  const price = num(/(?:price|prices|pricing)[^%\d]{0,20}?(\d+(?:\.\d+)?)\s*%/) ?? num(/(\d+(?:\.\d+)?)\s*%\s*price/);
  if (price !== null) {
    const neg = /(cut|lower|reduce|discount)[^.]{0,20}price/.test(s);
    if (neg) shock.pricePct = -price;
    else mitigation.pricePct = price;
    chips.push(`Price ${neg ? '−' : '+'}${price}%`);
  }

  const cost = num(/(?:cost|costs|opex|spend|freight)[^%\d]{0,20}?(?:rise|rises|up|increase|increases|grow|jump|jumps)?[^%\d]{0,10}(\d+(?:\.\d+)?)\s*%/);
  if (cost !== null && price === null) {
    const down = /(cut|reduce|lower)[^.]{0,20}(cost|opex|spend)/.test(s);
    if (down) mitigation.costPct = -cost;
    else shock.costPct = cost;
    chips.push(`Operating costs ${down ? '−' : '+'}${cost}%`);
  } else if (cost !== null && price !== null && /(cost|opex|freight)[^.]{0,15}(rise|up|increase)/.test(s)) {
    shock.costPct = cost;
    chips.push(`Operating costs +${cost}%`);
  }

  const understood = chips.length > 0;
  if (!understood) {
    shock.revenuePct = -5;
    chips.push('Revenue −5% (standard stress — no specific drivers detected)');
  }
  return { shock, mitigation, chips, understood };
}

/** AI-recommended mitigation levers (deterministic defaults). */
export const RECOMMENDED_MITIGATION: Levers = { revenuePct: 0, revenueScope: 'year', costPct: -3, hires: -10, pricePct: 2, dsoDays: -6 };

export const SUGGESTED_QUESTIONS = [
  'What if Q4 revenue drops 8% and customers pay 7 days slower?',
  'What if we delay 12 hires and raise prices 2%?',
  'What if freight costs rise 10% and our largest customer pays 30 days late?',
];

export function leverImpacts(downside: Levers, mitigation: Levers) {
  const base = runScenario(downside).minCash;
  const items: { key: keyof Levers; label: string; value: number; delta: number; owner: string }[] = [];
  const push = (key: keyof Levers, label: string, owner: string) => {
    const v = mitigation[key] as number;
    if (!v) return;
    const l = { ...downside, [key]: (downside[key] as number) + v } as Levers;
    items.push({ key, label, value: v, delta: round(runScenario(l).minCash - base), owner });
  };
  push('dsoDays', `Accelerate collections (−${Math.abs(mitigation.dsoDays)} days DSO)`, 'Collections Agent');
  push('hires', `Delay ${Math.abs(mitigation.hires)} Q4 hires to Q1`, 'Headcount plan');
  push('pricePct', `Targeted price increase +${mitigation.pricePct}%`, 'Commercial team');
  push('costPct', `Trim discretionary opex −${Math.abs(mitigation.costPct)}%`, 'Spend Agent');
  return items.sort((a, b) => b.delta - a.delta);
}
