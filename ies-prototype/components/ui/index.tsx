'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Info, Loader2 } from 'lucide-react';
import { cn } from '@/lib/format';
import type { Autonomy, Risk } from '@/lib/types';

/* ---------------- Button ---------------- */
type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'agent' | 'ok';
export function Button({
  variant = 'secondary',
  size = 'md',
  loading,
  icon,
  className,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; size?: 'sm' | 'md' | 'lg'; loading?: boolean; icon?: React.ReactNode }) {
  const v: Record<BtnVariant, string> = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm disabled:bg-brand-300',
    secondary: 'bg-white text-ink-2 border border-line hover:bg-slate-50 hover:border-slate-300 shadow-[0_1px_2px_rgba(16,24,40,0.05)]',
    ghost: 'text-ink-2 hover:bg-slate-100',
    danger: 'bg-white text-risk-700 border border-risk-100 hover:bg-risk-50',
    agent: 'bg-agent-600 text-white hover:bg-agent-700 shadow-sm',
    ok: 'bg-ok-600 text-white hover:bg-ok-700 shadow-sm',
  };
  const s = { sm: 'h-8 px-3 text-[13px] gap-1.5', md: 'h-9 px-3.5 text-sm gap-2', lg: 'h-11 px-5 text-[15px] gap-2' }[size];
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300',
        v[variant],
        s,
        className,
      )}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}

/* ---------------- Card ---------------- */
export function Card({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('rounded-2xl border border-line bg-white shadow-card', className)} {...rest}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, right, icon, className }: { title: React.ReactNode; subtitle?: React.ReactNode; right?: React.ReactNode; icon?: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-start justify-between gap-4 px-5 pt-4 pb-3', className)}>
      <div className="flex items-start gap-2.5 min-w-0">
        {icon && <div className="mt-0.5 text-ink-3">{icon}</div>}
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
          {subtitle && <p className="text-[13px] text-ink-3 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {right}
    </div>
  );
}

/* ---------------- Badge ---------------- */
type Tone = 'neutral' | 'brand' | 'ok' | 'warn' | 'risk' | 'agent' | 'violet' | 'dark';
export function Badge({ tone = 'neutral', children, className, dot }: { tone?: Tone; children: React.ReactNode; className?: string; dot?: boolean }) {
  const t: Record<Tone, string> = {
    neutral: 'bg-slate-100 text-ink-2 border-slate-200',
    brand: 'bg-brand-50 text-brand-700 border-brand-100',
    ok: 'bg-ok-50 text-ok-700 border-ok-100',
    warn: 'bg-warn-50 text-warn-700 border-warn-100',
    risk: 'bg-risk-50 text-risk-700 border-risk-100',
    agent: 'bg-agent-50 text-agent-700 border-agent-100',
    violet: 'bg-violet-50 text-violet-700 border-violet-100',
    dark: 'bg-ink text-white border-ink',
  };
  const d: Record<Tone, string> = {
    neutral: 'bg-ink-4', brand: 'bg-brand-500', ok: 'bg-ok-500', warn: 'bg-warn-500', risk: 'bg-risk-500', agent: 'bg-agent-500', violet: 'bg-violet-500', dark: 'bg-white',
  };
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-md border px-1.5 py-0.5 text-[11.5px] font-medium leading-4 whitespace-nowrap', t[tone], className)}>
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', d[tone])} />}
      {children}
    </span>
  );
}

export function RiskBadge({ risk }: { risk: Risk }) {
  return <Badge tone={risk === 'low' ? 'ok' : risk === 'medium' ? 'warn' : 'risk'} dot>{risk === 'low' ? 'Low risk' : risk === 'medium' ? 'Medium risk' : 'High risk'}</Badge>;
}

export function AutonomyBadge({ a }: { a: Autonomy }) {
  const map = { assist: ['neutral', 'Assist'], approve: ['warn', 'Approve'], autopilot: ['agent', 'Autopilot'] } as const;
  return <Badge tone={map[a][0]}>{map[a][1]}</Badge>;
}

/** Labels non-case numbers so evaluators can tell assumptions from facts. */
export function Assumption({ children = 'Illustrative', className }: { children?: React.ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded border border-dashed border-violet-300 bg-violet-50 px-1.5 py-px text-[10.5px] font-medium uppercase tracking-wide text-violet-700', className)} title="Prototype assumption — not a case fact">
      {children}
    </span>
  );
}

export function SourceTag({ tag }: { tag: 'Case' | 'Assumption' | 'Research' }) {
  const m = {
    Case: 'border-brand-200 bg-brand-50 text-brand-700',
    Assumption: 'border-violet-300 bg-violet-50 text-violet-700 border-dashed',
    Research: 'border-warn-100 bg-warn-50 text-warn-700',
  };
  return <span className={cn('inline-flex shrink-0 whitespace-nowrap rounded border px-1.5 py-px text-[10.5px] font-semibold uppercase tracking-wide', m[tag])}>{tag === 'Research' ? 'Needs research' : tag === 'Case' ? 'Case fact' : 'Assumption'}</span>;
}

/* ---------------- Confidence ---------------- */
export function Confidence({ value, size = 'md', showLabel = true }: { value: number; size?: 'sm' | 'md'; showLabel?: boolean }) {
  const tone = value >= 90 ? 'bg-ok-500' : value >= 70 ? 'bg-warn-500' : 'bg-risk-500';
  const text = value >= 90 ? 'text-ok-700' : value >= 70 ? 'text-warn-700' : 'text-risk-700';
  return (
    <div className="flex items-center gap-2" title={`Model confidence ${value}%`}>
      <div className={cn('relative overflow-hidden rounded-full bg-slate-100', size === 'sm' ? 'h-1.5 w-12' : 'h-2 w-20')}>
        <motion.div className={cn('absolute inset-y-0 left-0 rounded-full', tone)} initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} />
      </div>
      {showLabel && <span className={cn('tabular-nums font-semibold', size === 'sm' ? 'text-[12px]' : 'text-[13px]', text)}>{value}%</span>}
    </div>
  );
}

/* ---------------- Ring ---------------- */
export function Ring({ value, size = 120, stroke = 10, color = '#3F4FD9', label, sub }: { value: number; size?: number; stroke?: number; color?: string; label?: React.ReactNode; sub?: React.ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#EEF0F4" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: c - (Math.min(100, value) / 100) * c }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-semibold tabular-nums text-ink">{label ?? `${value}%`}</div>
        {sub && <div className="text-[11px] text-ink-3">{sub}</div>}
      </div>
    </div>
  );
}

/* ---------------- Segmented ---------------- */
export function Segmented<T extends string>({ value, onChange, options, size = 'md', className }: { value: T; onChange: (v: T) => void; options: { value: T; label: React.ReactNode; hint?: string }[]; size?: 'sm' | 'md'; className?: string }) {
  return (
    <div className={cn('inline-flex rounded-lg bg-slate-100 p-0.5', className)}>
      {options.map((o) => (
        <button
          key={o.value}
          title={o.hint}
          onClick={() => onChange(o.value)}
          className={cn(
            'relative rounded-md font-medium transition-colors',
            size === 'sm' ? 'px-2.5 py-1 text-[12.5px]' : 'px-3.5 py-1.5 text-[13px]',
            value === o.value ? 'text-ink' : 'text-ink-3 hover:text-ink-2',
          )}
        >
          {value === o.value && <motion.span layoutId={`seg-${options.map((x) => x.value).join('')}`} className="absolute inset-0 rounded-md bg-white shadow-sm" transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }} />}
          <span className="relative flex items-center gap-1.5">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ---------------- Toggle ---------------- */
export function Toggle({ on, onChange, label, disabled }: { on: boolean; onChange: (v: boolean) => void; label?: string; disabled?: boolean }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!on)}
      className={cn('relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors disabled:opacity-50', on ? 'bg-brand-600' : 'bg-slate-300')}
    >
      <motion.span layout transition={{ type: 'spring', stiffness: 500, damping: 32 }} className={cn('h-4 w-4 rounded-full bg-white shadow', on ? 'ml-[18px]' : 'ml-0.5')} />
    </button>
  );
}

/* ---------------- Tabs ---------------- */
export function Tabs<T extends string>({ value, onChange, tabs, className }: { value: T; onChange: (v: T) => void; tabs: { value: T; label: React.ReactNode; count?: number }[]; className?: string }) {
  return (
    <div className={cn('flex gap-5 border-b border-line', className)}>
      {tabs.map((t) => (
        <button key={t.value} onClick={() => onChange(t.value)} className={cn('relative -mb-px pb-2.5 pt-1 text-[13.5px] font-medium transition-colors', value === t.value ? 'text-ink' : 'text-ink-3 hover:text-ink-2')}>
          <span className="flex items-center gap-1.5">
            {t.label}
            {t.count !== undefined && <span className={cn('rounded-full px-1.5 text-[11px]', value === t.value ? 'bg-ink text-white' : 'bg-slate-100 text-ink-3')}>{t.count}</span>}
          </span>
          {value === t.value && <motion.span layoutId={`tab-${tabs.map((x) => x.value).join('')}`} className="absolute inset-x-0 -bottom-px h-0.5 rounded bg-ink" />}
        </button>
      ))}
    </div>
  );
}

/* ---------------- Portal ---------------- */
function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? createPortal(children, document.body) : null;
}

/* ---------------- Drawer ---------------- */
export function Drawer({ open, onClose, title, subtitle, children, footer, width = 560, badge }: { open: boolean; onClose: () => void; title: React.ReactNode; subtitle?: React.ReactNode; children: React.ReactNode; footer?: React.ReactNode; width?: number; badge?: React.ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);
  return (
    <Portal>
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-[1px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full flex-col bg-white shadow-drawer"
            style={{ width }}
            initial={{ x: width }}
            animate={{ x: 0 }}
            exit={{ x: width }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
              <div className="min-w-0">
                {badge && <div className="mb-1.5 flex flex-wrap gap-1.5">{badge}</div>}
                <h2 className="text-[17px] font-semibold leading-snug text-ink">{title}</h2>
                {subtitle && <p className="mt-1 text-[13px] text-ink-3">{subtitle}</p>}
              </div>
              <button onClick={onClose} className="rounded-lg p-1.5 text-ink-3 hover:bg-slate-100" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto scroll-thin px-6 py-5">{children}</div>
            {footer && <div className="border-t border-line bg-slate-50/60 px-6 py-3.5">{footer}</div>}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
    </Portal>
  );
}

/* ---------------- Modal ---------------- */
export function Modal({ open, onClose, title, children, footer, width = 520 }: { open: boolean; onClose: () => void; title: React.ReactNode; children: React.ReactNode; footer?: React.ReactNode; width?: number }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);
  return (
    <Portal>
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/30 p-6 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            className="flex max-h-[88vh] w-full flex-col rounded-2xl bg-white shadow-pop"
            style={{ maxWidth: width }}
            initial={{ y: 12, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 8, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h2 className="text-[16px] font-semibold text-ink">{title}</h2>
              <button onClick={onClose} className="rounded-lg p-1.5 text-ink-3 hover:bg-slate-100" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="overflow-y-auto scroll-thin px-6 py-5">{children}</div>
            {footer && <div className="flex justify-end gap-2 border-t border-line bg-slate-50/60 px-6 py-3.5 rounded-b-2xl">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </Portal>
  );
}

/* ---------------- Page header ---------------- */
export function PageHeader({ eyebrow, title, subtitle, right, icon }: { eyebrow?: React.ReactNode; title: React.ReactNode; subtitle?: React.ReactNode; right?: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-6">
      <div className="min-w-0">
        {eyebrow && <div className="mb-1.5 flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.08em] text-ink-3">{eyebrow}</div>}
        <h1 className="flex items-center gap-2.5 text-[26px] font-semibold tracking-tight text-ink">
          {icon}
          {title}
        </h1>
        {subtitle && <p className="mt-1.5 max-w-3xl text-[14.5px] text-ink-3">{subtitle}</p>}
      </div>
      {right && <div className="flex shrink-0 items-center gap-2">{right}</div>}
    </div>
  );
}

export function Stat({ label, value, sub, tone, assumption }: { label: string; value: React.ReactNode; sub?: React.ReactNode; tone?: 'ok' | 'warn' | 'risk' | 'neutral'; assumption?: boolean }) {
  const t = tone === 'ok' ? 'text-ok-700' : tone === 'warn' ? 'text-warn-700' : tone === 'risk' ? 'text-risk-700' : 'text-ink-3';
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[12.5px] text-ink-3">
        {label}
        {assumption && <Assumption />}
      </div>
      <div className="mt-1 text-[22px] font-semibold tracking-tight tabular-nums text-ink">{value}</div>
      {sub && <div className={cn('mt-0.5 text-[12.5px]', t)}>{sub}</div>}
    </div>
  );
}

export function Hint({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-line bg-slate-50 px-3 py-2 text-[12.5px] text-ink-3">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

export function Avatar({ initials, className, tone = 'brand' }: { initials: string; className?: string; tone?: 'brand' | 'agent' | 'violet' | 'dark' }) {
  const t = { brand: 'bg-brand-100 text-brand-700', agent: 'bg-agent-100 text-agent-700', violet: 'bg-violet-100 text-violet-700', dark: 'bg-ink text-white' }[tone];
  return <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold', t, className)}>{initials}</div>;
}

export function Shimmer({ className }: { className?: string }) {
  return <div className={cn('animate-shimmer rounded-md bg-[linear-gradient(90deg,#F1F3F6_0%,#E6E9EE_50%,#F1F3F6_100%)] bg-[length:800px_100%]', className)} />;
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="rounded border border-line bg-white px-1.5 py-px font-mono text-[10.5px] text-ink-3 shadow-[0_1px_0_#E4E7EC]">{children}</kbd>;
}

export function Dot({ tone = 'agent', pulse }: { tone?: 'agent' | 'ok' | 'warn' | 'risk' | 'neutral'; pulse?: boolean }) {
  const t = { agent: 'bg-agent-500', ok: 'bg-ok-500', warn: 'bg-warn-500', risk: 'bg-risk-500', neutral: 'bg-ink-4' }[tone];
  return <span className={cn('inline-block h-2 w-2 shrink-0 rounded-full', t, pulse && 'animate-pulseDot')} />;
}
