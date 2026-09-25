'use client';

import React, { useMemo, useState } from 'react';
import { Download, Search, Bot, User, Users, Server, Undo2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import type { AuditEntry } from '@/lib/types';
import { Badge, Button, Card, Drawer, PageHeader, Segmented } from '@/components/ui';
import { cn, usd } from '@/lib/format';

const ACTOR_ICON = { agent: Bot, human: User, expert: Users, system: Server };

export default function AuditLog() {
  const { state } = useStore();
  const [who, setWho] = useState<'all' | AuditEntry['actorType']>('all');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<AuditEntry | null>(null);

  const rows = useMemo(
    () =>
      state.audit.filter((a) => (who === 'all' || a.actorType === who) && (!q || [a.actor, a.action, a.target, a.policy ?? ''].join(' ').toLowerCase().includes(q.toLowerCase()))),
    [state.audit, who, q],
  );

  const exportCsv = () => {
    const head = ['timestamp', 'actor', 'actor_type', 'action', 'target', 'amount_usd', 'confidence', 'policy', 'approval', 'reversible', 'evidence'];
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = [head.join(','), ...rows.map((r) => [r.ts, r.actor, r.actorType, r.action, r.target, r.amount ?? '', r.confidence ?? '', r.policy ?? '', r.approval, r.reversible ?? '', r.evidence ?? ''].map(esc).join(','))].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ies-helm-audit-log.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader
        eyebrow={<>Governance</>}
        title="Audit & Activity Log"
        subtitle="An immutable record of every agent, human, expert and system action — with confidence, policy, approval and evidence. Actions you take in this prototype appear here in real time."
        right={<Button icon={<Download className="h-4 w-4" />} onClick={exportCsv}>Export CSV for auditors</Button>}
      />
      <div className="mb-4 flex items-center justify-between gap-4">
        <Segmented value={who} onChange={setWho} options={[{ value: 'all', label: `All · ${state.audit.length}` }, { value: 'agent', label: 'Agents' }, { value: 'human', label: 'Humans' }, { value: 'expert', label: 'Experts' }, { value: 'system', label: 'System' }]} />
        <div className="flex h-9 w-[320px] items-center gap-2 rounded-lg border border-line bg-white px-3">
          <Search className="h-4 w-4 text-ink-4" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search actor, action, policy…" className="flex-1 bg-transparent text-[13px] focus:outline-none" />
        </div>
      </div>
      <Card>
        <div className="grid grid-cols-[120px_190px_1.3fr_1.4fr_90px_80px_70px_140px] gap-3 border-b border-line bg-slate-50/70 px-5 py-2.5 text-[11.5px] font-medium uppercase tracking-wider text-ink-3 rounded-t-2xl">
          <span>Time</span><span>Actor</span><span>Action</span><span>Target</span><span className="text-right">Amount</span><span className="text-right">Conf.</span><span>Policy</span><span>Approval</span>
        </div>
        {rows.map((a) => {
          const Icon = ACTOR_ICON[a.actorType];
          return (
            <button key={a.id} onClick={() => setOpen(a)} className="grid w-full grid-cols-[120px_190px_1.3fr_1.4fr_90px_80px_70px_140px] items-center gap-3 border-b border-line px-5 py-2.5 text-left text-[12.5px] last:border-0 hover:bg-slate-50">
              <span className="font-mono text-[11.5px] text-ink-3">{a.ts}</span>
              <span className="flex min-w-0 items-center gap-2">
                <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-md', a.actorType === 'agent' ? 'bg-agent-50 text-agent-700' : a.actorType === 'expert' ? 'bg-violet-50 text-violet-700' : a.actorType === 'system' ? 'bg-slate-100 text-ink-2' : 'bg-brand-50 text-brand-700')}><Icon className="h-3.5 w-3.5" /></span>
                <span className="truncate font-medium text-ink">{a.actor}</span>
              </span>
              <span className="truncate text-ink">{a.action}</span>
              <span className="truncate text-ink-2">{a.target}</span>
              <span className="text-right font-mono tabular-nums text-ink-2">{a.amount ? usd(a.amount, { compact: true }) : '—'}</span>
              <span className="text-right font-mono tabular-nums text-ink-2">{a.confidence ? `${a.confidence}%` : '—'}</span>
              <span className="font-mono text-[11.5px] text-ink-3">{a.policy ?? '—'}</span>
              <span><ApprovalBadge a={a.approval} /></span>
            </button>
          );
        })}
        {rows.length === 0 && <div className="py-12 text-center text-[13px] text-ink-3">No entries match.</div>}
      </Card>

      <Drawer open={!!open} onClose={() => setOpen(null)} title={open?.action ?? ''} subtitle={open ? `${open.actor} · ${open.ts}` : ''} width={520}>
        {open && (
          <div className="space-y-3 text-[13px]">
            {[
              ['Target', open.target],
              ['Actor type', open.actorType],
              ['Amount', open.amount ? usd(open.amount, { cents: true }) : '—'],
              ['Confidence', open.confidence ? `${open.confidence}%` : '—'],
              ['Policy', open.policy ?? '—'],
              ['Approval', open.approval],
              ['Reversible', open.reversible === undefined ? '—' : open.reversible ? 'Yes — reversing entry available' : 'No'],
              ['Evidence', open.evidence ?? '—'],
              ['Record hash', `sha256:${hash(open.id + open.ts).slice(0, 24)}…`],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[120px_1fr] gap-3 border-b border-line pb-2.5">
                <span className="text-ink-3">{k}</span>
                <span className={cn('text-ink', k === 'Record hash' && 'font-mono text-[12px] text-ink-3')}>{v}</span>
              </div>
            ))}
            {open.reversible && <div className="flex items-center gap-2 text-[12.5px] text-ink-3"><Undo2 className="h-3.5 w-3.5" /> Roll back from the originating screen (e.g., Close Agent item drawer).</div>}
          </div>
        )}
      </Drawer>
    </div>
  );
}

function ApprovalBadge({ a }: { a: AuditEntry['approval'] }) {
  const tone = a === 'Autonomous' ? 'agent' : a === 'Human approved' ? 'ok' : a === 'Human rejected' ? 'risk' : a === 'Escalated' ? 'violet' : a === 'Config change' ? 'brand' : 'neutral';
  return <Badge tone={tone}>{a}</Badge>;
}

function hash(s: string) {
  let h = 2166136261;
  let out = '';
  for (let r = 0; r < 4; r++) {
    for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i) ^ r, 16777619);
    out += (h >>> 0).toString(16).padStart(8, '0');
  }
  return out;
}
