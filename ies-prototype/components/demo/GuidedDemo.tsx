'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, X, Minimize2, Maximize2, Sparkles, MousePointerClick } from 'lucide-react';
import { useStore } from '@/lib/store';
import { DEMO_STEPS } from '@/lib/data/demo';
import { cn } from '@/lib/format';

export function GuidedDemo() {
  const { state, actions } = useStore();
  const router = useRouter();
  const [min, setMin] = useState(false);
  const { active, step } = state.demo;
  const s = DEMO_STEPS[step];

  const go = (i: number) => {
    const next = DEMO_STEPS[i];
    actions.setDemo({ active: true, step: i });
    actions.setRole(next.role);
    router.push(next.route);
  };

  return (
    <AnimatePresence>
      {active && s && (
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          className="fixed bottom-5 right-5 z-[35] w-[400px] overflow-hidden rounded-2xl border border-ink/10 bg-ink text-white shadow-pop"
        >
          <div className="flex items-center justify-between px-4 pt-3.5">
            <div className="flex items-center gap-2 text-[11.5px] font-medium uppercase tracking-[0.1em] text-white/60">
              <Sparkles className="h-3.5 w-3.5 text-agent-500" /> Guided demo · {step + 1} / {DEMO_STEPS.length}
              <span className="normal-case tracking-normal text-white/40">· {s.minutes}</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setMin((m) => !m)} className="rounded p-1 text-white/60 hover:bg-white/10 hover:text-white" aria-label={min ? 'Expand' : 'Minimize'}>
                {min ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
              </button>
              <button onClick={() => actions.setDemo({ active: false, step })} className="rounded p-1 text-white/60 hover:bg-white/10 hover:text-white" aria-label="Exit demo">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex gap-1 px-4 pt-2.5">
            {DEMO_STEPS.map((d, i) => (
              <button key={d.id} onClick={() => go(i)} title={d.title} className={cn('h-1 flex-1 rounded-full transition-colors', i <= step ? 'bg-agent-500' : 'bg-white/15 hover:bg-white/30')} />
            ))}
          </div>
          <div className="px-4 pb-1 pt-3">
            <div className="text-[16px] font-semibold">{s.title}</div>
            {!min && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={s.id}>
                <p className="mt-1.5 text-[13px] leading-relaxed text-white/75">{s.say}</p>
                <div className="mt-3 space-y-1.5">
                  {s.doThis.map((d) => (
                    <div key={d} className="flex gap-2 text-[12.5px] text-white/90">
                      <MousePointerClick className="mt-0.5 h-3.5 w-3.5 shrink-0 text-agent-500" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 rounded-lg bg-white/[0.07] px-3 py-2 text-[12.5px] italic text-white/80">“{s.moment}”</div>
              </motion.div>
            )}
          </div>
          <div className="flex items-center justify-between gap-2 px-4 pb-3.5 pt-3">
            <button
              onClick={() => {
                actions.reset();
                setTimeout(() => {
                  actions.setDemo({ active: true, step: 0 });
                  router.push(DEMO_STEPS[0].route);
                }, 50);
              }}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[12.5px] text-white/60 hover:bg-white/10 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset demo
            </button>
            <div className="flex items-center gap-2">
              <button
                disabled={step === 0}
                onClick={() => go(step - 1)}
                className="flex items-center gap-1 rounded-lg border border-white/15 px-2.5 py-1.5 text-[13px] text-white/90 hover:bg-white/10 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
              {step < DEMO_STEPS.length - 1 ? (
                <button onClick={() => go(step + 1)} className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-[13px] font-semibold text-ink hover:bg-white/90">
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button onClick={() => actions.setDemo({ active: false, step: 0 })} className="rounded-lg bg-agent-500 px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-agent-600">
                  Finish
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
