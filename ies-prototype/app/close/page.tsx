'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Play, RotateCcw, Loader2, CheckCircle2, Clock, UserCheck, ShieldAlert, Sparkles, XCircle, Undo2, Lightbulb, ArrowRight, Hand, Gauge, Rocket, Settings2, Users, Check,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { CLOSE_CHECKLIST, CLOSE_ITEMS, DONE_STATUSES, decideOutcome, outcomeReason, readiness } from '@/lib/data/close';
import type { Autonomy, CloseItem, CloseItemStatus, Workstream } from '@/lib/types';
import { Badge, Button, Card, CardHeader, Confidence, Drawer, PageHeader, RiskBadge, Ring, Tabs, Hint, Assumption } from '@/components/ui';
import { EvidenceList, JournalTable, PhaseDot, PolicyList, TraceList } from '@/components/ai/AgentBits';
import { cn, usd } from '@/lib/format';

const STATUS: Record<CloseItemStatus, { label: string; tone: 'neutral' | 'brand' | 'ok' | 'warn' | 'risk' | 'agent' | 'violet'; icon: React.ElementType }> = {
  queued: { label: 'Queued', tone: 'neutral', icon: Clock },
  analyzing: { label: 'Analyzing', tone: 'agent', icon: Loader2 },
  recommended: { label: 'Recommended', tone: 'brand', icon: Lightbulb },
  awaiting_approval: { label: 'Needs approval', tone: 'warn', icon: UserCheck },
  auto_executed: { label: 'Auto-executed', tone: 'agent', icon: Sparkles },
  approved: { label: 'Approved', tone: 'ok', icon: CheckCircle2 },
  rejected: { label: 'Rejected', tone: 'neutral', icon: XCircle },
  escalated: { label: 'Escalated', tone: 'risk', icon: ShieldAlert },
  resolved: { label: 'Resolved', tone: 'ok', icon: CheckCircle2 },
  rolled_back: { label: 'Rolled back', tone: 'neutral', icon: Undo2 },
};

const MODES: { value: Autonomy; title: string; icon: React.ElementType; line: string; detail: string }[] = [
  { value: 'assist', title: 'Assist', icon: Hand, line: 'AI recommends', detail: 'Agent investigates and recommends. You execute every action.' },
  { value: 'approve', title: 'Approve', icon: UserCheck, line: 'AI prepares, you approve', detail: 'Agent prepares entries with evidence. Nothing posts without approval.' },
  { value: 'autopilot', title: 'Autopilot', icon: Rocket, line: 'AI executes within policy', detail: 'Low-risk, high-confidence items within limits execute automatically. Everything else still routes to you.' },
];

const WORKSTREAMS: Workstream[] = ['Reconciliation', 'Intercompany', 'Anomaly detection', 'Accruals', 'Revenue', 'Consolidation'];

export default function ClosePage() {
  const { state, actions } = useStore();
  const [openId, setOpenId] = useState<string | null>(null);
  const ready = readiness(state.closeStatuses);
  const s = state.closeStatuses;
  const running = state.closeRun === 'running';
  const count = (sts: CloseItemStatus[]) => CLOSE_ITEMS.filter((i) => sts.includes(s[i.id])).length;
  const minutesSaved = CLOSE_ITEMS.filter((i) => DONE_STATUSES.includes(s[i.id]) || ['awaiting_approval', 'recommended', 'escalated'].includes(s[i.id])).reduce((a, i) => a + i.minutesSaved, 0);

  const feedRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.closeActivity.length) feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' });
  }, [state.closeActivity.length]);

  const open = CLOSE_ITEMS.find((i) => i.id === openId) ?? null;

  return (
    <div>
      <PageHeader
        eyebrow={<>September 2026 close · Business day 3 · Target day 5</>}
        title="Financial Close Agent"
        subtitle="Reconciliation, intercompany, anomaly detection, accruals and consolidation across 3 entities — at the autonomy level you choose, inside the policies you set."
        right={
          <>
            <Link href="/trust"><Button icon={<Settings2 className="h-4 w-4" />}>Policies</Button></Link>
            <Button variant="primary" size="lg" loading={running} icon={state.closeRun === 'done' ? <RotateCcw className="h-4 w-4" /> : <Play className="h-4 w-4" />} onClick={actions.runClose}>
              {running ? 'Agent working…' : state.closeRun === 'done' ? 'Re-run Close Agent' : 'Run Close Agent'}
            </Button>
          </>
        }
      />

      {/* Top: readiness + autonomy */}
      <Card className="mb-5 grid grid-cols-[260px_1fr] overflow-hidden">
        <div className="flex flex-col items-center justify-center border-r border-line bg-slate-50/50 px-6 py-5">
          <Ring value={ready} size={132} stroke={11} color={ready >= 95 ? '#12B76A' : '#3F4FD9'} sub="close readiness" />
          <div className="mt-3 grid w-full grid-cols-3 gap-2 text-center">
            <MiniStat n={count(['auto_executed'])} label="Auto" tone="text-agent-700" />
            <MiniStat n={count(['awaiting_approval', 'recommended'])} label="For you" tone="text-warn-700" />
            <MiniStat n={count(['escalated'])} label="Escalated" tone="text-risk-700" />
          </div>
          <div className="mt-3 text-center text-[11.5px] text-ink-3">
            {Math.round(minutesSaved / 6) / 10}h of manual work handled <Assumption className="ml-0.5">Est.</Assumption>
          </div>
        </div>
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[14px] font-semibold">Autonomy level</div>
              <div className="text-[12.5px] text-ink-3">Risk-based automation. Guardrails apply in every mode.</div>
            </div>
            {state.closeRun === 'done' && <span className="text-[12px] text-ink-3">Changing mode re-applies policy to pending items</span>}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {MODES.map((m) => {
              const sel = state.closeMode === m.value;
              const Icon = m.icon;
              return (
                <button
                  key={m.value}
                  onClick={() => actions.setMode(m.value)}
                  disabled={running}
                  className={cn(
                    'relative rounded-xl border p-3.5 text-left transition-all disabled:cursor-not-allowed',
                    sel ? 'border-brand-500 bg-brand-50/50 ring-4 ring-brand-100' : 'border-line bg-white hover:border-slate-300',
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className={cn('flex h-7 w-7 items-center justify-center rounded-lg', sel ? 'bg-brand-600 text-white' : 'bg-slate-100 text-ink-2')}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold">{m.title}</div>
                      <div className="text-[11.5px] text-ink-3">{m.line}</div>
                    </div>
                    {sel && <Check className="ml-auto h-4 w-4 text-brand-600" />}
                  </div>
                  <div className="mt-2 text-[12.5px] leading-snug text-ink-2">{m.detail}</div>
                </button>
              );
            })}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-[12px]">
            <Guard icon={<Sparkles className="h-3.5 w-3.5 text-agent-600" />} text={`Autonomous: low risk · ≥ ${state.thresholds.minConfidence}% confidence · ≤ ${usd(state.thresholds.autoLimit)} or approved template`} />
            <Guard icon={<UserCheck className="h-3.5 w-3.5 text-warn-600" />} text="Human approval: medium risk, above limits, or policy-gated (e.g., intercompany, consolidation)" />
            <Guard icon={<ShieldAlert className="h-3.5 w-3.5 text-risk-600" />} text={`Escalation: high risk or confidence < ${state.thresholds.escalateBelow}% — the agent never guesses`} />
          </div>
        </div>
      </Card>

      {/* Workstream tracker */}
      <div className="mb-5 grid grid-cols-6 gap-2">
        {WORKSTREAMS.map((w) => {
          const items = CLOSE_ITEMS.filter((i) => i.workstream === w);
          const done = items.filter((i) => DONE_STATUSES.includes(s[i.id])).length;
          const anyRun = items.some((i) => s[i.id] === 'analyzing');
          const blocked = items.some((i) => s[i.id] === 'escalated');
          const waiting = items.some((i) => ['awaiting_approval', 'recommended'].includes(s[i.id]));
          const complete = done === items.length;
          return (
            <div key={w} className={cn('rounded-xl border bg-white px-3 py-2.5 transition-colors', complete ? 'border-ok-100 bg-ok-50/40' : anyRun ? 'border-agent-500/40 bg-agent-50/60' : 'border-line')}>
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] font-medium text-ink-2">{w}</span>
                {complete ? <CheckCircle2 className="h-4 w-4 text-ok-600" /> : anyRun ? <Loader2 className="h-4 w-4 animate-spin text-agent-600" /> : blocked ? <ShieldAlert className="h-4 w-4 text-risk-600" /> : waiting ? <UserCheck className="h-4 w-4 text-warn-600" /> : <Clock className="h-4 w-4 text-ink-4" />}
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-100">
                <motion.div className={cn('h-full rounded-full', complete ? 'bg-ok-500' : 'bg-brand-500')} animate={{ width: `${(done / items.length) * 100}%` }} />
              </div>
              <div className="mt-1 text-[11px] text-ink-3">{done}/{items.length} complete</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-5">
        {/* Work items */}
        <Card>
          <CardHeader
            title="Agent work items"
            subtitle={state.closeRun === 'idle' ? 'The agent has a plan for 9 checks. Run it to see findings.' : 'Click any item to inspect evidence, confidence, policy and audit history.'}
            right={<Badge tone="neutral">{CLOSE_ITEMS.length} items · 3 entities</Badge>}
          />
          <div className="px-2 pb-2">
            <div className="grid grid-cols-[1fr_80px_96px_104px_134px] gap-3 border-y border-line bg-slate-50/70 px-3 py-2 text-[11.5px] font-medium uppercase tracking-wider text-ink-3">
              <span>Finding</span>
              <span className="text-right">Amount</span>
              <span>Confidence</span>
              <span>Risk</span>
              <span>Status</span>
            </div>
            {CLOSE_ITEMS.map((it) => {
              const st = STATUS[s[it.id]];
              const Icon = st.icon;
              const idle = s[it.id] === 'queued';
              return (
                <motion.button
                  layout
                  key={it.id}
                  onClick={() => setOpenId(it.id)}
                  className={cn('grid w-full grid-cols-[1fr_80px_96px_104px_134px] items-center gap-3 border-b border-line px-3 py-3 text-left transition-colors last:border-0 hover:bg-slate-50', s[it.id] === 'analyzing' && 'bg-agent-50/50')}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-ink-4">
                      {it.workstream} <span className="normal-case tracking-normal">· {it.entity}</span>
                    </div>
                    <div className={cn('truncate text-[13.5px] font-medium', idle ? 'text-ink-3' : 'text-ink')}>{idle ? planLabel(it) : it.title}</div>
                  </div>
                  <div className="text-right font-mono text-[12.5px] tabular-nums text-ink-2">{idle ? '—' : usd(it.amount, { compact: true })}</div>
                  <div>{idle || s[it.id] === 'analyzing' ? <span className="text-[12px] text-ink-4">—</span> : <Confidence value={it.confidence} size="sm" />}</div>
                  <div>{idle || s[it.id] === 'analyzing' ? <span className="text-[12px] text-ink-4">—</span> : <RiskBadge risk={it.risk} />}</div>
                  <div>
                    <Badge tone={st.tone}>
                      <Icon className={cn('h-3 w-3', s[it.id] === 'analyzing' && 'animate-spin')} /> {st.label}
                    </Badge>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </Card>

        {/* Activity stream */}
        <div className="space-y-5">
          <Card className="flex flex-col">
            <CardHeader
              title="Agent activity"
              subtitle="Understand → Investigate → Decide → Act → Verify"
              right={running ? <Badge tone="agent"><Loader2 className="h-3 w-3 animate-spin" /> Live</Badge> : state.closeRun === 'done' ? <Badge tone="ok">Complete</Badge> : <Badge>Idle</Badge>}
            />
            <div ref={feedRef} className="h-[430px] overflow-y-auto scroll-thin px-5 pb-4">
              {state.closeActivity.length === 0 ? (
                <div>
                  <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-ink-3">Pre-close checklist</div>
                  {CLOSE_CHECKLIST.map((c) => (
                    <div key={c.name} className="flex items-center gap-2 py-1.5 text-[13px] text-ink-2">
                      <CheckCircle2 className="h-4 w-4 text-ok-600" /> {c.name}
                    </div>
                  ))}
                  <div className="mb-2 mt-5 text-[12px] font-semibold uppercase tracking-wider text-ink-3">Agent plan</div>
                  {CLOSE_ITEMS.map((c, i) => (
                    <div key={c.id} className="flex items-center gap-2 py-1 text-[12.5px] text-ink-3">
                      <span className="w-4 text-right font-mono text-[11px] text-ink-4">{i + 1}</span> {planLabel(c)}
                    </div>
                  ))}
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {state.closeActivity.map((a) => (
                    <motion.div key={a.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5 py-1.5">
                      <span className="mt-[3px] w-[52px] shrink-0 font-mono text-[10.5px] text-ink-4">{a.t}</span>
                      <PhaseDot phase={a.phase} />
                      <div className="-mt-1 min-w-0">
                        <span className={cn('text-[11px] font-semibold uppercase tracking-wider', a.tone === 'risk' ? 'text-risk-700' : a.tone === 'ok' ? 'text-ok-700' : a.tone === 'warn' ? 'text-warn-700' : 'text-ink-3')}>{a.phase}</span>
                        <div className="text-[12.5px] leading-snug text-ink-2">{a.text}</div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </Card>
          {state.closeRun === 'done' && ready < 100 && (
            <Hint>
              Items waiting on you or an expert hold the close. Approve, reject, or escalate each one — every decision is written to the <Link href="/audit" className="font-medium text-brand-600 underline">audit log</Link>.
            </Hint>
          )}
          {ready >= 100 && (
            <Card className="border-ok-100 bg-ok-50/60 p-4">
              <div className="flex items-center gap-2 text-[14px] font-semibold text-ok-700"><CheckCircle2 className="h-5 w-5" /> Close ready for sign-off</div>
              <div className="mt-1 text-[12.5px] text-ok-700/80">All 9 agent work items are resolved. The draft financials and flux commentary are ready.</div>
            </Card>
          )}
        </div>
      </div>

      <ItemInspector item={open} onClose={() => setOpenId(null)} />
    </div>
  );
}

function planLabel(it: CloseItem) {
  const m: Record<string, string> = {
    'rec-us': 'Reconcile US operating account',
    'rec-ca': 'Reconcile Canada clearing accounts',
    'ic-us-uk': 'Match intercompany balances (14 pairs)',
    'anom-dup': 'Scan AP payments for duplicates',
    'anom-spend': 'Detect unusual spend by account',
    'acc-freight': 'Prepare unbilled freight accrual',
    'acc-payroll': 'Prepare payroll accrual',
    'rev-harbor': 'Revenue cut-off testing',
    cons: 'Draft consolidation & eliminations',
  };
  return m[it.id] ?? it.title;
}

function MiniStat({ n, label, tone }: { n: number; label: string; tone: string }) {
  return (
    <div>
      <div className={cn('text-[18px] font-semibold tabular-nums', tone)}>{n}</div>
      <div className="text-[11px] text-ink-3">{label}</div>
    </div>
  );
}

function Guard({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-1.5 rounded-lg bg-slate-50 px-2.5 py-2 text-ink-2">
      <span className="mt-0.5">{icon}</span>
      <span className="leading-snug">{text}</span>
    </div>
  );
}

type Tab = 'overview' | 'evidence' | 'reasoning' | 'policy' | 'audit';

function ItemInspector({ item, onClose }: { item: CloseItem | null; onClose: () => void }) {
  const { state, actions } = useStore();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');

  useEffect(() => {
    setTab('overview');
    setRejecting(false);
    setReason('');
  }, [item?.id]);

  const auditRows = useMemo(() => (item ? state.audit.filter((a) => a.itemId === item.id) : []), [state.audit, item]);
  if (!item) return <Drawer open={false} onClose={onClose} title="">{null}</Drawer>;

  const status = state.closeStatuses[item.id];
  const st = STATUS[status];
  const analyzed = status !== 'queued' && status !== 'analyzing';
  const outcome = decideOutcome(item, state.closeMode, state.thresholds);
  const jeNo = `JE-2409${CLOSE_ITEMS.indexOf(item) + 11}`;
  const isExpert = item.escalateTo?.startsWith('Expert');
  const existingCase = state.expertCases.find((c) => c.packId === 'harborview');

  let footer: React.ReactNode = null;
  if (!analyzed) {
    footer = <div className="text-[12.5px] text-ink-3">Run the Close Agent to analyze this item.</div>;
  } else if (status === 'awaiting_approval' || status === 'recommended') {
    footer = rejecting ? (
      <div className="flex items-center gap-2">
        <input autoFocus value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Why? (helps the agent learn)" className="h-9 flex-1 rounded-lg border border-line px-3 text-[13px] focus:border-brand-400 focus:outline-none" />
        <Button onClick={() => setRejecting(false)}>Cancel</Button>
        <Button variant="danger" onClick={() => { actions.rejectItem(item.id, reason || 'No reason given'); onClose(); }}>Reject</Button>
      </div>
    ) : (
      <div className="flex items-center justify-between gap-2">
        <Button variant="danger" onClick={() => setRejecting(true)} icon={<XCircle className="h-4 w-4" />}>Reject</Button>
        <div className="flex gap-2">
          <Button variant="ok" icon={<CheckCircle2 className="h-4 w-4" />} onClick={() => { actions.approveItem(item.id); onClose(); }}>
            {status === 'recommended' ? (item.journal ? 'Apply & post entry' : 'Apply recommendation') : item.id === 'cons' ? 'Sign off consolidation' : item.journal ? 'Approve & post' : 'Approve action'}
          </Button>
        </div>
      </div>
    );
  } else if (status === 'auto_executed' || status === 'approved') {
    footer = (
      <div className="flex items-center justify-between">
        <span className="text-[12.5px] text-ink-3">{item.journal ? `Posted as ${jeNo}` : 'Action executed'} · {status === 'auto_executed' ? 'autonomously within policy' : 'with your approval'}</span>
        {item.reversible && <Button variant="danger" icon={<Undo2 className="h-4 w-4" />} onClick={() => { actions.rollbackItem(item.id); onClose(); }}>Roll back</Button>}
      </div>
    );
  } else if (status === 'escalated') {
    footer = isExpert ? (
      <div className="flex items-center justify-between gap-2">
        <span className="text-[12.5px] text-ink-3">Context pack is pre-assembled — no re-explaining.</span>
        <Button variant="primary" icon={<Users className="h-4 w-4" />} onClick={() => { actions.openCase('harborview'); router.push('/experts'); }}>
          {existingCase ? 'Open expert case' : 'Escalate to expert'} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    ) : (
      <div className="flex items-center justify-end gap-2">
        <Button onClick={() => { actions.resolveReview(item.id, 'Confirmed as operating expense — no reclass'); onClose(); }}>Confirm: expense</Button>
        <Button variant="primary" onClick={() => { actions.resolveReview(item.id, 'Annual prepayment — reclassed $58,300 to Prepaid, amortize 12 months'); onClose(); }}>Confirm: annual prepayment</Button>
      </div>
    );
  } else {
    footer = <div className="text-[12.5px] text-ink-3">{status === 'resolved' ? 'Resolved with human or expert judgment.' : status === 'rejected' ? 'Rejected. Feedback captured for the agent.' : 'Reversed. Original and reversing entries retained.'}</div>;
  }

  return (
    <Drawer
      open={!!item}
      onClose={onClose}
      width={640}
      badge={
        <>
          <Badge tone={st.tone}>{st.label}</Badge>
          <Badge>{item.workstream}</Badge>
          <Badge>{item.entity}</Badge>
          {analyzed && <RiskBadge risk={item.risk} />}
        </>
      }
      title={analyzed ? item.title : planLabel(item)}
      subtitle={analyzed ? item.summary : 'Not analyzed yet.'}
      footer={footer}
    >
      {!analyzed ? (
        <Hint>The agent will pull data, investigate, and decide the route for this item based on risk, confidence and your autonomy policy.</Hint>
      ) : (
        <>
          <Tabs
            value={tab}
            onChange={setTab}
            className="mb-5"
            tabs={[
              { value: 'overview', label: 'Overview' },
              { value: 'evidence', label: 'Evidence', count: item.evidence.length },
              { value: 'reasoning', label: 'Reasoning' },
              { value: 'policy', label: 'Policy', count: item.policies.length },
              { value: 'audit', label: 'Audit', count: auditRows.length },
            ]}
          />
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              {tab === 'overview' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-line p-3">
                      <div className="text-[11.5px] text-ink-3">Confidence</div>
                      <div className="mt-1.5"><Confidence value={item.confidence} /></div>
                    </div>
                    <div className="rounded-xl border border-line p-3">
                      <div className="text-[11.5px] text-ink-3">Amount</div>
                      <div className="mt-1 text-[15px] font-semibold tabular-nums">{usd(item.amount, { cents: item.amount < 10000 })}</div>
                    </div>
                    <div className="rounded-xl border border-line p-3">
                      <div className="text-[11.5px] text-ink-3">Reversible</div>
                      <div className="mt-1 text-[15px] font-semibold">{item.reversible ? 'Yes' : 'N/A'}</div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-ink-3"><Sparkles className="h-3.5 w-3.5 text-agent-600" /> Proposed action</div>
                    <div className="rounded-xl border border-agent-100 bg-agent-50/50 p-3.5 text-[13.5px] text-ink">{item.proposedAction}</div>
                    {item.journal && <div className="mt-3"><JournalTable lines={item.journal} /></div>}
                  </div>

                  <div>
                    <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-ink-3"><Gauge className="h-3.5 w-3.5" /> Why this route</div>
                    <div className="flex items-start gap-3 rounded-xl border border-line p-3.5">
                      <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', outcome === 'auto' ? 'bg-agent-50 text-agent-600' : outcome === 'escalate' ? 'bg-risk-50 text-risk-600' : outcome === 'approval' ? 'bg-warn-50 text-warn-600' : 'bg-brand-50 text-brand-600')}>
                        {outcome === 'auto' ? <Sparkles className="h-4 w-4" /> : outcome === 'escalate' ? <ShieldAlert className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className="text-[13.5px] font-semibold">
                          {outcome === 'auto' ? 'Autonomous execution' : outcome === 'escalate' ? `Escalate → ${item.escalateTo}` : outcome === 'approval' ? 'Human approval required' : 'Recommendation only'}
                        </div>
                        <div className="text-[12.5px] text-ink-3">{outcomeReason(item, state.closeMode, state.thresholds)}</div>
                        <div className="mt-1.5 text-[12px] text-ink-3">Approver: {item.id === 'cons' || item.workstream === 'Intercompany' ? 'Controller' : outcome === 'escalate' ? (isExpert ? 'Qualified expert + Controller' : 'Controller') : 'Controller or CFO'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[12.5px]">
                    <div className="rounded-xl bg-slate-50 p-3"><span className="text-ink-3">Evidence sources</span><div className="mt-0.5 font-medium">{item.evidence.map((e) => e.source.split(' ')[0]).filter((v, i, a) => a.indexOf(v) === i).join(' · ')}</div></div>
                    <div className="rounded-xl bg-slate-50 p-3"><span className="text-ink-3">Manual effort replaced</span><div className="mt-0.5 font-medium">≈ {item.minutesSaved} min <Assumption>Est.</Assumption></div></div>
                  </div>
                </div>
              )}
              {tab === 'evidence' && <EvidenceList items={item.evidence} />}
              {tab === 'reasoning' && (
                <div>
                  <TraceList items={item.trace} />
                  <div className="mt-5"><Hint>The reasoning trace is a structured summary of the agent’s steps and tool calls — calculations are deterministic and reproducible from the evidence.</Hint></div>
                </div>
              )}
              {tab === 'policy' && (
                <div className="space-y-4">
                  <PolicyList items={item.policies} />
                  <div className="rounded-xl border border-line p-3 text-[12.5px] text-ink-3">
                    Current thresholds: autonomous ≤ <b className="text-ink-2">{usd(state.thresholds.autoLimit)}</b>, confidence ≥ <b className="text-ink-2">{state.thresholds.minConfidence}%</b>, escalate below <b className="text-ink-2">{state.thresholds.escalateBelow}%</b>. <Link href="/trust" className="font-medium text-brand-600 hover:underline">Edit in Trust Center</Link>
                  </div>
                </div>
              )}
              {tab === 'audit' && (
                <div className="space-y-2">
                  {auditRows.length === 0 && <div className="text-[13px] text-ink-3">No audit entries yet.</div>}
                  {auditRows.map((a) => (
                    <div key={a.id} className="flex gap-3 rounded-xl border border-line p-3">
                      <div className={cn('mt-1 h-2 w-2 shrink-0 rounded-full', a.actorType === 'agent' ? 'bg-agent-500' : a.actorType === 'expert' ? 'bg-violet-500' : 'bg-brand-500')} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] font-semibold">{a.action}</span>
                          <span className="font-mono text-[11px] text-ink-4">{a.ts}</span>
                        </div>
                        <div className="text-[12.5px] text-ink-3">{a.actor} · {a.approval}{a.policy ? ` · ${a.policy}` : ''}</div>
                        {a.evidence && <div className="mt-0.5 text-[12px] text-ink-4">{a.evidence}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </Drawer>
  );
}
