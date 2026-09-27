'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Briefcase, Code2, Target, Flag, FlaskConical, Gauge, AlertTriangle, Coins, Swords, Layers, Map, Scale, Sparkles, UserCheck, ShieldAlert, Quote, Compass } from 'lucide-react';
import {
  COMPETITION, DEV_INCENTIVES, LOFAS, METRICS, MONETIZATION, OPERATING_MODEL, PILLARS, PRIORITIZATION, PROBLEMS, RISKS, ROADMAP, VISION,
} from '@/lib/data/strategy';
import { Badge, Card, PageHeader, SourceTag } from '@/components/ui';
import { Flywheel } from '@/components/ai/Flywheel';
import { cn } from '@/lib/format';

const NAV = [
  ['problem', 'Problem'], ['vision', 'Vision'], ['pillars', 'Pillars'], ['model', 'Human + AI model'], ['flywheel', 'Flywheel'], ['business', 'Business model'],
  ['competition', 'Competition'], ['roadmap', 'Roadmap'], ['priorities', 'Prioritization'], ['lofas', 'LOFAs'], ['metrics', 'Metrics'], ['risks', 'Risks'],
];

export default function Strategy() {
  return (
    <div>
      <PageHeader
        eyebrow={<>Case Study Mode</>}
        title="Orbit — product strategy"
        subtitle="The reasoning behind the prototype: the customer problem, the vision, how we would build and prove it, and how we would know it is working."
      />
      <div className="mb-3 flex flex-wrap items-center gap-3 text-[12px] text-ink-3">
        Legend: <SourceTag tag="Case" /> stated in the Intuit case brief · <SourceTag tag="Assumption" /> prototype assumption · <SourceTag tag="Research" /> requires external validation
      </div>
      <div className="sticky top-0 z-10 -mx-2 mb-6 flex flex-wrap gap-1.5 bg-canvas/90 px-2 py-2 backdrop-blur">
        {NAV.map(([id, l]) => (
          <a key={id} href={`#${id}`} className="rounded-full border border-line bg-white px-3 py-1 text-[12.5px] text-ink-2 hover:border-slate-300 hover:text-ink">{l}</a>
        ))}
      </div>

      <div className="space-y-12">
        {/* Problem */}
        <Section id="problem" icon={Target} title="Customer problem" kicker="Empathize & define">
          <div className="grid grid-cols-2 gap-5">
            {([['finance', Briefcase, 'Mid-market finance leaders'], ['developer', Code2, 'Developers & ISVs']] as const).map(([k, Icon, title]) => {
              const p = PROBLEMS[k];
              return (
                <Card key={k} className="p-5">
                  <div className="flex items-center gap-2"><Icon className="h-5 w-5 text-brand-600" /><span className="text-[16px] font-semibold">{title}</span></div>
                  <div className="mt-1 text-[12.5px] text-ink-3">{p.who} <SourceTag tag="Case" /></div>
                  <div className="mt-4 space-y-2">
                    {p.pains.map((x) => (
                      <div key={x.text} className="flex items-start justify-between gap-3 text-[13px] text-ink-2"><span>• {x.text}</span><SourceTag tag={x.tag} /></div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-xl bg-slate-50 p-3.5">
                    <Quote className="h-4 w-4 text-ink-4" />
                    <div className="mt-1 text-[13.5px] italic text-ink">{p.quote}</div>
                    <div className="mt-1.5 text-[11px] text-ink-4">{p.quoteNote}</div>
                  </div>
                  <div className="mt-3 text-[12.5px]"><span className="font-semibold">How it feels: </span><span className="text-ink-2">{p.feel}</span></div>
                </Card>
              );
            })}
          </div>
          <Card className="mt-5 grid grid-cols-2 gap-6 p-5">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wider text-ink-3">Ideal state — finance leader</div>
              <div className="mt-1 text-[14px] text-ink">“My agents close the books, flag what matters and prepare the decision. I approve what’s material, call an expert when it’s a judgment, and I can prove every number.”</div>
            </div>
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wider text-ink-3">Ideal state — developer</div>
              <div className="mt-1 text-[14px] text-ink">“I get rich business context through one API, a sandbox that behaves like a real company, a way to prove my agent is safe, and customers who can buy it in one click.”</div>
            </div>
            <div className="col-span-2 text-[11px] text-ink-4">Ideal-state statements are hypotheses written in the customer’s voice; they must be validated in discovery interviews (see LOFAs). <SourceTag tag="Research" /></div>
          </Card>
        </Section>

        {/* Vision */}
        <Section id="vision" icon={Compass} title="Vision" kicker="Where IES goes">
          <Card className="bg-ink p-8 text-white">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">From system of record → system of action</div>
            <div className="mt-3 max-w-4xl text-[22px] font-medium leading-snug">{VISION}</div>
          </Card>
        </Section>

        {/* Pillars */}
        <Section id="pillars" icon={Layers} title="Strategic pillars">
          <div className="grid grid-cols-4 gap-4">
            {PILLARS.map((p) => (
              <Card key={p.n} className="p-5">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-4">Pillar {p.n}</div>
                <div className="mt-1 text-[16px] font-semibold">{p.name}</div>
                <div className="mt-1.5 text-[13px] text-ink-2">{p.line}</div>
                <div className="mt-3 text-[12px] text-brand-700">In prototype: {p.proof}</div>
              </Card>
            ))}
          </div>
        </Section>

        {/* Operating model */}
        <Section id="model" icon={Scale} title="Human + AI operating model" kicker="Where agents automate, assist, and when experts step in">
          <div className="grid grid-cols-3 gap-4">
            {OPERATING_MODEL.map((o) => {
              const I = o.color === 'ok' ? Sparkles : o.color === 'warn' ? UserCheck : ShieldAlert;
              return (
                <Card key={o.zone} className={cn('p-5', o.color === 'ok' ? 'border-agent-100' : o.color === 'warn' ? 'border-warn-100' : 'border-risk-100')}>
                  <I className={cn('h-5 w-5', o.color === 'ok' ? 'text-agent-600' : o.color === 'warn' ? 'text-warn-600' : 'text-risk-600')} />
                  <div className="mt-2 text-[15px] font-semibold">{o.zone}</div>
                  <div className="text-[12.5px] font-medium text-ink-2">{o.rule}</div>
                  <div className="mt-2 text-[12.5px] text-ink-3">{o.examples}</div>
                </Card>
              );
            })}
          </div>
          <div className="mt-3 text-[13px] text-ink-2">Trust, accuracy and liability: calculations are deterministic; AI proposes and explains; the customer (or a licensed expert) remains the decision-maker for material judgments; every action is evidenced, reversible where possible, and exportable for auditors. <Link href="/trust" className="font-medium text-brand-600">See Trust Center →</Link></div>
        </Section>

        {/* Flywheel */}
        <Section id="flywheel" icon={Sparkles} title="Platform flywheel">
          <Card className="flex items-center gap-10 p-6">
            <Flywheel size={440} />
            <div className="max-w-md space-y-3 text-[13.5px] text-ink-2">
              <p>Every close, forecast and approval enriches the shared business context. Better context makes first-party and third-party agents more accurate, which earns them more autonomy and delivers more value.</p>
              <p>Value attracts customers; customers attract developers; developers build specialized agents (verticals, niches) that Intuit would never build alone — which brings more usage back into IES.</p>
              <p className="text-[12.5px] text-ink-3">The moat is not the model — it is trusted context + governance + distribution.</p>
            </div>
          </Card>
        </Section>

        {/* Business */}
        <Section id="business" icon={Coins} title="Business & ecosystem model">
          <div className="grid grid-cols-[1.4fr_1fr] gap-5">
            <Card>
              <table className="w-full text-[13px]">
                <thead className="border-b border-line text-left text-[11.5px] uppercase tracking-wider text-ink-3"><tr><th className="px-5 py-2.5 font-medium">Revenue stream</th><th className="px-3 py-2.5 font-medium">How</th><th className="px-5 py-2.5 font-medium">Status</th></tr></thead>
                <tbody>
                  {MONETIZATION.map((m) => (
                    <tr key={m.stream} className="border-b border-line last:border-0"><td className="px-5 py-3 font-medium">{m.stream}</td><td className="px-3 py-3 text-ink-2">{m.how}</td><td className="px-5 py-3"><SourceTag tag={m.tag} /></td></tr>
                  ))}
                </tbody>
              </table>
            </Card>
            <Card className="p-5">
              <div className="text-[14px] font-semibold">Developer & advisor incentives</div>
              <ul className="mt-2 space-y-1.5">
                {DEV_INCENTIVES.map((d) => <li key={d} className="text-[12.5px] text-ink-2">• {d}</li>)}
              </ul>
              <div className="mt-3 text-[12px] text-ink-3">Advisors (accountants, consultants) join the Expert Network and can publish expert services and agents; they earn per case and through client installs. <SourceTag tag="Assumption" /></div>
            </Card>
          </div>
        </Section>

        {/* Competition */}
        <Section id="competition" icon={Swords} title="Competitive hypothesis framework" kicker={COMPETITION.note}>
          <Card>
            <table className="w-full text-[13px]">
              <thead className="border-b border-line text-left text-[11.5px] uppercase tracking-wider text-ink-3">
                <tr><th className="px-5 py-2.5 font-medium">Differentiation axis</th><th className="px-3 py-2.5 font-medium">Hypothesis for Orbit</th><th className="px-3 py-2.5 font-medium">Research needed</th>{COMPETITION.competitors.map((c) => <th key={c} className="px-2 py-2.5 text-center font-medium">{c}</th>)}</tr>
              </thead>
              <tbody>
                {COMPETITION.axes.map((a) => (
                  <tr key={a.axis} className="border-b border-line last:border-0 align-top">
                    <td className="px-5 py-3 font-medium">{a.axis}</td>
                    <td className="px-3 py-3 text-ink-2">{a.hypothesis}</td>
                    <td className="px-3 py-3 text-[12px] text-ink-3">{a.research}</td>
                    {COMPETITION.competitors.map((c) => <td key={c} className="px-2 py-3 text-center"><Badge tone="warn">?</Badge></td>)}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-line px-5 py-3 text-[12px] text-ink-3">“?” = not assessed. Competitor capabilities must be filled from primary research (product docs, analyst reports, win/loss interviews) before any claim is made. <SourceTag tag="Research" /></div>
          </Card>
        </Section>

        {/* Roadmap */}
        <Section id="roadmap" icon={Map} title="Roadmap" kicker="Phased: validate → MVP → expand → platform">
          <div className="grid grid-cols-4 gap-4">
            {ROADMAP.map((r, i) => (
              <Card key={r.phase} className={cn('p-5', i === 1 && 'ring-2 ring-brand-100')}>
                <div className="flex items-center justify-between"><span className="text-[16px] font-semibold">{r.phase}</span>{i === 1 && <Badge tone="brand">MVP</Badge>}</div>
                <div className="text-[12px] text-ink-3">{r.horizon} <SourceTag tag="Assumption" /></div>
                <ul className="mt-3 space-y-1.5">{r.items.map((x) => <li key={x} className="text-[12.5px] text-ink-2">• {x}</li>)}</ul>
              </Card>
            ))}
          </div>
          <div className="mt-3 text-[13px] text-ink-2">Why this order: start where pain is sharpest and value is measurable (the close), build trust infrastructure once and reuse it for every agent, then open the platform when there is proof and demand for third parties.</div>
        </Section>

        {/* Prioritization */}
        <Section id="priorities" icon={Flag} title="Prioritization" kicker="Scored 1–5 on customer impact, platform leverage, feasibility, learning value">
          <Card>
            <table className="w-full text-[13px]">
              <thead className="border-b border-line text-left text-[11.5px] uppercase tracking-wider text-ink-3"><tr><th className="px-5 py-2.5 font-medium">Initiative</th>{['Customer impact', 'Platform leverage', 'Feasibility', 'Learning value', 'Total'].map((h) => <th key={h} className="px-3 py-2.5 text-center font-medium">{h}</th>)}</tr></thead>
              <tbody>
                {[...PRIORITIZATION].map((p) => ({ ...p, total: p.impact + p.leverage + p.feasibility + p.learning })).sort((a, b) => b.total - a.total).map((p) => (
                  <tr key={p.item} className="border-b border-line last:border-0">
                    <td className="px-5 py-2.5 font-medium">{p.item}</td>
                    {[p.impact, p.leverage, p.feasibility, p.learning].map((v, i) => (
                      <td key={i} className="px-3 py-2.5 text-center"><span className={cn('inline-flex h-6 w-6 items-center justify-center rounded-md text-[12px] font-semibold', v >= 5 ? 'bg-ok-100 text-ok-700' : v >= 4 ? 'bg-ok-50 text-ok-700' : v >= 3 ? 'bg-slate-100 text-ink-2' : 'bg-warn-50 text-warn-700')}>{v}</span></td>
                    ))}
                    <td className="px-3 py-2.5 text-center font-semibold">{p.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-line px-5 py-3 text-[12px] text-ink-3">Scores are the author’s judgment for discussion. <SourceTag tag="Assumption" /> Autopilot scores high on impact but low on feasibility — it is earned per workflow after Assist/Approve prove accuracy.</div>
          </Card>
        </Section>

        {/* LOFAs */}
        <Section id="lofas" icon={FlaskConical} title="Riskiest assumptions (LOFAs) & experiments">
          <div className="grid grid-cols-1 gap-3">
            {LOFAS.map((l) => (
              <Card key={l.area} className="grid grid-cols-[160px_1.2fr_1.4fr_1fr] gap-4 p-4 text-[13px]">
                <div className="font-semibold">{l.area}</div>
                <div><div className="text-[11px] uppercase tracking-wider text-ink-4">Assumption</div><div className="text-ink-2">{l.assumption}</div></div>
                <div><div className="text-[11px] uppercase tracking-wider text-ink-4">Fastest test</div><div className="text-ink-2">{l.test}</div></div>
                <div><div className="text-[11px] uppercase tracking-wider text-ink-4">Success signal</div><div className="text-ink-2">{l.signal}</div></div>
              </Card>
            ))}
          </div>
        </Section>

        {/* Metrics */}
        <Section id="metrics" icon={Gauge} title="Metrics for success">
          <div className="grid grid-cols-4 gap-4">
            {METRICS.map((m) => (
              <Card key={m.group} className="p-5">
                <div className="text-[14px] font-semibold">{m.group}</div>
                <ul className="mt-2 space-y-1.5">{m.items.map((x) => <li key={x} className="text-[12.5px] text-ink-2">• {x}</li>)}</ul>
              </Card>
            ))}
          </div>
          <div className="mt-3 text-[13px] text-ink-2"><b>North star:</b> hours of finance work completed by agents with evidence and without override, per customer per month. <SourceTag tag="Assumption" /></div>
        </Section>

        {/* Risks */}
        <Section id="risks" icon={AlertTriangle} title="Risks & trade-offs">
          <div className="grid grid-cols-2 gap-3">
            {RISKS.map((r) => (
              <Card key={r.risk} className="flex gap-4 p-4">
                <div className="w-[140px] shrink-0 text-[13.5px] font-semibold">{r.risk}</div>
                <div className="text-[13px] text-ink-2">{r.mitigation}</div>
              </Card>
            ))}
          </div>
          <Card className="mt-4 p-5 text-[13px] text-ink-2">
            <b>Key trade-offs.</b> Speed vs. trust: we default to Approve and earn Autopilot per workflow. Openness vs. quality: certification slows marketplace growth but protects the brand. Breadth vs. depth: one flagship workflow (close) done deeply before many shallow agents.
          </Card>
        </Section>

        <Card className="flex items-center justify-between p-5">
          <div>
            <div className="text-[15px] font-semibold">See it working</div>
            <div className="text-[13px] text-ink-3">Every section above maps to a working screen in this prototype.</div>
          </div>
          <Link href="/vision" className="flex items-center gap-1 text-[13.5px] font-medium text-brand-600">Platform vision <ArrowRight className="h-4 w-4" /></Link>
        </Card>
      </div>
    </div>
  );
}

function Section({ id, icon: Icon, title, kicker, children }: { id: string; icon: React.ElementType; title: string; kicker?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-16">
      <div className="mb-4">
        <div className="flex items-center gap-2"><Icon className="h-5 w-5 text-brand-600" /><h2 className="text-[20px] font-semibold tracking-tight">{title}</h2></div>
        {kicker && <div className="mt-0.5 text-[13px] text-ink-3">{kicker}</div>}
      </div>
      {children}
    </section>
  );
}
