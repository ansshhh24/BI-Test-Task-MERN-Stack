'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Zap, Database, Sparkles, GitBranch, ShieldCheck, Send, CheckCircle2, Wand2, Save, FlaskConical, Users, Loader2, Lock, AlertTriangle, MessageSquare, Bot,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { DEFAULT_AGENT_PROMPT, STUDIO_GUARDRAILS, STUDIO_NODES, STUDIO_TEMPLATES, STUDIO_TOOLS } from '@/lib/data/developer';
import { Badge, Button, Card, PageHeader, Tabs, Toggle, Hint } from '@/components/ui';
import { cn, usd } from '@/lib/format';

const ICON: Record<string, React.ElementType> = { Zap, Database, Sparkles, GitBranch, ShieldCheck, Send, CheckCircle2 };

type NodeId = (typeof STUDIO_NODES)[number]['id'] | 'remind' | 'escalate';

export default function Studio() {
  const router = useRouter();
  const { state, actions } = useStore();
  const st = state.studio;
  const [prompt, setPrompt] = useState(st.prompt || DEFAULT_AGENT_PROMPT);
  const [generating, setGenerating] = useState(false);
  const [shown, setShown] = useState(st.generated ? 99 : 0);
  const [sel, setSel] = useState<NodeId>('gate');
  const [tab, setTab] = useState<'node' | 'tools' | 'guardrails'>('node');

  const generate = () => {
    setGenerating(true);
    setShown(0);
    const total = 9;
    for (let i = 1; i <= total; i++) setTimeout(() => setShown(i), 260 * i);
    setTimeout(() => {
      setGenerating(false);
      setShown(99);
      actions.studio({ generated: true, prompt, saved: false });
      actions.completeOnboarding('agent');
      actions.toast('Agent generated', '7-step workflow, 5 tools, 6 guardrails. Review before testing.', 'agent');
    }, 260 * (total + 1));
  };

  const visible = (i: number) => (!generating && st.generated) || shown >= i;
  const generated = st.generated || shown > 0;

  return (
    <div>
      <PageHeader
        eyebrow={<>Developer experience · Agent Studio</>}
        title={
          <span className="flex items-center gap-2">
            {st.name} <Badge tone="neutral">v0.{st.version}</Badge> {st.saved ? <Badge tone="ok">Saved</Badge> : st.generated ? <Badge tone="warn">Unsaved changes</Badge> : null}
          </span>
        }
        subtitle="Describe the job in plain English. Studio generates a governed workflow — triggers, IES data, tools, permissions, approval gates and guardrails — that you can inspect and edit."
        right={
          <>
            <Button icon={<Save className="h-4 w-4" />} disabled={!st.generated} onClick={() => { actions.studio({ saved: true, version: st.version + (st.saved ? 0 : 1) }); actions.toast('Version saved', `Cash Recovery Agent v0.${st.version + (st.saved ? 0 : 1)}`, 'info'); }}>Save version</Button>
            <Button variant="primary" icon={<FlaskConical className="h-4 w-4" />} disabled={!st.generated} onClick={() => router.push('/developer/test')}>Test in sandbox</Button>
          </>
        }
      />

      <div className="grid grid-cols-[280px_1fr_320px] gap-4">
        {/* Left: describe */}
        <div className="space-y-4">
          <Card className="p-4">
            <div className="mb-2 flex items-center gap-2 text-[13px] font-semibold"><MessageSquare className="h-4 w-4 text-agent-600" /> Describe your agent</div>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={10} className="w-full resize-none rounded-xl border border-line bg-slate-50 p-3 text-[13px] leading-relaxed text-ink focus:border-brand-400 focus:bg-white focus:outline-none" />
            <Button variant="agent" className="mt-3 w-full" loading={generating} icon={<Wand2 className="h-4 w-4" />} onClick={generate}>
              {st.generated ? 'Regenerate from description' : 'Generate agent from description'}
            </Button>
          </Card>
          <Card className="p-4">
            <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-ink-3">Templates</div>
            {STUDIO_TEMPLATES.map((t, i) => (
              <div key={t.id} className={cn('rounded-lg px-2.5 py-2', i === 0 ? 'bg-brand-50' : '')}>
                <div className="text-[13px] font-medium">{t.name} {i === 0 && <Badge tone="brand">In use</Badge>}</div>
                <div className="text-[12px] text-ink-3">{t.desc}</div>
              </div>
            ))}
          </Card>
        </div>

        {/* Center: canvas */}
        <Card className="grid-bg relative min-h-[640px] overflow-hidden p-6">
          {!generated ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-agent-50 text-agent-600"><Bot className="h-6 w-6" /></div>
              <div className="mt-3 text-[16px] font-semibold">Your workflow will appear here</div>
              <div className="mt-1 max-w-sm text-[13px] text-ink-3">Studio maps your description to Trigger → Read IES data → Analyze → Decide → Act, with approval gates and escalation paths.</div>
            </div>
          ) : (
            <div className="mx-auto flex max-w-[520px] flex-col items-center">
              {STUDIO_NODES.slice(0, 4).map((n, i) => (
                <React.Fragment key={n.id}>
                  <FlowNode node={n} show={visible(i + 1)} selected={sel === n.id} onClick={() => { setSel(n.id); setTab('node'); }} />
                  <Connector show={visible(i + 2)} />
                </React.Fragment>
              ))}
              {/* Branches */}
              <AnimatePresence>
                {visible(5) && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="relative grid w-full max-w-[560px] grid-cols-3 gap-2.5">
                    <div className="absolute -top-3 left-[16.6%] right-[16.6%] h-3 rounded-t-lg border-x border-t border-slate-300" />
                    <Branch label="< $5K, reliable payer" tone="agent">
                      <MiniNode title="Send reminder" sub="Autonomous (policy C-01)" icon={Send} selected={sel === 'remind'} onClick={() => { setSel('remind'); setTab('node'); }} />
                    </Branch>
                    <Branch label={`> ${usd(st.approvalLimit, { compact: true })} balance`} tone="warn">
                      <MiniNode title="Approval gate" sub="AR manager · SLA 4h" icon={ShieldCheck} selected={sel === 'gate'} onClick={() => { setSel('gate'); setTab('node'); }} warn />
                      <div className="mx-auto h-3 w-px bg-slate-300" />
                      <MiniNode title="Payment-plan offer" sub="Drafted → sent on approval" icon={Send} selected={sel === 'act'} onClick={() => { setSel('act'); setTab('node'); }} />
                    </Branch>
                    <Branch label="Dispute · hold · low data" tone="risk">
                      <MiniNode title="Escalate to human" sub="Context pack to AR team" icon={Users} selected={sel === 'escalate'} onClick={() => { setSel('escalate'); setTab('node'); }} risk />
                    </Branch>
                  </motion.div>
                )}
              </AnimatePresence>
              <Connector show={visible(7)} />
              <FlowNode node={STUDIO_NODES[6]} show={visible(7)} selected={sel === 'verify'} onClick={() => { setSel('verify'); setTab('node'); }} />
              {visible(8) && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 flex flex-wrap justify-center gap-1.5">
                  <Badge tone="brand"><Lock className="h-3 w-3" />4 scopes · least privilege</Badge>
                  <Badge tone="agent">{Object.values(st.guardrails).filter(Boolean).length} guardrails on</Badge>
                  <Badge tone="warn">1 approval gate</Badge>
                  <Badge tone="risk">1 escalation path</Badge>
                </motion.div>
              )}
            </div>
          )}
          {generating && (
            <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-agent-100 bg-white px-3 py-1 text-[12px] text-agent-700 shadow-card">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating workflow…
            </div>
          )}
        </Card>

        {/* Right: inspector */}
        <Card className="h-fit">
          <div className="px-4 pt-3">
            <Tabs value={tab} onChange={setTab} tabs={[{ value: 'node', label: 'Step' }, { value: 'tools', label: 'Tools & scopes' }, { value: 'guardrails', label: 'Guardrails' }]} />
          </div>
          <div className="p-4">
            {!st.generated && shown < 99 ? (
              <div className="text-[13px] text-ink-3">Generate the agent to inspect its steps, tools and guardrails.</div>
            ) : tab === 'node' ? (
              <NodeInspector id={sel} />
            ) : tab === 'tools' ? (
              <div className="space-y-2">
                {STUDIO_TOOLS.map((t) => {
                  const on = st.tools[t.id];
                  const dangerous = t.scope.endsWith(':write');
                  return (
                    <div key={t.id} className={cn('flex items-center gap-3 rounded-xl border p-2.5', on ? 'border-line' : 'border-dashed border-line bg-slate-50/60')}>
                      <div className="min-w-0 flex-1">
                        <div className="font-mono text-[12px] text-ink">{t.id}</div>
                        <div className={cn('font-mono text-[11px]', dangerous ? 'text-risk-700' : 'text-ink-3')}>{t.scope}</div>
                      </div>
                      <Toggle
                        on={on}
                        onChange={(v) => {
                          actions.studio({ tools: { ...st.tools, [t.id]: v }, saved: false });
                          if (v && dangerous) actions.toast('Write scope added', 'Certification requires a justification for GL/credit write access.', 'warn');
                        }}
                        label={t.id}
                      />
                    </div>
                  );
                })}
                <Hint>Tools map 1:1 to IES scopes. The customer approves these scopes at install; anything else is blocked at runtime.</Hint>
              </div>
            ) : (
              <div className="space-y-2">
                {STUDIO_GUARDRAILS.map((g) => (
                  <div key={g.id} className={cn('flex items-center gap-3 rounded-xl border p-2.5', !st.guardrails[g.id] && g.id === 'currency' ? 'border-warn-100 bg-warn-50/50' : 'border-line')}>
                    <div className="flex-1 text-[12.5px] text-ink">{g.label}</div>
                    <Toggle on={st.guardrails[g.id]} onChange={(v) => actions.studio({ guardrails: { ...st.guardrails, [g.id]: v }, saved: false })} label={g.label} />
                  </div>
                ))}
                {!st.guardrails['currency'] && (
                  <div className="flex gap-2 rounded-lg bg-warn-50 px-3 py-2 text-[12px] text-warn-700"><AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />Currency guardrail is off — the evaluation suite will catch what happens.</div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function FlowNode({ node, show, selected, onClick }: { node: (typeof STUDIO_NODES)[number]; show: boolean; selected: boolean; onClick: () => void }) {
  const Icon = ICON[node.icon];
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.96, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          onClick={onClick}
          className={cn('flex w-[320px] items-center gap-3 rounded-xl border bg-white p-3 text-left shadow-card transition-all', selected ? 'border-brand-500 ring-4 ring-brand-100' : 'border-line hover:border-slate-300')}
        >
          <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', node.type === 'Trigger' ? 'bg-warn-50 text-warn-600' : node.type === 'Analyze' || node.type === 'Decide' ? 'bg-violet-50 text-violet-600' : 'bg-agent-50 text-agent-600')}>
            <Icon className="h-[18px] w-[18px]" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">{node.type}</div>
            <div className="truncate text-[13.5px] font-semibold text-ink">{node.title}</div>
            <div className="truncate font-mono text-[11px] text-ink-4">{node.detail}</div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function Connector({ show }: { show: boolean }) {
  return <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: show ? 1 : 0 }} style={{ originY: 0 }} className="h-6 w-px bg-slate-300" />;
}

function Branch({ label, tone, children }: { label: string; tone: 'agent' | 'warn' | 'risk'; children: React.ReactNode }) {
  const c = { agent: 'text-agent-700 bg-agent-50', warn: 'text-warn-700 bg-warn-50', risk: 'text-risk-700 bg-risk-50' }[tone];
  return (
    <div className="flex flex-col items-center">
      <span className={cn('mb-2 mt-1 rounded-full px-2 py-0.5 text-[11px] font-medium', c)}>{label}</span>
      {children}
    </div>
  );
}

function MiniNode({ title, sub, icon: Icon, selected, onClick, warn, risk }: { title: string; sub: string; icon: React.ElementType; selected: boolean; onClick: () => void; warn?: boolean; risk?: boolean }) {
  return (
    <button onClick={onClick} className={cn('w-full rounded-xl border bg-white p-2.5 text-left shadow-card transition-all', selected ? 'border-brand-500 ring-4 ring-brand-100' : 'border-line hover:border-slate-300')}>
      <div className="flex items-center gap-2">
        <Icon className={cn('h-4 w-4', warn ? 'text-warn-600' : risk ? 'text-risk-600' : 'text-agent-600')} />
        <span className="text-[12.5px] font-semibold">{title}</span>
      </div>
      <div className="mt-0.5 text-[11px] text-ink-3">{sub}</div>
    </button>
  );
}

function NodeInspector({ id }: { id: NodeId }) {
  const { state, actions } = useStore();
  const st = state.studio;
  const Row = ({ k, v }: { k: string; v: React.ReactNode }) => (
    <div className="grid grid-cols-[96px_1fr] gap-2 border-b border-line py-2 text-[12.5px] last:border-0">
      <span className="text-ink-3">{k}</span>
      <span className="text-ink">{v}</span>
    </div>
  );
  if (id === 'gate')
    return (
      <div>
        <div className="mb-2 flex items-center gap-2 text-[14px] font-semibold"><ShieldCheck className="h-4 w-4 text-warn-600" />Approval gate</div>
        <Row k="Condition" v={`Balance > ${usd(st.approvalLimit)}`} />
        <Row k="Approver" v="Customer’s AR manager (role)" />
        <Row k="Evidence" v="Payment profile, aging, proposed plan" />
        <Row k="SLA" v="4 hours → reminder, 24h → expire" />
        <Row k="On reject" v="Log reason; no customer contact" />
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-[12px]"><span className="text-ink-3">Approval threshold</span><span className="font-mono font-semibold">{usd(st.approvalLimit)}</span></div>
          <input type="range" min={5000} max={100000} step={5000} value={st.approvalLimit} onChange={(e) => actions.studio({ approvalLimit: Number(e.target.value), saved: false })} className="w-full accent-brand-600" />
          <div className="mt-2 text-[11.5px] text-ink-3">Customers can tighten (never loosen) this in their Trust Center.</div>
        </div>
      </div>
    );
  const map: Record<string, { title: string; rows: [string, string][] }> = {
    trigger: { title: 'Trigger', rows: [['Event', 'invoice.overdue'], ['Filter', 'days_overdue > 15'], ['Frequency', 'Real-time; batched hourly'], ['Idempotency', 'One run per invoice per 7 days']] },
    read: { title: 'Read IES data', rows: [['Tools', 'get_payment_profile, list_open_invoices, get_disputes'], ['Scopes', 'read only'], ['PII', 'Redacted before model call']] },
    analyze: { title: 'Analyze', rows: [['Model', 'Propensity-to-pay v2 (IES)'], ['Explains', 'Top 3 factors per decision'], ['Sufficiency', 'Needs ≥ 3 paid invoices + 1 contact']] },
    decide: { title: 'Decide', rows: [['Paths', 'Remind · Payment plan · Escalate'], ['Policy', 'Tenant autonomy policy applied at runtime'], ['Low confidence', '< 70% → escalate']] },
    act: { title: 'Payment-plan offer', rows: [['Tool', 'propose_payment_plan'], ['Mode', 'Draft → sent after approval'], ['Limits', 'Max 3 instalments; no discounts']] },
    remind: { title: 'Send reminder', rows: [['Tool', 'create_reminder'], ['Autonomy', 'Autonomous under tenant policy C-01'], ['Tone', 'Personalized from payment history']] },
    escalate: { title: 'Escalate to human', rows: [['API', 'POST /v1/agents/escalations'], ['Pack', 'Invoice, history, dispute text, reasoning'], ['Routes to', 'AR team queue']] },
    verify: { title: 'Verify', rows: [['Checks', 'Delivery, response, payment received'], ['Writes', 'Audit record with evidence'], ['Learns', 'Updates propensity features']] },
  };
  const m = map[id];
  return (
    <div>
      <div className="mb-2 text-[14px] font-semibold">{m.title}</div>
      {m.rows.map(([k, v]) => <Row key={k} k={k} v={v} />)}
    </div>
  );
}
