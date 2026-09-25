'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Sparkles, ArrowRight, Loader2, Check, Calculator, Save, Users, Bot, Database, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useStore } from '@/lib/store';
import {
  COVENANT, MONTHS, RECOMMENDED_MITIGATION, SUGGESTED_QUESTIONS, ZERO, combine, leverImpacts, parseQuestion, runScenario, type Levers, type ParsedQuestion,
} from '@/lib/data/scenarios';
import { Assumption, Badge, Button, Card, CardHeader, Drawer, PageHeader, Toggle, Hint } from '@/components/ui';
import { cn, millions } from '@/lib/format';

const THINK = ['Understanding your question', 'Pulling plan, AR aging, payroll and open POs', 'Running base, downside and mitigated cases', 'Ranking mitigation levers'];

export default function ScenarioLab() {
  const router = useRouter();
  const { state, actions } = useStore();
  const [q, setQ] = useState('');
  const [asked, setAsked] = useState<string | null>(null);
  const [phase, setPhase] = useState(-1);
  const [parsed, setParsed] = useState<ParsedQuestion | null>(null);
  const [enabled, setEnabled] = useState<Record<string, boolean>>({ dsoDays: true, hires: true, pricePct: true, costPct: true });
  const [howOpen, setHowOpen] = useState(false);

  const ask = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setQ(t);
    setAsked(t);
    setParsed(null);
    setPhase(0);
    THINK.forEach((_, i) => setTimeout(() => setPhase(i + 1), 380 * (i + 1)));
    setTimeout(() => {
      setParsed(parseQuestion(t));
      setPhase(99);
    }, 380 * (THINK.length + 1));
  };

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('q');
    if (p) ask(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const model = useMemo(() => {
    if (!parsed) return null;
    const scenarioLevers = combine(parsed.shock, parsed.mitigation);
    const mit: Levers = { ...ZERO };
    (Object.keys(enabled) as (keyof Levers)[]).forEach((k) => {
      if (enabled[k]) (mit[k] as number) = RECOMMENDED_MITIGATION[k] as number;
    });
    const base = runScenario(ZERO);
    const down = runScenario(scenarioLevers);
    const mitigated = runScenario(combine(scenarioLevers, mit));
    const impacts = leverImpacts(scenarioLevers, RECOMMENDED_MITIGATION);
    const series = MONTHS.map((m, i) => ({ m, base: base.cash[i], down: down.cash[i], mit: mitigated.cash[i] }));
    const q = (arr: number[]) => [0, 1, 2, 3].map((k) => Math.round(arr.slice(k * 3, k * 3 + 3).reduce((a, b) => a + b, 0) * 100) / 100);
    const bq = q(base.ebitda), dq = q(down.ebitda), mq = q(mitigated.ebitda);
    const quarters = ['Q4 FY26', 'Q1', 'Q2', 'Q3'].map((name, i) => ({ name, base: bq[i], down: dq[i], mit: mq[i] }));
    const isDownside = down.minCash < base.minCash - 0.01;
    return { base, down, mitigated, impacts, series, quarters, isDownside };
  }, [parsed, enabled]);

  const thinking = phase >= 0 && phase < 99;

  return (
    <div>
      <PageHeader
        eyebrow={<>Pillar 2 · Intelligence + human expertise</>}
        title="Scenario Lab"
        subtitle="Ask a business question in plain English. The Forecast Agent shows what it understood, builds base, downside and mitigated cases from live IES data, and recommends what to do."
      />

      <Card className="mb-5 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(q);
          }}
          className="flex items-center gap-3"
        >
          <div className="flex h-12 flex-1 items-center gap-3 rounded-xl border border-line bg-slate-50 px-4 focus-within:border-brand-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-50">
            <Sparkles className="h-5 w-5 text-agent-600" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="What if Q4 revenue drops 8% and customers pay 7 days slower?" className="flex-1 bg-transparent text-[15px] text-ink placeholder:text-ink-4 focus:outline-none" />
          </div>
          <Button variant="primary" size="lg" type="submit" loading={thinking} icon={<ArrowRight className="h-4 w-4" />}>Run scenario</Button>
        </form>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[12px] text-ink-3">Try:</span>
          {SUGGESTED_QUESTIONS.map((s) => (
            <button key={s} onClick={() => ask(s)} className="rounded-full border border-line bg-white px-3 py-1 text-[12.5px] text-ink-2 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700">
              {s}
            </button>
          ))}
        </div>
      </Card>

      {!asked && (
        <div className="grid grid-cols-3 gap-4">
          {[
            ['Understand', 'Parses drivers — revenue, cost, hiring, pricing, collections — and shows you what it understood before it calculates.'],
            ['Calculate', 'Runs a deterministic driver model on your plan, AR, payroll and POs. Numbers are reproducible, not generated.'],
            ['Recommend', 'Ranks levers by impact on your covenant, and can hand work to agents or an FP&A expert.'],
          ].map(([t, d], i) => (
            <Card key={t} className="p-5">
              <div className="text-[11.5px] font-semibold uppercase tracking-wider text-ink-4">Step {i + 1}</div>
              <div className="mt-1 text-[15px] font-semibold">{t}</div>
              <div className="mt-1 text-[13px] text-ink-3">{d}</div>
            </Card>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {thinking && (
          <motion.div key="think" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card className="p-6">
              <div className="mb-3 text-[13px] text-ink-3">“{asked}”</div>
              <div className="space-y-2.5">
                {THINK.map((t, i) => (
                  <div key={t} className={cn('flex items-center gap-2.5 text-[13.5px]', phase > i ? 'text-ink' : phase === i ? 'text-ink-2' : 'text-ink-4')}>
                    {phase > i ? <Check className="h-4 w-4 text-ok-600" /> : phase === i ? <Loader2 className="h-4 w-4 animate-spin text-agent-600" /> : <span className="h-4 w-4 rounded-full border border-line" />}
                    {t}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {parsed && model && (
          <motion.div key={asked} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            {/* Understood */}
            <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-agent-100 bg-agent-50/60 px-4 py-2.5">
              <Bot className="h-4 w-4 text-agent-600" />
              <span className="text-[13px] font-medium text-agent-700">I understood:</span>
              {parsed.chips.map((c) => (
                <span key={c} className="rounded-md border border-agent-100 bg-white px-2 py-0.5 text-[12.5px] font-medium text-ink-2">{c}</span>
              ))}
              <span className="ml-auto flex items-center gap-1.5 text-[12px] text-ink-3"><Database className="h-3.5 w-3.5" /> FY plan · AR aging · payroll · open POs · credit agreement</span>
            </div>
            {!parsed.understood && <div className="mb-4"><Hint>I couldn’t find specific drivers in that question, so I applied a standard stress. Try naming revenue, costs, hires, prices or payment timing.</Hint></div>}

            {/* Scenario cards */}
            <div className="mb-5 grid grid-cols-3 gap-4">
              <ScenarioCard name="Base case" sub="Current plan & run-rate" r={model.base} color="#5465F0" />
              <ScenarioCard name={model.isDownside ? 'Downside' : 'Your scenario'} sub={parsed.chips.slice(0, 2).join(' · ')} r={model.down} color="#D92D20" />
              <ScenarioCard name="Mitigated" sub="Your scenario + recommended levers" r={model.mitigated} color="#12B76A" highlight />
            </div>

            <div className="grid grid-cols-[1fr_380px] gap-5">
              <div className="space-y-5">
                <Card>
                  <CardHeader
                    title="Month-end cash · next 12 months"
                    subtitle="Consolidated, $M"
                    right={<Button size="sm" variant="ghost" icon={<Calculator className="h-4 w-4" />} onClick={() => setHowOpen(true)}>How this was calculated</Button>}
                  />
                  <div className="h-[290px] px-3 pb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={model.series} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                        <CartesianGrid stroke="#EEF0F4" vertical={false} />
                        <XAxis dataKey="m" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}M`} domain={['auto', 'auto']} />
                        <Tooltip formatter={(v: number, n: string) => [millions(v), n === 'base' ? 'Base' : n === 'down' ? (model.isDownside ? 'Downside' : 'Your scenario') : 'Mitigated']} contentStyle={{ borderRadius: 10, border: '1px solid #E4E7EC', fontSize: 12 }} />
                        <ReferenceLine y={COVENANT} stroke="#F04438" strokeDasharray="4 4" label={{ value: 'Min-cash covenant $4.0M', position: 'insideTopLeft', fontSize: 11, fill: '#B42318' }} />
                        <Line type="monotone" dataKey="base" stroke="#5465F0" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="down" stroke="#D92D20" strokeWidth={2} dot={false} strokeDasharray="5 4" />
                        <Line type="monotone" dataKey="mit" stroke="#12B76A" strokeWidth={2.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
                <Card>
                  <CardHeader title="EBITDA by quarter" subtitle="$M · fiscal quarters from October" />
                  <div className="h-[210px] px-3 pb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={model.quarters} margin={{ top: 4, right: 16, left: -10, bottom: 0 }} barGap={3}>
                        <CartesianGrid stroke="#EEF0F4" vertical={false} />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}M`} />
                        <Tooltip formatter={(v: number) => millions(v)} contentStyle={{ borderRadius: 10, border: '1px solid #E4E7EC', fontSize: 12 }} />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} formatter={(v) => (v === 'base' ? 'Base' : v === 'down' ? (model.isDownside ? 'Downside' : 'Your scenario') : 'Mitigated')} />
                        <Bar dataKey="base" fill="#A5B4FC" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="down" fill="#FDA29B" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="mit" fill="#12B76A" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              <div className="space-y-5">
                <Card>
                  <CardHeader title="Recommended actions" subtitle="Ranked by effect on the cash low point" right={<Badge tone="agent">Forecast Agent</Badge>} />
                  <div className="space-y-2 px-4 pb-4">
                    {model.impacts.map((l) => (
                      <div key={l.key} className={cn('rounded-xl border p-3 transition-colors', enabled[l.key] ? 'border-ok-100 bg-ok-50/40' : 'border-line')}>
                        <div className="flex items-start gap-3">
                          <Toggle on={enabled[l.key]} onChange={(v) => setEnabled((e) => ({ ...e, [l.key]: v }))} label={l.label} />
                          <div className="min-w-0 flex-1">
                            <div className="text-[13px] font-medium text-ink">{l.label}</div>
                            <div className="text-[11.5px] text-ink-3">Owner: {l.owner}</div>
                          </div>
                          <div className="text-right font-mono text-[12.5px] font-semibold text-ok-700">+{millions(l.delta)}</div>
                        </div>
                      </div>
                    ))}
                    <div className={cn('mt-3 flex items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-medium', model.mitigated.breach ? 'bg-risk-50 text-risk-700' : 'bg-ok-50 text-ok-700')}>
                      {model.mitigated.breach ? <AlertTriangle className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                      {model.mitigated.breach ? `Still ${millions(COVENANT - model.mitigated.minCash)} below covenant — talk to an expert and your lender.` : `Clears the covenant with ${millions(model.mitigated.minCash - COVENANT)} headroom.`}
                    </div>
                  </div>
                  <div className="space-y-2 border-t border-line px-4 py-3.5">
                    <Button variant="agent" className="w-full" icon={state.jobsDone.includes('collections-sprint') ? <Check className="h-4 w-4" /> : <Bot className="h-4 w-4" />} disabled={state.jobsDone.includes('collections-sprint')} onClick={() => actions.runJob('collections-sprint')}>
                      {state.jobsDone.includes('collections-sprint') ? 'Collections sprint running' : 'Hand collections to the agent'}
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button icon={<Users className="h-4 w-4" />} onClick={() => { actions.openCase('covenant'); router.push('/experts'); }}>Ask FP&A expert</Button>
                      <Button
                        icon={<Save className="h-4 w-4" />}
                        onClick={() => {
                          actions.audit({ actor: 'Maya Chen (CFO)', actorType: 'human', action: 'Saved scenario', target: asked ?? '', approval: 'N/A', evidence: `Min cash: base ${millions(model.base.minCash)}, downside ${millions(model.down.minCash)}, mitigated ${millions(model.mitigated.minCash)}` });
                          actions.toast('Scenario saved', 'Shared with Tom Reyes (FP&A). Versioned in the audit log.');
                        }}
                      >
                        Save & share
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Drawer open={howOpen} onClose={() => setHowOpen(false)} title="How this was calculated" subtitle="Deterministic driver model — every number is reproducible." width={560}>
        <div className="space-y-4 text-[13px] text-ink-2">
          <div className="rounded-xl border border-line p-4 font-mono text-[12px] leading-relaxed">
            cash[m] = cash[m−1] + EBITDA[m] − ΔAR[m] + ΔInventory[m] − debt&capex
            <br />EBITDA = revenue × gross margin − payroll − other opex
            <br />AR = revenue × credit share × DSO / 30.4
          </div>
          <div>
            <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-ink-3">Data used (fictional)</div>
            <ul className="space-y-1.5">
              <li>• FY plan revenue by month with holiday seasonality ($152M / yr)</li>
              <li>• Gross margin 40.8% (September actual)</li>
              <li>• Payroll $2.95M / month + 18 planned Q4 hires</li>
              <li>• DSO 48 days; opening cash $6.82M</li>
              <li>• Q4 inventory working-capital swing from open POs</li>
            </ul>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-ink-3">Model assumptions <Assumption /></div>
            <ul className="space-y-1.5">
              <li>• Loaded cost per hire: $8.5K / month</li>
              <li>• 64% of revenue sold on credit terms (wholesale); DTC paid at checkout</li>
              <li>• Price elasticity: 60% of a price increase lost to volume; 55% flows to margin</li>
              <li>• DSO changes phase in over 2 months</li>
            </ul>
          </div>
          <Hint>Language understanding is used only to extract drivers. All calculations are deterministic, so the same question always yields the same answer — and an auditor can re-perform it.</Hint>
        </div>
      </Drawer>
    </div>
  );
}

function ScenarioCard({ name, sub, r, color, highlight }: { name: string; sub: string; r: ReturnType<typeof runScenario>; color: string; highlight?: boolean }) {
  return (
    <Card className={cn('p-4', highlight && 'ring-2 ring-ok-100')}>
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
        <span className="text-[14px] font-semibold">{name}</span>
        <Badge tone={r.breach ? 'risk' : 'ok'} className="ml-auto" dot>{r.breach ? 'Covenant breach' : 'Covenant safe'}</Badge>
      </div>
      <div className="mt-0.5 truncate text-[12px] text-ink-3">{sub}</div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div>
          <div className="text-[11.5px] text-ink-3">Cash low</div>
          <div className={cn('text-[18px] font-semibold tabular-nums', r.breach ? 'text-risk-700' : 'text-ink')}>{millions(r.minCash)}</div>
          <div className="text-[11px] text-ink-4">{r.minMonth}</div>
        </div>
        <div>
          <div className="text-[11.5px] text-ink-3">12-mo EBITDA</div>
          <div className="text-[18px] font-semibold tabular-nums">{millions(r.ebitdaYear)}</div>
        </div>
        <div>
          <div className="text-[11.5px] text-ink-3">12-mo revenue</div>
          <div className="text-[18px] font-semibold tabular-nums">${r.revenueYear.toFixed(1)}M</div>
        </div>
      </div>
    </Card>
  );
}
