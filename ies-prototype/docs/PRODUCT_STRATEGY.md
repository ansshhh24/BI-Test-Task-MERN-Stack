# IES Helm — product strategy

> **IES Helm**: the AI operating layer for the mid-market. Agents that understand, decide and act, with you at the helm.

## 1. Problem

**Finance leaders.** These are CFOs, controllers and owners at multi-entity companies with 50–2,500 employees. They run the business on data spread across accounting, payroll, HR and commerce tools. The close takes weeks. Specialized expertise is expensive. Every decision is made on month-old numbers. *(Case fact.)*

They also hesitate to let AI touch the books unless they get evidence, control and an audit trail. *(Assumption, to be validated.)*

- **How it feels:** reactive, exposed, and always one step behind the business.
- **Ideal state, in their words (hypothesis):** "My agents close the books, flag what matters and prepare the decision. I approve what's material, call an expert when it's a judgment, and I can prove every number."

**Developers and ISVs.** Financial integrations are complex. APIs are data-thin and report-centric. There is no agent framework and little monetization. *(Case fact.)*

They also have no safe way to prove to a finance buyer that their agent is trustworthy. *(Assumption.)*

- **Ideal state (hypothesis):** "I get rich business context through one API, a sandbox that behaves like a real company, a way to prove my agent is safe, and customers who can buy it in one click."

## 2. Vision

IES Helm turns Intuit Enterprise Suite from a **system of record** into a **system of action**. It becomes a trusted operating layer where AI agents, human experts and third-party developers work on one shared business context, and the finance leader stays at the helm.

## 3. Strategic pillars

1. **Agentic work.** Agents do the work (close, collections, compliance) rather than just answering questions.
2. **Intelligence + human expertise.** Real-time insight, plus a one-click handoff to a vetted expert who receives the full context.
3. **Open developer platform.** Semantic APIs, an Agent SDK, a sandbox, evaluation tools, and a marketplace that reaches IES customers.
4. **Trust & governance.** Every action carries permissions, confidence, evidence, policy, approval, an audit trail and, where possible, a rollback.

## 4. Human + AI operating model

| Zone | Rule | Examples |
|---|---|---|
| Autonomous | Low risk, high confidence, within limits, in Autopilot | Bank-fee entries, clearing reclasses, recurring accruals, low-value reminders |
| AI prepares, human approves | Medium risk, above limits, or gated by policy | Intercompany true-ups, large accruals, vendor disputes, consolidation |
| Human or expert decides | High risk, judgment calls, or low confidence | Revenue-recognition judgments, tax positions, unclear spend |

**Trust, accuracy and liability.**
- Calculations are deterministic. AI proposes and explains.
- For material judgments, the customer or a licensed expert makes the decision.
- Every action is backed by evidence, reversible where possible, and exportable for auditors.
- Autonomy is earned per workflow. It is expanded only when override rates stay low.

## 5. Platform architecture

| Layer | Contents |
|---|---|
| Experience | Finance, accounting, workforce, commerce, marketplace, experts |
| Agents | First-party agents, third-party agents, expert-in-the-loop |
| Orchestration | Context, planning, tool use, policies, approvals, evaluation |
| Data / API | Finance, workforce, commerce, customers and events, plus a semantic layer |
| Developer | APIs, SDK, sandbox, Agent Studio, evaluation tools, marketplace |
| Trust | Identity, permissions, governance, audit, security, evidence. This layer wraps every call. |

## 6. Platform flywheel

More business usage → richer context → better agents → more customer value → more developers → more specialized solutions → stronger ecosystem → more usage.

The moat is not the model. It is **trusted context + governance + distribution**.

## 7. Roadmap

| Phase | Horizon (assumption) | Scope | Rationale |
|---|---|---|---|
| **Validate** | 0–3 months | Discovery with 15–20 finance leaders and 10 ISVs; prototype tests; Wizard-of-Oz Close Agent with 3 design partners; define trust thresholds with controllers | Pressure-test the riskiest assumptions cheaply |
| **MVP** | 3–9 months | Close Agent in Assist and Approve modes; Trust Center v1 and audit log; core semantic APIs and sandbox; Agent Studio (private beta) | Sharpest pain and measurable value. Trust infrastructure is built once and reused |
| **Expand** | 9–18 months | Scenario Lab and forecasting; Compliance Agent; Expert Network handoff; marketplace GA with certification | Broaden the value and start the ecosystem |
| **Platform** | 18+ months | Third-party ecosystem at scale; multi-agent workflows; vertical solutions; Autopilot for proven workflows | Compound the flywheel |

## 8. Prioritization

Each initiative is scored 1–5 on four criteria. The scores are the author's judgment.

| Initiative | Customer impact | Platform leverage | Feasibility | Learning value | Total |
|---|---|---|---|---|---|
| Close Agent (Assist/Approve) | 5 | 4 | 4 | 5 | 18 |
| Trust Center + audit | 4 | 5 | 4 | 4 | 17 |
| Agent Studio + Test Lab | 3 | 5 | 3 | 5 | 16 |
| Semantic APIs + sandbox | 3 | 5 | 4 | 4 | 16 |
| Expert context handoff | 4 | 3 | 4 | 4 | 15 |
| Autopilot mode | 5 | 4 | 2 | 4 | 15 |
| Scenario Lab | 4 | 3 | 4 | 3 | 14 |
| Marketplace GA | 3 | 5 | 3 | 3 | 14 |

## 9. LOFAs (riskiest assumptions) and experiments

| Area | Assumption | Fastest test | Success signal |
|---|---|---|---|
| AI trust | Controllers will approve agent-prepared entries when evidence and policy are visible | Prototype test with 8 controllers approving or rejecting 20 items each | At least 70% approve without re-deriving; median decision under 60 seconds |
| Autonomous finance | Customers will enable Autopilot for low-risk, recurring tasks after a shadow period | Shadow mode for 2 closes at 3 design partners | At least 2 of 3 enable it; override rate under 5% |
| Developer adoption | Semantic APIs and the SDK cut time-to-first-agent enough to attract ISVs | Private beta or hackathon with 20 developers | First call in under 5 minutes; first passing agent in under 1 day for at least 60% |
| Marketplace economics | Customers will pay for certified third-party agents inside IES | Fake-door listings testing 3 pricing models | Listing-to-waitlist conversion of at least 8% |
| Human + AI experts | Context packs cut expert time and customers will pay for them | Concierge A/B test on 20 escalations | At least 40% less expert time; CSAT of 4.5 or higher |

## 10. Metrics

- **North star (assumption):** hours of finance work completed by agents with evidence and without override, per customer per month.
- **Customer value:** agent task completion rate, time saved per close, reduction in close cycle (days), forecast accuracy.
- **Trust:** AI override rate, escalation precision, incidents per 10,000 actions, share of actions with complete evidence.
- **Ecosystem:** developers onboarded, active agents and apps, API usage, marketplace installs.
- **Business:** ecosystem revenue, expert-service attach rate, agent-usage revenue, net revenue retention *(research)*.

## 11. Business model (all numbers illustrative)

| Stream | Mechanism |
|---|---|
| Core platform subscription | IES tiers by entities and users (existing model; needs research) |
| AI / agent usage | Agent credits included per tier, metered beyond that (for example, per close task) |
| API consumption | Free sandbox; production tiers by volume; semantic APIs priced as premium |
| Marketplace revenue share | Illustrative 80/20 developer/Intuit split; 90/10 for early certified partners |
| Embedded expert services | Per-case or per-session fees with expert payouts; context packs reduce the expert's time |

**Ecosystem incentives:**
- a free sandbox and developer credits
- onboarding in under 5 minutes (target)
- semantic APIs and the Agent SDK
- marketplace distribution
- certification
- analytics
- co-selling for the top agents

Advisors earn through the Expert Network and through client installs.

## 12. Competitive hypothesis framework

We make **no competitor claims**. Each axis below is a hypothesis that needs primary research against NetSuite, SAP Business ByDesign, Workday and AI-native entrants:

1. **Mid-market simplicity.** Time-to-value and total cost of ownership. *Research: implementation benchmarks, win/loss interviews.*
2. **Unified data context.** Finance, workforce and commerce in one data model. *Research: compare data-model breadth.*
3. **Agentic execution.** Agents that execute within policy. *Research: audit competitors' current and announced agent capabilities.*
4. **Human + AI expertise.** An embedded expert network with context handoff. *Research: partner and advisor models.*
5. **Developer ecosystem.** AI-ready APIs, SDK and marketplace for mid-market ISVs. *Research: developer surveys and marketplace terms.*
6. **Trust & governance.** Visible, per-action evidence and policy controls. *Research: buyer interviews on what blocks AI adoption.*

## 13. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Hallucination | Actions require evidence; grounding in IES data; escalate when data is insufficient; evaluation gates |
| Financial accuracy | Deterministic postings; ledger rules validate what the AI proposes; back-testing |
| Autonomous actions | Risk × confidence × amount engine; approval gates; reversible entries; kill switch |
| Compliance | Complete audit log, segregation-of-duties checks, data residency, exportable evidence |
| Liability | Clear responsibility model; licensed experts; third-party terms *(legal research)* |
| Third-party quality | Certification, scope enforcement, runtime monitoring, incident process, delisting |
| Platform adoption | Lead with first-party value; design partners; credits and co-selling |
| Competition | Differentiate on unified context, trust UX and experts; validate with win/loss research |

**Trade-offs:**
- **Speed vs. trust:** default to Approve and earn Autopilot.
- **Openness vs. quality:** certification slows growth but protects the brand.
- **Breadth vs. depth:** do one flagship workflow deeply first.
