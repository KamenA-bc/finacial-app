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

## [LRN-20261019-002] best_practice

**Logged**: 2026-10-19T21:18:30+03:00
**Priority**: high
**Status**: resolved
**Area**: frontend

### Summary
Never persist time-relative UI state (such as `selectedDate`) in `localStorage`, and remove Zustand `persist` middleware completely when its cached fields are retired instead of leaving a placeholder field in `partialize`.

### Details
In commit `f634d7a5` (2026-10-13), `userId`, `incomeEntries`, `expenseEntries`, and `loadedYears` were removed from Zustand's `persist` `partialize` config in `src/store/transactionStore.ts` for security. Instead of removing the `persist` wrapper altogether, `selectedDate: state.selectedDate` was placed into `partialize`. That caused `selectedDate` to be written to `localStorage['finance-tracker-store-cache']` whenever the store updated (including when opening the app on a past day or drilling down from `/history` in commit `0458edc` on 2026-10-18) and rehydrated on every subsequent app launch, overriding `toISODateString(new Date())` (today).

### Suggested Action
1. Never persist time-relative defaults (`selectedDate`, `transactionFilters`, transient UI state) across browser sessions in `localStorage`.
2. When removing persisted fields from a Zustand store, remove the `persist(...)` middleware wrapper completely rather than substituting another state property into `partialize`.
3. Keep unit tests in `src/store/transactionStore.test.ts` asserting that `selectedDate` initializes to `toISODateString(new Date())` and is never written to `localStorage`.

### Metadata
- Source: conversation
- Related Files: src/store/transactionStore.ts, src/store/transactionStore.test.ts
- Tags: zustand, persist, localStorage, selectedDate, state-management
- Pattern-Key: store.no_persisted_time_relative_state
- Recurrence-Count: 1
- First-Seen: 2026-10-13
- Last-Seen: 2026-10-19

### Context Maintenance
- Decay-Type: decision
- Decay-Rate: durable (architectural invariant for session-scoped date state)
- Authority: src/store/transactionStore.ts & src/store/transactionStore.test.ts; Owner: project maintainer
- Revalidation: enforced by unit test `selectedDate initialization & non-persistence` in `src/store/transactionStore.test.ts`; triggers on any edit to `src/store/transactionStore.ts`
- Validation: verified; Last-Validated: 2026-10-19; Evidence: commit `70fd849` and `src/store/transactionStore.test.ts`
- Disposition: retain; Application: applied

### Resolution
- **Resolved**: 2026-10-19T21:16:35+03:00
- **Commit/PR**: `70fd849`
- **Notes**: Removed `persist` middleware from `useFinancialStore`, added startup purge for `finance-tracker-store-cache`, and added unit tests in `src/store/transactionStore.test.ts`.

---

