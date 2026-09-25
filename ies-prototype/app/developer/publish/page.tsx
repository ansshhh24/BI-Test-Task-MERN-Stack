'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Check, Loader2, ShieldCheck, Rocket, Boxes, FlaskConical, BadgeDollarSign, Store, TrendingUp, Lock, Star, BadgeCheck, HandCoins, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { DEV_ANALYTICS, PRICING_MODELS, PUBLISH_CHECKS, TEST_CASES } from '@/lib/data/developer';
import { DEV_AGENT_LISTING } from '@/lib/data/marketplace';
import { Assumption, Badge, Button, Card, CardHeader, PageHeader, Hint } from '@/components/ui';
import { cn } from '@/lib/format';

export default function Publish() {
  const { state, actions } = useStore();
  const built = state.studio.generated;
  const tested = state.tests.run === 'done' && TEST_CASES.every((t) => state.tests.results[t.id] !== 'fail');
  const certified = state.publish.checks === 'passed';
  const priced = !!state.publish.pricing;
  const published = state.publish.published;
  const model = PRICING_MODELS.find((p) => p.id === state.publish.pricing)!;

  const stages = [
    { label: 'Build', done: built, icon: Boxes },
    { label: 'Test', done: tested, icon: FlaskConical },
    { label: 'Security & AI evaluation', done: certified, icon: ShieldCheck },
    { label: 'Pricing', done: priced && certified, icon: BadgeDollarSign },
    { label: 'Publish', done: published, icon: Rocket },
    { label: 'Reach customers & earn', done: published, icon: TrendingUp },
  ];

  return (
    <div>
      <PageHeader
        eyebrow={<>Developer experience · Publish & Monetize</>}
        title="Ship Cash Recovery Agent"
        subtitle="Certification proves to finance buyers that your agent is safe. Then choose a business model and publish to IES customers — billing, metering and payouts are handled by the platform."
      />

      {/* Pipeline */}
      <Card className="mb-5 px-6 py-5">
        <div className="flex items-center">
          {stages.map((s, i) => (
            <React.Fragment key={s.label}>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors', s.done ? 'border-ok-500 bg-ok-500 text-white' : 'border-line bg-white text-ink-3')}>
                  {s.done ? <Check className="h-5 w-5" /> : <s.icon className="h-[18px] w-[18px]" />}
                </div>
                <span className={cn('max-w-[110px] text-[12px] leading-tight', s.done ? 'font-semibold text-ink' : 'text-ink-3')}>{s.label}</span>
              </div>
              {i < stages.length - 1 && <div className={cn('mx-2 mb-6 h-0.5 flex-1 rounded', s.done && stages[i + 1].done ? 'bg-ok-500' : s.done ? 'bg-gradient-to-r from-ok-500 to-line' : 'bg-line')} />}
            </React.Fragment>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-[1fr_400px] gap-5">
        <div className="space-y-5">
          {/* Certification */}
          <Card>
            <CardHeader title="Security & AI certification" subtitle="Automated review; results shown to customers as the “IES Certified” badge" icon={<ShieldCheck className="h-4 w-4" />}
              right={
                <Button size="sm" variant="primary" disabled={!tested || state.publish.checks !== 'idle'} loading={state.publish.checks === 'running'} onClick={actions.runPublishChecks}>
                  {certified ? 'Certified' : 'Run certification'}
                </Button>
              }
            />
            <div className="space-y-2 px-5 pb-5">
              {!tested && <Hint>Certification requires a passing evaluation run. <Link href="/developer/test" className="font-medium text-brand-600 underline">Open Test Lab</Link></Hint>}
              {PUBLISH_CHECKS.map((c, i) => {
                const st = certified ? 'pass' : state.publish.checks === 'running' ? (i < 2 ? 'pass' : 'run') : 'idle';
                return (
                  <motion.div key={c.id} className="flex items-center gap-3 rounded-xl border border-line px-3 py-2.5">
                    {st === 'pass' ? <Check className="h-4 w-4 text-ok-600" /> : st === 'run' ? <Loader2 className="h-4 w-4 animate-spin text-agent-600" /> : <span className="h-4 w-4 rounded-full border border-line" />}
                    <div className="flex-1">
                      <div className="text-[13px] font-medium">{c.label}</div>
                      <div className="text-[11.5px] text-ink-3">{c.detail}</div>
                    </div>
                    {st === 'pass' && <Badge tone="ok">Pass</Badge>}
                  </motion.div>
                );
              })}
            </div>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader title="Business model" subtitle="Metered and billed through the customer’s IES invoice" icon={<BadgeDollarSign className="h-4 w-4" />} right={<Assumption>All prices illustrative</Assumption>} />
            <div className="grid grid-cols-2 gap-3 px-5 pb-4">
              {PRICING_MODELS.map((p) => (
                <button key={p.id} disabled={published} onClick={() => actions.publish({ pricing: p.id })} className={cn('rounded-xl border p-3.5 text-left transition-all disabled:cursor-not-allowed', state.publish.pricing === p.id ? 'border-brand-500 ring-4 ring-brand-50' : 'border-line hover:border-slate-300')}>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-semibold">{p.name}</span>
                    {state.publish.pricing === p.id && <Check className="h-4 w-4 text-brand-600" />}
                  </div>
                  <div className="mt-0.5 text-[13px] text-ink-2">{p.price}</div>
                  <div className="mt-1 text-[11.5px] text-ink-3">{p.note}</div>
                  <div className="mt-2 text-[12px] text-ink-2">Est. month-6 revenue: <b>{p.est ? `$${p.est}K` : '$0'}</b></div>
                </button>
              ))}
            </div>
            <div className="mx-5 mb-5 grid grid-cols-3 gap-3 rounded-xl bg-slate-50 p-3.5 text-[12.5px]">
              <div><div className="text-ink-3">Revenue share</div><div className="font-semibold">80% developer / 20% Intuit</div></div>
              <div><div className="text-ink-3">Early-partner rate (first 12 mo)</div><div className="font-semibold">90% / 10%</div></div>
              <div><div className="text-ink-3">Payouts</div><div className="font-semibold">Monthly, net-30</div></div>
              <div className="col-span-3 flex items-center gap-1.5 text-[11.5px] text-ink-3"><Assumption /> Revenue-share figures are prototype assumptions for discussion, not Intuit terms.</div>
            </div>
          </Card>
        </div>

        {/* Listing preview + publish */}
        <div className="space-y-5">
          <Card>
            <CardHeader title="Listing preview" subtitle="How IES customers will see it" icon={<Store className="h-4 w-4" />} />
            <div className="px-5 pb-5">
              <div className="rounded-xl border border-line p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ background: DEV_AGENT_LISTING.color }}><HandCoins className="h-5 w-5" /></div>
                  <div className="flex-1">
                    <div className="text-[14.5px] font-semibold">{DEV_AGENT_LISTING.name}</div>
                    <div className="flex items-center gap-1 text-[12px] text-ink-3">Ledgerline Labs <BadgeCheck className="h-3.5 w-3.5 text-brand-600" /></div>
                  </div>
                  <Badge tone="agent">New</Badge>
                </div>
                <p className="mt-2 text-[13px] text-ink-2">{DEV_AGENT_LISTING.tagline}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Badge tone="agent">AI Agent</Badge>
                  {certified ? <Badge tone="brand"><ShieldCheck className="h-3 w-3" />Certified</Badge> : <Badge tone="warn">Certification pending</Badge>}
                  <Badge><Lock className="h-3 w-3" />Read / draft only</Badge>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-[12px]">
                  <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-warn-500 text-warn-500" />New</span>
                  <span className="font-medium">{model.price}</span>
                </div>
              </div>
              {published ? (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 rounded-xl bg-ok-50 px-3 py-2.5 text-[13px] font-medium text-ok-700"><Check className="h-4 w-4" /> Live in the IES Marketplace</div>
                  <Link href="/marketplace"><Button className="w-full" icon={<ArrowRight className="h-4 w-4" />}>View in Marketplace</Button></Link>
                  <Link href="/developer/analytics"><Button variant="ghost" className="w-full">Open Developer Analytics</Button></Link>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  className="mt-4 w-full"
                  icon={<Rocket className="h-4 w-4" />}
                  disabled={!certified}
                  onClick={() => {
                    actions.publish({ published: true });
                    actions.toast('Published to the IES Marketplace', 'Cash Recovery Agent is now discoverable by IES customers.', 'ok');
                  }}
                >
                  Publish to marketplace
                </Button>
              )}
              {!certified && !published && <div className="mt-2 text-center text-[12px] text-ink-3">Complete testing and certification to publish.</div>}
            </div>
          </Card>

          <Card>
            <CardHeader title="Projected revenue" subtitle={`${model.name} · first 6 months`} right={<Assumption />} />
            <div className="h-[170px] px-2 pb-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DEV_ANALYTICS.revenue.map((r) => ({ ...r, gross: +(r.gross * (model.est / 18.4 || 0)).toFixed(1), net: +(r.net * (model.est / 18.4 || 0)).toFixed(1) }))} margin={{ top: 6, right: 12, left: -18, bottom: 0 }}>
                  <CartesianGrid stroke="#EEF0F4" vertical={false} />
                  <XAxis dataKey="m" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}K`} />
                  <Tooltip formatter={(v: number, n: string) => [`$${v}K`, n === 'gross' ? 'Gross' : 'Developer net']} contentStyle={{ borderRadius: 10, border: '1px solid #E4E7EC', fontSize: 12 }} />
                  <Area type="monotone" dataKey="gross" stroke="#A5B4FC" fill="#EEF2FF" strokeWidth={2} />
                  <Area type="monotone" dataKey="net" stroke="#14A38B" fill="#CCFBEF" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
