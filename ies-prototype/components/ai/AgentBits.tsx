'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Landmark, FileText, Receipt, BookOpen, Users, ShoppingBag, Mail, History, Warehouse, ShieldCheck, ShieldAlert, UserCheck, CheckCircle2 } from 'lucide-react';
import type { EvidenceItem, PolicyHit } from '@/lib/types';
import { cn } from '@/lib/format';

export const EVIDENCE_ICON: Record<EvidenceItem['kind'], React.ElementType> = {
  bank: Landmark,
  gl: BookOpen,
  invoice: Receipt,
  contract: FileText,
  payroll: Users,
  commerce: ShoppingBag,
  email: Mail,
  history: History,
  warehouse: Warehouse,
};

export function EvidenceList({ items }: { items: EvidenceItem[] }) {
  return (
    <div className="space-y-2">
      {items.map((e, i) => {
        const Icon = EVIDENCE_ICON[e.kind];
        return (
          <motion.div key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="flex gap-3 rounded-xl border border-line bg-white p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-ink-2">
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[13px] font-semibold text-ink">{e.label}</div>
                <div className="truncate text-[11px] text-ink-4">{e.source}</div>
              </div>
              <div className="mt-0.5 text-[12.5px] text-ink-2">{e.detail}</div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function PolicyList({ items }: { items: PolicyHit[] }) {
  return (
    <div className="space-y-2">
      {items.map((p) => {
        const map = {
          allows_autonomy: { icon: ShieldCheck, c: 'text-ok-600 bg-ok-50', label: 'Allows autonomy' },
          requires_approval: { icon: UserCheck, c: 'text-warn-600 bg-warn-50', label: 'Requires approval' },
          requires_escalation: { icon: ShieldAlert, c: 'text-risk-600 bg-risk-50', label: 'Requires escalation' },
          check_passed: { icon: CheckCircle2, c: 'text-brand-600 bg-brand-50', label: 'Check passed' },
        }[p.effect];
        const Icon = map.icon;
        return (
          <div key={p.id} className="flex gap-3 rounded-xl border border-line p-3">
            <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', map.c)}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11.5px] text-ink-3">{p.id}</span>
                <span className="text-[13px] font-semibold text-ink">{p.name}</span>
                <span className={cn('ml-auto rounded px-1.5 py-px text-[10.5px] font-semibold', map.c)}>{map.label}</span>
              </div>
              <div className="mt-0.5 text-[12.5px] text-ink-3">{p.detail}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const PHASE_COLOR: Record<string, string> = {
  Understand: 'bg-brand-500',
  Investigate: 'bg-violet-500',
  Decide: 'bg-warn-500',
  Act: 'bg-agent-500',
  Verify: 'bg-ok-500',
  Escalate: 'bg-risk-500',
};

export function TraceList({ items }: { items: { phase: string; text: string }[] }) {
  return (
    <ol className="relative ml-2 border-l border-line">
      {items.map((t, i) => (
        <motion.li key={i} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="relative mb-3.5 pl-5 last:mb-0">
          <span className={cn('absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-white', PHASE_COLOR[t.phase] ?? 'bg-ink-4')} />
          <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">{t.phase}</div>
          <div className="text-[13px] text-ink">{t.text}</div>
        </motion.li>
      ))}
    </ol>
  );
}

export function PhaseDot({ phase }: { phase: string }) {
  return <span className={cn('inline-block h-2 w-2 shrink-0 rounded-full', PHASE_COLOR[phase] ?? 'bg-ink-4')} />;
}

export function JournalTable({ lines }: { lines: { account: string; debit?: number; credit?: number; entity: string }[] }) {
  const f = (n?: number) => (n ? n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '');
  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <table className="w-full text-[12.5px]">
        <thead className="bg-slate-50 text-ink-3">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Account</th>
            <th className="px-3 py-2 text-left font-medium">Entity</th>
            <th className="px-3 py-2 text-right font-medium">Debit</th>
            <th className="px-3 py-2 text-right font-medium">Credit</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((l, i) => (
            <tr key={i} className="border-t border-line">
              <td className="px-3 py-2 text-ink">{l.account}</td>
              <td className="px-3 py-2 text-ink-3">{l.entity}</td>
              <td className="px-3 py-2 text-right font-mono tabular-nums">{f(l.debit)}</td>
              <td className="px-3 py-2 text-right font-mono tabular-nums">{f(l.credit)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** The five-step agent loop, shown compactly. */
export function AgentLoop({ active }: { active?: number }) {
  const steps = ['Understand', 'Investigate', 'Decide', 'Act', 'Verify'];
  return (
    <div className="flex items-center gap-1">
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <span className={cn('rounded-md px-2 py-0.5 text-[11.5px] font-medium transition-colors', active === undefined ? 'bg-slate-100 text-ink-2' : i < active ? 'bg-ok-50 text-ok-700' : i === active ? 'bg-agent-600 text-white' : 'bg-slate-100 text-ink-4')}>{s}</span>
          {i < steps.length - 1 && <span className="text-ink-4">→</span>}
        </React.Fragment>
      ))}
    </div>
  );
}
