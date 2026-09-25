'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Shield, Sparkles, UserCheck, ShieldAlert, Power, Check, AlertOctagon, ScrollText, Lock, Minus, Bot } from 'lucide-react';
import { useStore, useAgents } from '@/lib/store';
import { CLOSE_ITEMS, decideOutcome } from '@/lib/data/close';
import { DATA_DOMAINS, INCIDENTS, POLICIES, QUALITY_TREND } from '@/lib/data/governance';
import type { Autonomy, Risk } from '@/lib/types';
import { Assumption, Badge, Button, Card, CardHeader, PageHeader, RiskBadge, Segmented, Stat, Tabs, Toggle, Hint } from '@/components/ui';
import { cn, usd } from '@/lib/format';

type Tab = 'overview' | 'agents' | 'policies' | 'data' | 'quality' | 'incidents';

export default function TrustCenter() {
  const [tab, setTab] = useState<Tab>('overview');
  const agents = useAgents();
  return (
    <div>
      <PageHeader
        eyebrow={<>Pillar 4 · Trust & governance</>}
        title="Trust Center"
        subtitle="One place to govern every agent — first- or third-party: what it can see, what it can do on its own, when it must ask, how good it is, and everything it has done."
        right={<Link href="/audit"><Button icon={<ScrollText className="h-4 w-4" />}>Audit log</Button></Link>}
      />
      <Tabs
        value={tab}
        onChange={setTab}
        className="mb-5"
        tabs={[
          { value: 'overview', label: 'Overview' },
          { value: 'agents', label: 'Agents & autonomy', count: agents.length },
          { value: 'policies', label: 'Thresholds & policies' },
          { value: 'data', label: 'Data access' },
          { value: 'quality', label: 'AI quality' },
          { value: 'incidents', label: 'Incidents', count: INCIDENTS.length },
        ]}
      />
      {tab === 'overview' && <Overview go={setTab} />}
      {tab === 'agents' && <AgentsTab />}
      {tab === 'policies' && <PoliciesTab />}
      {tab === 'data' && <DataTab />}
      {tab === 'quality' && <QualityTab />}
      {tab === 'incidents' && <IncidentsTab />}
    </div>
  );
}

function Overview({ go }: { go: (t: Tab) => void }) {
  const { state } = useStore();
  const agents = useAgents();
  return (
    <div className="space-y-5">
      <Card className="grid grid-cols-5 divide-x divide-line">
        <div className="px-5 py-4"><Stat label="Agent actions (Sep)" value="4,076" sub="100% with evidence" tone="ok" /></div>
        <div className="px-5 py-4"><Stat label="Autonomous" value="66%" sub="Low risk · within limits" /></div>
        <div className="px-5 py-4"><Stat label="Human-approved" value="29%" sub="Median decision 48s" /></div>
        <div className="px-5 py-4"><Stat label="Escalated" value="5%" sub="Human or expert" /></div>
        <div className="px-5 py-4"><Stat label="Override rate" value="3.1%" sub="↓ from 7.8% in April" tone="ok" /></div>
      </Card>
      <div className="grid grid-cols-3 gap-5">
        <Card className="col-span-2">
          <CardHeader title="How autonomy is decided" subtitle="Risk × confidence × amount — the same engine for every agent" right={<Button size="sm" variant="ghost" onClick={() => go('policies')}>Edit thresholds</Button>} />
          <div className="px-5 pb-5"><RiskMatrix /></div>
        </Card>
        <Card>
          <CardHeader title="Agents under governance" subtitle={`${agents.length} total · ${agents.filter((a) => a.paused).length} paused`} right={<Button size="sm" variant="ghost" onClick={() => go('agents')}>Manage</Button>} />
          <div className="space-y-1 px-3 pb-3">
            {agents.map((a) => (
              <div key={a.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px]">
                <Bot className={cn('h-4 w-4', a.firstParty ? 'text-agent-600' : 'text-violet-600')} />
                <span className="flex-1 truncate">{a.name}</span>
                {a.paused ? <Badge>Paused</Badge> : <Badge tone={a.autonomy === 'autopilot' ? 'agent' : a.autonomy === 'approve' ? 'warn' : 'neutral'}>{a.autonomy}</Badge>}
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Lock, t: 'Least privilege by default', d: 'Agents get scoped tokens per data domain; third-party agents never see more than they asked for at install.' },
          { icon: ScrollText, t: 'Every action is evidenced', d: `${state.audit.length} entries in this session’s audit log — who, what, why, confidence, policy and approval.` },
          { icon: Power, t: 'Kill switch & rollback', d: 'Pause any agent instantly. Posted entries are reversible with a linked reversing entry.' },
        ].map((x) => (
          <Card key={x.t} className="p-4">
            <x.icon className="h-5 w-5 text-brand-600" />
            <div className="mt-2 text-[14px] font-semibold">{x.t}</div>
            <div className="mt-1 text-[12.5px] text-ink-3">{x.d}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function RiskMatrix() {
  const { state } = useStore();
  const t = state.thresholds;
  const risks: Risk[] = ['low', 'medium', 'high'];
  const bands = [
    { label: `≥ ${t.minConfidence}%`, conf: t.minConfidence },
    { label: `${t.escalateBelow}–${t.minConfidence - 1}%`, conf: Math.max(t.escalateBelow, t.minConfidence - 1) },
    { label: `< ${t.escalateBelow}%`, conf: t.escalateBelow - 1 },
  ];
  const cell = (risk: Risk, conf: number) => {
    if (risk === 'high' || conf < t.escalateBelow) return 'escalate';
    if (risk === 'low' && conf >= t.minConfidence) return 'auto';
    return 'approve';
  };
  const style = { auto: 'bg-agent-50 text-agent-700 border-agent-100', approve: 'bg-warn-50 text-warn-700 border-warn-100', escalate: 'bg-risk-50 text-risk-700 border-risk-100' };
  const label = { auto: 'Autonomous', approve: 'AI prepares · human approves', escalate: 'Human / expert decides' };
  const Icon = { auto: Sparkles, approve: UserCheck, escalate: ShieldAlert };
  return (
    <div>
      <div className="grid grid-cols-[110px_1fr_1fr_1fr] gap-2 text-[12px]">
        <div />
        {bands.map((b) => <div key={b.label} className="text-center font-medium text-ink-3">Confidence {b.label}</div>)}
        {risks.map((r) => (
          <React.Fragment key={r}>
            <div className="flex items-center"><RiskBadge risk={r} /></div>
            {bands.map((b) => {
              const c = cell(r, b.conf);
              const I = Icon[c];
              return (
                <div key={b.label} className={cn('flex items-center justify-center gap-1.5 rounded-lg border px-2 py-3 text-center font-medium transition-colors', style[c])}>
                  <I className="h-3.5 w-3.5" /> {label[c]}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-3 text-[12px] text-ink-3">Plus: autonomous only when amount ≤ <b className="text-ink-2">{usd(t.autoLimit)}</b> (or an approved recurring template) and the agent is in Autopilot mode. Policy-gated actions (intercompany, consolidation, vendor contact) always need approval.</div>
    </div>
  );
}

function AgentsTab() {
  const { actions, state } = useStore();
  const agents = useAgents();
  return (
    <Card>
      <div className="px-2 py-2">
        <div className="grid grid-cols-[1.5fr_120px_280px_1fr_120px] gap-3 border-b border-line px-3 py-2 text-[11.5px] font-medium uppercase tracking-wider text-ink-3">
          <span>Agent</span><span>Risk profile</span><span>Autonomy</span><span>Data domains</span><span className="text-right">Kill switch</span>
        </div>
        {agents.map((a) => (
          <div key={a.id} className={cn('grid grid-cols-[1.5fr_120px_280px_1fr_120px] items-center gap-3 border-b border-line px-3 py-3 last:border-0', a.paused && 'bg-slate-50')}>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[13.5px] font-semibold">{a.name} {!a.firstParty && <Badge tone="violet">3rd party</Badge>}</div>
              <div className="truncate text-[12px] text-ink-3">{a.publisher} · {a.description}</div>
            </div>
            <div><RiskBadge risk={a.risk} /></div>
            <div>
              <Segmented
                size="sm"
                value={a.autonomy}
                onChange={(v: Autonomy) => (a.id === 'close' ? actions.setMode(v) : actions.setAgentAutonomy(a.id, v, a.name))}
                options={[{ value: 'assist', label: 'Assist' }, { value: 'approve', label: 'Approve' }, { value: 'autopilot', label: 'Autopilot' }]}
              />
            </div>
            <div className="text-[12px] text-ink-2">{a.domains.filter((d) => !(state.revokedDomains[a.id] ?? []).includes(d)).length} of {a.domains.length} granted</div>
            <div className="flex items-center justify-end gap-2">
              <span className={cn('text-[12px] font-medium', a.paused ? 'text-risk-700' : 'text-ok-700')}>{a.paused ? 'Paused' : 'Running'}</span>
              <Toggle on={!a.paused} onChange={() => actions.togglePause(a.id, a.name)} label={`Pause ${a.name}`} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function PoliciesTab() {
  const { state, actions } = useStore();
  const t = state.thresholds;
  const [dirty, setDirty] = useState(false);
  const preview = useMemo(() => CLOSE_ITEMS.map((i) => ({ i, o: decideOutcome(i, 'autopilot', t) })), [t]);
  const counts = { auto: preview.filter((p) => p.o === 'auto').length, approval: preview.filter((p) => p.o === 'approval').length, escalate: preview.filter((p) => p.o === 'escalate').length };
  const set = (patch: Partial<typeof t>) => {
    actions.setThresholds(patch);
    setDirty(true);
  };
  return (
    <div className="grid grid-cols-[1fr_420px] gap-5">
      <div className="space-y-5">
        <Card>
          <CardHeader title="Autonomy thresholds" subtitle="Applies to every agent in Autopilot mode" right={<Button size="sm" variant="primary" disabled={!dirty} onClick={() => { actions.commitThresholds(`Limit ${usd(t.autoLimit)} · min conf ${t.minConfidence}% · escalate < ${t.escalateBelow}%`); actions.toast('Thresholds saved', 'New policy applies to all agents immediately. Change logged.'); setDirty(false); }}>Save policy</Button>} />
          <div className="space-y-6 px-5 pb-5">
            <Slider label="Maximum amount for autonomous action" value={t.autoLimit} min={1000} max={100000} step={1000} fmt={(v) => usd(v)} onChange={(v) => set({ autoLimit: v })} />
            <Slider label="Minimum confidence for autonomy" value={t.minConfidence} min={80} max={99} step={1} fmt={(v) => `${v}%`} onChange={(v) => set({ minConfidence: v })} />
            <Slider label="Escalate to a human below" value={t.escalateBelow} min={50} max={85} step={1} fmt={(v) => `${v}%`} onChange={(v) => set({ escalateBelow: v })} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Risk matrix (live)" />
          <div className="px-5 pb-5"><RiskMatrix /></div>
        </Card>
        <Card>
          <CardHeader title="Active policies" subtitle="Referenced by id on every agent action" />
          <div className="px-2 pb-2">
            {POLICIES.map((p) => (
              <div key={p.id} className="grid grid-cols-[64px_1fr_1.4fr_100px] items-center gap-3 border-t border-line px-3 py-2.5 text-[12.5px]">
                <span className="font-mono text-ink-3">{p.id}</span>
                <span className="font-medium text-ink">{p.name}</span>
                <span className="text-ink-2">{p.rule}</span>
                <span className="text-right text-ink-3">{p.owner}</span>
              </div>
            ))}
            {state.appliedPacks.includes('harborview') && (
              <div className="grid grid-cols-[64px_1fr_1.4fr_100px] items-center gap-3 border-t border-line bg-warn-50/40 px-3 py-2.5 text-[12.5px]">
                <span className="font-mono text-ink-3">R-02</span>
                <span className="font-medium text-ink">Segregation-date check <Badge tone="warn">Proposed</Badge></span>
                <span className="text-ink-2">Bill-and-hold revenue requires segregation before period end — learned from expert case</span>
                <span className="text-right"><Button size="sm" onClick={() => { actions.audit({ actor: 'Maya Chen (CFO)', actorType: 'human', action: 'Approved agent-proposed policy', target: 'R-02 Segregation-date check', approval: 'Config change', policy: 'R-02' }); actions.toast('Policy R-02 approved', 'The Close Agent will apply it from the next close.'); }}>Approve</Button></span>
              </div>
            )}
          </div>
        </Card>
      </div>
      <Card className="h-fit">
        <CardHeader title="Impact preview" subtitle="How September close items would route in Autopilot" />
        <div className="grid grid-cols-3 gap-2 px-5 pb-3 text-center">
          <div className="rounded-lg bg-agent-50 py-2"><div className="text-[18px] font-semibold text-agent-700">{counts.auto}</div><div className="text-[11px] text-agent-700">Autonomous</div></div>
          <div className="rounded-lg bg-warn-50 py-2"><div className="text-[18px] font-semibold text-warn-700">{counts.approval}</div><div className="text-[11px] text-warn-700">Approval</div></div>
          <div className="rounded-lg bg-risk-50 py-2"><div className="text-[18px] font-semibold text-risk-700">{counts.escalate}</div><div className="text-[11px] text-risk-700">Escalate</div></div>
        </div>
        <div className="px-3 pb-3">
          {preview.map(({ i, o }) => (
            <div key={i.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[12.5px]">
              {o === 'auto' ? <Sparkles className="h-3.5 w-3.5 text-agent-600" /> : o === 'escalate' ? <ShieldAlert className="h-3.5 w-3.5 text-risk-600" /> : <UserCheck className="h-3.5 w-3.5 text-warn-600" />}
              <span className="flex-1 truncate text-ink-2">{i.title}</span>
              <span className="font-mono text-[11px] text-ink-4">{usd(i.amount, { compact: true })} · {i.confidence}%</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Slider({ label, value, min, max, step, fmt, onChange }: { label: string; value: number; min: number; max: number; step: number; fmt: (v: number) => string; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[13px] font-medium text-ink-2">{label}</span>
        <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[13px] font-semibold tabular-nums">{fmt(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-brand-600" />
      <div className="flex justify-between text-[11px] text-ink-4"><span>{fmt(min)}</span><span>{fmt(max)}</span></div>
    </div>
  );
}

function DataTab() {
  const { state, actions } = useStore();
  const agents = useAgents();
  return (
    <Card>
      <CardHeader title="Data access matrix" subtitle="Click to grant or revoke a data domain. Greyed cells were never requested by the agent." />
      <div className="overflow-x-auto scroll-thin px-5 pb-5">
        <table className="w-full text-[12.5px]">
          <thead>
            <tr>
              <th className="w-[200px] py-2 text-left font-medium text-ink-3">Agent</th>
              {DATA_DOMAINS.map((d) => <th key={d} className="px-1 py-2 text-center text-[11.5px] font-medium text-ink-3">{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {agents.map((a) => (
              <tr key={a.id} className="border-t border-line">
                <td className="py-2 font-medium">{a.name}</td>
                {DATA_DOMAINS.map((d) => {
                  const requested = a.domains.includes(d);
                  const revoked = (state.revokedDomains[a.id] ?? []).includes(d);
                  return (
                    <td key={d} className="px-1 py-1.5 text-center">
                      {requested ? (
                        <button onClick={() => actions.toggleDomain(a.id, d, a.name)} className={cn('mx-auto flex h-7 w-7 items-center justify-center rounded-md border transition-colors', revoked ? 'border-risk-100 bg-risk-50 text-risk-600' : 'border-ok-100 bg-ok-50 text-ok-600 hover:bg-ok-100')} title={revoked ? 'Revoked — click to grant' : 'Granted — click to revoke'}>
                          {revoked ? <Minus className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
                        </button>
                      ) : (
                        <span className="mx-auto block h-7 w-7 rounded-md bg-slate-50" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4"><Hint>Expert Network access is separate: experts receive only a per-case context pack that expires when the case closes.</Hint></div>
      </div>
    </Card>
  );
}

function QualityTab() {
  return (
    <div className="grid grid-cols-2 gap-5">
      <Card>
        <CardHeader title="Accuracy vs. human review" subtitle="Share of agent outputs accepted without change" right={<Assumption />} />
        <div className="h-[240px] px-3 pb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={QUALITY_TREND} margin={{ top: 8, right: 16, left: -12, bottom: 0 }}>
              <CartesianGrid stroke="#EEF0F4" vertical={false} />
              <XAxis dataKey="m" tickLine={false} axisLine={false} />
              <YAxis domain={[95, 99]} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E4E7EC', fontSize: 12 }} />
              <Line type="monotone" dataKey="accuracy" stroke="#12B76A" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card>
        <CardHeader title="Override rate & autonomy earned" subtitle="Lower overrides → more autonomy granted" right={<Assumption />} />
        <div className="h-[240px] px-3 pb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={QUALITY_TREND} margin={{ top: 8, right: 16, left: -12, bottom: 0 }}>
              <CartesianGrid stroke="#EEF0F4" vertical={false} />
              <XAxis dataKey="m" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E4E7EC', fontSize: 12 }} />
              <Area type="monotone" dataKey="autonomous" stroke="#14A38B" fill="#CCFBEF" strokeWidth={2} name="Autonomous share" />
              <Area type="monotone" dataKey="override" stroke="#F79009" fill="#FEF0C7" strokeWidth={2} name="Override rate" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card className="col-span-2 grid grid-cols-4 divide-x divide-line">
        <div className="px-5 py-4"><Stat label="Unsupported claims (eval)" value="0" sub="Every output cites evidence" tone="ok" /></div>
        <div className="px-5 py-4"><Stat label="Escalation precision" value="91%" sub="Escalations that truly needed a human" /></div>
        <div className="px-5 py-4"><Stat label="Forecast error (13-wk)" value="4.2%" sub="UK downgraded to Assist" tone="warn" /></div>
        <div className="px-5 py-4"><Stat label="Eval drift alerts" value="1" sub="INC-0139 · monitoring" tone="warn" /></div>
      </Card>
    </div>
  );
}

function IncidentsTab() {
  return (
    <div className="space-y-3">
      {INCIDENTS.map((i) => (
        <Card key={i.id} className="flex gap-4 p-5">
          <AlertOctagon className={cn('mt-0.5 h-5 w-5 shrink-0', i.status === 'Resolved' ? 'text-ink-4' : 'text-warn-600')} />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[12px] text-ink-3">{i.id}</span>
              <Badge tone={i.sev === 'Sev 3' ? 'warn' : 'neutral'}>{i.sev}</Badge>
              <Badge tone={i.status === 'Resolved' ? 'ok' : 'brand'}>{i.status}</Badge>
              <span className="ml-auto text-[12px] text-ink-4">{i.when}</span>
            </div>
            <div className="mt-1 text-[14.5px] font-semibold">{i.title}</div>
            <div className="text-[12.5px] text-ink-3">{i.agent}</div>
            <p className="mt-2 text-[13px] text-ink-2">{i.detail}</p>
          </div>
        </Card>
      ))}
      <Hint><span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> Incidents are fictional examples of how guardrails behave: blocked, logged, notified, and auto-downgraded autonomy.</span></Hint>
    </div>
  );
}
