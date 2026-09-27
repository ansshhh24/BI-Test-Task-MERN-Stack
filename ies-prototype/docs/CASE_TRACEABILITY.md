# Case traceability — Orbit

Maps each requirement in the Intuit PM case brief to the product solution and the prototype screen that shows it.
Routes are relative to the running app (e.g. `http://localhost:3000/close`).

## Problem statement

| Case requirement | Product solution | Prototype screen |
|---|---|---|
| Evolve IES from an integrated suite to an AI-native business platform | Orbit: a system of action. Agents, experts and developers share one business context, with a trust layer around it | `/` (landing), `/vision` |
| Embed AI agents across finance, accounting, workforce and commerce | First-party agents: Close, Collections, Cash Forecast, Compliance, Spend, Workforce/Commerce insights | `/command-center`, `/workflows`, `/close`, `/compliance` |
| Embed human + AI expert services | Expert Network with auto-built context packs, expert matching and apply-to-books | `/experts` |
| Let third-party developers build AI-native apps, integrations and agents on IES data, APIs and tools | Semantic APIs, typed agent tool registry, Agent SDK, sandbox, Agent Studio, Test Lab, Publish | `/developer/*` |
| Foster an ecosystem for businesses and their advisors | Marketplace for agents, apps, integrations and expert services; advisors join the Expert Network | `/marketplace`, `/experts`, `/strategy#business` |

## Persona goals and pain points

| Persona need (case) | Solution | Screen |
|---|---|---|
| Finance leaders: automate close, forecasting and compliance end-to-end with agents | Close Agent (Assist / Approve / Autopilot), Cash Forecast Agent, Compliance Agent | `/close`, `/scenarios`, `/compliance` |
| Finance leaders: real-time, decision-ready insights on profitability, cash flow and scenarios | Agent brief with confidence and evidence; natural-language Scenario Lab | `/command-center`, `/scenarios` |
| Finance leaders: expert guidance (tax, advisory, planning) at the moment of need | One-click escalation with a context pack; expert matching | `/close` → `/experts`, `/compliance` → `/experts`, `/scenarios` → `/experts` |
| Finance leaders: value from an ecosystem without leaving IES | Marketplace; installed agents show up in workflows, the brief and governance | `/marketplace` → `/command-center`, `/workflows`, `/trust` |
| Pain: data silos, weeks-long manual close | One data context across GL, bank, payroll, commerce and 3PL; agent close with readiness tracking | `/close` |
| Pain: specialized expertise is expensive or unavailable | Expert Network, priced per case (illustrative) | `/experts` |
| Pain: disconnected tools, multi-entity complexity | 3 entities, intercompany matching, consolidation, one Trust Center | `/close`, `/trust` |
| Developers: real-time, AI-ready APIs | Semantic endpoints that return definitions, drivers, lineage and confidence | `/developer/apis` |
| Developers: build agents that extend IES | Agent Studio: describe the agent in plain English, get a governed workflow | `/developer/studio` |
| Developers: integrate IES and reduce complexity | Sandbox company, SDK, event stream, onboarding path | `/developer/onboarding`, `/developer` |
| Pain: complex integrations, thin APIs, limited monetization, no agent framework | Onboarding in under 5 minutes (target), tool registry, certification, marketplace pricing models | `/developer/*` |

## Key considerations

| Consideration | Solution | Screen |
|---|---|---|
| Where agents automate, assist, or hand off to experts | Risk × confidence × amount policy engine; three autonomy modes; escalation floor | `/close`, `/trust` (risk matrix), `/strategy#model` |
| Trust, accuracy and liability | Evidence, reasoning trace, policy hits, approvals, rollback and audit on every action; deterministic calculations | `/close` item drawer, `/audit`, `/scenarios` "How this was calculated" |
| How developers discover, onboard, build and monetize | Console → Onboarding → APIs → Studio → Test → Certify → Price → Publish → Analytics | `/developer/*` |
| What an AI-ready API and agent framework looks like | Semantic APIs, tool schemas with `x-ies-policy`, approvals and escalations APIs | `/developer/apis` |
| Attracting and retaining developers, ISVs and advisors | Credits, sandbox, certification, distribution, analytics, co-selling | `/developer`, `/strategy#business` |
| Business model | Subscription, agent usage, API tiers, marketplace revenue share, expert services (all illustrative) | `/strategy#business`, `/developer/publish` |
| Competitive landscape | Hypothesis framework with no competitor claims; research gaps marked | `/strategy#competition` |

## "What we expect to see" in the brief

| Expected section | Where |
|---|---|
| 1. Problem framing and customer understanding | `/strategy#problem`, `docs/PRODUCT_STRATEGY.md`, `docs/AI_PROCESS.md` |
| 2. Vision and strategy | `/vision`, `/strategy#vision`, `#pillars` |
| 3. Solution design: agents, services, APIs; human + AI operating model; developer journey | The whole prototype; `/strategy#model` |
| 4. Roadmap and prioritization, LOFAs | `/strategy#roadmap`, `#priorities`, `#lofas` |
| 5. Business and ecosystem model | `/strategy#business`, `/developer/publish` |
| 6. Metrics for success | `/strategy#metrics`, `/trust` (AI quality), `/developer/analytics` |
| 7. Risks and trade-offs | `/strategy#risks` |

## Deliverables

| Deliverable | Source |
|---|---|
| Clickable prototype (primary) | `ies-prototype/` (Next.js static export) |
| Slide deck, 10 slides or fewer | `docs/SLIDE_DECK_SOURCE.md` |
| Video, 3 minutes or less | `docs/VIDEO_SCRIPT.md` |
| AI usage and process | `docs/AI_PROCESS.md` |
| Live walkthrough, 10–15 min | `docs/DEMO_SCRIPT.md` and the in-app Guided Demo |
