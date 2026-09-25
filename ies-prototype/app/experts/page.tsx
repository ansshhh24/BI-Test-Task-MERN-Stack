'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Package, FileText, Paperclip, Bot, Send, Check, Star, Clock, Loader2, ShieldCheck, ArrowRight, History, MessageSquare, Sparkles, Lock, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { CONTEXT_PACKS, EXPERTS, PAST_CASES } from '@/lib/data/experts';
import type { ExpertCase } from '@/lib/types';
import { Assumption, Avatar, Badge, Button, Card, CardHeader, Confidence, PageHeader, Hint } from '@/components/ui';
import { cn } from '@/lib/format';

const STEPS = ['Context pack assembled', 'Expert matched', 'Sent', 'Expert reviewing', 'Response', 'Applied'];
const stepIndex = (s: ExpertCase['status']) => ({ draft: 1, sent: 2, in_review: 3, responded: 4, applied: 5 })[s];

export default function ExpertsPage() {
  const { state, actions } = useStore();
  const [selected, setSelected] = useState<string | null>(null);

  const cases = state.expertCases;
  useEffect(() => {
    if (!selected && cases.length) setSelected(cases[0].id);
  }, [cases, selected]);

  const current = cases.find((c) => c.id === selected) ?? null;
  const harborEscalated = state.closeStatuses['rev-harbor'] === 'escalated' && !cases.some((c) => c.packId === 'harborview');

  return (
    <div>
      <PageHeader
        eyebrow={<>Pillar 2 · Human + AI expertise</>}
        title="Expert Network"
        subtitle="When a decision needs professional judgment, agents hand off to vetted human experts with a structured context pack — the issue, data, AI analysis, evidence and prior actions. No one re-explains anything."
      />

      <div className="grid grid-cols-[300px_1fr] gap-5">
        {/* Case list */}
        <div className="space-y-4">
          <Card>
            <CardHeader title="Cases" subtitle={`${cases.filter((c) => c.status !== 'applied').length} open`} />
            <div className="space-y-1 px-2 pb-2">
              {cases.length === 0 && <div className="px-3 pb-3 text-[12.5px] text-ink-3">No open cases. Agents will suggest escalations when needed.</div>}
              {cases.map((c) => {
                const p = CONTEXT_PACKS[c.packId];
                return (
                  <button key={c.id} onClick={() => setSelected(c.id)} className={cn('w-full rounded-lg px-3 py-2.5 text-left transition-colors', selected === c.id ? 'bg-slate-100' : 'hover:bg-slate-50')}>
                    <div className="text-[13px] font-medium leading-snug text-ink">{p.title}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <CaseStatus s={c.status} />
                      <span className="text-[11.5px] text-ink-4">{p.origin}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card>
            <CardHeader title="Start from an agent finding" subtitle="Pre-built context packs" />
            <div className="space-y-1 px-2 pb-2">
              {Object.values(CONTEXT_PACKS).map((p) => {
                const exists = cases.some((c) => c.packId === p.id);
                return (
                  <button
                    key={p.id}
                    disabled={exists}
                    onClick={() => setSelected(actions.openCase(p.id))}
                    className="flex w-full items-start gap-2.5 rounded-lg px-3 py-2 text-left hover:bg-slate-50 disabled:opacity-50"
                  >
                    <Package className="mt-0.5 h-4 w-4 shrink-0 text-ink-3" />
                    <div className="min-w-0">
                      <div className="text-[12.5px] font-medium text-ink">{p.title}</div>
                      <div className="text-[11.5px] text-ink-4">{exists ? 'Case open' : p.origin}</div>
                    </div>
                    {p.id === 'harborview' && harborEscalated && <Badge tone="risk" className="ml-auto">Waiting</Badge>}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card>
            <CardHeader title="Past cases" icon={<History className="h-4 w-4" />} />
            <div className="space-y-2 px-5 pb-4">
              {PAST_CASES.map((p) => (
                <div key={p.id} className="text-[12.5px]">
                  <div className="font-medium text-ink-2">{p.title}</div>
                  <div className="text-ink-4">{p.expert} · {p.outcome} · {p.date}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Case workspace */}
        <div>{current ? <CaseWorkspace c={current} /> : <EmptyWorkspace onStart={() => setSelected(actions.openCase('harborview'))} />}</div>
      </div>
    </div>
  );
}

function CaseStatus({ s }: { s: ExpertCase['status'] }) {
  const m = { draft: ['neutral', 'Ready to send'], sent: ['brand', 'Sent'], in_review: ['violet', 'Expert reviewing'], responded: ['warn', 'Response ready'], applied: ['ok', 'Applied'] } as const;
  return <Badge tone={m[s][0]}>{m[s][1]}</Badge>;
}

function EmptyWorkspace({ onStart }: { onStart: () => void }) {
  return (
    <Card className="flex flex-col items-center justify-center px-10 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600"><MessageSquare className="h-6 w-6" /></div>
      <div className="mt-4 text-[17px] font-semibold">Human judgment, with full context</div>
      <p className="mt-1.5 max-w-md text-[13.5px] text-ink-3">
        The Close Agent found a $1.24M revenue cut-off question it should not decide alone. Open the case to see the context pack it assembled.
      </p>
      <Button variant="primary" className="mt-5" onClick={onStart} icon={<Package className="h-4 w-4" />}>Open Harborview case</Button>
    </Card>
  );
}

function CaseWorkspace({ c }: { c: ExpertCase }) {
  const { state, actions } = useStore();
  const pack = CONTEXT_PACKS[c.packId];
  const idx = stepIndex(c.status);
  const experts = useMemo(
    () => EXPERTS.map((e) => ({ ...e, fit: e.id === pack.expertId ? 96 : Math.max(40, e.match - 22) })).sort((a, b) => b.fit - a.fit),
    [pack.expertId],
  );
  const chosen = EXPERTS.find((e) => e.id === c.expertId)!;

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[11.5px] font-semibold uppercase tracking-wider text-ink-3">{pack.origin} · {pack.specialty}</div>
            <div className="mt-0.5 text-[18px] font-semibold">{pack.title}</div>
          </div>
          <CaseStatus s={c.status} />
        </div>
        <div className="mt-4 flex items-center gap-1">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-1.5">
                <div className={cn('flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold', i <= idx ? 'bg-ok-500 text-white' : i === idx + 1 ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-ink-4')}>
                  {i <= idx ? <Check className="h-3 w-3" /> : i + 1}
                </div>
                <span className={cn('text-[12px]', i <= idx ? 'font-medium text-ink' : 'text-ink-4')}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={cn('mx-1 h-px flex-1', i < idx ? 'bg-ok-500' : 'bg-line')} />}
            </React.Fragment>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-[1fr_340px] gap-4">
        {/* Context pack */}
        <Card>
          <CardHeader
            title="Context pack"
            subtitle="Assembled automatically by the agent"
            icon={<Package className="h-4 w-4" />}
            right={<Badge tone="agent"><Sparkles className="h-3 w-3" /> Auto-built</Badge>}
          />
          <div className="space-y-4 px-5 pb-5">
            <Section title="The question">
              <div className="rounded-xl border border-line bg-slate-50 p-3 text-[13.5px] font-medium text-ink">{pack.question}</div>
            </Section>
            <Section title="Supporting facts (from IES data)">
              <ul className="space-y-1.5">
                {pack.facts.map((f) => (
                  <li key={f} className="flex gap-2 text-[13px] text-ink-2"><FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-4" />{f}</li>
                ))}
              </ul>
            </Section>
            <Section title="AI analysis">
              <div className="rounded-xl border border-agent-100 bg-agent-50/50 p-3">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[12px] font-semibold text-agent-700"><Bot className="h-3.5 w-3.5" /> Agent’s view (not a decision)</span>
                  <Confidence value={pack.aiConfidence} size="sm" />
                </div>
                <div className="text-[13px] text-ink-2">{pack.aiAnalysis}</div>
              </div>
            </Section>
            <div className="grid grid-cols-2 gap-4">
              <Section title="Evidence attached">
                <div className="flex flex-wrap gap-1.5">
                  {pack.attachments.map((a) => (
                    <span key={a} className="flex items-center gap-1 rounded-md border border-line bg-white px-2 py-1 text-[11.5px] text-ink-2"><Paperclip className="h-3 w-3" />{a}</span>
                  ))}
                </div>
              </Section>
              <Section title="Previous actions">
                <ul className="space-y-1">
                  {pack.priorActions.map((a) => (
                    <li key={a} className="flex gap-1.5 text-[12.5px] text-ink-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ok-600" />{a}</li>
                  ))}
                </ul>
              </Section>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-[12px] text-ink-3">
              <Lock className="h-3.5 w-3.5" /> The expert sees only this pack (scope <code className="font-mono">context.pack:read</code>) — not your full books. Access expires when the case closes.
            </div>
          </div>
        </Card>

        {/* Expert + thread */}
        <div className="space-y-4">
          {c.status === 'draft' ? (
            <Card>
              <CardHeader title="Matched experts" subtitle="Ranked by specialty fit & availability" />
              <div className="space-y-2 px-4 pb-4">
                {experts.map((e, i) => (
                  <button key={e.id} onClick={() => actions.setCaseExpert(c.id, e.id)} className={cn('w-full rounded-xl border p-3 text-left transition-all', c.expertId === e.id ? 'border-brand-500 ring-4 ring-brand-50' : 'border-line hover:border-slate-300')}>
                    <div className="flex items-center gap-2.5">
                      <Avatar initials={e.initials} tone="violet" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 text-[13px] font-semibold">{e.name} {i === 0 && <Badge tone="ok">Best match</Badge>}</div>
                        <div className="truncate text-[11.5px] text-ink-3">{e.specialty}</div>
                      </div>
                      <div className="text-right text-[12px] font-semibold text-ok-700">{e.fit}%</div>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-ink-3">
                      <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-warn-500 text-warn-500" />{e.rating}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{e.sla.replace('Typically responds ', '')}</span>
                      <span>{e.price}</span>
                    </div>
                  </button>
                ))}
                <div className="flex items-center gap-1.5 pt-1 text-[11px] text-ink-4">Expert names are fictional; pricing <Assumption /></div>
              </div>
              <div className="border-t border-line px-4 py-3.5">
                <Button variant="primary" className="w-full" icon={<Send className="h-4 w-4" />} onClick={() => actions.sendCase(c.id)}>
                  Send context pack to {chosen.name.split(',')[0]}
                </Button>
              </div>
            </Card>
          ) : (
            <Card>
              <CardHeader title={chosen.name} subtitle={chosen.specialty} icon={<Avatar initials={chosen.initials} tone="violet" className="h-7 w-7" />} />
              <div className="space-y-3 px-4 pb-4">
                <SystemMsg text={`Context pack shared · ${pack.attachments.length} attachments · AI analysis · prior actions`} />
                <AnimatePresence>
                  {c.status === 'sent' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-[12.5px] text-ink-3">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Notifying expert…
                    </motion.div>
                  )}
                  {c.status === 'in_review' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-[12.5px] text-violet-700">
                      <span className="flex gap-0.5">
                        {[0, 1, 2].map((d) => <motion.span key={d} className="h-1.5 w-1.5 rounded-full bg-violet-500" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: d * 0.2 }} />)}
                      </span>
                      {chosen.name.split(',')[0]} is reviewing the pack
                    </motion.div>
                  )}
                </AnimatePresence>
                {(c.status === 'responded' || c.status === 'applied') && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-violet-100 bg-violet-50/50 p-3">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[13.5px] font-semibold text-ink">{pack.response.summary}</span>
                      <span className="text-[11px] text-ink-4">{pack.response.minutes} min · simulated</span>
                    </div>
                    <p className="text-[12.5px] leading-relaxed text-ink-2">{pack.response.body}</p>
                    <ol className="mt-2 space-y-1">
                      {pack.response.steps.map((s, i) => (
                        <li key={s} className="flex gap-2 text-[12.5px] text-ink-2"><span className="font-mono text-[11px] text-violet-700">{i + 1}.</span>{s}</li>
                      ))}
                    </ol>
                  </motion.div>
                )}
                {(c.status === 'responded' || c.status === 'applied') && (
                  <div className="grid grid-cols-2 gap-2 text-center text-[11.5px]">
                    <div className="rounded-lg bg-slate-50 p-2"><div className="text-[16px] font-semibold text-ink">0</div>clarifying questions</div>
                    <div className="rounded-lg bg-slate-50 p-2"><div className="text-[16px] font-semibold text-ink">{pack.response.minutes}m</div>to answer <Assumption className="ml-0.5">Sim</Assumption></div>
                  </div>
                )}
              </div>
              {c.status === 'responded' && (
                <div className="border-t border-line px-4 py-3.5">
                  <Button variant="ok" className="w-full" icon={<CheckCircle2 className="h-4 w-4" />} onClick={() => actions.applyCase(c.id)}>{pack.response.applyLabel}</Button>
                  <div className="mt-2 text-center text-[11.5px] text-ink-3">You stay accountable: applying posts the entry with the expert memo as evidence.</div>
                </div>
              )}
              {c.status === 'applied' && (
                <div className="flex items-center justify-between border-t border-line px-4 py-3.5">
                  <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-ok-700"><ShieldCheck className="h-4 w-4" /> Applied & logged</span>
                  {pack.itemId && <Link href="/close" className="flex items-center gap-1 text-[12.5px] font-medium text-brand-600">Back to close <ArrowRight className="h-3.5 w-3.5" /></Link>}
                </div>
              )}
            </Card>
          )}
          {pack.itemId && state.closeStatuses[pack.itemId] === 'queued' && <Hint>Tip: run the Close Agent first — this case normally starts from its escalation.</Hint>}
          {c.status === 'applied' && pack.itemId && (
            <Hint>The agent proposed a policy update (segregation-date check) so it can decide this pattern next time — pending your approval in the Trust Center.</Hint>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-[11.5px] font-semibold uppercase tracking-wider text-ink-3">{title}</div>
      {children}
    </div>
  );
}

function SystemMsg({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-[12px] text-ink-3">
      <Package className="h-3.5 w-3.5" /> {text}
    </div>
  );
}
