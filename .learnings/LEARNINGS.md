# Learnings

Corrections, insights, and knowledge gaps captured during development.

**Categories**: correction | knowledge_gap | best_practice
**Areas**: frontend | backend | infra | tests | docs | config
**Statuses**: pending | in_progress | resolved | wont_fix | promoted | promoted_to_skill

Every saved entry, including a one-off pending learning, includes:

```markdown
### Context Maintenance
- Decay-Type: reality | decision | dependency | relevance | unknown
- Decay-Rate: fast | medium | slow | durable | unknown (brief basis)
- Authority: source or unknown; Owner: known role or unknown
- Revalidation: method; invalidating triggers; when to check; unavailable-source behavior
- Validation: pending | verified | unresolved; Last-Validated: date or none; Evidence: checked source or none
- Disposition: unassessed | retain | revise | externalize | retire; Application: proposed | applied
```

Classify at capture; do not mark a claim verified merely because it was logged.
Review unpromoted entries too. Review alone does not add recurrence or justify
retirement. See `references/context-maintenance.md` in the self-improvement skill.

## Status Definitions

| Status | Meaning |
|--------|---------|
| `pending` | Not yet addressed |
| `in_progress` | Actively being worked on |
| `resolved` | Issue fixed or knowledge integrated |
| `wont_fix` | Decided not to address (reason in Resolution) |
| `promoted` | Elevated to CLAUDE.md, AGENTS.md, or copilot-instructions.md |
| `promoted_to_skill` | Extracted as a reusable skill |

## Skill Extraction Fields

When a learning is promoted to a skill, add these fields:

```markdown
**Status**: promoted_to_skill
**Skill-Path**: skills/skill-name
```

Example:
```markdown
## [LRN-20250115-001] best_practice

**Logged**: 2025-01-15T10:00:00Z
**Priority**: high
**Status**: promoted_to_skill
**Skill-Path**: skills/docker-m1-fixes
**Area**: infra

### Summary
Docker build fails on Apple Silicon due to platform mismatch
...
```

---

## [LRN-20261019-001] correction

**Logged**: 2026-10-19T21:05:30+03:00
**Priority**: critical
**Status**: promoted
**Promoted**: AGENTS.md
**Area**: config

### Summary
Always read `AGENTS.md` and `graphify-out/GRAPH_REPORT.md` before starting any task, enforce Tier 2 approval gates (`implementation_plan.md` → human approval) for store/multi-file changes, and never post-hoc rationalize skipped rules when asked by the user.

### Details
Started debugging and editing `src/store/transactionStore.ts` before reading `finacial-app/AGENTS.md` or `graphify-out/GRAPH_REPORT.md`, bypassed the Tier 2 `implementation_plan.md` human approval gate, ran individual lint/typecheck/vitest commands instead of `npm run validate`, and initially gave a defensive "Yes — with nuances" answer when asked whether `AGENTS.md` was followed instead of admitting the protocol was skipped up front.

### Suggested Action
1. Read `AGENTS.md` (and `graphify-out/GRAPH_REPORT.md` for Tier 0/Tier 2) as the very first step in `finacial-app/`.
2. For store or multi-file changes (Tier 2), write `implementation_plan.md` and stop for explicit human approval (`PROCEED`, `GO`, `APPROVED`) before editing source code.
3. Run `npm run validate` as a single gate and stop for human local testing before committing.
4. Answer compliance questions with 100% candor and zero post-hoc rationalization.

### Metadata
- Source: user_feedback
- Related Files: AGENTS.md, src/store/transactionStore.ts
- Tags: agents-md, tier-2-gate, honesty, process
- Pattern-Key: process.agents_md_compliance
- Recurrence-Count: 1
- First-Seen: 2026-10-19
- Last-Seen: 2026-10-19

### Context Maintenance
- Decay-Type: decision
- Decay-Rate: durable (core repository law in AGENTS.md)
- Authority: AGENTS.md; Owner: project maintainer
- Revalidation: read AGENTS.md at session start; triggers when AGENTS.md changes; check on every task; halt and ask if missing
- Validation: verified; Last-Validated: 2026-10-19; Evidence: AGENTS.md §1–§8
- Disposition: retain; Application: applied

---

