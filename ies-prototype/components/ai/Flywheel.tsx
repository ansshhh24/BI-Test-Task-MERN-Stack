'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FLYWHEEL } from '@/lib/data/strategy';

export function Flywheel({ size = 420 }: { size?: number }) {
  const n = FLYWHEEL.length;
  const r = size / 2 - 60;
  const c = size / 2;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0">
        <defs>
          <marker id="fw-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#14A38B" />
          </marker>
        </defs>
        <motion.circle cx={c} cy={c} r={r} fill="none" stroke="#CCFBEF" strokeWidth={14} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />
        {FLYWHEEL.map((_, i) => {
          const a1 = (i / n) * 2 * Math.PI - Math.PI / 2 + 0.2;
          const a2 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2 - 0.2;
          const p = (a: number) => [c + r * Math.cos(a), c + r * Math.sin(a)];
          const [x1, y1] = p(a1);
          const [x2, y2] = p(a2);
          return <path key={i} d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`} fill="none" stroke="#14A38B" strokeWidth={2} markerEnd="url(#fw-arrow)" />;
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-4">Platform</div>
          <div className="text-[18px] font-semibold">Flywheel</div>
          <div className="mx-auto mt-1 max-w-[120px] text-[11px] leading-snug text-ink-3">Shared context compounds</div>
        </div>
      </div>
      {FLYWHEEL.map((label, i) => {
        const a = (i / n) * 2 * Math.PI - Math.PI / 2;
        const x = c + r * Math.cos(a);
        const y = c + r * Math.sin(a);
        return (
          <div key={label} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: x, top: y }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="w-max max-w-[112px] rounded-xl border border-agent-100 bg-white px-2.5 py-1 text-center text-[12px] font-medium leading-tight text-ink shadow-card"
            >
              {label}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
