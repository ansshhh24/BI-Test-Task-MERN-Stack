# AI process (D4D: Empathize · Define · Ideate · Prototype · Experiment)

This document records how generative AI was used to build this prototype. It also gives reusable prompts for the research steps.

> **Honesty note.** This prototype contains **no primary customer research**. The personas and pain points come from the case brief, and quotes are marked as synthesized. The sections marked **▢ Author to complete** are where you add the evidence you gather yourself: transcripts, review mining, and deep-research outputs with links.

## Tools
| Stage | Tool(s) | Used for |
|---|---|---|
| Empathize | ▢ Author to complete (e.g. Perplexity / Gemini Deep Research / NotebookLM) | Market sensing, review mining, synthesized interviews |
| Define | Claude | Problem framing, persona pains, ideal-state statements |
| Ideate | Claude | Going broad on concepts, then narrowing with a scoring rubric |
| Prototype | Claude Code (agentic coding) | The full Next.js prototype, centralized mock data, deterministic AI simulation, QA with a headless browser |
| Experiment | Claude | LOFAs, experiment design, success signals |

## 1. Empathize
**Prompts to run (reusable):**
1. *"Act as a market researcher. Summarize the top 10 pain points of mid-market CFOs (50–2,500 employees, multi-entity) with the month-end close, cash forecasting and compliance. Cite every source. Separate survey data from opinion."*
2. *"Mine public reviews of mid-market ERP and accounting suites. Cluster the complaints into themes with frequency counts and representative quotes, with links."*
3. *"Summarize what developers say about building on accounting and ERP APIs: integration complexity, data depth, monetization, AI-agent tooling. Cite forums and docs."*

**Evidence gathered:** ▢ Author to complete (links, key numbers, 3–5 verbatim quotes).

## 2. Define
**What AI did:** it turned the case personas into problem statements that follow a pattern: who they are → what they are trying to do → what blocks them → how it feels → the ideal state in their own words. See `/strategy#problem`.

**Key prompt:** *"Using only the attached case brief, write a D4D problem statement for each persona. Mark anything not in the brief as an assumption."*

**What worked:** forcing a fact-vs-assumption tag on every statement.

**What was rejected:** AI-generated "customer quotes" presented as real. They are kept only as clearly labelled illustrative syntheses.

## 3. Ideate
**Go broad (AI-generated concept list, condensed):**
- a chat copilot over IES data
- an autonomous close bot
- an agent marketplace only
- an expert-network add-on
- a vertical AI advisors bundle
- a developer platform first
- a trust layer + agent platform + flagship workflows (**chosen**)

**Narrow:** each concept was scored on customer impact, platform leverage, feasibility and learning value (see `/strategy#priorities`).

**Rejected, and why:**
- *Chatbot-first UI.* It answers questions but does no work, and the case explicitly asks for agents that "do the work".
- *Fully autonomous close.* The trust, liability and adoption risk is too high, so we chose risk-based autonomy with Assist, Approve and Autopilot.
- *Marketplace before first-party value.* That would create an empty-ecosystem problem, so first-party agents come first.

## 4. Prototype
**Approach:** Claude Code built the app end-to-end in Next.js 14, TypeScript, Tailwind, Recharts, Framer Motion and Lucide.

**Build prompt (condensed):** the full brief given to the coding agent covered four pillars, 9 hero journeys, the IA, the design direction, and the rule to "simulate AI deterministically; clearly label assumptions; don't fabricate research".

**Key engineering decisions:**
- **Mock data is centralized** in `lib/data/*`, and every number traces to one place.
- **A deterministic policy engine** (`lib/data/close.ts → decideOutcome`) routes items by risk, confidence, amount and mode. The UI, the Trust Center matrix and the impact preview all use the same function.
- **A deterministic scenario model** (`lib/data/scenarios.ts`) uses a small natural-language driver parser plus a reproducible cash model.
- **Global state** (`lib/store.tsx`) is persisted to localStorage, so actions carry across screens: approvals, installs, expert cases, publishing and the audit log.
- **QA:** a headless-browser end-to-end script clicked through all 9 journeys, checked for console errors, and took screenshots at 1440×900. The run caught a state-hydration bug and a drawer-positioning bug, and both were fixed.

**Where AI output was corrected:** unlabeled numbers were tagged "Illustrative", competitor claims were removed in favour of a hypothesis framework, and tax and revenue-recognition rules were softened to "illustrative, needs a qualified review".

## 5. Experiment
The AI drafted the five LOFAs with a fastest test and a success signal for each. A human reviewed them for testability. See `/strategy#lofas` and `PRODUCT_STRATEGY.md §9`.

**Next step:** run LOFA 1 (controller trust test) with this prototype. The Close Agent drawer is the stimulus. Measure approve/reject rate, time to decision, and what evidence people open.
