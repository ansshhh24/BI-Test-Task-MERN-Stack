'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CalendarClock, MapPin, ShieldAlert, CheckCircle2, AlertTriangle, Users, FileCheck2, Bot, Check } from 'lucide-react';
import { useStore } from '@/lib/store';
import { CONTROLS, FILINGS, NEXUS } from '@/lib/data/compliance';
import { Assumption, Badge, Button, Card, CardHeader, PageHeader, Hint, Stat } from '@/components/ui';
import { cn, usd } from '@/lib/format';

export default function Compliance() {
  const router = useRouter();
  const { state, actions } = useStore();
  const [approved, setApproved] = useState<string[]>([]);
  const [sodFixed, setSodFixed] = useState(false);
  const [coPrepared, setCoPrepared] = useState(false);

  const approveFiling = (id: string, name: string) => {
    setApproved((a) => [...a, id]);
    actions.audit({ actor: 'Maya Chen (CFO)', actorType: 'human', action: 'Approved filing for submission', target: name, approval: 'Human approved', policy: 'TX-02', evidence: 'Return prepared by Compliance Agent with source reconciliation' });
    actions.toast('Filing approved', `${name} will be submitted on schedule.`);
  };

  return (
    <div>
      <PageHeader
        eyebrow={<>Pillar 1 · Agentic work</>}
        title="Compliance Agent"
        subtitle="Continuously monitors filings, economic nexus and internal controls across US, Canada and UK — prepares the work, and routes judgment calls to you or a tax expert."
      />

      <Card className="mb-5 grid grid-cols-4 divide-x divide-line">
        <div className="px-5 py-4"><Stat label="Filings next 45 days" value="4" sub="2 prepared, awaiting approval" tone="warn" /></div>
        <div className="px-5 py-4"><Stat label="Jurisdictions monitored" value="17" sub="14 US states · CA · UK" /></div>
        <div className="px-5 py-4"><Stat label="Controls tested (Sep)" value="4,176" sub="1 exception" tone="warn" /></div>
        <div className="px-5 py-4"><Stat label="Agent actions with evidence" value="100%" sub="Audit-ready" tone="ok" /></div>
      </Card>

      <div className="grid grid-cols-[1fr_400px] gap-5">
        <div className="space-y-5">
          <Card>
            <CardHeader title="Filing calendar" subtitle="Prepared by the agent from IES data; submitted only after approval" icon={<CalendarClock className="h-4 w-4" />} />
            <div className="px-2 pb-2">
              {FILINGS.map((f) => {
                const isApproved = approved.includes(f.id);
                const canApprove = f.status === 'Prepared' && !isApproved;
                return (
                  <div key={f.id} className="grid grid-cols-[1fr_60px_80px_150px_130px] items-center gap-3 border-t border-line px-3 py-3">
                    <div>
                      <div className="text-[13.5px] font-medium">{f.name}</div>
                      <div className="text-[12px] text-ink-3">{f.owner} · {f.autonomy} mode</div>
                    </div>
                    <Badge>{f.entity}</Badge>
                    <div className="text-[12.5px] text-ink-2">Due {f.due}</div>
                    <div>{isApproved ? <Badge tone="ok"><Check className="h-3 w-3" />Approved</Badge> : <Badge tone={f.status === 'Prepared' ? 'warn' : f.status === 'Scheduled' ? 'agent' : 'neutral'}>{f.status}</Badge>}</div>
                    <div className="text-right">
                      {canApprove ? <Button size="sm" variant="primary" onClick={() => approveFiling(f.id, f.name)}>Review & approve</Button> : <span className="text-[12px] text-ink-4">—</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <CardHeader title="Internal controls · continuous testing" subtitle="Every agent action is also a control test" icon={<FileCheck2 className="h-4 w-4" />} />
            <div className="space-y-2 px-5 pb-5">
              {CONTROLS.map((c) => {
                const risk = c.tone === 'risk' && !sodFixed;
                return (
                  <div key={c.id} className={cn('flex items-center gap-3 rounded-xl border p-3', risk ? 'border-risk-100 bg-risk-50/40' : 'border-line')}>
                    {risk ? <ShieldAlert className="h-5 w-5 shrink-0 text-risk-600" /> : <CheckCircle2 className="h-5 w-5 shrink-0 text-ok-600" />}
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-medium">{c.name}</div>
                      <div className="text-[12px] text-ink-3">{risk ? c.detail : c.tone === 'risk' ? 'Resolved: payment-approval rights removed from 2 AP users; change logged.' : c.detail}</div>
                    </div>
                    {risk ? (
                      <Button size="sm" variant="primary" onClick={() => { setSodFixed(true); actions.audit({ actor: 'Maya Chen (CFO)', actorType: 'human', action: 'Approved SoD remediation', target: 'Removed payment approval from 2 AP users', approval: 'Human approved', policy: 'SOD-1', evidence: 'Compliance Agent SoD test' }); actions.toast('Segregation of duties fixed', 'Role change applied and logged.'); }}>
                        Apply fix
                      </Button>
                    ) : (
                      <Badge tone="ok">{c.tone === 'risk' ? 'Fixed' : c.result}</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Economic nexus monitor" subtitle="Trailing-12-month sales by state" icon={<MapPin className="h-4 w-4" />} right={<Assumption>Rules illustrative</Assumption>} />
            <div className="space-y-3 px-5 pb-4">
              {NEXUS.map((n) => {
                const pct = Math.min(100, (n.sales / n.threshold) * 100);
                return (
                  <div key={n.state}>
                    <div className="flex items-center justify-between text-[12.5px]">
                      <span className="font-medium text-ink">{n.state}</span>
                      <span className="font-mono tabular-nums text-ink-3">{usd(n.sales, { compact: true })} / {usd(n.threshold, { compact: true })}</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className={cn('h-full rounded-full', n.status === 'crossed' ? 'bg-risk-500' : n.status === 'watch' ? 'bg-warn-500' : 'bg-ok-500')} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-line px-5 py-4">
              <div className="flex items-start gap-2 rounded-xl border border-risk-100 bg-risk-50/50 p-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-risk-600" />
                <div>
                  <div className="text-[13px] font-semibold text-ink">Colorado threshold crossed Sep 22</div>
                  <div className="text-[12.5px] text-ink-2">Agent drafted a registration packet. Timing and local rules need a qualified review (confidence 72%).</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button icon={coPrepared ? <Check className="h-4 w-4 text-ok-600" /> : <Bot className="h-4 w-4" />} disabled={coPrepared} onClick={() => { setCoPrepared(true); actions.audit({ actor: 'Compliance Agent', actorType: 'agent', action: 'Prepared CO registration packet (draft)', target: 'Colorado Department of Revenue', confidence: 93, approval: 'Recommendation', policy: 'TX-01', evidence: 'Trailing CO sales, entity data' }); actions.toast('Registration packet ready', 'Draft only — nothing submitted.', 'agent'); }}>
                  {coPrepared ? 'Packet drafted' : 'Draft registration'}
                </Button>
                <Button variant="primary" icon={<Users className="h-4 w-4" />} onClick={() => { actions.openCase('nexus'); router.push('/experts'); }}>Ask tax expert</Button>
              </div>
            </div>
          </Card>
          <Hint>Tax rules and thresholds shown are illustrative. In production, rules come from a maintained tax-content service, and filings are always approved by a human.</Hint>
          {state.appliedPacks.includes('nexus') && <Badge tone="ok">Expert guidance applied · registration plan approved</Badge>}
        </div>
      </div>
    </div>
  );
}
