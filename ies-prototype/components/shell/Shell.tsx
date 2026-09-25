'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard, Workflow, BookCheck, LineChart, ShieldCheck, Users, Store, Terminal, BookOpen, Rocket, Boxes, FlaskConical,
  BadgeDollarSign, BarChart3, Shield, ScrollText, PlayCircle, Presentation, Layers, Sparkles, CheckCircle2, Info, AlertTriangle, Bot, ChevronDown,
} from 'lucide-react';
import { useStore, useAgents } from '@/lib/store';
import { COMPANY, PEOPLE, PRODUCT } from '@/lib/data/company';
import { CLOSE_ITEMS } from '@/lib/data/close';
import { Avatar, Kbd, Segmented, Dot } from '@/components/ui';
import { cn } from '@/lib/format';
import { GuidedDemo } from '@/components/demo/GuidedDemo';
import { CommandPalette } from './CommandPalette';

export function Logo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="9" fill={light ? '#fff' : '#0E1726'} />
      <circle cx="16" cy="16" r="7.2" fill="none" stroke={light ? '#0E1726' : '#fff'} strokeWidth="2.2" />
      <circle cx="16" cy="16" r="2.4" fill="#14A38B" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <line key={a} x1="16" y1="5" x2="16" y2="9" stroke={light ? '#0E1726' : '#fff'} strokeWidth="2.2" strokeLinecap="round" transform={`rotate(${a} 16 16)`} />
      ))}
    </svg>
  );
}

type NavItem = { href: string; label: string; icon: React.ElementType; badge?: number };

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const router = useRouter();
  const { state, actions } = useStore();
  const agents = useAgents();
  const [paletteOpen, setPaletteOpen] = useState(false);

  const path = pathname.replace(/\/$/, '') || '/';
  const isDevRoute = path.startsWith('/developer');
  const businessOnly = ['/command-center', '/workflows', '/close', '/scenarios', '/compliance', '/experts'].some((p) => path.startsWith(p));
  const role = isDevRoute ? 'developer' : businessOnly ? 'business' : state.role;

  useEffect(() => {
    if (isDevRoute && state.role !== 'developer') actions.setRole('developer');
    if (businessOnly && state.role !== 'business') actions.setRole('business');
  }, [isDevRoute, businessOnly, state.role, actions]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const pendingClose = CLOSE_ITEMS.filter((i) => ['awaiting_approval', 'recommended', 'escalated'].includes(state.closeStatuses[i.id])).length;
  const expertBadge = state.expertCases.filter((c) => c.status === 'responded' || c.status === 'draft').length;

  const sections = useMemo(() => {
    const business: { title: string; items: NavItem[] }[] = [
      {
        title: 'Business',
        items: [
          { href: '/command-center', label: 'AI Command Center', icon: LayoutDashboard },
          { href: '/workflows', label: 'Agent Workflows', icon: Workflow },
          { href: '/close', label: 'Financial Close Agent', icon: BookCheck, badge: pendingClose || undefined },
          { href: '/scenarios', label: 'Scenario Lab', icon: LineChart },
          { href: '/compliance', label: 'Compliance Agent', icon: ShieldCheck },
          { href: '/experts', label: 'Expert Network', icon: Users, badge: expertBadge || undefined },
        ],
      },
    ];
    const developer: { title: string; items: NavItem[] }[] = [
      {
        title: 'Developer',
        items: [
          { href: '/developer', label: 'Developer Console', icon: Terminal },
          { href: '/developer/onboarding', label: 'Onboarding', icon: Rocket },
          { href: '/developer/apis', label: 'API Catalog', icon: BookOpen },
          { href: '/developer/studio', label: 'Agent Studio', icon: Boxes },
          { href: '/developer/test', label: 'Test & Evaluation Lab', icon: FlaskConical },
          { href: '/developer/publish', label: 'Publish & Monetize', icon: BadgeDollarSign },
          { href: '/developer/analytics', label: 'Developer Analytics', icon: BarChart3 },
        ],
      },
    ];
    const shared: { title: string; items: NavItem[] }[] = [
      { title: 'Ecosystem', items: [{ href: '/marketplace', label: 'App + Agent Marketplace', icon: Store }] },
      { title: 'Governance', items: [{ href: '/trust', label: 'Trust Center', icon: Shield }, { href: '/audit', label: 'Audit & Activity Log', icon: ScrollText }] },
      { title: 'Presentation', items: [{ href: '/strategy', label: 'Case Study Mode', icon: Presentation }, { href: '/vision', label: 'Platform Vision', icon: Layers }] },
    ];
    return [...(role === 'developer' ? developer : business), ...shared];
  }, [role, pendingClose, expertBadge]);

  if (path === '/') {
    return (
      <>
        {children}
        <GuidedDemo />
        <Toasts />
      </>
    );
  }

  const activeAgents = agents.filter((a) => !a.paused).length;
  const needsYou = pendingClose + expertBadge;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="flex w-[248px] shrink-0 flex-col border-r border-line bg-white">
        <Link href="/" className="flex items-center gap-2.5 px-5 pb-4 pt-5">
          <Logo className="h-8 w-8" />
          <div>
            <div className="text-[15px] font-semibold leading-tight tracking-tight text-ink">{PRODUCT.name}</div>
            <div className="text-[11px] leading-tight text-ink-3">Intuit Enterprise Suite</div>
          </div>
        </Link>
        <nav className="flex-1 overflow-y-auto scroll-thin px-3 pb-4">
          {sections.map((sec) => (
            <div key={sec.title} className="mt-3">
              <div className="px-2.5 pb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-4">{sec.title}</div>
              {sec.items.map((it) => {
                const active = it.href === '/developer' ? path === '/developer' : path.startsWith(it.href);
                const Icon = it.icon;
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    className={cn(
                      'group relative mb-0.5 flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13.5px] transition-colors',
                      active ? 'bg-slate-100 font-medium text-ink' : 'text-ink-2 hover:bg-slate-50 hover:text-ink',
                    )}
                  >
                    {active && <motion.span layoutId="nav-active" className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-brand-600" />}
                    <Icon className={cn('h-[17px] w-[17px] shrink-0', active ? 'text-brand-600' : 'text-ink-3 group-hover:text-ink-2')} />
                    <span className="truncate">{it.label}</span>
                    {it.badge ? <span className="ml-auto rounded-full bg-warn-100 px-1.5 text-[11px] font-semibold text-warn-700">{it.badge}</span> : null}
                  </Link>
                );
              })}
            </div>
          ))}
          <button
            onClick={() => {
              actions.setDemo({ active: true, step: 0 });
              router.push('/command-center');
            }}
            className="mt-4 flex w-full items-center gap-2.5 rounded-lg border border-dashed border-brand-200 bg-brand-50/60 px-2.5 py-2 text-[13px] font-medium text-brand-700 hover:bg-brand-50"
          >
            <PlayCircle className="h-[17px] w-[17px]" /> Start guided demo
          </button>
        </nav>
        <div className="border-t border-line px-4 py-3 text-[11px] leading-relaxed text-ink-4">
          Prototype · fictional demo data. <br />
          AI is simulated deterministically.
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[60px] shrink-0 items-center gap-4 border-b border-line bg-white/90 px-6 backdrop-blur">
          <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-slate-50">
            <div className={cn('flex h-7 w-7 items-center justify-center rounded-md text-[11px] font-bold text-white', role === 'developer' ? 'bg-agent-600' : 'bg-brand-600')}>
              {role === 'developer' ? 'LL' : 'CS'}
            </div>
            <div>
              <div className="text-[13px] font-semibold leading-tight text-ink">{role === 'developer' ? 'Ledgerline Labs' : COMPANY.name}</div>
              <div className="text-[11px] leading-tight text-ink-3">{role === 'developer' ? 'Developer workspace · Sandbox' : `${COMPANY.entities.length} entities · ${COMPANY.entities.map((e) => e.code).join(' · ')}`}</div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-ink-4" />
          </button>

          <button
            onClick={() => setPaletteOpen(true)}
            className="mx-auto flex h-9 w-full max-w-[460px] items-center gap-2.5 rounded-lg border border-line bg-slate-50 px-3 text-[13px] text-ink-3 transition hover:border-slate-300 hover:bg-white"
          >
            <Sparkles className="h-4 w-4 text-agent-600" />
            <span className="flex-1 text-left">Ask Helm or give an agent a job…</span>
            <Kbd>⌘K</Kbd>
          </button>

          <div className="flex items-center gap-3">
            {role === 'business' && (
              <Link href="/workflows" className="hidden items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-[12px] text-ink-2 hover:bg-slate-50 xl:flex">
                <Dot tone="agent" pulse /> {activeAgents} agents active
                {needsYou > 0 && <span className="rounded-full bg-warn-100 px-1.5 font-semibold text-warn-700">{needsYou} need you</span>}
              </Link>
            )}
            <Segmented
              size="sm"
              value={role}
              onChange={(v) => {
                actions.setRole(v);
                router.push(v === 'developer' ? '/developer' : '/command-center');
              }}
              options={[
                { value: 'business', label: 'Business' },
                { value: 'developer', label: 'Developer' },
              ]}
            />
            <Avatar initials={role === 'developer' ? PEOPLE.dev.initials : PEOPLE.cfo.initials} tone={role === 'developer' ? 'agent' : 'brand'} />
          </div>
        </header>

        <main className="relative flex-1 overflow-y-auto scroll-thin">
          <AnimatePresence mode="wait">
            <motion.div key={path} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, ease: 'easeOut' }} className="mx-auto max-w-[1360px] px-8 pb-40 pt-7">
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <GuidedDemo />
      <Toasts />
    </div>
  );
}

function Toasts() {
  const { state, actions } = useStore();
  return (
    <div className="pointer-events-none fixed bottom-5 left-[268px] z-[70] flex w-[380px] flex-col-reverse gap-2">
      <AnimatePresence>
        {state.toasts.map((t) => {
          const Icon = t.tone === 'ok' ? CheckCircle2 : t.tone === 'warn' ? AlertTriangle : t.tone === 'agent' ? Bot : Info;
          const c = t.tone === 'ok' ? 'text-ok-600' : t.tone === 'warn' ? 'text-warn-600' : t.tone === 'agent' ? 'text-agent-600' : 'text-brand-600';
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -24 }}
              className="pointer-events-auto flex gap-3 rounded-xl border border-line bg-white p-3.5 shadow-pop"
              onClick={() => actions.dismissToast(t.id)}
            >
              <Icon className={cn('mt-0.5 h-[18px] w-[18px] shrink-0', c)} />
              <div className="min-w-0">
                <div className="text-[13.5px] font-semibold text-ink">{t.title}</div>
                {t.body && <div className="mt-0.5 text-[12.5px] text-ink-3">{t.body}</div>}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

