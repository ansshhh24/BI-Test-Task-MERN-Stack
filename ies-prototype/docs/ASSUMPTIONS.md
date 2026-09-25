# Facts, assumptions and research gaps

The prototype tags these three kinds of claim in the UI. Case facts carry a **Case fact** chip, assumptions carry a dashed **Illustrative / Assumption** chip, and open questions carry a **Needs research** chip.

## 1. Case facts (from the Intuit case brief)

- IES is Intuit's offering for mid-market businesses: companies that have outgrown small-business tools but find legacy ERPs too heavy, slow and expensive.
- IES brings together financial management, accounting, workforce management, commerce and embedded human + AI expert services.
- Mid-market businesses increasingly expect AI agents to do the work, rely on ecosystems of connected apps, and expect expert help at the moment of need.
- Target personas:
  - Finance leaders (CFO / Controller / Owner) at 50–2,500-employee, multi-entity, multi-geography companies.
  - Third-party developers and ISVs.
- Finance leaders' goals and pain points: automating close, forecasting and compliance; real-time insights; expert access; ecosystem value; data silos; a weeks-long manual close; limited access to expertise; disconnected tools; multi-entity complexity.
- Developers' goals and pain points: AI-ready APIs; building agents and apps; integrating IES; complex integrations; data-thin, report-centric APIs; limited monetization; no agent frameworks.
- The competitors named in the brief are NetSuite, SAP Business ByDesign, Workday and emerging AI-native entrants. The brief names them only; it gives no facts about them.
- Deliverables: a clickable prototype (primary), 10 slides or fewer, a video of 3 minutes or less, and AI usage shown across Empathize, Define, Ideate, Prototype and Experiment.

## 2. Prototype assumptions (fictional or illustrative)

### Demo world
- **Cascadia Supply Group** and its three entities (US, CA, UK), its 640 employees, its financials, customers, vendors and people are all **fictional**.
- **Ledgerline Labs**, **Priya Raman** and every marketplace publisher (Portside Analytics, TaxGrid, Cadence Ledger and others) are **fictional**.
- Every expert (Elena Varga, Marcus Hale, Sofia Lindqvist, Rahul Mehta) is **fictional**. Their response times are simulated.
- The demo date is Mon, Oct 5, 2026, during the September close.

### Product mechanics
- AI behaviour is **simulated deterministically**: findings, confidence scores and traces are scripted, so the demo never breaks.
- Default autonomy thresholds are an autonomous limit of $10,000, a minimum confidence of 95%, and an escalation floor of 70%. These are design proposals.
- Scenario Lab model parameters:
  - loaded cost per hire of $8.5K a month
  - 64% of revenue sold on credit terms
  - price elasticity: 60% of a price increase is lost to volume, and 55% flows to margin
  - DSO changes phase in over 2 months
- The historical close average (9 days) and the "hours of manual work handled" figures are estimates.
- Agent task volumes, success, override and accuracy trends are illustrative.
- API endpoint names, the `@ies/sdk` and `@ies/agent-sdk` packages, the sandbox host and the tool-schema format are **proposed designs**, not existing Intuit products.

### Business model numbers
- Every price in the marketplace and the Expert Network is **illustrative**.
- The 80/20 revenue share and the 90/10 early-partner rate are **illustrative**, not Intuit terms.
- The developer credits ($500) and revenue projections are **illustrative**.
- Roadmap time horizons are planning assumptions.

### Compliance content
- Nexus thresholds and tax rules shown are **illustrative**. A real product would use a maintained tax-content service, with review by a qualified professional.
- The bill-and-hold discussion is a simplified illustration of a revenue-recognition judgment. It is not accounting advice.

## 3. Research gaps (must be validated before external use)

| Gap | Why it matters | How to close it |
|---|---|---|
| Real customer evidence for pain severity and willingness to pay | The personas come from the brief, and the quotes are synthesized | 15–20 finance-leader interviews and 10 ISV interviews; review mining |
| Competitor capabilities (NetSuite, SAP Business ByDesign, Workday, AI-native entrants) | The competitive table deliberately contains "?" | Product documentation review, analyst reports, win/loss interviews |
| IES's current pricing, API surface and marketplace terms | The model builds on assumed baselines | Internal data |
| Finance leaders' acceptable autonomy thresholds | They set the defaults in the Trust Center | Controller prototype tests (LOFA 1) and a shadow-mode pilot (LOFA 2) |
| Liability model for agent and expert actions | Legal and regulatory exposure | Legal review, and review of expert-network terms |
| Developer appetite for certification and revenue share | Marketplace economics depend on it | Fake-door pricing test and a developer beta (LOFA 3–4) |
| Expert time saved by context packs | The case for embedded expert services depends on it | Concierge A/B test (LOFA 5) |
