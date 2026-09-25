'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CornerDownLeft, LineChart, Play, Sparkles, Store, Compass } from 'lucide-react';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/format';

interface Cmd {
  id: string;
  label: string;
  hint: string;
  group: 'Agent jobs' | 'Ask' | 'Go to';
  icon: React.ElementType;
  run: () => void;
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const { actions } = useStore();
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ('');
      setIdx(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const commands = useMemo<Cmd[]>(() => {
    const go = (href: string) => () => router.push(href);
    return [
      { id: 'run-close', label: 'Run the September close', hint: 'Close Agent', group: 'Agent jobs', icon: Play, run: () => { router.push('/close'); setTimeout(actions.runClose, 400); } },
      { id: 'collect', label: 'Start a collections sprint', hint: 'Collections Agent', group: 'Agent jobs', icon: Play, run: () => { actions.runJob('collections-sprint'); router.push('/command-center'); } },
      { id: 'freight', label: 'Find an agent to audit freight invoices', hint: 'Marketplace', group: 'Agent jobs', icon: Store, run: go('/marketplace?focus=freightaudit') },
      { id: 'q1', label: 'What if Q4 revenue drops 8% and customers pay 7 days slower?', hint: 'Scenario Lab', group: 'Ask', icon: LineChart, run: go('/scenarios?q=' + encodeURIComponent('What if Q4 revenue drops 8% and customers pay 7 days slower?')) },
      { id: 'q2', label: 'What if we delay 12 hires and raise prices 2%?', hint: 'Scenario Lab', group: 'Ask', icon: LineChart, run: go('/scenarios?q=' + encodeURIComponent('What if we delay 12 hires and raise prices 2%?')) },
      ...[
        ['AI Command Center', '/command-center'], ['Financial Close Agent', '/close'], ['Scenario Lab', '/scenarios'], ['Compliance Agent', '/compliance'], ['Expert Network', '/experts'],
        ['Marketplace', '/marketplace'], ['Trust Center', '/trust'], ['Audit Log', '/audit'], ['Agent Studio', '/developer/studio'], ['Test & Evaluation Lab', '/developer/test'],
        ['Publish & Monetize', '/developer/publish'], ['API Catalog', '/developer/apis'], ['Case Study Mode', '/strategy'], ['Platform Vision', '/vision'],
      ].map(([label, href]) => ({ id: href, label, hint: href, group: 'Go to' as const, icon: Compass, run: go(href) })),
    ];
  }, [router, actions]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    let list = s ? commands.filter((c) => c.label.toLowerCase().includes(s) || c.hint.toLowerCase().includes(s)) : commands;
    if (s && s.length > 6) {
      list = [
        ...list,
        { id: 'free', label: `Ask Scenario Lab: “${q.trim()}”`, hint: 'Natural-language scenario', group: 'Ask', icon: Sparkles, run: () => router.push('/scenarios?q=' + encodeURIComponent(q.trim())) },
      ];
    }
    return list;
  }, [q, commands, router]);

  const exec = (c?: Cmd) => {
    if (!c) return;
    c.run();
    onClose();
  };

  const groups = ['Agent jobs', 'Ask', 'Go to'] as const;

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[65] flex items-start justify-center bg-ink/25 pt-[12vh] backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            initial={{ y: -8, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -6, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-[620px] overflow-hidden rounded-2xl border border-line bg-white shadow-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
              <Sparkles className="h-5 w-5 text-agent-600" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => { setQ(e.target.value); setIdx(0); }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') { e.preventDefault(); setIdx((i) => Math.min(filtered.length - 1, i + 1)); }
                  if (e.key === 'ArrowUp') { e.preventDefault(); setIdx((i) => Math.max(0, i - 1)); }
                  if (e.key === 'Enter') exec(filtered[idx]);
                  if (e.key === 'Escape') onClose();
                }}
                placeholder="Give an agent a job, ask a what-if, or jump to a page…"
                className="flex-1 bg-transparent text-[15px] text-ink placeholder:text-ink-4 focus:outline-none"
              />
            </div>
            <div className="max-h-[420px] overflow-y-auto scroll-thin p-2">
              {filtered.length === 0 && <div className="px-3 py-6 text-center text-[13px] text-ink-3">No matches.</div>}
              {groups.map((g) => {
                const items = filtered.filter((c) => c.group === g);
                if (!items.length) return null;
                return (
                  <div key={g} className="mb-1">
                    <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-ink-4">{g}</div>
                    {items.map((c) => {
                      const i = filtered.indexOf(c);
                      const Icon = c.icon;
                      return (
                        <button
                          key={c.id}
                          onMouseEnter={() => setIdx(i)}
                          onClick={() => exec(c)}
                          className={cn('flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[13.5px]', i === idx ? 'bg-slate-100 text-ink' : 'text-ink-2')}
                        >
                          <Icon className="h-4 w-4 shrink-0 text-ink-3" />
                          <span className="flex-1 truncate">{c.label}</span>
                          <span className="text-[11.5px] text-ink-4">{c.hint}</span>
                          {i === idx ? <CornerDownLeft className="h-3.5 w-3.5 text-ink-4" /> : <ArrowRight className="h-3.5 w-3.5 text-transparent" />}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
