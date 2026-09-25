'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Play, Copy, ArrowRight, Timer } from 'lucide-react';
import { useStore } from '@/lib/store';
import { ONBOARDING_STEPS, SAMPLE_RESPONSES } from '@/lib/data/developer';
import { Assumption, Badge, Button, Card, PageHeader } from '@/components/ui';
import { cn } from '@/lib/format';

export default function Onboarding() {
  const { state, actions } = useStore();
  const router = useRouter();
  const [calling, setCalling] = useState(false);
  const [resp, setResp] = useState<string | null>(null);
  const firstOpen = ONBOARDING_STEPS.find((s) => !state.onboardingDone.includes(s.id))?.id;

  const runCall = () => {
    setCalling(true);
    setTimeout(() => {
      setCalling(false);
      setResp(SAMPLE_RESPONSES.cashpos);
      actions.completeOnboarding('call');
    }, 900);
  };

  return (
    <div>
      <PageHeader
        eyebrow={<>Developer onboarding</>}
        title="From sign-up to first agent"
        subtitle="A guided path with a ready-made sandbox company, scoped credentials and a working first API call — no sales call, no data-import project."
        right={<div className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-[13px]"><Timer className="h-4 w-4 text-agent-600" /> Target time to first call: <b>&lt; 5 min</b> <Assumption>Target</Assumption></div>}
      />
      <div className="max-w-[920px] space-y-3">
        {ONBOARDING_STEPS.map((s, i) => {
          const done = state.onboardingDone.includes(s.id);
          const active = s.id === firstOpen;
          return (
            <Card key={s.id} className={cn('p-5 transition-all', active && 'ring-2 ring-brand-100')}>
              <div className="flex items-start gap-4">
                <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold', done ? 'bg-ok-500 text-white' : active ? 'bg-ink text-white' : 'bg-slate-100 text-ink-3')}>{done ? <Check className="h-4 w-4" /> : i + 1}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-semibold">{s.title}</span>
                    <Badge>{s.time}</Badge>
                    {done && <Badge tone="ok">Done</Badge>}
                  </div>
                  <div className="text-[13px] text-ink-3">{s.desc}</div>

                  {s.id === 'call' && (active || done) && (
                    <div className="mt-3 space-y-2">
                      <pre className="overflow-x-auto rounded-xl bg-ink p-4 font-mono text-[12px] leading-relaxed text-white/90">
{`curl https://sandbox.api.ies.example/v1/semantic/cash-position \\
  -H "Authorization: Bearer $IES_SANDBOX_KEY" \\
  -d entity=consolidated`}
                      </pre>
                      {!done && <Button variant="primary" loading={calling} icon={<Play className="h-4 w-4" />} onClick={runCall}>Run in sandbox</Button>}
                      <AnimatePresence>
                        {resp && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                            <div className="mb-1 flex items-center gap-2 text-[12px]"><Badge tone="ok">200 OK</Badge><span className="text-ink-3">142 ms · AI-ready: definitions, lineage and confidence included</span></div>
                            <pre className="max-h-[260px] overflow-auto rounded-xl border border-line bg-slate-50 p-4 font-mono text-[12px] leading-relaxed text-ink-2">{resp}</pre>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {s.id === 'sdk' && (active || done) && (
                    <div className="mt-3 space-y-2">
                      <pre className="rounded-xl bg-ink p-4 font-mono text-[12px] leading-relaxed text-white/90">
{`npm install @ies/agent-sdk   # proposed package

import { Agent, tools } from '@ies/agent-sdk';
const agent = new Agent({ name: 'cash-recovery', tools: [tools.ar, tools.customers] });`}
                      </pre>
                      {!done && <Button icon={<Copy className="h-4 w-4" />} onClick={() => { actions.completeOnboarding('sdk'); actions.toast('Copied', 'Install command copied', 'info'); }}>Copy & mark done</Button>}
                    </div>
                  )}

                  {s.id === 'agent' && (active || done) && (
                    <div className="mt-3">
                      <Button variant="primary" icon={<ArrowRight className="h-4 w-4" />} onClick={() => { actions.completeOnboarding('agent'); router.push('/developer/studio'); }}>Open Agent Studio with a template</Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
