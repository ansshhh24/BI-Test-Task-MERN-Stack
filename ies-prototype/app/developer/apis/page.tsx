'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, Code2, Wrench, Lock } from 'lucide-react';
import { useStore } from '@/lib/store';
import { API_GROUPS, SAMPLE_RESPONSES } from '@/lib/data/developer';
import { Badge, Button, Card, PageHeader, Segmented, Hint } from '@/components/ui';
import { cn } from '@/lib/format';

const ALL = API_GROUPS.flatMap((g) => g.endpoints.map((e) => ({ ...e, group: g.group })));

export default function ApiCatalog() {
  const { actions } = useStore();
  const [sel, setSel] = useState('cashpos');
  const [view, setView] = useState<'sdk' | 'tool'>('sdk');
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<Record<string, string>>({});
  const ep = ALL.find((e) => e.id === sel)!;

  const tryIt = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResp((r) => ({ ...r, [sel]: SAMPLE_RESPONSES[sel] ?? SAMPLE_RESPONSES.default }));
      actions.completeOnboarding('call');
    }, 700);
  };

  const methodTone = (m: string) => (m === 'GET' ? 'bg-ok-50 text-ok-700' : m === 'POST' ? 'bg-brand-50 text-brand-700' : 'bg-violet-50 text-violet-700');

  return (
    <div>
      <PageHeader
        eyebrow={<>Developer experience</>}
        title="API Catalog"
        subtitle="AI-ready APIs across finance, workforce, commerce and customers — plus semantic endpoints and an agent runtime for approvals and escalations. Every endpoint is also exposed as a typed agent tool."
      />
      <div className="grid grid-cols-[320px_1fr] gap-5">
        <Card className="h-fit p-2">
          {API_GROUPS.map((g) => (
            <div key={g.group} className="mb-2">
              <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-ink-4">{g.group}</div>
              {g.endpoints.map((e) => (
                <button key={e.id} onClick={() => setSel(e.id)} className={cn('flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left', sel === e.id ? 'bg-slate-100' : 'hover:bg-slate-50')}>
                  <span className={cn('w-10 shrink-0 rounded px-1 py-px text-center font-mono text-[10px] font-bold', methodTone(e.method))}>{e.method}</span>
                  <span className="flex-1 truncate text-[13px] text-ink">{e.title}</span>
                  {e.semantic && <Sparkles className="h-3.5 w-3.5 text-agent-600" />}
                </button>
              ))}
            </div>
          ))}
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-2">
              <span className={cn('rounded px-1.5 py-0.5 font-mono text-[11px] font-bold', methodTone(ep.method))}>{ep.method}</span>
              <code className="font-mono text-[14px] text-ink">{ep.path}</code>
              {ep.semantic && <Badge tone="agent"><Sparkles className="h-3 w-3" />Semantic · AI-ready</Badge>}
            </div>
            <div className="mt-2 text-[16px] font-semibold">{ep.title}</div>
            <p className="mt-1 text-[13.5px] text-ink-2">{ep.desc}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px]">
              <Lock className="h-3.5 w-3.5 text-ink-4" />
              {ep.scopes.map((s) => <code key={s} className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11.5px] text-ink-2">{s}</code>)}
              <span className="text-ink-4">· rate limit 600/min (sandbox)</span>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <Segmented size="sm" value={view} onChange={setView} options={[{ value: 'sdk', label: <><Code2 className="h-3.5 w-3.5" />SDK request</> }, { value: 'tool', label: <><Wrench className="h-3.5 w-3.5" />Agent tool schema</> }]} />
              <Button variant="primary" size="sm" loading={loading} icon={<Play className="h-3.5 w-3.5" />} onClick={tryIt}>Try in sandbox</Button>
            </div>
            <pre className="overflow-x-auto bg-ink p-5 font-mono text-[12.5px] leading-relaxed text-white/90">
              {view === 'sdk'
                ? `import { IES } from '@ies/sdk';            // proposed SDK

const ies = new IES({ apiKey: process.env.IES_SANDBOX_KEY });
const res = await ies.request('${ep.method === 'SUB' ? 'SUBSCRIBE' : ep.method}', '${ep.path}');
console.log(res.data);`
                : JSON.stringify(
                    {
                      name: ep.id === 'cashpos' ? 'get_cash_position' : ep.title.toLowerCase().replace(/[^a-z]+/g, '_'),
                      description: ep.desc,
                      input_schema: { type: 'object', properties: { entity: { type: 'string', enum: ['consolidated', 'US', 'CA', 'UK'] } } },
                      'x-ies-policy': { scopes: ep.scopes, side_effects: ep.method === 'GET' ? 'none' : 'draft_or_write', requires_approval_over_usd: ep.method === 'GET' ? null : 25000, audit: true },
                    },
                    null,
                    2,
                  )}
            </pre>
            <AnimatePresence>
              {resp[sel] && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="border-t border-line">
                  <div className="flex items-center gap-2 px-5 pt-3 text-[12px]"><Badge tone="ok">200 OK</Badge><span className="text-ink-3">sandbox · 118 ms</span></div>
                  <pre className="max-h-[300px] overflow-auto px-5 py-3 font-mono text-[12px] leading-relaxed text-ink-2">{resp[sel]}</pre>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
          <Hint>“Semantic” endpoints return business meaning — definitions, drivers, lineage and confidence — so agents reason over facts instead of scraping reports. Endpoint names are proposed for this concept.</Hint>
        </div>
      </div>
    </div>
  );
}
