'use client';

import React from 'react';
import Link from 'next/link';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useStore } from '@/lib/store';
import { DEV_ANALYTICS } from '@/lib/data/developer';
import { Assumption, Badge, Button, Card, CardHeader, PageHeader, Stat, Hint } from '@/components/ui';

const PIE = ['#14A38B', '#5465F0', '#8B5CF6', '#F79009'];

export default function DevAnalytics() {
  const { state } = useStore();
  const live = state.publish.published;
  return (
    <div>
      <PageHeader
        eyebrow={<>Developer experience · Analytics</>}
        title="Developer Analytics"
        subtitle="Installs, outcomes, quality and revenue for your agent — including how often customers override it, so you can earn more autonomy."
        right={<Badge tone={live ? 'ok' : 'neutral'} dot>{live ? 'Live' : 'Preview'}</Badge>}
      />
      {!live && (
        <div className="mb-5">
          <Hint>
            Preview with sample data. <Link href="/developer/publish" className="font-medium text-brand-600 underline">Publish your agent</Link> to see live metrics.
          </Hint>
        </div>
      )}
      <Card className="mb-5 grid grid-cols-6 divide-x divide-line">
        <div className="px-5 py-4"><Stat label="Installs" value="302" sub="+59 this week" tone="ok" /></div>
        <div className="px-5 py-4"><Stat label="Active companies" value="262" sub="87% of installs" /></div>
        <div className="px-5 py-4"><Stat label="Agent tasks" value="18.4K" sub="Last 30 days" /></div>
        <div className="px-5 py-4"><Stat label="Task success" value="97.3%" sub="Target ≥ 95%" tone="ok" /></div>
        <div className="px-5 py-4"><Stat label="Override rate" value="2.0%" sub="Eligible for Autopilot tier" tone="ok" /></div>
        <div className="px-5 py-4"><Stat label="Net revenue (M6)" value="$23.7K" sub="After rev share" assumption /></div>
      </Card>
      <div className="grid grid-cols-2 gap-5">
        <Card>
          <CardHeader title="Installs & active companies" subtitle="Weekly, since launch" right={<Assumption />} />
          <div className="h-[240px] px-3 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DEV_ANALYTICS.installs} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="#EEF0F4" vertical={false} />
                <XAxis dataKey="w" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E4E7EC', fontSize: 12 }} />
                <Line type="monotone" dataKey="installs" stroke="#5465F0" strokeWidth={2.5} dot={false} name="Installs" />
                <Line type="monotone" dataKey="active" stroke="#14A38B" strokeWidth={2.5} dot={false} name="Active" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader title="Revenue" subtitle="Gross vs developer net, $K / month" right={<Assumption />} />
          <div className="h-[240px] px-3 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEV_ANALYTICS.revenue} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="#EEF0F4" vertical={false} />
                <XAxis dataKey="m" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}K`} />
                <Tooltip formatter={(v: number) => `$${v}K`} contentStyle={{ borderRadius: 10, border: '1px solid #E4E7EC', fontSize: 12 }} />
                <Bar dataKey="gross" fill="#C7D2FE" radius={[4, 4, 0, 0]} name="Gross" />
                <Bar dataKey="net" fill="#14A38B" radius={[4, 4, 0, 0]} name="Developer net" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader title="API & tool calls" subtitle="Per 100 agent runs" />
          <div className="h-[220px] px-3 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEV_ANALYTICS.apiCalls} layout="vertical" margin={{ top: 4, right: 16, left: 30, bottom: 0 }}>
                <CartesianGrid stroke="#EEF0F4" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={100} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E4E7EC', fontSize: 12 }} />
                <Bar dataKey="calls" fill="#5465F0" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader title="Outcomes" subtitle="How agent actions were executed across customers" />
          <div className="flex h-[220px] items-center gap-6 px-6 pb-4">
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie data={DEV_ANALYTICS.outcomes} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2} stroke="none">
                  {DEV_ANALYTICS.outcomes.map((_, i) => <Cell key={i} fill={PIE[i]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ borderRadius: 10, border: '1px solid #E4E7EC', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {DEV_ANALYTICS.outcomes.map((o, i) => (
                <div key={o.name} className="flex items-center gap-2 text-[13px]"><span className="h-2.5 w-2.5 rounded-full" style={{ background: PIE[i] }} />{o.name}<span className="ml-auto pl-4 font-semibold">{o.value}%</span></div>
              ))}
            </div>
          </div>
        </Card>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <span className="text-[12px] text-ink-4">All analytics values are illustrative sample data.</span>
        <Link href="/developer/studio"><Button size="sm">Improve agent in Studio</Button></Link>
      </div>
    </div>
  );
}
