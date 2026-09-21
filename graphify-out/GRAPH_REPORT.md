# Graph Report - finacial-app  (2026-09-21)

## Corpus Check
- 106 files · ~54,257 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .ttf 2, .ico 1)

## Summary
- 559 nodes · 1326 edges · 29 communities (21 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `95d812c3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- constants.ts
- transactionStore.test.ts
- proxy.ts
- DashboardClient.tsx
- ErrorBoundary
- 20260919000000_baseline_schema.sql
- @playwright/test
- route.test.ts
- statistics/page.tsx
- react
- dependencies
- history/page.tsx
- transactionStore.ts
- pdfExport.ts
- QuickTransactionForm.tsx
- package.json
- compilerOptions
- telemetry.ts
- Changelog
- AGENT DIRECTIVE: SENIOR STAFF FULL-STACK ARCHITECT & DESIGN ENGINEER
- devDependencies
- eslint.config.mjs
- postcss.config.mjs
- vercel.json
- Architecture – Finance Tracker
- README.md
- scripts

## God Nodes (most connected - your core abstractions)
1. `react` - 53 edges
2. `useFinancialStore` - 38 edges
3. `getCurrencySymbol()` - 33 edges
4. `vitest` - 26 edges
5. `logError()` - 26 edges
6. `IncomeEntry` - 19 edges
7. `ExpenseEntry` - 19 edges
8. `lucide-react` - 18 edges
9. `useAuth()` - 18 edges
10. `compilerOptions` - 16 edges

## Surprising Connections (you probably didn't know these)
- `MonthCardProps` --references--> `MonthlySummary`  [EXTRACTED]
  src/components/history/MonthCard.tsx → src/hooks/useHistoryData.ts
- `ErrorPage()` --calls--> `logError()`  [EXTRACTED]
  src/app/error.tsx → src/lib/errorLogger.ts
- `GlobalError()` --calls--> `logError()`  [EXTRACTED]
  src/app/global-error.tsx → src/lib/errorLogger.ts
- `HistoryPage()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/history/page.tsx → src/components/auth/AuthProvider.tsx
- `LoginPage()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/login/page.tsx → src/components/auth/AuthProvider.tsx

## Import Cycles
- None detected.

## Communities (29 total, 6 thin omitted)

### Community 0 - "constants.ts"
Cohesion: 0.10
Nodes (33): exceljs, buildCalendarGrid(), CalendarDay, DateNavigator(), MONTH_NAMES_SHORT, WEEKDAY_LABELS, ExportDropdown(), ExportDropdownProps (+25 more)

### Community 1 - "transactionStore.test.ts"
Cohesion: 0.22
Nodes (8): mockDelete, mockGte, mockLte, mockOrder, mockSingle, mockUpdate, mockUpdateEqId, mockUpdateEqUser

### Community 2 - "proxy.ts"
Cohesion: 0.25
Nodes (4): @supabase/ssr, AUTH_ROUTES, config, RECOVERY_ROUTES

### Community 3 - "DashboardClient.tsx"
Cohesion: 0.07
Nodes (36): recharts, MonthlyTrendsChart, CategoryChart(), CustomTooltip(), CustomTooltipProps, formatTooltipValue(), TabType, CategoryChart (+28 more)

### Community 5 - "20260919000000_baseline_schema.sql"
Cohesion: 0.33
Nodes (9): auth.users, idx_error_logs_action, idx_error_logs_created_at, idx_expense_entries_user_category, idx_expense_entries_user_date, idx_income_entries_user_date, public.error_logs, public.expense_entries (+1 more)

### Community 8 - "statistics/page.tsx"
Cohesion: 0.06
Nodes (38): @hugeicons/core-free-icons, @hugeicons/react, @testing-library/jest-dom, StatisticsPage(), DayRecord, FactCardProps, fmt(), FunFacts() (+30 more)

### Community 13 - "react"
Cohesion: 0.07
Nodes (43): lucide-react, react, react-hook-form, @supabase/supabase-js, zod, ErrorPage(), ErrorProps, ForgotPasswordPage() (+35 more)

### Community 15 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, exceljs, @hookform/resolvers, @hugeicons/core-free-icons, @hugeicons/react, jspdf, jsqr, lucide-react (+10 more)

### Community 22 - "history/page.tsx"
Cohesion: 0.12
Nodes (12): nextConfig, next, zustand, metadata, DashboardSkeleton(), HistorySkeleton(), DashboardLayout(), DashboardLayoutProps (+4 more)

### Community 24 - "transactionStore.ts"
Cohesion: 0.08
Nodes (47): @testing-library/react, vitest, HistoryPage(), DashboardClient(), EditTransactionModal(), EditTransactionModalProps, CATEGORY_COLORS, CATEGORY_ICONS (+39 more)

### Community 25 - "pdfExport.ts"
Cohesion: 0.17
Nodes (31): arrayBufferToBase64(), C, drawCategoryRanking(), DrawContext, drawFunFacts(), drawHeader(), drawIncomeBreakdown(), drawMonthlyTrends() (+23 more)

### Community 36 - "QuickTransactionForm.tsx"
Cohesion: 0.11
Nodes (26): jsqr, ExpenseFormValues, expenseSchema, IncomeFormValues, incomeSchema, QuickTransactionForm(), TabType, CameraState (+18 more)

### Community 47 - "package.json"
Cohesion: 0.12
Nodes (16): name, private, version, eslint, eslint-config-next, @hookform/resolvers, jsdom, jspdf (+8 more)

### Community 66 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 108 - "telemetry.ts"
Cohesion: 0.42
Nodes (6): WebVitals(), calculateMetricRating(), getTelemetrySessionId(), MetricRating, PerformanceMetricEvent, recordWebVital()

### Community 138 - "Changelog"
Cohesion: 0.11
Nodes (18): [2026-04-08], [2026-09-14], [2026-09-19], [2026-09-20], Added, Added, Added, Added (+10 more)

### Community 139 - "AGENT DIRECTIVE: SENIOR STAFF FULL-STACK ARCHITECT & DESIGN ENGINEER"
Cohesion: 0.17
Nodes (11): 0. TECH STACK SPECIFICATION, 1. EXECUTION TIERS & STATE MACHINE, 2. HIGH-IMPACT PROJECT GOTCHAS & GUARDRAILS (CRITICAL), 3. DESIGN ENGINEERING & FINTECH CRAFT PROTOCOL, 4. RECONNAISSANCE & CONTEXT PROTOCOL, 5. VALIDATION & SUBAGENT DELEGATION, 6. LEAN RESPONSE PROTOCOL (STRICT), AGENT DIRECTIVE: SENIOR STAFF FULL-STACK ARCHITECT & DESIGN ENGINEER (+3 more)

### Community 148 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, eslint, eslint-config-next, jsdom, @playwright/test, tailwindcss, @tailwindcss/postcss, @testing-library/jest-dom (+6 more)

### Community 157 - "Architecture – Finance Tracker"
Cohesion: 0.17
Nodes (11): Architecture – Finance Tracker, Authentication Flow, Constants (single source of truth: `lib/constants.ts`), Dashboard Page (`/`), Data Flow, Directory Structure, History Page (`/history`), Key Component Relationships (+3 more)

### Community 249 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 368 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, build, dev, dev:https, graph:update, lint, start, test (+3 more)

## Knowledge Gaps
- **211 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+206 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 254 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `constants.ts`, `DashboardClient.tsx`, `QuickTransactionForm.tsx`, `statistics/page.tsx`, `package.json`, `history/page.tsx`, `transactionStore.ts`?**
  _High betweenness centrality (0.170) - this node is a cross-community bridge._
- **Why does `vitest` connect `transactionStore.ts` to `constants.ts`, `transactionStore.test.ts`, `QuickTransactionForm.tsx`, `route.test.ts`, `statistics/page.tsx`, `telemetry.ts`, `react`, `package.json`, `history/page.tsx`, `pdfExport.ts`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _211 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `constants.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09696969696969697 - nodes in this community are weakly interconnected._
- **Should `DashboardClient.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07400555041628122 - nodes in this community are weakly interconnected._
- **Should `statistics/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06359189378057302 - nodes in this community are weakly interconnected._