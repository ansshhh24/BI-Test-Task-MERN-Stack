'use client';

import React from 'react';
import Link from 'next/link';
import { Rocket, KeyRound, Database, Boxes, FlaskConical, BadgeDollarSign, Copy, Check, ArrowRight, BookOpen, Coins, Zap, Wrench, RefreshCcw } from 'lucide-react';
import { useStore } from '@/lib/store';
import { API_GROUPS, DEV_ANALYTICS, ONBOARDING_STEPS, TEST_CASES } from '@/lib/data/developer';
import { DEV_INCENTIVES } from '@/lib/data/strategy';
import { Assumption, Badge, Button, Card, CardHeader, PageHeader, Hint } from '@/components/ui';
import { PEOPLE } from '@/lib/data/company';
import { cn } from '@/lib/format';

export default function DevConsole() {
  const { state, actions } = useStore();
  const done = state.onboardingDone.length;
  const testsPassed = state.tests.run === 'done' && TEST_CASES.every((t) => state.tests.results[t.id] !== 'fail');
  const stages = [
    { label: 'Build', done: state.studio.generated, href: '/developer/studio', icon: Boxes },
    { label: 'Test', done: testsPassed, href: '/developer/test', icon: FlaskConical },
    { label: 'Certify', done: state.publish.checks === 'passed', href: '/developer/publish', icon: Check },
    { label: 'Publish', done: state.publish.published, href: '/developer/publish', icon: BadgeDollarSign },
  ];
  const endpoints = API_GROUPS.reduce((a, g) => a + g.endpoints.length, 0);

  return (
    <div>
      <PageHeader
        eyebrow={<>Developer experience · Pillar 3</>}
        title={`Welcome back, ${PEOPLE.dev.name.split(' ')[0]}`}
        subtitle="Build AI agents and apps on IES data, test them in a realistic sandbox, pass certification, and reach mid-market customers through the marketplace."
        right={<Link href="/developer/studio"><Button variant="primary" icon={<Boxes className="h-4 w-4" />}>Open Agent Studio</Button></Link>}
      />

      <div className="grid grid-cols-3 gap-5">
        <Card className="col-span-2">
          <CardHeader title="Your agent: Cash Recovery Agent" subtitle={`v0.${state.studio.version} · built with IES Agent SDK`} right={<Badge tone={state.publish.published ? 'ok' : 'neutral'}>{state.publish.published ? 'Live in marketplace' : 'In development'}</Badge>} />
          <div className="grid grid-cols-4 gap-3 px-5 pb-5">
            {stages.map((s, i) => (
              <Link key={s.label} href={s.href} className={cn('group rounded-xl border p-3.5 transition-colors', s.done ? 'border-ok-100 bg-ok-50/50' : 'border-line hover:border-slate-300')}>
                <div className="flex items-center justify-between">
                  <span className="text-[11.5px] font-semibold uppercase tracking-wider text-ink-3">Step {i + 1}</span>
                  {s.done ? <Check className="h-4 w-4 text-ok-600" /> : <ArrowRight className="h-4 w-4 text-ink-4 group-hover:text-ink-2" />}
                </div>
                <div className="mt-1 flex items-center gap-2 text-[15px] font-semibold"><s.icon className="h-4 w-4 text-ink-3" />{s.label}</div>
                <div className="text-[12px] text-ink-3">{s.done ? 'Complete' : 'Next up'}</div>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Getting started" subtitle={`${done} of ${ONBOARDING_STEPS.length} steps`} icon={<Rocket className="h-4 w-4" />} />
          <div className="px-5 pb-5">
            <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-agent-500 transition-all" style={{ width: `${(done / ONBOARDING_STEPS.length) * 100}%` }} /></div>
            <div className="mt-3 space-y-1.5">
              {ONBOARDING_STEPS.map((s) => (
                <div key={s.id} className="flex items-center gap-2 text-[12.5px]">
                  {state.onboardingDone.includes(s.id) ? <Check className="h-3.5 w-3.5 text-ok-600" /> : <span className="h-3.5 w-3.5 rounded-full border border-line" />}
                  <span className={state.onboardingDone.includes(s.id) ? 'text-ink-3 line-through' : 'text-ink'}>{s.title}</span>
                </div>
              ))}
            </div>
            <Link href="/developer/onboarding"><Button size="sm" className="mt-4 w-full">Continue onboarding</Button></Link>
          </div>
        </Card>

        <Card>
          <CardHeader title="Sandbox company" icon={<Database className="h-4 w-4" />} right={<Badge tone="ok" dot>Healthy</Badge>} />
          <div className="space-y-2 px-5 pb-5 text-[12.5px] text-ink-2">
            <div className="font-semibold text-ink">Cascadia Sandbox (synthetic)</div>
            <div>3 entities · USD/CAD/GBP · 24 months of history</div>
            <div>41k invoices · 640 employees · 180k orders</div>
            <div className="text-ink-3">Deterministic seed — tests are reproducible.</div>
            <Button size="sm" icon={<RefreshCcw className="h-3.5 w-3.5" />} onClick={() => actions.toast('Sandbox reset', 'Synthetic data restored to seed 2026-09.', 'info')}>Reset sandbox</Button>
          </div>
        </Card>

        <Card>
          <CardHeader title="Credentials" icon={<KeyRound className="h-4 w-4" />} />
          <div className="space-y-3 px-5 pb-5">
            {[
              ['Sandbox API key', 'ies_sbx_4f2a••••••••c91e'],
              ['OAuth client ID', 'll-cash-recovery-dev'],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-[11.5px] text-ink-3">{k}</div>
                <div className="mt-0.5 flex items-center justify-between rounded-lg border border-line bg-slate-50 px-2.5 py-1.5 font-mono text-[12px]">
                  {v}
                  <button onClick={() => actions.toast('Copied', `${k} copied (sandbox only)`, 'info')} className="text-ink-4 hover:text-ink-2" aria-label="Copy"><Copy className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            ))}
            <div className="text-[11.5px] text-ink-3">Scopes: ar.invoices:read · customers.profile:read · ar.reminders:draft · agents:*</div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Developer credits" icon={<Coins className="h-4 w-4" />} right={<Assumption />} />
          <div className="px-5 pb-5">
            <div className="text-[24px] font-semibold tabular-nums">$412 <span className="text-[13px] font-normal text-ink-3">of $500 left</span></div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-[82%] rounded-full bg-brand-500" /></div>
            <div className="mt-3 space-y-1 text-[12.5px] text-ink-2">
              {DEV_ANALYTICS.apiCalls.slice(0, 3).map((a) => (
                <div key={a.name} className="flex justify-between"><span className="font-mono text-ink-3">{a.name}</span><span>{a.calls} calls</span></div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="col-span-2">
          <CardHeader title="What you get on IES" subtitle="Platform for AI-native builders" />
          <div className="grid grid-cols-3 gap-3 px-5 pb-5">
            {[
              { icon: BookOpen, t: `${endpoints} semantic & core APIs`, d: 'Business objects with definitions, lineage and confidence — not report dumps.', href: '/developer/apis' },
              { icon: Wrench, t: 'Typed agent tool registry', d: 'Every API is an LLM-ready tool with policy metadata.', href: '/developer/apis' },
              { icon: Zap, t: 'Event stream', d: 'Trigger agents on invoice.overdue, close.started and 40+ events.', href: '/developer/apis' },
            ].map((x) => (
              <Link key={x.t} href={x.href} className="rounded-xl border border-line p-3.5 hover:border-slate-300">
                <x.icon className="h-5 w-5 text-agent-600" />
                <div className="mt-2 text-[13.5px] font-semibold">{x.t}</div>
                <div className="mt-0.5 text-[12px] text-ink-3">{x.d}</div>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Developer incentives" />
          <ul className="space-y-1.5 px-5 pb-5">
            {DEV_INCENTIVES.slice(0, 7).map((d) => (
              <li key={d} className="flex gap-2 text-[12.5px] text-ink-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ok-600" />{d}</li>
            ))}
          </ul>
        </Card>
      </div>
      <div className="mt-5"><Hint>API names, SDK and sandbox details are proposed designs for this concept, not existing Intuit products.</Hint></div>
    </div>
  );
}
