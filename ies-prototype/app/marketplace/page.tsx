'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Star, BadgeCheck, ShieldCheck, Truck, Landmark, FileText, Presentation, ShoppingBag, Warehouse, Users, ShieldAlert, Briefcase, Scale, ClipboardCheck, HandCoins,
  Check, Loader2, Eye, PenLine, FilePen, Sparkles, Hand, UserCheck, Rocket, AlertTriangle, Lock,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { DEV_AGENT_LISTING, MARKET_ITEMS } from '@/lib/data/marketplace';
import type { Autonomy, MarketItem } from '@/lib/types';
import { Assumption, Badge, Button, Card, Drawer, Modal, PageHeader, Segmented, Tabs, Hint } from '@/components/ui';
import { cn } from '@/lib/format';

const ICONS: Record<string, React.ElementType> = { Truck, Landmark, FileText, Presentation, ShoppingBag, Warehouse, Users, ShieldAlert, Briefcase, Scale, ClipboardCheck, HandCoins };

type Filter = 'all' | 'AI Agent' | 'App' | 'Integration' | 'Expert Service' | 'installed';

export default function Marketplace() {
  const { state } = useStore();
  const [filter, setFilter] = useState<Filter>('all');
  const [q, setQ] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const f = new URLSearchParams(window.location.search).get('focus');
    if (f) setOpenId(f);
  }, []);

  const items = useMemo(() => {
    const all = state.publish.published ? [DEV_AGENT_LISTING, ...MARKET_ITEMS] : MARKET_ITEMS;
    return all.filter((m) => {
      if (filter === 'installed' && !state.installed.includes(m.id)) return false;
      if (filter !== 'all' && filter !== 'installed' && m.kind !== filter) return false;
      const s = q.toLowerCase();
      return !s || [m.name, m.publisher, m.tagline, m.category].some((x) => x.toLowerCase().includes(s));
    });
  }, [filter, q, state.installed, state.publish.published]);

  const all = state.publish.published ? [DEV_AGENT_LISTING, ...MARKET_ITEMS] : MARKET_ITEMS;
  const open = all.find((m) => m.id === openId) ?? null;
  const featured = MARKET_ITEMS[0];

  return (
    <div>
      <PageHeader
        eyebrow={<>Ecosystem · Pillar 3</>}
        title="App + Agent Marketplace"
        subtitle="Certified third-party agents, apps, integrations and expert services — installed with explicit permissions and governed by the same Trust Center as first-party agents."
      />

      {/* Recommended */}
      {!state.installed.includes(featured.id) && (
        <Card className="mb-5 flex items-center gap-5 overflow-hidden border-agent-100 bg-gradient-to-r from-agent-50/80 to-white p-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white" style={{ background: featured.color }}>
            <Truck className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-[12px] font-semibold text-agent-700"><Sparkles className="h-3.5 w-3.5" /> Recommended for Cascadia · based on the Canada margin finding</div>
            <div className="mt-0.5 text-[16px] font-semibold">{featured.name} — {featured.tagline}</div>
            <div className="text-[13px] text-ink-3">3PL accessorial fees are driving 0.9 pts of the Canada margin decline. This certified agent audits every freight invoice against your contract.</div>
          </div>
          <Button variant="primary" onClick={() => setOpenId(featured.id)}>View agent</Button>
        </Card>
      )}

      <div className="mb-4 flex items-center justify-between gap-4">
        <Segmented
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'All' },
            { value: 'AI Agent', label: 'AI agents' },
            { value: 'App', label: 'Apps' },
            { value: 'Integration', label: 'Integrations' },
            { value: 'Expert Service', label: 'Expert services' },
            { value: 'installed', label: `Installed · ${all.filter((m) => state.installed.includes(m.id)).length}` },
          ]}
        />
        <div className="flex h-9 w-[300px] items-center gap-2 rounded-lg border border-line bg-white px-3">
          <Search className="h-4 w-4 text-ink-4" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search agents, apps, publishers…" className="flex-1 bg-transparent text-[13px] focus:outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <AnimatePresence>
          {items.map((m, i) => (
            <motion.div key={m.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.02 }}>
              <ListingCard m={m} installed={state.installed.includes(m.id)} onOpen={() => setOpenId(m.id)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {items.length === 0 && <div className="py-16 text-center text-[13px] text-ink-3">Nothing matches that search.</div>}
      <div className="mt-6 flex items-center gap-2 text-[12px] text-ink-4">All publishers and listings are fictional. Prices shown are <Assumption /> assumptions.</div>

      <ListingDrawer item={open} onClose={() => setOpenId(null)} />
    </div>
  );
}

function ListingIcon({ m, size = 'md' }: { m: MarketItem; size?: 'md' | 'lg' }) {
  const Icon = ICONS[m.icon] ?? Sparkles;
  return (
    <div className={cn('flex shrink-0 items-center justify-center rounded-xl text-white', size === 'lg' ? 'h-14 w-14 rounded-2xl' : 'h-10 w-10')} style={{ background: m.color }}>
      <Icon className={size === 'lg' ? 'h-7 w-7' : 'h-5 w-5'} />
    </div>
  );
}

function ListingCard({ m, installed, onOpen }: { m: MarketItem; installed: boolean; onOpen: () => void }) {
  return (
    <Card className="flex h-full cursor-pointer flex-col p-4 transition-all hover:-translate-y-0.5 hover:shadow-pop" onClick={onOpen}>
      <div className="flex items-start gap-3">
        <ListingIcon m={m} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[14.5px] font-semibold">{m.name}</span>
            {m.isNew && <Badge tone="agent">New</Badge>}
          </div>
          <div className="flex items-center gap-1 text-[12px] text-ink-3">
            {m.publisher} {m.publisherVerified && <BadgeCheck className="h-3.5 w-3.5 text-brand-600" />}
          </div>
        </div>
        {installed && <Badge tone="ok"><Check className="h-3 w-3" />Installed</Badge>}
      </div>
      <p className="mt-2.5 flex-1 text-[13px] leading-snug text-ink-2">{m.tagline}</p>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <Badge tone={m.kind === 'AI Agent' ? 'agent' : m.kind === 'Expert Service' ? 'violet' : 'neutral'}>{m.kind}</Badge>
        {m.certified ? <Badge tone="brand"><ShieldCheck className="h-3 w-3" />Certified</Badge> : <Badge tone="warn">Not certified</Badge>}
        {m.defaultAutonomy && <Badge>{m.permissions.some((p) => p.access === 'write') ? 'Writes data' : 'Read / draft only'}</Badge>}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-[12px]">
        <span className="flex items-center gap-1 text-ink-2"><Star className="h-3.5 w-3.5 fill-warn-500 text-warn-500" />{m.rating.toFixed(1)} <span className="text-ink-4">({m.reviews})</span> · <span className="text-ink-4">{m.installs} installs</span></span>
        <span className="font-medium text-ink-2">{m.price}</span>
      </div>
    </Card>
  );
}

function ListingDrawer({ item, onClose }: { item: MarketItem | null; onClose: () => void }) {
  const { state, actions } = useStore();
  const [tab, setTab] = useState<'overview' | 'permissions' | 'pricing' | 'developer'>('overview');
  const [installOpen, setInstallOpen] = useState(false);
  useEffect(() => setTab('overview'), [item?.id]);
  if (!item) return <Drawer open={false} onClose={onClose} title="">{null}</Drawer>;
  const installed = state.installed.includes(item.id);
  const isService = item.kind === 'Expert Service';

  return (
    <>
      <Drawer
        open={!!item}
        onClose={onClose}
        width={600}
        title={
          <div className="flex items-center gap-3">
            <ListingIcon m={item} size="lg" />
            <div>
              <div>{item.name}</div>
              <div className="flex items-center gap-1 text-[13px] font-normal text-ink-3">{item.publisher} {item.publisherVerified && <BadgeCheck className="h-3.5 w-3.5 text-brand-600" />}</div>
            </div>
          </div>
        }
        footer={
          <div className="flex items-center justify-between">
            <div className="text-[13px]"><span className="font-semibold">{item.price}</span> <span className="text-ink-3">· {item.priceNote}</span></div>
            {installed ? (
              <div className="flex gap-2">
                {item.kind === 'AI Agent' && <Link href="/trust"><Button>Manage in Trust Center</Button></Link>}
                {item.publisher !== 'Intuit' && <Button variant="danger" onClick={() => actions.uninstall(item.id)}>Uninstall</Button>}
              </div>
            ) : isService ? (
              <Button variant="primary" onClick={() => { actions.audit({ actor: 'Maya Chen (CFO)', actorType: 'human', action: 'Requested expert service', target: item.name, approval: 'N/A', evidence: 'Context pack will be attached automatically' }); actions.toast('Request sent', `${item.name}: an expert will be matched and receive your context pack.`); }}>Request service</Button>
            ) : (
              <Button variant="primary" onClick={() => setInstallOpen(true)}>Install {item.kind === 'AI Agent' ? 'agent' : ''}</Button>
            )}
          </div>
        }
      >
        <div className="mb-4 flex flex-wrap gap-1.5">
          <Badge tone={item.kind === 'AI Agent' ? 'agent' : item.kind === 'Expert Service' ? 'violet' : 'neutral'}>{item.kind}</Badge>
          {item.certified ? <Badge tone="brand"><ShieldCheck className="h-3 w-3" />IES Certified</Badge> : <Badge tone="warn">Not certified</Badge>}
          <Badge><Star className="h-3 w-3 fill-warn-500 text-warn-500" />{item.rating.toFixed(1)} · {item.reviews} reviews</Badge>
          <Badge>{item.category}</Badge>
        </div>
        <Tabs value={tab} onChange={setTab} className="mb-5" tabs={[{ value: 'overview', label: 'Overview' }, { value: 'permissions', label: 'Permissions', count: item.permissions.length }, { value: 'pricing', label: 'Pricing' }, { value: 'developer', label: 'Developer' }]} />
        {tab === 'overview' && (
          <div className="space-y-5">
            <p className="text-[14px] leading-relaxed text-ink-2">{item.description}</p>
            <ul className="space-y-1.5">
              {item.highlights.map((h) => (
                <li key={h} className="flex gap-2 text-[13px] text-ink-2">{h.toLowerCase().includes('not') || h.includes('Requests write') ? <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warn-600" /> : <Check className="mt-0.5 h-4 w-4 shrink-0 text-ok-600" />}{h}</li>
              ))}
            </ul>
            {item.evalScore && (
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-line p-3"><div className="text-[11.5px] text-ink-3">AI evaluation score</div><div className="text-[18px] font-semibold">{item.evalScore}/100</div></div>
                <div className="rounded-xl border border-line p-3"><div className="text-[11.5px] text-ink-3">Data domains</div><div className="text-[13px] font-medium">{item.dataDomains.join(', ')}</div></div>
                <div className="rounded-xl border border-line p-3"><div className="text-[11.5px] text-ink-3">Default autonomy</div><div className="text-[13px] font-medium capitalize">{item.defaultAutonomy ?? 'N/A'}</div></div>
              </div>
            )}
          </div>
        )}
        {tab === 'permissions' && (
          <div className="space-y-2">
            {item.permissions.map((p) => <PermRow key={p.scope} p={p} />)}
            <div className="pt-2"><Hint>Scopes are enforced by the IES permission gateway. Calls outside granted scopes are blocked and logged (policy SEC-03). You can revoke any data domain later in the Trust Center.</Hint></div>
          </div>
        )}
        {tab === 'pricing' && (
          <div className="space-y-3 text-[13px] text-ink-2">
            <div className="rounded-xl border border-line p-4">
              <div className="text-[18px] font-semibold text-ink">{item.price}</div>
              <div className="text-ink-3">{item.priceNote}</div>
            </div>
            <div className="flex items-center gap-2">Billed through your IES subscription · one invoice <Assumption /></div>
            <div className="flex items-center gap-2">Usage is metered by the IES agent runtime and visible in the Trust Center.</div>
          </div>
        )}
        {tab === 'developer' && (
          <div className="space-y-3 text-[13px] text-ink-2">
            <div className="flex items-center gap-2"><span className="font-semibold text-ink">{item.publisher}</span>{item.publisherVerified ? <Badge tone="brand">Verified publisher</Badge> : <Badge tone="warn">Unverified</Badge>}</div>
            <div>Built on IES Agent SDK · uses semantic APIs · sandbox-tested before certification.</div>
            <div className="text-ink-3">Support: in-app · Data processing addendum on file · Incident history: {item.id === 'vendorrisk' ? '1 blocked scope violation (Sep 30)' : 'none'}</div>
          </div>
        )}
      </Drawer>
      <InstallModal item={installOpen ? item : null} onClose={() => setInstallOpen(false)} />
    </>
  );
}

function PermRow({ p }: { p: MarketItem['permissions'][number] }) {
  const m = { read: { icon: Eye, tone: 'ok' as const, label: 'Read' }, draft: { icon: FilePen, tone: 'warn' as const, label: 'Draft only' }, write: { icon: PenLine, tone: 'risk' as const, label: 'Write' } }[p.access];
  const Icon = m.icon;
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line p-3">
      <Icon className="h-4 w-4 text-ink-3" />
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[12.5px] text-ink">{p.scope}</div>
        <div className="text-[12px] text-ink-3">{p.why}</div>
      </div>
      <Badge tone={m.tone}>{m.label}</Badge>
    </div>
  );
}

function InstallModal({ item, onClose }: { item: MarketItem | null; onClose: () => void }) {
  const { actions } = useStore();
  const [step, setStep] = useState(0);
  const [agree, setAgree] = useState(false);
  const [autonomy, setAutonomy] = useState<Autonomy>('approve');
  const [progress, setProgress] = useState(0);
  const isAgent = item?.kind === 'AI Agent';

  useEffect(() => {
    if (item) {
      setStep(0);
      setAgree(false);
      setAutonomy(item.defaultAutonomy ?? 'approve');
      setProgress(0);
    }
  }, [item]);

  const PROGRESS = ['Creating scoped credentials', 'Registering with Trust Center', 'Applying autonomy & approval policy', 'Connecting data domains'];
  const install = () => {
    setStep(2);
    PROGRESS.forEach((_, i) => setTimeout(() => setProgress(i + 1), 550 * (i + 1)));
    setTimeout(() => {
      actions.install(item!.id, autonomy);
      setStep(3);
    }, 550 * (PROGRESS.length + 1));
  };

  if (!item) return <Modal open={false} onClose={onClose} title="">{null}</Modal>;
  const steps = isAgent ? ['Permissions', 'Autonomy', 'Install'] : ['Permissions', 'Install'];

  return (
    <Modal
      open={!!item}
      onClose={onClose}
      width={560}
      title={`Install ${item.name}`}
      footer={
        step === 0 ? (
          <>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="primary" disabled={!agree} onClick={() => (isAgent ? setStep(1) : install())}>{isAgent ? 'Continue' : 'Install'}</Button>
          </>
        ) : step === 1 ? (
          <>
            <Button onClick={() => setStep(0)}>Back</Button>
            <Button variant="primary" onClick={install}>Install with {autonomy} mode</Button>
          </>
        ) : step === 3 ? (
          <>
            {isAgent && <Link href="/workflows"><Button>View in Agent Workflows</Button></Link>}
            <Button variant="primary" onClick={onClose}>Done</Button>
          </>
        ) : null
      }
    >
      <div className="mb-5 flex items-center gap-2">
        {steps.map((s, i) => {
          const cur = step === 3 ? steps.length : step === 2 ? steps.length - 1 : step;
          return (
            <React.Fragment key={s}>
              <div className={cn('flex items-center gap-1.5 text-[12.5px]', i <= cur ? 'font-medium text-ink' : 'text-ink-4')}>
                <span className={cn('flex h-5 w-5 items-center justify-center rounded-full text-[10.5px] font-bold', i < cur ? 'bg-ok-500 text-white' : i === cur ? 'bg-ink text-white' : 'bg-slate-100')}>{i < cur ? <Check className="h-3 w-3" /> : i + 1}</span>
                {s}
              </div>
              {i < steps.length - 1 && <div className="h-px flex-1 bg-line" />}
            </React.Fragment>
          );
        })}
      </div>

      {step === 0 && (
        <div className="space-y-2">
          <div className="text-[13px] text-ink-2">{item.name} is requesting:</div>
          {item.permissions.map((p) => <PermRow key={p.scope} p={p} />)}
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-[12px] text-ink-3"><Lock className="h-3.5 w-3.5" /> It will never receive access beyond these scopes. Everything it does is logged.</div>
          <label className="flex cursor-pointer items-center gap-2 pt-2 text-[13px]">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="h-4 w-4 accent-brand-600" />
            I grant these scopes to {item.publisher} for Cascadia Supply Group
          </label>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-2">
          <div className="text-[13px] text-ink-2">How much should this agent do on its own?</div>
          {([
            ['assist', Hand, 'Assist', 'Recommends only — you act.'],
            ['approve', UserCheck, 'Approve', 'Prepares actions (e.g., dispute drafts) — you approve each one.'],
            ['autopilot', Rocket, 'Autopilot', 'Acts within your policies and thresholds; exceptions still come to you.'],
          ] as const).map(([v, Icon, t, d]) => (
            <button key={v} onClick={() => setAutonomy(v)} className={cn('flex w-full items-center gap-3 rounded-xl border p-3 text-left', autonomy === v ? 'border-brand-500 ring-4 ring-brand-50' : 'border-line hover:border-slate-300')}>
              <Icon className="h-5 w-5 text-ink-2" />
              <div className="flex-1">
                <div className="text-[13.5px] font-semibold">{t} {v === item.defaultAutonomy && <span className="font-normal text-ink-3">· publisher default</span>}</div>
                <div className="text-[12.5px] text-ink-3">{d}</div>
              </div>
              {autonomy === v && <Check className="h-4 w-4 text-brand-600" />}
            </button>
          ))}
          {autonomy === 'autopilot' && <Hint>New third-party agents typically start in Approve mode. You can promote to Autopilot after reviewing its override rate in the Trust Center.</Hint>}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-2.5 py-2">
          {PROGRESS.map((p, i) => (
            <div key={p} className={cn('flex items-center gap-2.5 text-[13.5px]', progress > i ? 'text-ink' : 'text-ink-4')}>
              {progress > i ? <Check className="h-4 w-4 text-ok-600" /> : progress === i ? <Loader2 className="h-4 w-4 animate-spin text-agent-600" /> : <span className="h-4 w-4 rounded-full border border-line" />}
              {p}
            </div>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="py-4 text-center">
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ok-50 text-ok-600"><Check className="h-6 w-6" /></motion.div>
          <div className="mt-3 text-[16px] font-semibold">{item.name} is installed</div>
          <div className="mt-1 text-[13px] text-ink-3">{isAgent ? `Running in ${autonomy} mode. It now appears in Agent Workflows, the Trust Center and the audit log.` : 'Ready to use.'}</div>
          {item.id === 'freightaudit' && <div className="mt-3 text-[12.5px] text-agent-700">Its first findings will appear in your Command Center brief.</div>}
        </div>
      )}
    </Modal>
  );
}
