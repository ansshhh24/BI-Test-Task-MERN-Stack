'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Presentation, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { LAYERS, ROADMAP, PILLARS } from '@/lib/data/strategy';
import { Button, Card, PageHeader } from '@/components/ui';
import { Flywheel } from '@/components/ai/Flywheel';
import { cn } from '@/lib/format';

const LAYER_META: Record<string, { color: string; demo: string; href: string; line: string }> = {
  Experience: { color: 'bg-brand-600', demo: 'Command Center · Close · Scenario Lab · Experts', href: '/command-center', line: 'One experience across finance, accounting, workforce, commerce, marketplace and experts' },
  Agents: { color: 'bg-agent-600', demo: 'Agent Workflows · Marketplace', href: '/workflows', line: 'First-party and third-party agents, with experts in the loop' },
  Orchestration: { color: 'bg-violet-600', demo: 'Close Agent activity & policy routing', href: '/close', line: 'Context, planning, tool use, policies, approvals and evaluation' },
  'Data / API': { color: 'bg-ink', demo: 'API Catalog', href: '/developer/apis', line: 'Semantic business data: finance, workforce, commerce, customers, events' },
  Developer: { color: 'bg-warn-600', demo: 'Studio · Test Lab · Publish · Analytics', href: '/developer/studio', line: 'APIs, SDK, sandbox, Agent Studio, eval tools, marketplace' },
  Trust: { color: 'bg-risk-600', demo: 'Trust Center · Audit Log', href: '/trust', line: 'Identity, permissions, governance, audit, security, evidence' },
};

export default function Vision() {
  const [hover, setHover] = useState<string | null>(null);
  const { state, actions } = useStore();
  const router = useRouter();
  return (
    <div>
      <PageHeader
        eyebrow={<>The platform vision</>}
        title="One trusted operating layer for the mid-market"
        subtitle="IES Helm connects businesses, AI agents, human experts and developers on a shared business context — so software that used to record the business can now understand it, decide, act and collaborate."
        right={<Link href="/strategy"><Button icon={<Presentation className="h-4 w-4" />}>Case study</Button></Link>}
      />

      <div className="grid grid-cols-[1.25fr_1fr] gap-6">
        <Card className="p-5">
          <div className="mb-3 text-[13px] font-semibold text-ink-3">Platform architecture · hover a layer to see where it lives in the prototype</div>
          <div className="space-y-2">
            {LAYERS.map((l, i) => {
              const m = LAYER_META[l.name];
              const trust = l.name === 'Trust';
              return (
                <motion.div
                  key={l.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onMouseEnter={() => setHover(l.name)}
                  onMouseLeave={() => setHover(null)}
                  className={cn('group flex items-stretch overflow-hidden rounded-xl border transition-all', hover === l.name ? 'border-slate-300 shadow-pop' : 'border-line', trust && 'border-risk-100')}
                >
                  <div className={cn('flex w-[130px] shrink-0 items-center px-4 text-[13px] font-semibold text-white', m.color)}>{l.name}</div>
                  <div className="flex-1 px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {l.items.map((it) => <span key={it} className="rounded-md bg-slate-100 px-2 py-0.5 text-[12px] text-ink-2">{it}</span>)}
                    </div>
                    <div className={cn('overflow-hidden text-[12px] text-ink-3 transition-all', hover === l.name ? 'mt-2 max-h-12' : 'max-h-0')}>
                      {m.line} · <Link href={m.href} className="font-medium text-brand-600">{m.demo} →</Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-3 text-[12px] text-ink-3">Trust is not a layer on top — it wraps every call: identity, scopes, policy and evidence are enforced for first- and third-party agents alike.</div>
        </Card>

        <Card className="flex items-center justify-center p-4">
          <Flywheel size={420} />
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        {PILLARS.map((p) => (
          <Card key={p.n} className="p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-4">Pillar {p.n}</div>
            <div className="text-[15px] font-semibold">{p.name}</div>
            <div className="mt-1 text-[12.5px] text-ink-3">{p.line}</div>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-5">
        <div className="mb-3 text-[14px] font-semibold">Roadmap</div>
        <div className="grid grid-cols-4 gap-3">
          {ROADMAP.map((r, i) => (
            <div key={r.phase} className="relative rounded-xl bg-slate-50 p-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-4">{r.horizon}</div>
              <div className="text-[15px] font-semibold">{r.phase}</div>
              <div className="mt-1 text-[12px] text-ink-3">{r.items.slice(0, 2).join(' · ')}</div>
              {i < 3 && <ArrowRight className="absolute -right-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 rounded-full bg-white p-0.5 text-ink-4 shadow-card" />}
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-6 overflow-hidden bg-ink p-8 text-white">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">The shift</div>
        <div className="mt-2 max-w-4xl text-[26px] font-semibold leading-tight tracking-tight">
          IES is evolving from software that records business activity into a trusted AI platform that understands, decides, acts, collaborates with humans — and lets an ecosystem add intelligence on top.
        </div>
        <div className="mt-5 flex gap-3">
          <Link href="/command-center"><Button variant="secondary">Explore the prototype</Button></Link>
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10"
            icon={<RotateCcw className="h-4 w-4" />}
            onClick={() => {
              actions.reset();
              setTimeout(() => {
                actions.setDemo({ active: true, step: 0 });
                router.push('/command-center');
              }, 50);
            }}
          >
            Restart demo {state.demo.active ? '' : 'from the top'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
