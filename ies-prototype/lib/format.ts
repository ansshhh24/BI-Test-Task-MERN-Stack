export function usd(n: number, opts: { compact?: boolean; cents?: boolean } = {}) {
  if (opts.compact) {
    const a = Math.abs(n);
    const sign = n < 0 ? '−' : '';
    const trim = (x: string) => x.replace(/\.0+$/, '');
    if (a >= 1_000_000) return `${sign}$${trim((a / 1_000_000).toFixed(a >= 10_000_000 ? 1 : 2))}M`;
    if (a >= 1_000) return `${sign}$${trim((a / 1_000).toFixed(a >= 100_000 ? 0 : 1))}K`;
    return `${sign}$${a.toFixed(0)}`;
  }
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: opts.cents ? 2 : 0,
    maximumFractionDigits: opts.cents ? 2 : 0,
  });
}

export const millions = (n: number) => `${n < 0 ? '−' : ''}$${Math.abs(n).toFixed(2)}M`;

export function cn(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(' ');
}
