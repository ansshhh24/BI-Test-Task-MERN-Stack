'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Play, Loader2, CheckCircle2, XCircle, ShieldAlert, Clock, Wrench, Brain, ShieldCheck, Flag, Wand2, ArrowRight, AlertTriangle } from 'lucide-react';
import { useStore, type TestState } from '@/lib/store';
import { TEST_CASES, type TestCase } from '@/lib/data/developer';
import { Badge, Button, Card, CardHeader, Confidence, PageHeader, Hint } from '@/components/ui';
import { cn } from '@/lib/format';

export default function TestLab() {
  const { state, actions } = useStore();
  const [sel, setSel] = useState('t5');
  const res = state.tests.results;
  const currencyOn = state.studio.guardrails['currency'];
  const ran = state.tests.run === 'done';
  const running = state.tests.run === 'running';
  const fails = TEST_CASES.filter((t) => res[t.id] === 'fail');
  const passes = TEST_CASES.filter((t) => res[t.id] === 'pass' || res[t.id] === 'escalated');

  useEffect(() => {
    if (ran && fails.length) setSel(fails[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ran]);

  const tc = TEST_CASES.find((t) => t.id === sel)!;
  const r = res[tc.id];
  const view = r === 'fail' && tc.failVariant ? { ...tc, ...tc.failVariant } : tc;

  const score = ran ? Math.round((passes.length / TEST_CASES.length) * 100) : null;

  return (
    <div>
      <PageHeader
        eyebrow={<>Developer experience · Test & Evaluation Lab</>}
        title="Sandbox evaluation"
        subtitle="Run the agent against scripted scenarios in the synthetic sandbox — including adversarial and insufficient-data cases. Every tool call, reasoning step and policy check is traced."
        right={
          <Button variant="primary" size="lg" loading={running} icon={<Play className="h-4 w-4" />} onClick={actions.runTests} disabled={!state.studio.generated}>
            {running ? 'Running suite…' : ran ? 'Re-run suite' : 'Run evaluation suite'}
          </Button>
        }
      />
      {!state.studio.generated && (
        <div className="mb-4"><Hint>Generate the agent in <Link href="/developer/studio" className="font-medium text-brand-600 underline">Agent Studio</Link> first.</Hint></div>
      )}

      <div className="mb-5 grid grid-cols-5 gap-3">
        <Metric label="Evaluation score" value={score === null ? '—' : `${score}%`} tone={score === null ? undefined : score === 100 ? 'ok' : 'warn'} sub="Threshold ≥ 95%" />
        <Metric label="Critical tests" value={ran ? `${TEST_CASES.filter((t) => t.critical && res[t.id] !== 'fail').length}/${TEST_CASES.filter((t) => t.critical).length}` : '—'} tone={ran ? (fails.some((f) => f.critical) ? 'risk' : 'ok') : undefined} sub="Must all pass" />
        <Metric label="Policy violations" value={ran ? '0' : '—'} tone={ran ? 'ok' : undefined} sub="Across 8 scenarios" />
        <Metric label="Unsupported claims" value={ran ? '0' : '—'} tone={ran ? 'ok' : undefined} sub="Hallucination check" />
        <Metric label="Correct escalations" value={ran ? '2/2' : '—'} tone={ran ? 'ok' : undefined} sub="Escalated, didn’t guess" />
      </div>

      <AnimatePresence>
        {ran && fails.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-5">
            <Card className="flex items-center gap-4 border-warn-100 bg-warn-50/60 p-4">
              <AlertTriangle className="h-5 w-5 shrink-0 text-warn-600" />
              <div className="flex-1">
                <div className="text-[14px] font-semibold">1 critical failure: foreign-currency invoice</div>
                <div className="text-[12.5px] text-ink-2">The reminder stated $9,400 for a CAD 9,400 invoice. Suggested fix: enable the guardrail “Always state amounts in the invoice currency”.</div>
              </div>
              <Button variant="primary" icon={<Wand2 className="h-4 w-4" />} onClick={() => { actions.studio({ guardrails: { ...state.studio.guardrails, currency: true }, saved: false }); setTimeout(actions.runTests, 100); }}>Apply fix & re-run</Button>
            </Card>
          </motion.div>
        )}
        {ran && fails.length === 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-5">
            <Card className="flex items-center gap-4 border-ok-100 bg-ok-50/60 p-4">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-ok-600" />
              <div className="flex-1">
                <div className="text-[14px] font-semibold">All tests pass — ready for certification</div>
                <div className="text-[12.5px] text-ink-2">Evaluation results are attached to your submission automatically.</div>
              </div>
              <Link href="/developer/publish"><Button variant="ok" icon={<ArrowRight className="h-4 w-4" />}>Continue to Publish</Button></Link>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-[380px_1fr] gap-5">
        <Card className="h-fit">
          <CardHeader title="Scenarios" subtitle={`${TEST_CASES.length} tests · run #${state.tests.runs || 0}`} />
          <div className="px-2 pb-2">
            {TEST_CASES.map((t) => (
              <button key={t.id} onClick={() => setSel(t.id)} className={cn('flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left', sel === t.id ? 'bg-slate-100' : 'hover:bg-slate-50')}>
                <StatusIcon s={res[t.id]} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium">{t.name}</div>
                  <div className="text-[11.5px] text-ink-4">{t.critical ? 'Critical' : 'Standard'} · expects: {t.expected}</div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            title={tc.name}
            subtitle={tc.input}
            right={<ResultBadge s={r} />}
          />
          <div className="space-y-4 px-5 pb-5">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-line p-3"><div className="text-[11.5px] text-ink-3">Expected</div><div className="text-[13px] font-medium">{tc.expected}</div></div>
              <div className="rounded-xl border border-line p-3"><div className="text-[11.5px] text-ink-3">Agent confidence</div><div className="mt-1">{r === 'queued' || r === 'running' ? <span className="text-[13px] text-ink-4">—</span> : <Confidence value={view.confidence} size="sm" />}</div></div>
              <div className="rounded-xl border border-line p-3"><div className="text-[11.5px] text-ink-3">Guardrails in effect</div><div className="text-[13px] font-medium">{Object.values(state.studio.guardrails).filter(Boolean).length} of 7{!currencyOn && tc.id === 't7' ? ' (currency off)' : ''}</div></div>
            </div>

            <div>
              <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-ink-3">Trace</div>
              {r === 'queued' ? (
                <div className="rounded-xl border border-dashed border-line py-10 text-center text-[13px] text-ink-3">Run the suite to see tool calls, reasoning and policy checks.</div>
              ) : r === 'running' ? (
                <div className="flex items-center gap-2 py-8 text-[13px] text-agent-700"><Loader2 className="h-4 w-4 animate-spin" /> Executing in sandbox…</div>
              ) : (
                <div className="space-y-1.5">
                  {view.steps.map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className={cn('flex items-center gap-3 rounded-lg border px-3 py-2', s.ok === false ? 'border-risk-100 bg-risk-50/50' : 'border-line')}>
                      <StepIcon s={s} />
                      <span className={cn('flex-1 text-[12.5px]', s.kind === 'tool' || s.kind === 'result' ? 'font-mono text-[12px]' : '')}>{s.text}</span>
                      {s.ms && <span className="font-mono text-[11px] text-ink-4">{s.ms} ms</span>}
                      {s.kind === 'policy' && (s.ok ? <Badge tone="ok">pass</Badge> : <Badge tone="risk">fail</Badge>)}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {r !== 'queued' && r !== 'running' && (
              <div className={cn('rounded-xl p-3.5 text-[13px]', r === 'fail' ? 'bg-risk-50 text-risk-700' : r === 'escalated' ? 'bg-violet-50 text-violet-700' : 'bg-ok-50 text-ok-700')}>
                <span className="font-semibold">Outcome: </span>{view.actual}
              </div>
            )}
            {tc.id === 't5' && r === 'escalated' && (
              <Hint>This is the behavior we want: with only one prior invoice and no verified contact, the agent’s confidence is 41%. It escalates with what’s missing instead of inventing a payment plan — and this counts as a pass.</Hint>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Metric({ label, value, sub, tone }: { label: string; value: string; sub: string; tone?: 'ok' | 'warn' | 'risk' }) {
  return (
    <Card className="px-4 py-3.5">
      <div className="text-[12px] text-ink-3">{label}</div>
      <div className={cn('mt-1 text-[22px] font-semibold tabular-nums', tone === 'ok' ? 'text-ok-700' : tone === 'warn' ? 'text-warn-700' : tone === 'risk' ? 'text-risk-700' : 'text-ink')}>{value}</div>
      <div className="text-[11.5px] text-ink-4">{sub}</div>
    </Card>
  );
}

function StatusIcon({ s }: { s: TestState }) {
  if (s === 'running') return <Loader2 className="h-4 w-4 shrink-0 animate-spin text-agent-600" />;
  if (s === 'pass') return <CheckCircle2 className="h-4 w-4 shrink-0 text-ok-600" />;
  if (s === 'fail') return <XCircle className="h-4 w-4 shrink-0 text-risk-600" />;
  if (s === 'escalated') return <ShieldAlert className="h-4 w-4 shrink-0 text-violet-600" />;
  return <Clock className="h-4 w-4 shrink-0 text-ink-4" />;
}

function ResultBadge({ s }: { s: TestState }) {
  if (s === 'pass') return <Badge tone="ok">Pass</Badge>;
  if (s === 'fail') return <Badge tone="risk">Fail</Badge>;
  if (s === 'escalated') return <Badge tone="violet">Pass · escalated correctly</Badge>;
  if (s === 'running') return <Badge tone="agent">Running</Badge>;
  return <Badge>Not run</Badge>;
}

function StepIcon({ s }: { s: TestCase['steps'][number] }) {
  const m = { tool: Wrench, reason: Brain, policy: ShieldCheck, result: Flag }[s.kind];
  const I = m;
  return <I className={cn('h-4 w-4 shrink-0', s.kind === 'tool' ? 'text-brand-600' : s.kind === 'reason' ? 'text-violet-600' : s.kind === 'policy' ? (s.ok === false ? 'text-risk-600' : 'text-ok-600') : 'text-agent-600')} />;
}
