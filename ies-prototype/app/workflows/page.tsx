'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bot, Pause, Play, ArrowRight, Zap, Database, Sparkles, UserCheck, CheckCircle2, ShieldCheck, Store, Users } from 'lucide-react';
import { useStore, useAgents } from '@/lib/store';
import { AutonomyBadge, Badge, Button, Card, CardHeader, PageHeader, Stat, Segmented, Dot, Assumption } from '@/components/ui';
import { cn } from '@/lib/format';

const FLOWS = {
  close: {
    name: 'Month-end close',
    steps: [
      { icon: Zap, title: 'Trigger', line: 'Period end · bank feeds synced', agent: 'Bank Feed Sync', mode: 'autopilot' },
      { icon: Database, title: 'Gather', line: 'GL, bank, AP/AR, payroll, 3PL', agent: 'Close Agent', mode: 'autopilot' },
      { icon: Sparkles, title: 'Reconcile & detect', line: 'Recs, intercompany, anomalies', agent: 'Close Agent', mode: 'approve' },
      { icon: Store, title: 'Specialist check', line: 'Freight invoice audit', agent: 'FreightAudit AI', mode: 'approve', thirdParty: true },
      { icon: Users, title: 'Judgment', line: 'Revenue cut-off → expert', agent: 'Expert Network', mode: 'assist' },
      { icon: UserCheck, title: 'Approve', line: 'Controller sign-off', agent: 'Human', mode: 'assist' },
      { icon: CheckCircle2, title: 'Report', line: 'Consolidation & flux', agent: 'Close Agent', mode: 'approve' },
    ],
  },
  cash: {
    name: 'Order-to-cash',
    steps: [
      { icon: Zap, title: 'Trigger', line: 'Invoice 15+ days overdue', agent: 'Event stream', mode: 'autopilot' },
      { icon: Database, title: 'Context', line: 'Payment profile, disputes', agent: 'Collections Agent', mode: 'autopilot' },
      { icon: Sparkles, title: 'Decide', line: 'Remind · plan · escalate', agent: 'Collections Agent', mode: 'autopilot' },
      { icon: UserCheck, title: 'Approval gate', line: 'Balances > $25K', agent: 'Human', mode: 'approve' },
      { icon: CheckCircle2, title: 'Verify', line: 'Cash applied · forecast updated', agent: 'Cash Forecast Agent', mode: 'autopilot' },
    ],
  },
} as const;

export default function Workflows() {
  const { state, actions } = useStore();
  const agents = useAgents();
  const [flow, setFlow] = useState<'close' | 'cash'>('close');
  const f = FLOWS[flow];
  const freight = state.installed.includes('freightaudit');
  const totalTasks = agents.reduce((a, b) => a + b.tasksMonth, 0);
  const hours = agents.reduce((a, b) => a + b.hoursSaved, 0);

  return (
    <div>
      <PageHeader
        eyebrow={<>Pillar 1 · Agentic work</>}
        title="Agent Workflows"
        subtitle="Every agent working for Cascadia — first-party and third-party — with what it is allowed to do, how well it is doing, and where humans sit in the loop."
        right={<Link href="/trust"><Button icon={<ShieldCheck className="h-4 w-4" />}>Governance</Button></Link>}
      />

      <Card className="mb-5 grid grid-cols-4 divide-x divide-line">
        <div className="px-5 py-4"><Stat label="Active agents" value={agents.filter((a) => !a.paused).length} sub={`${agents.filter((a) => !a.firstParty).length} third-party`} /></div>
        <div className="px-5 py-4"><Stat label="Tasks this month" value={totalTasks.toLocaleString()} sub="+18% vs August" tone="ok" /></div>
        <div className="px-5 py-4"><Stat label="Executed autonomously" value="66%" sub="Within policy · 3.1% overridden" tone="ok" /></div>
        <div className="px-5 py-4"><Stat label="Hours returned to team" value={`${hours}h`} sub="September" assumption /></div>
      </Card>

      {/* Workflow visualization */}
      <Card className="mb-5">
        <CardHeader
          title={`Multi-agent workflow · ${f.name}`}
          subtitle="Agents hand off to each other, to humans and to experts — with the autonomy level of each step visible."
          right={<Segmented size="sm" value={flow} onChange={setFlow} options={[{ value: 'close', label: 'Month-end close' }, { value: 'cash', label: 'Order-to-cash' }]} />}
        />
        <div className="overflow-x-auto scroll-thin px-5 pb-5">
          <div className="flex min-w-max items-stretch gap-2">
            {f.steps.map((s, i) => {
              const Icon = s.icon;
              const inactive = 'thirdParty' in s && s.thirdParty && !freight;
              return (
                <React.Fragment key={s.title}>
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn('w-[152px] rounded-xl border p-3', inactive ? 'border-dashed border-line bg-slate-50/60' : s.agent === 'Human' || s.agent === 'Expert Network' ? 'border-violet-100 bg-violet-50/40' : 'border-line bg-white')}
                  >
                    <div className="flex items-center justify-between">
                      <div className={cn('flex h-7 w-7 items-center justify-center rounded-lg', s.agent === 'Human' || s.agent === 'Expert Network' ? 'bg-violet-100 text-violet-700' : 'bg-agent-50 text-agent-700')}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <AutonomyBadge a={s.mode} />
                    </div>
                    <div className="mt-2 text-[13px] font-semibold">{s.title}</div>
                    <div className="text-[11.5px] leading-snug text-ink-3">{s.line}</div>
                    <div className="mt-2 flex items-center gap-1 text-[11.5px] font-medium text-ink-2">
                      {s.agent === 'Human' || s.agent === 'Expert Network' ? <Users className="h-3 w-3" /> : <Bot className="h-3 w-3" />} {s.agent}
                    </div>
                    {inactive && <Link href="/marketplace?focus=freightaudit" className="mt-1 block text-[11px] font-medium text-brand-600">Not installed → Marketplace</Link>}
                  </motion.div>
                  {i < f.steps.length - 1 && <div className="flex items-center text-ink-4"><ArrowRight className="h-4 w-4" /></div>}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Agents table */}
      <Card>
        <CardHeader title="Agents" subtitle="Pause any agent instantly. Change autonomy in the Trust Center." />
        <div className="px-2 pb-2">
          <div className="grid grid-cols-[1.6fr_110px_100px_100px_100px_1.2fr_110px] gap-3 border-y border-line bg-slate-50/70 px-3 py-2 text-[11.5px] font-medium uppercase tracking-wider text-ink-3">
            <span>Agent</span><span>Autonomy</span><span className="text-right">Tasks / mo</span><span className="text-right">Success</span><span className="text-right">Overrides</span><span>Last action</span><span />
          </div>
          {agents.map((a) => (
            <div key={a.id} className={cn('grid grid-cols-[1.6fr_110px_100px_100px_100px_1.2fr_110px] items-center gap-3 border-b border-line px-3 py-3 last:border-0', a.paused && 'opacity-60')}>
              <div className="flex min-w-0 items-center gap-3">
                <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', a.firstParty ? 'bg-agent-50 text-agent-700' : 'bg-violet-50 text-violet-700')}><Bot className="h-4 w-4" /></div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[13.5px] font-semibold">{a.name} {!a.firstParty && <Badge tone="violet">3rd party</Badge>}</div>
                  <div className="truncate text-[12px] text-ink-3">{a.description}</div>
                </div>
              </div>
              <div><AutonomyBadge a={a.autonomy} /></div>
              <div className="text-right font-mono text-[12.5px] tabular-nums">{a.tasksMonth ? a.tasksMonth.toLocaleString() : '—'}</div>
              <div className="text-right font-mono text-[12.5px] tabular-nums">{a.tasksMonth ? `${a.successRate}%` : <span className="text-ink-4">eval {a.successRate}</span>}</div>
              <div className="text-right font-mono text-[12.5px] tabular-nums">{a.tasksMonth ? `${a.overrideRate}%` : '—'}</div>
              <div className="flex items-center gap-2 truncate text-[12.5px] text-ink-2"><Dot tone={a.paused ? 'neutral' : 'agent'} pulse={!a.paused} />{a.paused ? 'Paused' : a.lastAction}</div>
              <div className="text-right">
                <Button size="sm" variant={a.paused ? 'secondary' : 'ghost'} icon={a.paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />} onClick={() => actions.togglePause(a.id, a.name)}>
                  {a.paused ? 'Resume' : 'Pause'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <div className="mt-3 flex items-center gap-1.5 text-[12px] text-ink-4">Task volumes, success and override rates are fictional demo values <Assumption /></div>
    </div>
  );
}
