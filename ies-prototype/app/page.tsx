'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle, Briefcase, Code2, Presentation, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Logo } from '@/components/shell/Shell';
import { PILLARS } from '@/lib/data/strategy';
import { cn } from '@/lib/format';

const PHASES = [
  { p: 'Understand', t: 'Sep close · 3 entities · 1,996 bank lines pulled' },
  { p: 'Investigate', t: 'US↔UK management fee off by $1,215.40' },
  { p: 'Decide', t: 'Root cause: wrong FX rate date · policy IC-02 applies' },
  { p: 'Act', t: 'True-up prepared → routed to Controller for approval' },
  { p: 'Verify', t: 'Pair nets to $0.00 · audit record written' },
];

export default function Landing() {
  const router = useRouter();
  const { actions } = useStore();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPhase((p) => (p + 1) % (PHASES.length + 2)), 1300);
    return () => clearInterval(t);
  }, []);

  const startDemo = () => {
    actions.setDemo({ active: true, step: 0 });
    actions.setRole('business');
    router.push('/command-center');
  };

  return (
    <div className="grid-bg min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[1280px] flex-col px-10">
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-2.5">
            <Logo className="h-9 w-9" />
            <div>
              <div className="text-[16px] font-semibold tracking-tight">Orbit</div>
              <div className="text-[11.5px] text-ink-3">Intuit Enterprise Suite · product concept</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[12.5px] text-ink-3">
            <span className="rounded-full border border-line bg-white px-3 py-1">Clickable prototype</span>
            <span className="rounded-full border border-line bg-white px-3 py-1">Fictional demo data</span>
            <span className="rounded-full border border-line bg-white px-3 py-1">AI simulated deterministically</span>
          </div>
        </header>

        <div className="grid flex-1 grid-cols-[1.1fr_0.9fr] items-center gap-14 pb-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-agent-100 bg-agent-50 px-3 py-1 text-[12.5px] font-medium text-agent-700">
              <Sparkles className="h-3.5 w-3.5" /> The AI-native business platform for the mid-market
            </div>
            <h1 className="text-[52px] font-semibold leading-[1.05] tracking-[-0.025em] text-ink">
              From system of record
              <br />
              to <span className="text-brand-600">system of action.</span>
            </h1>
            <p className="mt-5 max-w-[560px] text-[17px] leading-relaxed text-ink-2">
              Orbit puts AI agents, human experts and third-party developers on one trusted business context. Agents understand, decide and act — with evidence, policy and an audit trail — while finance leaders stay at the center.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button onClick={startDemo} className="flex h-12 items-center gap-2 rounded-xl bg-ink px-5 text-[15px] font-semibold text-white shadow-pop transition hover:bg-ink/90">
                <PlayCircle className="h-5 w-5" /> Start guided demo <span className="font-normal text-white/60">· 10 steps, ~14 min</span>
              </button>
              <Link href="/command-center" onClick={() => actions.setRole('business')} className="flex h-12 items-center gap-2 rounded-xl border border-line bg-white px-4 text-[14px] font-medium text-ink-2 hover:bg-slate-50">
                <Briefcase className="h-4 w-4" /> Explore as CFO
              </Link>
              <Link href="/developer" onClick={() => actions.setRole('developer')} className="flex h-12 items-center gap-2 rounded-xl border border-line bg-white px-4 text-[14px] font-medium text-ink-2 hover:bg-slate-50">
                <Code2 className="h-4 w-4" /> Explore as developer
              </Link>
              <Link href="/strategy" className="flex h-12 items-center gap-2 rounded-xl px-3 text-[14px] font-medium text-ink-2 hover:bg-white">
                <Presentation className="h-4 w-4" /> Case study <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* Agent loop visual */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="rounded-2xl border border-line bg-white p-5 shadow-pop">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-agent-50 text-agent-600">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[14px] font-semibold">Close Agent</div>
                  <div className="text-[11.5px] text-ink-3">Cascadia Supply Group · September close</div>
                </div>
              </div>
              <span className="rounded-md border border-warn-100 bg-warn-50 px-2 py-0.5 text-[11.5px] font-medium text-warn-700">Approve mode</span>
            </div>
            <div className="mt-5 space-y-2.5">
              {PHASES.map((ph, i) => {
                const state = phase > i ? 'done' : phase === i ? 'active' : 'todo';
                return (
                  <div key={ph.p} className={cn('flex items-start gap-3 rounded-xl border px-3.5 py-2.5 transition-all duration-500', state === 'active' ? 'border-agent-500/40 bg-agent-50' : state === 'done' ? 'border-line bg-white' : 'border-transparent bg-slate-50 opacity-50')}>
                    <div className={cn('mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold', state === 'done' ? 'bg-ok-500 text-white' : state === 'active' ? 'bg-agent-600 text-white' : 'bg-slate-200 text-ink-3')}>
                      {state === 'done' ? <Check className="h-3 w-3" /> : i + 1}
                    </div>
                    <div>
                      <div className="text-[12px] font-semibold uppercase tracking-wider text-ink-3">{ph.p}</div>
                      <div className="text-[13.5px] text-ink">{ph.t}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4 text-[12px]">
              <div><div className="text-ink-3">Confidence</div><div className="font-semibold text-ok-700">94%</div></div>
              <div><div className="text-ink-3">Evidence</div><div className="font-semibold">3 sources</div></div>
              <div><div className="flex items-center gap-1 text-ink-3"><ShieldCheck className="h-3 w-3" /> Policy</div><div className="font-semibold">IC-02 · approval</div></div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-4 gap-4 pb-10">
          {PILLARS.map((p, i) => (
            <motion.div key={p.n} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.06 }} className="rounded-2xl border border-line bg-white/80 p-4 backdrop-blur">
              <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-4">Pillar {p.n}</div>
              <div className="mt-1 text-[15px] font-semibold">{p.name}</div>
              <div className="mt-1 text-[13px] leading-snug text-ink-3">{p.line}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
