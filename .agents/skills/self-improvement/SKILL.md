---
name: self-improvement
description: Continuous learning, post-task retrospective, root-cause diagnosis, and instruction promotion. Use to evaluate task performance, identify where mistakes or friction occurred, determine the root cause, and record actionable instructions in .learnings/ or promote them to AGENTS.md so they are never repeated.
---

# Self-Improvement & Continuous Learning Skill

This skill enforces a closed-loop learning cycle: **Observe → Diagnose → Formulate → Promote**.
Instead of letting mistakes fade with session context, the agent systematically analyzes friction points, uncovers root causes, and records durable rules to prevent recurrence.

---

## 1. When to Trigger Self-Improvement

Run this evaluation:
1. **At the end of any significant task or implementation**: Conduct a brief retrospective before final handover.
2. **When an operation or command fails**: When a build, lint, or test fails unexpectedly.
3. **When the user corrects the agent**: When the user says *"No"*, *"Actually..."*, *"Don't do that"*, or points out an error.
4. **When unexpected friction occurs**: Repeated edits, circular tool calls, or backtracking.
5. **When a superior pattern or convention is discovered**: A "golden path" that should become standard procedure.

---

## 2. The 4-Phase Learning Loop

```
┌─────────────────┐     ┌─────────────────┐     ┌───────────────────────┐     ┌─────────────────────┐
│ 1. Observe      │ ──> │ 2. Diagnose Why │ ──> │ 3. Formulate Rule     │ ──> │ 4. Log & Promote    │
│ (Friction/Error)│     │ (Root Cause)    │     │ (Actionable Guidance) │     │ (.learnings/ → Law) │
└─────────────────┘     └─────────────────┘     └───────────────────────┘     └─────────────────────┘
```

### Phase 1: Observe & Audit
Review the session trajectory and identify:
- What went wrong or was sub-optimal?
- Did any command or test fail?
- Did the user have to intervene to correct direction?
- Was unnecessary or circular work done?

### Phase 2: Root Cause Diagnosis ("Why Did It Happen?")
Identify the underlying breakdown category:
- **`context_omission`**: Failed to read a crucial file, rule in `AGENTS.md`, or existing component before making changes.
- **`flawed_assumption`**: Assumed an API, type, or behavior without inspecting the code or running verification.
- **`premature_action`**: Made edits before understanding the architecture or getting required user sign-off (violating execution tiers).
- **`missing_verification`**: Assumed code worked without running `npm run validate` or local testing.
- **`craft_gap`**: Violated project craft guidelines (e.g. used `dark:`, skipped `tabular-nums`, missed active scale feedback).

### Phase 3: Formulate the Preventive Instruction
Transform the mistake into a durable, concrete directive:
- **Bad (Generic):** *"Be more careful when editing database queries."*
- **Good (Actionable):** *"Always wrap client-side Supabase calls in `withJwtRetry` to survive PGRST303 clock skew."*
- Rules must specify:
  1. **Trigger Condition**: When does this apply?
  2. **Negative Constraint**: What must NEVER be done?
  3. **Positive Directive**: What MUST be done instead?

### Phase 4: Persist & Promote
* **Technical Failures & Crashes**: Append to `.learnings/ERRORS.md`.
* **Behavioral Corrections & Best Practices**: Append to `.learnings/LEARNINGS.md`.
* **Project Law Promotion**: If the learning affects core architecture, security, or recurring project conventions, propose adding it directly to `AGENTS.md` or `.agents/rules/`.

---

## 3. Storage Format

### `.learnings/LEARNINGS.md`
```markdown
### [YYYY-MM-DD] <Concise Title>
- **Category**: `correction` | `best_practice` | `knowledge_gap`
- **Context & Trigger**: What task was being performed when this happened.
- **Mistake / Friction**: What the agent did poorly or incorrectly.
- **Root Cause ("Why")**: Why the agent made this decision.
- **Actionable Instruction**: The exact rule/process to follow next time.
- **Status**: `logged` | `promoted-to-AGENTS.md`
```

### `.learnings/ERRORS.md`
```markdown
### [YYYY-MM-DD] <Error Name / Summary>
- **Command / Operation**: The command or code that triggered the error.
- **Error Output**: Key snippet of the error message.
- **Root Cause**: Why the failure occurred.
- **Resolution**: How it was fixed.
- **Prevention**: What check to run in advance next time.
```

---

## 4. End-of-Task Retrospective Format

When completing any multi-step task, append a brief self-critique summary if friction or learning occurred:

```markdown
### 🔍 Self-Evaluation & Retrospective
* **Friction / Mistake**: <What was suboptimal, or "Clean execution: no new friction">
* **Root Cause**: <Why it happened>
* **Learned Instruction**: <New rule logged in `.learnings/` or proposed for `AGENTS.md`>
```

If execution was flawless, simply state:
`Self-Evaluation: Clean execution — no new friction or corrections.`
