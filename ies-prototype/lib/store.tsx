'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type { AgentRecord, AuditEntry, Autonomy, CloseItemStatus, ExpertCase, Role, Thresholds, Toast } from './types';
import { CLOSE_ITEMS, DEFAULT_THRESHOLDS, decideOutcome, outcomeToStatus } from './data/close';
import { AUDIT_SEED, FIRST_PARTY_AGENTS } from './data/governance';
import { DEV_AGENT_LISTING, INSTALLED_BY_DEFAULT, MARKET_ITEMS } from './data/marketplace';
import { AGENT_JOBS } from './data/company';
import { CONTEXT_PACKS } from './data/experts';
import { STUDIO_GUARDRAILS, STUDIO_TOOLS, TEST_CASES, type TestStatus } from './data/developer';

export type TestState = 'queued' | 'running' | TestStatus;

export interface CloseActivity {
  id: string;
  t: string;
  itemId: string;
  phase: string;
  text: string;
  tone: 'agent' | 'ok' | 'warn' | 'risk';
}

export interface State {
  role: Role;
  closeMode: Autonomy;
  thresholds: Thresholds;
  closeRun: 'idle' | 'running' | 'done';
  closeStatuses: Record<string, CloseItemStatus>;
  closeActivity: CloseActivity[];
  jobsDone: string[];
  audit: AuditEntry[];
  clock: number; // demo clock, minutes after 09:00
  expertCases: ExpertCase[];
  appliedPacks: string[];
  installed: string[];
  agentAutonomy: Record<string, Autonomy>;
  pausedAgents: string[];
  revokedDomains: Record<string, string[]>;
  onboardingDone: string[];
  studio: {
    generated: boolean;
    name: string;
    prompt: string;
    tools: Record<string, boolean>;
    guardrails: Record<string, boolean>;
    approvalLimit: number;
    version: number;
    saved: boolean;
  };
  tests: { run: 'idle' | 'running' | 'done'; results: Record<string, TestState>; runs: number };
  publish: { checks: 'idle' | 'running' | 'passed'; pricing: string; published: boolean };
  demo: { active: boolean; step: number };
  toasts: Toast[];
}

const initialStatuses = () => Object.fromEntries(CLOSE_ITEMS.map((i) => [i.id, 'queued' as CloseItemStatus]));

export const initialState = (): State => ({
  role: 'business',
  closeMode: 'approve',
  thresholds: { ...DEFAULT_THRESHOLDS },
  closeRun: 'idle',
  closeStatuses: initialStatuses(),
  closeActivity: [],
  jobsDone: [],
  audit: [...AUDIT_SEED],
  clock: 12,
  expertCases: [],
  appliedPacks: [],
  installed: [...INSTALLED_BY_DEFAULT],
  agentAutonomy: Object.fromEntries(FIRST_PARTY_AGENTS.map((a) => [a.id, a.autonomy])),
  pausedAgents: [],
  revokedDomains: {},
  onboardingDone: ['account', 'sandbox', 'key'],
  studio: {
    generated: false,
    name: 'Cash Recovery Agent',
    prompt: '',
    tools: Object.fromEntries(STUDIO_TOOLS.map((t) => [t.id, t.on])),
    guardrails: Object.fromEntries(STUDIO_GUARDRAILS.map((g) => [g.id, g.on])),
    approvalLimit: 25000,
    version: 3,
    saved: false,
  },
  tests: { run: 'idle', results: Object.fromEntries(TEST_CASES.map((t) => [t.id, 'queued' as TestState])), runs: 0 },
  publish: { checks: 'idle', pricing: 'outcome', published: false },
  demo: { active: false, step: 0 },
  toasts: [],
});

type Action =
  | { type: 'hydrate'; state: State }
  | { type: 'patch'; patch: Partial<State> }
  | { type: 'reset' }
  | { type: 'toast'; toast: Toast }
  | { type: 'dismissToast'; id: string }
  | { type: 'audit'; entry: Omit<AuditEntry, 'id' | 'ts'> }
  | { type: 'setCloseStatus'; id: string; status: CloseItemStatus }
  | { type: 'closeActivity'; entry: CloseActivity }
  | { type: 'setMode'; mode: Autonomy }
  | { type: 'setThresholds'; thresholds: Partial<Thresholds> }
  | { type: 'studio'; patch: Partial<State['studio']> }
  | { type: 'testResult'; id: string; status: TestState }
  | { type: 'tests'; patch: Partial<State['tests']> }
  | { type: 'publish'; patch: Partial<State['publish']> };

const fmtClock = (m: number) => {
  const h = 9 + Math.floor(m / 60);
  const mm = String(m % 60).padStart(2, '0');
  return `Oct 5 · ${String(h).padStart(2, '0')}:${mm}`;
};

let uid = 0;
const nextId = (p: string) => `${p}-${Date.now().toString(36)}-${(uid++).toString(36)}`;

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'hydrate':
      return action.state;
    case 'patch':
      return { ...state, ...action.patch };
    case 'reset':
      return { ...initialState(), toasts: [] };
    case 'toast':
      return { ...state, toasts: [...state.toasts.slice(-3), action.toast] };
    case 'dismissToast':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };
    case 'audit': {
      const clock = state.clock + 1 + (state.audit.length % 3);
      const entry: AuditEntry = { ...action.entry, id: nextId('a'), ts: fmtClock(clock) };
      return { ...state, clock, audit: [entry, ...state.audit] };
    }
    case 'setCloseStatus':
      return { ...state, closeStatuses: { ...state.closeStatuses, [action.id]: action.status } };
    case 'closeActivity':
      return { ...state, closeActivity: [...state.closeActivity, action.entry].slice(-80) };
    case 'setMode':
      return { ...state, closeMode: action.mode };
    case 'setThresholds':
      return { ...state, thresholds: { ...state.thresholds, ...action.thresholds } };
    case 'studio':
      return { ...state, studio: { ...state.studio, ...action.patch } };
    case 'testResult':
      return { ...state, tests: { ...state.tests, results: { ...state.tests.results, [action.id]: action.status } } };
    case 'tests':
      return { ...state, tests: { ...state.tests, ...action.patch } };
    case 'publish':
      return { ...state, publish: { ...state.publish, ...action.patch } };
    default:
      return state;
  }
}

const STORAGE_KEY = 'orbit-state-v1';

export const USER = 'Maya Chen (CFO)';

function useStoreValue() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const didHydrate = useRef(false);
  const [ready, setReady] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  // hydrate from localStorage
  useEffect(() => {
    if (didHydrate.current) return;
    didHydrate.current = true;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<State>;
        const base = initialState();
        const merged: State = { ...base, ...saved, toasts: [] };
        if (merged.closeRun === 'running') {
          merged.closeRun = 'idle';
          merged.closeStatuses = base.closeStatuses;
          merged.closeActivity = [];
        }
        if (merged.tests?.run === 'running') merged.tests = base.tests;
        if (merged.publish?.checks === 'running') merged.publish = { ...merged.publish, checks: 'idle' };
        dispatch({ type: 'hydrate', state: merged });
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      const { toasts, ...rest } = state;
      void toasts;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
    } catch {
      /* ignore */
    }
  }, [state, ready]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms));
  };

  const toast = useCallback((title: string, body?: string, tone: Toast['tone'] = 'ok') => {
    const id = nextId('t');
    dispatch({ type: 'toast', toast: { id, title, body, tone } });
    setTimeout(() => dispatch({ type: 'dismissToast', id }), 4800);
  }, []);

  const audit = useCallback((entry: Omit<AuditEntry, 'id' | 'ts'>) => dispatch({ type: 'audit', entry }), []);

  const actions = useMemo(() => {
    const itemById = (id: string) => CLOSE_ITEMS.find((i) => i.id === id)!;

    return {
      toast,
      audit,
      dismissToast: (id: string) => dispatch({ type: 'dismissToast', id }),
      setRole: (role: Role) => dispatch({ type: 'patch', patch: { role } }),
      reset: () => {
        timers.current.forEach(clearTimeout);
        timers.current = [];
        dispatch({ type: 'reset' });
      },

      // ---------- Close Agent ----------
      setMode: (mode: Autonomy) => {
        const s = stateRef.current;
        if (s.closeMode === mode) return;
        dispatch({ type: 'setMode', mode });
        audit({ actor: USER, actorType: 'human', action: 'Changed Close Agent autonomy', target: `${cap(s.closeMode)} → ${cap(mode)}`, approval: 'Config change', policy: 'GOV-02' });
        // re-evaluate pending items under the new mode
        if (s.closeRun === 'done') {
          CLOSE_ITEMS.forEach((it) => {
            const st = s.closeStatuses[it.id];
            if (st === 'recommended' || st === 'awaiting_approval') {
              const next = outcomeToStatus(decideOutcome(it, mode, s.thresholds));
              if (next !== st) {
                dispatch({ type: 'setCloseStatus', id: it.id, status: next });
                if (next === 'auto_executed') {
                  audit({ actor: 'Close Agent', actorType: 'agent', action: it.journal ? 'Posted journal entry' : 'Executed action', target: it.title, amount: it.amount, confidence: it.confidence, policy: it.policies[0]?.id, approval: 'Autonomous', reversible: it.reversible, itemId: it.id, evidence: it.evidence.map((e) => e.label).join(', ') });
                }
              }
            }
          });
        }
      },
      setThresholds: (t: Partial<Thresholds>) => dispatch({ type: 'setThresholds', thresholds: t }),
      commitThresholds: (label: string) =>
        audit({ actor: USER, actorType: 'human', action: 'Updated autonomy thresholds', target: label, approval: 'Config change', policy: 'GOV-01' }),

      runClose: () => {
        const s = stateRef.current;
        if (s.closeRun === 'running') return;
        timers.current.forEach(clearTimeout);
        timers.current = [];
        dispatch({ type: 'patch', patch: { closeRun: 'running', closeStatuses: initialStatuses(), closeActivity: [] } });
        const mode = s.closeMode;
        const t = s.thresholds;
        const step = 1050;
        let tick = 0;
        const stamp = () => {
          tick += 1;
          const sec = 5 + tick * 3;
          return `09:${String(14 + Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
        };
        CLOSE_ITEMS.forEach((it, idx) => {
          const t0 = idx * step;
          later(t0, () => {
            dispatch({ type: 'setCloseStatus', id: it.id, status: 'analyzing' });
            dispatch({ type: 'closeActivity', entry: { id: nextId('c'), t: stamp(), itemId: it.id, phase: 'Understand', text: it.trace[0].text, tone: 'agent' } });
          });
          later(t0 + 350, () => dispatch({ type: 'closeActivity', entry: { id: nextId('c'), t: stamp(), itemId: it.id, phase: 'Investigate', text: it.trace[1].text, tone: 'agent' } }));
          later(t0 + 700, () => dispatch({ type: 'closeActivity', entry: { id: nextId('c'), t: stamp(), itemId: it.id, phase: 'Decide', text: it.trace[2].text, tone: 'agent' } }));
          later(t0 + 950, () => {
            const outcome = decideOutcome(it, mode, t);
            const status = outcomeToStatus(outcome);
            dispatch({ type: 'setCloseStatus', id: it.id, status });
            const actText =
              outcome === 'auto'
                ? `Executed autonomously — ${it.proposedAction}`
                : outcome === 'approval'
                  ? 'Prepared action — waiting for human approval.'
                  : outcome === 'escalate'
                    ? `Escalated → ${it.escalateTo ?? 'human review'}. Nothing posted.`
                    : 'Recommendation ready for you.';
            dispatch({
              type: 'closeActivity',
              entry: { id: nextId('c'), t: stamp(), itemId: it.id, phase: outcome === 'escalate' ? 'Escalate' : 'Act', text: actText, tone: outcome === 'auto' ? 'ok' : outcome === 'escalate' ? 'risk' : 'warn' },
            });
            if (outcome === 'auto') {
              dispatch({ type: 'closeActivity', entry: { id: nextId('c'), t: stamp(), itemId: it.id, phase: 'Verify', text: it.trace[4].text, tone: 'ok' } });
            }
            audit({
              actor: 'Close Agent',
              actorType: 'agent',
              action: outcome === 'auto' ? (it.journal ? 'Posted journal entry' : 'Executed action') : outcome === 'approval' ? 'Prepared action for approval' : outcome === 'escalate' ? 'Escalated to human' : 'Recommended action',
              target: it.title,
              amount: it.amount,
              confidence: it.confidence,
              policy: it.policies[0]?.id,
              approval: outcome === 'auto' ? 'Autonomous' : outcome === 'escalate' ? 'Escalated' : 'Recommendation',
              reversible: outcome === 'auto' ? it.reversible : undefined,
              itemId: it.id,
              evidence: it.evidence.map((e) => e.label).join(', '),
            });
          });
        });
        later(CLOSE_ITEMS.length * step + 200, () => {
          dispatch({ type: 'patch', patch: { closeRun: 'done' } });
          toast('Close Agent run complete', 'Review items that need you. Everything is logged in the audit trail.', 'agent');
        });
      },

      approveItem: (id: string, note?: string) => {
        const it = itemById(id);
        dispatch({ type: 'setCloseStatus', id, status: 'approved' });
        audit({ actor: USER, actorType: 'human', action: it.journal ? 'Approved & posted entry' : 'Approved action', target: it.title, amount: it.amount, confidence: it.confidence, policy: it.policies[0]?.id, approval: 'Human approved', reversible: it.reversible, itemId: id, evidence: note });
        toast('Approved', it.journal ? 'Entry posted to the ledger with evidence attached.' : 'Action executed and logged.');
      },
      rejectItem: (id: string, reason: string) => {
        const it = itemById(id);
        dispatch({ type: 'setCloseStatus', id, status: 'rejected' });
        audit({ actor: USER, actorType: 'human', action: 'Rejected agent proposal', target: it.title, amount: it.amount, confidence: it.confidence, approval: 'Human rejected', itemId: id, evidence: `Reason: ${reason}` });
        toast('Rejected — feedback sent to the agent', 'Your reason is used to improve future proposals.', 'info');
      },
      rollbackItem: (id: string) => {
        const it = itemById(id);
        dispatch({ type: 'setCloseStatus', id, status: 'rolled_back' });
        audit({ actor: USER, actorType: 'human', action: 'Rolled back entry (reversing JE)', target: it.title, amount: it.amount, approval: 'Human approved', itemId: id, evidence: 'Reversing entry created; original retained for audit' });
        toast('Rolled back', 'A reversing entry was posted. The original stays in the audit trail.', 'warn');
      },
      resolveReview: (id: string, choice: string) => {
        const it = itemById(id);
        dispatch({ type: 'setCloseStatus', id, status: 'resolved' });
        audit({ actor: 'Daniel Ortiz (Controller)', actorType: 'human', action: 'Resolved escalated item', target: it.title, amount: it.amount, approval: 'Human approved', itemId: id, evidence: choice });
        toast('Resolved', choice);
      },

      // ---------- Experts ----------
      openCase: (packId: string) => {
        const s = stateRef.current;
        const existing = s.expertCases.find((c) => c.packId === packId && c.status !== 'applied');
        if (existing) return existing.id;
        const pack = CONTEXT_PACKS[packId];
        const id = nextId('case');
        dispatch({ type: 'patch', patch: { expertCases: [{ id, packId, expertId: pack.expertId, status: 'draft', createdAt: 'Today' }, ...s.expertCases] } });
        return id;
      },
      setCaseExpert: (caseId: string, expertId: string) => {
        const s = stateRef.current;
        dispatch({ type: 'patch', patch: { expertCases: s.expertCases.map((c) => (c.id === caseId ? { ...c, expertId } : c)) } });
      },
      sendCase: (caseId: string) => {
        const setStatus = (status: ExpertCase['status']) => {
          const s = stateRef.current;
          dispatch({ type: 'patch', patch: { expertCases: s.expertCases.map((c) => (c.id === caseId ? { ...c, status } : c)) } });
        };
        const c = stateRef.current.expertCases.find((x) => x.id === caseId);
        if (!c) return;
        const pack = CONTEXT_PACKS[c.packId];
        setStatus('sent');
        audit({ actor: USER, actorType: 'human', action: 'Sent context pack to expert', target: pack.title, approval: 'Escalated', itemId: pack.itemId, evidence: `${pack.attachments.length} attachments · AI analysis · prior actions` });
        later(1800, () => setStatus('in_review'));
        later(5200, () => {
          setStatus('responded');
          toast('Expert responded', pack.response.summary, 'agent');
        });
      },
      applyCase: (caseId: string) => {
        const s = stateRef.current;
        const c = s.expertCases.find((x) => x.id === caseId);
        if (!c) return;
        const pack = CONTEXT_PACKS[c.packId];
        dispatch({ type: 'patch', patch: { expertCases: s.expertCases.map((x) => (x.id === caseId ? { ...x, status: 'applied' } : x)), appliedPacks: [...s.appliedPacks, c.packId] } });
        if (pack.itemId) {
          const it = itemById(pack.itemId);
          dispatch({ type: 'setCloseStatus', id: pack.itemId, status: 'resolved' });
          audit({ actor: USER, actorType: 'human', action: 'Applied expert guidance · posted deferral', target: it.title, amount: it.amount, approval: 'Human approved', policy: 'R-01', reversible: true, itemId: it.id, evidence: 'Expert memo from Elena Varga, CPA' });
          audit({ actor: 'Close Agent', actorType: 'agent', action: 'Learned policy update (pending approval)', target: 'Add segregation-date check to cut-off test', approval: 'Recommendation', policy: 'R-01' });
        } else {
          audit({ actor: USER, actorType: 'human', action: 'Applied expert guidance', target: pack.title, approval: 'Human approved' });
        }
        toast('Expert guidance applied', pack.itemId ? 'Close item resolved and close readiness updated.' : 'Saved to your plan.');
      },

      // ---------- Command Center jobs ----------
      runJob: (jobId: string) => {
        const s = stateRef.current;
        if (s.jobsDone.includes(jobId)) return;
        const job = AGENT_JOBS[jobId];
        dispatch({ type: 'patch', patch: { jobsDone: [...s.jobsDone, jobId] } });
        audit({ actor: job.agent, actorType: 'agent', action: job.audit, target: `Triggered by ${USER}`, approval: 'Human approved', confidence: 92 });
        toast(job.title, job.body, 'agent');
      },

      // ---------- Marketplace & agents ----------
      install: (id: string, autonomy: Autonomy) => {
        const s = stateRef.current;
        if (s.installed.includes(id)) return;
        const item = [...MARKET_ITEMS, DEV_AGENT_LISTING].find((m) => m.id === id)!;
        dispatch({ type: 'patch', patch: { installed: [...s.installed, id], agentAutonomy: { ...s.agentAutonomy, [id]: autonomy } } });
        audit({ actor: USER, actorType: 'human', action: `Installed ${item.kind.toLowerCase()}`, target: `${item.name} · ${item.publisher}`, approval: 'Config change', policy: 'SEC-03', evidence: `Granted: ${item.permissions.map((p) => `${p.scope}:${p.access}`).join(', ')} · autonomy ${cap(autonomy)}` });
        toast(`${item.name} installed`, item.kind === 'AI Agent' ? `Running in ${cap(autonomy)} mode. Manage it in the Trust Center.` : 'Ready to use.');
      },
      uninstall: (id: string) => {
        const s = stateRef.current;
        const item = [...MARKET_ITEMS, DEV_AGENT_LISTING].find((m) => m.id === id)!;
        dispatch({ type: 'patch', patch: { installed: s.installed.filter((x) => x !== id) } });
        audit({ actor: USER, actorType: 'human', action: 'Uninstalled', target: item.name, approval: 'Config change', evidence: 'All tokens and scopes revoked' });
        toast(`${item.name} removed`, 'Access tokens revoked.', 'info');
      },
      setAgentAutonomy: (id: string, autonomy: Autonomy, name: string) => {
        const s = stateRef.current;
        const prev = s.agentAutonomy[id];
        dispatch({ type: 'patch', patch: { agentAutonomy: { ...s.agentAutonomy, [id]: autonomy } } });
        if (id === 'close') dispatch({ type: 'setMode', mode: autonomy });
        audit({ actor: USER, actorType: 'human', action: `Changed ${name} autonomy`, target: `${cap(prev ?? 'assist')} → ${cap(autonomy)}`, approval: 'Config change', policy: 'GOV-02' });
      },
      togglePause: (id: string, name: string) => {
        const s = stateRef.current;
        const paused = s.pausedAgents.includes(id);
        dispatch({ type: 'patch', patch: { pausedAgents: paused ? s.pausedAgents.filter((x) => x !== id) : [...s.pausedAgents, id] } });
        audit({ actor: USER, actorType: 'human', action: paused ? 'Resumed agent' : 'Paused agent (kill switch)', target: name, approval: 'Config change', policy: 'GOV-03' });
        toast(paused ? `${name} resumed` : `${name} paused`, paused ? undefined : 'All in-flight actions halted. Nothing further will execute.', paused ? 'ok' : 'warn');
      },
      toggleDomain: (agentId: string, domain: string, name: string) => {
        const s = stateRef.current;
        const cur = s.revokedDomains[agentId] ?? [];
        const revoked = cur.includes(domain);
        dispatch({ type: 'patch', patch: { revokedDomains: { ...s.revokedDomains, [agentId]: revoked ? cur.filter((d) => d !== domain) : [...cur, domain] } } });
        audit({ actor: USER, actorType: 'human', action: revoked ? 'Granted data access' : 'Revoked data access', target: `${name} · ${domain}`, approval: 'Config change', policy: 'SEC-01' });
      },

      // ---------- Developer ----------
      completeOnboarding: (id: string) => {
        const s = stateRef.current;
        if (!s.onboardingDone.includes(id)) dispatch({ type: 'patch', patch: { onboardingDone: [...s.onboardingDone, id] } });
      },
      studio: (patch: Partial<State['studio']>) => dispatch({ type: 'studio', patch }),
      runTests: () => {
        const s = stateRef.current;
        if (s.tests.run === 'running') return;
        const currencyOn = s.studio.guardrails['currency'];
        dispatch({ type: 'tests', patch: { run: 'running', results: Object.fromEntries(TEST_CASES.map((t) => [t.id, 'queued' as TestState])), runs: s.tests.runs + 1 } });
        TEST_CASES.forEach((tc, i) => {
          later(i * 650, () => dispatch({ type: 'testResult', id: tc.id, status: 'running' }));
          later(i * 650 + 560, () => dispatch({ type: 'testResult', id: tc.id, status: tc.failVariant && !currencyOn ? 'fail' : tc.result }));
        });
        later(TEST_CASES.length * 650 + 150, () => {
          dispatch({ type: 'tests', patch: { run: 'done' } });
          const failing = TEST_CASES.some((tc) => tc.failVariant && !currencyOn);
          toast(failing ? 'Evaluation finished · 1 critical failure' : 'Evaluation passed', failing ? 'Foreign-currency case failed. A fix is suggested.' : 'All critical tests pass. Ready for certification.', failing ? 'warn' : 'ok');
        });
      },
      publish: (patch: Partial<State['publish']>) => dispatch({ type: 'publish', patch }),
      runPublishChecks: () => {
        dispatch({ type: 'publish', patch: { checks: 'running' } });
        later(3000, () => dispatch({ type: 'publish', patch: { checks: 'passed' } }));
      },

      // ---------- Demo ----------
      setDemo: (demo: State['demo']) => dispatch({ type: 'patch', patch: { demo } }),
    };
  }, [audit, toast]);

  return { state, actions };
}

type Store = ReturnType<typeof useStoreValue>;
const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const value = useStoreValue();
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore outside provider');
  return v;
}

export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** All governed agents: first-party + installed marketplace agents. */
export function useAgents(): AgentRecord[] {
  const { state } = useStore();
  return useMemo(() => {
    const listings = [...MARKET_ITEMS, ...(state.publish.published ? [DEV_AGENT_LISTING] : [])];
    const third = listings
      .filter((m) => m.kind === 'AI Agent' && state.installed.includes(m.id))
      .map<AgentRecord>((m) => ({
        id: m.id,
        name: m.name,
        publisher: m.publisher,
        firstParty: false,
        description: m.tagline,
        autonomy: state.agentAutonomy[m.id] ?? m.defaultAutonomy ?? 'assist',
        paused: state.pausedAgents.includes(m.id),
        domains: m.dataDomains,
        tasksMonth: 0,
        successRate: m.evalScore ?? 0,
        overrideRate: 0,
        hoursSaved: 0,
        lastAction: 'Installed today',
        risk: m.permissions.some((p) => p.access === 'write') ? 'medium' : 'low',
      }));
    const first = FIRST_PARTY_AGENTS.map((a) => ({ ...a, autonomy: a.id === 'close' ? state.closeMode : state.agentAutonomy[a.id] ?? a.autonomy, paused: state.pausedAgents.includes(a.id) }));
    return [...first, ...third];
  }, [state.installed, state.agentAutonomy, state.pausedAgents, state.closeMode, state.publish.published]);
}
