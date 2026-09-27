# Orbit: clickable prototype

**Orbit** is a product concept for evolving Intuit Enterprise Suite into an AI-native business platform for the mid-market. It aims to move IES from a *system of record* to a *system of action*: AI agents understand business context, recommend, act, bring in humans or experts when needed, and leave a complete audit trail.

> This is a case-study prototype. Every company, person, partner and number in it is fictional or illustrative, and the AI is simulated deterministically, so the demo behaves the same every time. See [`docs/ASSUMPTIONS.md`](docs/ASSUMPTIONS.md).

## Run it

```bash
cd ies-prototype
npm install
npm run dev          # http://localhost:3000
# or build a static site:
npm run build        # outputs ./out (static export, no backend)
npx serve out        # or any static file server
```

The prototype is designed for a **1440×900** presentation screen. It needs no backend and no API keys.

## Take the tour
Click **Start guided demo** on the landing page. The walkthrough has 10 steps and takes about 14 minutes; it has Next, Back, Exit and Reset controls. The full talk track is in [`docs/DEMO_SCRIPT.md`](docs/DEMO_SCRIPT.md).

| Area | Route | What to try |
|---|---|---|
| AI Command Center | `/command-center` | Start a collections sprint and watch the covenant forecast update |
| Agent Workflows | `/workflows` | Multi-agent workflows; pause an agent |
| **Financial Close Agent** (flagship) | `/close` | Switch between Assist, Approve and Autopilot; run the agent; inspect evidence, policy and audit; approve, reject or roll back |
| Scenario Lab | `/scenarios` | Ask "What if Q4 revenue drops 8%…" and toggle the mitigation levers |
| Compliance Agent | `/compliance` | Approve filings, fix a segregation-of-duties conflict, escalate a nexus question |
| Expert Network | `/experts` | Send an auto-built context pack to a CPA and apply the guidance |
| Marketplace | `/marketplace` | Install FreightAudit AI with scoped permissions and an autonomy setting |
| Developer Console / Onboarding / APIs | `/developer`, `/developer/onboarding`, `/developer/apis` | Make a first call in the sandbox and view tool schemas |
| **Agent Studio** (developer hero) | `/developer/studio` | Generate a governed agent workflow from plain English |
| Test & Evaluation Lab | `/developer/test` | Run the suite, see the insufficient-data escalation, apply a fix |
| Publish & Monetize | `/developer/publish` | Certify, choose pricing, publish (the agent then appears in the Marketplace) |
| Developer Analytics | `/developer/analytics` | Installs, outcomes, revenue (illustrative) |
| Trust Center | `/trust` | Risk matrix, thresholds, data-access matrix, kill switch, quality, incidents |
| Audit Log | `/audit` | Every action from your session; CSV export |
| Case Study Mode | `/strategy` | Problem, vision, pillars, model, flywheel, business model, competition, roadmap, LOFAs, metrics, risks |
| Platform Vision | `/vision` | Layered architecture and flywheel |

Press **⌘K / Ctrl+K** anywhere to open the command bar, where you can give agents jobs, ask what-if questions or jump to a page.

## Architecture
- **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Recharts**, **Framer Motion**, **Lucide**. Built as a static export.
- `lib/data/*`: all mock data in one place (company, close findings, experts, marketplace, governance, compliance, scenarios, developer, strategy, demo steps).
- `lib/data/close.ts → decideOutcome()`: the deterministic risk × confidence × amount policy engine. The Close Agent, Trust Center matrix and impact preview all share it.
- `lib/data/scenarios.ts`: a natural-language driver parser plus a reproducible 12-month cash model.
- `lib/store.tsx`: global state and agent runners (close run, test suite, expert case lifecycle), persisted to `localStorage`. Every action writes to the audit log.
- `components/ui`: design-system primitives (Drawer, Modal, Tabs, Segmented, Confidence, Ring, Badge, Assumption tags).

### Optional live AI
Nothing in the demo calls an external model. This is deliberate, so the demo cannot break. To experiment with live AI, add a server route that calls a model for the Scenario Lab driver parser (`parseQuestion`) or for agent narration. Keep the deterministic calculations as the source of truth for any number.

## Documentation
- [`docs/CASE_TRACEABILITY.md`](docs/CASE_TRACEABILITY.md): case requirement → solution → screen
- [`docs/ASSUMPTIONS.md`](docs/ASSUMPTIONS.md): case facts vs. assumptions vs. research gaps
- [`docs/PRODUCT_STRATEGY.md`](docs/PRODUCT_STRATEGY.md): problem, vision, pillars, roadmap, metrics, LOFAs, business model, risks
- [`docs/SLIDE_DECK_SOURCE.md`](docs/SLIDE_DECK_SOURCE.md): outline for a deck of 10 slides or fewer
- [`docs/VIDEO_SCRIPT.md`](docs/VIDEO_SCRIPT.md): script for a video of 3 minutes or less
- [`docs/DEMO_SCRIPT.md`](docs/DEMO_SCRIPT.md): 10–15 minute live walkthrough
- [`docs/AI_PROCESS.md`](docs/AI_PROCESS.md): AI usage across Empathize, Define, Ideate, Prototype and Experiment

## QA
`scripts/e2e.cjs` is a headless end-to-end smoke test. It clicks through all 9 hero journeys (29 steps) and fails on any console error. To run it:

```bash
npm i -D playwright-core
BASE=http://localhost:3000 CHROME_PATH=/path/to/chrome node scripts/e2e.cjs
```
