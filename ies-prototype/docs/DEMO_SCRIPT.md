# Live demo script (10–15 minutes)

## Before you start
- Run `npm run dev` (or serve `out/`) and open the app at 1440×900.
- Click **Start guided demo** on the landing page. The dark panel in the bottom-right tracks the 10 steps and has Next, Back, Exit (✕) and Reset demo buttons.
- **Reset demo** clears all prototype state (it is stored in localStorage) and starts again at step 1.
- If you need screen space, minimize the panel with the ⤡ icon.

---

### 1. AI Command Center (1.5 min) · `/command-center`
**Say:** "Maya is the CFO of Cascadia Supply Group, a fictional company with 640 people across 3 entities. Instead of reports, her agents investigated overnight."

**Do:**
1. Point at the KPI strip, then the **covenant risk** card. Show its confidence (88%), expand **Evidence (3)**, and read the impact line.
2. Click **Start collections sprint**. The 13-week forecast gains a green "with sprint" line, and the low-point KPI flips to "Above covenant".
3. Point at the **Live agent activity** feed and at **Needs your decision**.
4. Optional: on the Canada margin card, click **See drill-down** to show the variance bridge.

**Moment:** "From reports to a system of action."

### 2. Financial Close Agent (2 min) · `/close`
**Do:**
1. Show readiness at 62% and the three autonomy cards. Select **Autopilot**.
2. Point at the guardrail strip. Autonomy needs low risk, at least 95% confidence and an amount of $10K or less. Escalation happens below 70%.
3. Click **Run Close Agent**. The activity stream plays Understand → Investigate → Decide → Act → Verify, and the workstream tiles fill.
4. Result: 3 items auto-execute (bank fees, clearing reclass, and the templated payroll accrual). 4 wait for approval. 2 escalate. Readiness rises to 73%.

**Moment:** "Risk-based automation, not all-or-nothing AI."

### 3. Human approval & trust (1.5 min) · `/close`
**Do:**
1. Open **Intercompany US ↔ UK**. Walk through the Overview tab (proposed JE and "why this route"), then Evidence, Reasoning, Policy (IC-02) and Audit.
2. Click **Approve & post**. Readiness rises.
3. Open the auto-executed **US operating account** item and click **Roll back**. A reversing entry is logged.
4. Optional: open the **marketing software** item (confidence 64%, escalated to the controller) and confirm it is an annual prepayment.

**Moment:** "Trust made visible in the UX."

### 4. Scenario Lab (1.5 min) · `/scenarios`
**Do:**
1. Click the chip **"What if Q4 revenue drops 8% and customers pay 7 days slower?"**.
2. Show the thinking steps, then the **"I understood"** chips.
3. Walk through the three scenario cards. Base is $3.70M (breach), Downside is $2.05M (breach), Mitigated is $4.12M (safe).
4. Toggle a lever off and watch the covenant status change. Open **How this was calculated**.
5. Optional: click **Ask FP&A expert**.

**Moment:** "Decision-ready insight in seconds, not weeks."

### 5. Expert escalation (1.5 min) · `/experts`
**Do:**
1. Back on `/close`, open **Revenue cut-off: Harborview Hotels** and click **Escalate to expert**. (Or open the case directly on this page.)
2. Walk through the context pack: the question, facts, AI analysis at 61%, attachments, prior actions, and the scoped access note.
3. Keep **Elena Varga, CPA** (best match) and click **Send context pack**. Status moves Sent → Reviewing → Response.
4. Point out the stat: **0 clarifying questions**. Click **Apply guidance to close**. The close item resolves.

**Moment:** "Human + AI, with zero re-explaining."

### 6. Marketplace (1 min) · `/marketplace`
**Do:**
1. Point at the **Recommended for Cascadia** banner, which ties back to the Canada margin finding, and click **View agent**.
2. Walk the Permissions tab (read, draft, write scopes), then click **Install agent**.
3. Grant the scopes, choose **Approve** mode, and install. Show the progress and the success state.
4. Optional: go back to the Command Center. A new FreightAudit finding appears; approve the 3 dispute drafts.

**Moment:** "An ecosystem inside IES, governed by IES."

### 7. Developer Agent Studio (1.5 min) · `/developer/studio`
**Do:**
1. Switch the role to **Developer** (top-right). You are Priya at Ledgerline Labs.
2. Click **Generate agent from description**. The nodes animate in: Trigger → Read → Analyze → Decide, which branches three ways (remind / approval gate → plan / escalate), then Verify.
3. Click **Approval gate** and show the threshold slider.
4. On the **Guardrails** tab, point out that the currency guardrail is **off**.

**Moment:** "From idea to governed agent in minutes."

### 8. Agent testing (1.5 min) · `/developer/test`
**Do:**
1. Click **Run evaluation suite**. It finishes with 1 critical failure (the foreign-currency case).
2. Open **Insufficient data**. Confidence is 41%, and the agent escalates instead of inventing a payment plan, which counts as a pass.
3. Click **Apply fix & re-run**. Every test passes.
4. Optional: open the prompt-injection test.
5. Optional: go to Publish, run certification, choose pricing, and publish. The agent then shows up in the marketplace.

**Moment:** "Agents earn trust with evidence, not claims."

### 9. Trust Center (1 min) · `/trust`
**Do:**
1. On Overview, show the risk × confidence matrix.
2. On **Thresholds & policies**, drag the amount limit and watch the impact preview. Click **Save policy**.
3. On **Agents & autonomy**, point out that FreightAudit AI now appears, then use a kill switch.
4. Open `/audit`. Every action from this demo is listed; click one to see the record hash and evidence. **Export CSV** is also available.

**Moment:** "Responsible AI as a product surface."

### 10. Platform vision (1 min) · `/vision`
**Do:**
1. Hover over the six layers to see where each one lives in the prototype.
2. Show the flywheel and the roadmap.
3. Close on the banner line.

**Moment:** "From system of record to system of action."

---

## Recovering from a mis-click
- **Reset demo** in the guided panel restores the initial state.
- Every step is deterministic, so re-running always produces the same results.
