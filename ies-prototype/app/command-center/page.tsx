'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Area, AreaChart, CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  Wallet, BookCheck, TrendingDown, Users, ShoppingBag, Landmark, ChevronDown, Check, Sparkles, ArrowUpRight, Play, Bot, FileSearch, Truck,
} from 'lucide-react';
import { useStore, useAgents } from '@/lib/store';
import { ACTIVITY_SEED, CASH_FORECAST, COMPANY, INSIGHTS, KPIS, MARGIN_BY_ENTITY, PEOPLE, type Insight } from '@/lib/data/company';
import { CLOSE_ITEMS, readiness } from '@/lib/data/close';
import { Badge, Button, Card, CardHeader, Confidence, Drawer, PageHeader, Dot, Hint } from '@/components/ui';
import { cn } from '@/lib/format';

const DOMAIN_ICON: Record<Insight['domain'], React.ElementType> = {
  Cash: Wallet,
  Close: BookCheck,
  Profitability: TrendingDown,
  Workforce: Users,
  Commerce: ShoppingBag,
  Compliance: Landmark,
};

export default function CommandCenter() {
  const { state, actions } = useStore();
  const agents = useAgents();
  const router = useRouter();
  const [marginOpen, setMarginOpen] = useState(false);
  const sprint = state.jobsDone.includes('collections-sprint');
  const ready = readiness(state.closeStatuses);
  const needs = CLOSE_ITEMS.filter((i) => ['awaiting_approval', 'escalated', 'recommended'].includes(state.closeStatuses[i.id])).length;
  const freightInstalled = state.installed.includes('freightaudit');
  const responded = state.expertCases.find((c) => c.status === 'responded');

  const insights = useMemo(() => {
    const list: Insight[] = INSIGHTS.map((i) =>
      i.id === 'close-status'
        ? {
            ...i,
            title:
              state.closeRun === 'idle'
                ? 'September close is 62% ready on day 3 — the Close Agent has work queued'
                : `September close is ${ready}% ready — ${needs ? `${needs} item${needs > 1 ? 's' : ''} need${needs > 1 ? '' : 's'} you` : 'no items waiting on you'}`,
          }
        : i,
    );
    if (freightInstalled) {
      list.splice(1, 0, {
        id: 'freight-found',
        domain: 'Profitability',
        severity: 'medium',
        title: 'FreightAudit AI found $23.4K of 3PL overbilling in September',
        body: '57 invoices include accessorial fees not in the rate card. 3 dispute drafts are ready for your approval — the agent will not send them without you.',
        agent: 'FreightAudit AI · Portside Analytics',
        confidence: 93,
        evidence: ['412 invoices matched to 3PL rate card', 'Accessorial codes not in contract: LIFTGATE, RESI-DLV', 'Recovered amounts credited against next invoice'],
        impact: '$23.4K recoverable · ≈ 0.7 pts of CA margin',
        actions: [{ kind: 'job', label: 'Approve 3 dispute drafts', jobId: 'freight-disputes', primary: true }],
      });
    }
    return list;
  }, [state.closeRun, ready, needs, freightInstalled]);

  const runAction = (a: Insight['actions'][number]) => {
    if (a.kind === 'nav') router.push(a.href);
    else if (a.kind === 'drawer') setMarginOpen(true);
    else actions.runJob(a.jobId);
  };

  const activity = [
    ...ACTIVITY_SEED,
    ...(sprint ? [{ t: '09:0' + 4, agent: 'Collections Agent', text: 'Sprint: 23 reminders queued · 4 approvals requested', tone: 'agent' }] : []),
    ...(state.closeRun !== 'idle' ? [{ t: '09:14', agent: 'Close Agent', text: state.closeRun === 'running' ? 'Running September close…' : `Close run complete · readiness ${ready}%`, tone: 'agent' }] : []),
    ...(freightInstalled ? [{ t: '09:22', agent: 'FreightAudit AI', text: 'Audited 412 invoices · $23.4K flagged', tone: 'warn' }] : []),
  ].reverse();

  return (
    <div>
      <PageHeader
        eyebrow={<><span>{COMPANY.demoDate}</span><span className="text-ink-4">·</span><span className="flex items-center gap-1.5 normal-case tracking-normal"><Dot tone="agent" pulse /> Agents worked overnight</span></>}
        title={`Good morning, ${PEOPLE.cfo.name.split(' ')[0]}`}
        subtitle="Your agents investigated overnight. Here is what changed, why it matters and what they can do about it — ranked by impact."
        right={
          <>
            <Button icon={<Sparkles className="h-4 w-4 text-agent-600" />} onClick={() => router.push('/scenarios')}>Ask a what-if</Button>
            <Button variant="primary" icon={<Play className="h-4 w-4" />} onClick={() => router.push('/close')}>Open September close</Button>
          </>
        }
      />

      {/* KPIs */}
      <div className="mb-6 grid grid-cols-5 gap-3">
        {KPIS.map((k, i) => (
          <motion.div key={k.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className="px-4 py-3.5">
              <div className="text-[12.5px] text-ink-3">{k.label}</div>
              <div className="mt-1 text-[22px] font-semibold tracking-tight tabular-nums">{k.id === 'low' && sprint ? '$4.51M' : k.value}</div>
              <div className={cn('mt-0.5 text-[12px] font-medium', k.id === 'low' && sprint ? 'text-ok-700' : k.tone === 'ok' ? 'text-ok-700' : k.tone === 'risk' ? 'text-risk-700' : k.tone === 'warn' ? 'text-warn-700' : 'text-ink-3')}>
                {k.id === 'low' && sprint ? 'Above covenant with sprint' : k.delta}
              </div>
              <div className="mt-0.5 text-[11.5px] text-ink-4">{k.sub}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_380px] gap-5">
        {/* Brief */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold">Agent brief <span className="font-normal text-ink-3">· {insights.length} items, ranked by impact</span></h2>
            <div className="flex items-center gap-2 text-[12px] text-ink-3">
              Every card shows <Badge tone="neutral">confidence</Badge><Badge tone="neutral">evidence</Badge><Badge tone="neutral">action</Badge>
            </div>
          </div>
          <div className="space-y-3">
            {insights.map((ins, i) => (
              <InsightCard key={ins.id} ins={ins} idx={i} done={state.jobsDone} onAction={runAction} />
            ))}
          </div>
        </div>

        {/* Right rail */}
        <div className="space-y-5">
          <Card>
            <CardHeader
              title="13-week cash forecast"
              subtitle={sprint ? 'With collections sprint (agent-projected)' : 'Consolidated · covenant floor $4.0M'}
              right={<Badge tone={sprint ? 'ok' : 'risk'} dot>{sprint ? 'Covenant safe' : 'Covenant risk'}</Badge>}
            />
            <div className="h-[190px] px-2 pb-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CASH_FORECAST} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="g-base" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5465F0" stopOpacity={0.18} />
                      <stop offset="100%" stopColor="#5465F0" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#EEF0F4" vertical={false} />
                  <XAxis dataKey="wk" tickLine={false} axisLine={false} interval={3} />
                  <YAxis domain={[3, 7.5]} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}M`} />
                  <Tooltip formatter={(v: number, n: string) => [`$${v.toFixed(2)}M`, n === 'base' ? 'Current path' : 'With sprint']} contentStyle={{ borderRadius: 10, border: '1px solid #E4E7EC', fontSize: 12 }} />
                  <ReferenceLine y={4} stroke="#F04438" strokeDasharray="4 4" label={{ value: 'Covenant $4.0M', position: 'insideBottomLeft', fontSize: 10.5, fill: '#B42318' }} />
                  <Area type="monotone" dataKey="base" stroke="#5465F0" strokeWidth={2} fill="url(#g-base)" />
                  {sprint && <Area type="monotone" dataKey="mitigated" stroke="#12B76A" strokeWidth={2} fill="none" strokeDasharray="0" />}
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {!sprint && (
              <div className="border-t border-line px-5 py-3">
                <Button size="sm" variant="agent" className="w-full" icon={<Bot className="h-4 w-4" />} onClick={() => actions.runJob('collections-sprint')}>
                  Let Collections Agent close the gap
                </Button>
              </div>
            )}
          </Card>

          <Card>
            <CardHeader title="Needs your decision" subtitle="Across all agents" />
            <div className="space-y-1 px-3 pb-3">
              <DecisionRow href="/close" label="Close items" value={state.closeRun === 'idle' ? 'Run pending' : `${needs} waiting`} tone={needs ? 'warn' : 'ok'} />
              <DecisionRow href="/experts" label="Expert cases" value={responded ? '1 response ready' : `${state.expertCases.filter((c) => c.status !== 'applied').length} open`} tone={responded ? 'warn' : 'neutral'} />
              <DecisionRow href="/command-center" label="Collections approvals (> $25K)" value={sprint ? '4 waiting' : '—'} tone={sprint ? 'warn' : 'neutral'} />
              <DecisionRow href="/compliance" label="Filings to approve" value="2 prepared" tone="warn" />
            </div>
          </Card>

          <Card>
            <CardHeader title="Live agent activity" subtitle={`${agents.filter((a) => !a.paused).length} agents · all actions logged`} right={<Link href="/audit" className="text-[12.5px] font-medium text-brand-600 hover:underline">Audit log</Link>} />
            <div className="max-h-[300px] space-y-0 overflow-y-auto scroll-thin px-5 pb-4">
              <AnimatePresence initial={false}>
                {activity.map((a, i) => (
                  <motion.div key={a.agent + a.t + i} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex gap-3 border-b border-line py-2.5 last:border-0">
                    <span className="mt-0.5 w-9 shrink-0 font-mono text-[11px] text-ink-4">{a.t}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-[12px] font-semibold text-ink-2">
                        <Dot tone={a.tone === 'ok' ? 'ok' : a.tone === 'warn' ? 'warn' : 'agent'} /> {a.agent}
                      </div>
                      <div className="text-[12.5px] text-ink-3">{a.text}</div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </Card>
        </div>
      </div>

      <MarginDrawer open={marginOpen} onClose={() => setMarginOpen(false)} />
    </div>
  );
}

function DecisionRow({ href, label, value, tone }: { href: string; label: string; value: string; tone: 'warn' | 'ok' | 'neutral' }) {
  return (
    <Link href={href} className="flex items-center justify-between rounded-lg px-2 py-2 text-[13px] hover:bg-slate-50">
      <span className="text-ink-2">{label}</span>
      <span className={cn('flex items-center gap-1 font-medium', tone === 'warn' ? 'text-warn-700' : tone === 'ok' ? 'text-ok-700' : 'text-ink-3')}>
        {value} <ArrowUpRight className="h-3.5 w-3.5 text-ink-4" />
      </span>
    </Link>
  );
}

function InsightCard({ ins, idx, done, onAction }: { ins: Insight; idx: number; done: string[]; onAction: (a: Insight['actions'][number]) => void }) {
  const [open, setOpen] = useState(false);
  const Icon = ins.id === 'freight-found' ? Truck : DOMAIN_ICON[ins.domain];
  const sev = ins.severity === 'high' ? 'border-l-risk-500' : ins.severity === 'medium' ? 'border-l-warn-500' : 'border-l-brand-400';
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}>
      <Card className={cn('border-l-[3px] p-4', sev)}>
        <div className="flex items-start gap-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-ink-2">
            <Icon className="h-[18px] w-[18px]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[11.5px] font-semibold uppercase tracking-wider text-ink-3">{ins.domain}</span>
              {ins.severity === 'high' && <Badge tone="risk">High impact</Badge>}
              {ins.id === 'freight-found' && <Badge tone="violet">Third-party agent</Badge>}
            </div>
            <div className="mt-0.5 text-[15px] font-semibold leading-snug text-ink">{ins.title}</div>
            <p className="mt-1 text-[13.5px] leading-relaxed text-ink-2">{ins.body}</p>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px]">
              <span className="flex items-center gap-1.5 text-ink-3"><Bot className="h-3.5 w-3.5" />{ins.agent}</span>
              <span className="flex items-center gap-2 text-ink-3">Confidence <Confidence value={ins.confidence} size="sm" /></span>
              <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1 font-medium text-ink-2 hover:text-ink">
                <FileSearch className="h-3.5 w-3.5" /> Evidence ({ins.evidence.length}) <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
              </button>
              <span className="text-ink-3">Impact: <span className="font-medium text-ink-2">{ins.impact}</span></span>
            </div>
            <AnimatePresence>
              {open && (
                <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-2.5 space-y-1 overflow-hidden rounded-lg bg-slate-50 px-3 py-2.5">
                  {ins.evidence.map((e) => (
                    <li key={e} className="flex gap-2 text-[12.5px] text-ink-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ok-600" />{e}</li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
          <div className="flex shrink-0 flex-col items-stretch gap-2">
            {ins.actions.map((a) => {
              const isDone = a.kind === 'job' && done.includes(a.jobId);
              return (
                <Button
                  key={a.label}
                  size="sm"
                  variant={isDone ? 'secondary' : a.primary ? (a.kind === 'job' ? 'agent' : 'primary') : 'secondary'}
                  icon={isDone ? <Check className="h-4 w-4 text-ok-600" /> : a.kind === 'job' ? <Bot className="h-4 w-4" /> : undefined}
                  disabled={isDone}
                  onClick={() => onAction(a)}
                >
                  {isDone ? 'Done — agent working' : a.label}
                </Button>
              );
            })}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function MarginDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const { actions } = useStore();
  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={600}
      badge={<><Badge tone="warn" dot>Profitability</Badge><Badge tone="neutral">Profitability Agent · 84% confidence</Badge></>}
      title="Canada gross margin −2.1 pts: what the agent found"
      subtitle="Drill-down generated from GL, 3PL invoices and order data."
      footer={
        <div className="flex justify-between gap-2">
          <Button onClick={() => { actions.openCase('covenant'); router.push('/experts'); }}>Ask an FP&A expert</Button>
          <Button variant="primary" onClick={() => router.push('/marketplace?focus=freightaudit')}>Find a freight audit agent</Button>
        </div>
      }
    >
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={MARGIN_BY_ENTITY} margin={{ top: 8, right: 10, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="#EEF0F4" vertical={false} />
            <XAxis dataKey="m" tickLine={false} axisLine={false} />
            <YAxis domain={[37, 43]} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ borderRadius: 10, border: '1px solid #E4E7EC', fontSize: 12 }} />
            <Line type="monotone" dataKey="US" stroke="#98A2B3" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="UK" stroke="#C7D2FE" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="CA" stroke="#D92D20" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex gap-4 text-[12px] text-ink-3">
        <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-risk-600" /> Canada</span>
        <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-ink-4" /> US</span>
        <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-brand-200" /> UK</span>
      </div>
      <h4 className="mb-2 mt-6 text-[13px] font-semibold">Variance bridge · Canada, Aug → Sep</h4>
      <div className="space-y-2">
        {[
          ['3PL base freight rate change', -1.3, 'New contract effective Sep 1'],
          ['Accessorial fees not in rate card', -0.9, '$38.1K across 58 invoices'],
          ['Product mix', 0.1, 'Order volume flat (+1.2%)'],
          ['Pricing', 0.0, 'No list-price changes'],
        ].map(([l, v, d]) => (
          <div key={l as string} className="flex items-center gap-3">
            <div className="w-[220px] text-[12.5px] text-ink-2">{l}<div className="text-[11.5px] text-ink-4">{d}</div></div>
            <div className="relative h-5 flex-1 rounded bg-slate-50">
              <div className="absolute left-1/2 top-0 h-full w-px bg-line" />
              <div className={cn('absolute top-0.5 h-4 rounded', (v as number) < 0 ? 'bg-risk-500/80' : 'bg-ok-500/80')} style={{ width: `${Math.abs(v as number) * 30}%`, left: (v as number) < 0 ? `${50 - Math.abs(v as number) * 30}%` : '50%' }} />
            </div>
            <div className={cn('w-14 text-right font-mono text-[12.5px]', (v as number) < 0 ? 'text-risk-700' : 'text-ink-3')}>{(v as number) > 0 ? '+' : ''}{(v as number).toFixed(1)} pts</div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Hint>No first-party agent audits 3PL invoices today. The marketplace has a certified third-party agent for this — installing it is governed by the Trust Center.</Hint>
      </div>
    </Drawer>
  );
}
