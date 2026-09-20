# Graph Report - finacial-app  (2026-09-20)

## Corpus Check
- 102 files · ~52,188 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .ttf 2, .ico 1)

## Summary
- 537 nodes · 1254 edges · 27 communities (19 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cf4441a7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- route.test.ts
- proxy.ts
- @playwright/test
- DashboardClient.tsx
- next
- lucide-react
- dependencies
- react
- transactionStore.ts
- pdfExport.ts
- QuickTransactionForm.tsx
- package.json
- compilerOptions
- TransactionList.tsx
- constants.ts
- telemetry.ts
- [2026-04-08]
- AGENT DIRECTIVE: SENIOR STAFF FULL-STACK ARCHITECT & DESIGN ENGINEER
- devDependencies
- eslint.config.mjs
- postcss.config.mjs
- vercel.json
- Architecture – Finance Tracker
- README.md
- scripts

## God Nodes (most connected - your core abstractions)
1. `react` - 49 edges
2. `useFinancialStore` - 38 edges
3. `getCurrencySymbol()` - 33 edges
4. `lucide-react` - 26 edges
5. `logError()` - 26 edges
6. `vitest` - 24 edges
7. `IncomeEntry` - 19 edges
8. `ExpenseEntry` - 19 edges
9. `useAuth()` - 18 edges
10. `compilerOptions` - 16 edges

## Surprising Connections (you probably didn't know these)
- `ExpenseRowProps` --references--> `ExpenseEntry`  [EXTRACTED]
  src/components/transactions/TransactionList.tsx → src/types/index.ts
- `IncomeRowProps` --references--> `IncomeEntry`  [EXTRACTED]
  src/components/transactions/TransactionList.tsx → src/types/index.ts
- `ErrorPage()` --calls--> `logError()`  [EXTRACTED]
  src/app/error.tsx → src/lib/errorLogger.ts
- `GlobalError()` --calls--> `logError()`  [EXTRACTED]
  src/app/global-error.tsx → src/lib/errorLogger.ts
- `HistoryPage()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/history/page.tsx → src/components/auth/AuthProvider.tsx

## Import Cycles
- None detected.

## Communities (27 total, 6 thin omitted)

### Community 2 - "proxy.ts"
Cohesion: 0.25
Nodes (4): @supabase/ssr, AUTH_ROUTES, config, RECOVERY_ROUTES

### Community 8 - "DashboardClient.tsx"
Cohesion: 0.06
Nodes (48): recharts, MonthlyTrendsChart, CategoryChart(), CustomTooltip(), CustomTooltipProps, formatTooltipValue(), TabType, CategoryChart (+40 more)

### Community 13 - "lucide-react"
Cohesion: 0.06
Nodes (48): lucide-react, react-hook-form, @supabase/supabase-js, zod, ErrorPage(), ErrorProps, ForgotPasswordPage(), forgotPasswordSchema (+40 more)

### Community 15 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, exceljs, @hookform/resolvers, jspdf, jsqr, lucide-react, next, react (+8 more)

### Community 22 - "react"
Cohesion: 0.08
Nodes (17): react, @testing-library/jest-dom, zustand, metadata, DashboardSkeleton(), QuickTransactionForm(), HistorySkeleton(), DashboardLayout() (+9 more)

### Community 24 - "transactionStore.ts"
Cohesion: 0.08
Nodes (42): @testing-library/react, vitest, HistoryPage(), StatisticsPage(), DailyRow(), fmt(), formatDayDate(), MonthCard() (+34 more)

### Community 25 - "pdfExport.ts"
Cohesion: 0.17
Nodes (31): arrayBufferToBase64(), C, drawCategoryRanking(), DrawContext, drawFunFacts(), drawHeader(), drawIncomeBreakdown(), drawMonthlyTrends() (+23 more)

### Community 36 - "QuickTransactionForm.tsx"
Cohesion: 0.11
Nodes (25): jsqr, ExpenseFormValues, expenseSchema, IncomeFormValues, incomeSchema, TabType, CameraState, isMobileDevice() (+17 more)

### Community 47 - "package.json"
Cohesion: 0.12
Nodes (16): name, private, version, eslint, eslint-config-next, @hookform/resolvers, jsdom, jspdf (+8 more)

### Community 66 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 71 - "TransactionList.tsx"
Cohesion: 0.15
Nodes (15): CATEGORY_COLORS, CATEGORY_ICONS, DeleteDialogProps, ExpenseRow(), ExpenseRowProps, FilterMode, formatAmount(), IncomeRow() (+7 more)

### Community 83 - "constants.ts"
Cohesion: 0.09
Nodes (37): exceljs, DayRecord, FactCardProps, fmt(), FunFacts(), FunFactsProps, buildCalendarGrid(), CalendarDay (+29 more)

### Community 108 - "telemetry.ts"
Cohesion: 0.42
Nodes (6): WebVitals(), calculateMetricRating(), getTelemetrySessionId(), MetricRating, PerformanceMetricEvent, recordWebVital()

### Community 138 - "[2026-04-08]"
Cohesion: 0.12
Nodes (15): [2026-04-08], [2026-09-14], [2026-09-19], Added, Added, Added, Added, Changed (+7 more)

### Community 139 - "AGENT DIRECTIVE: SENIOR STAFF FULL-STACK ARCHITECT & DESIGN ENGINEER"
Cohesion: 0.11
Nodes (18): 0.1 FINITE STATE MACHINE & EXECUTION GATING (STRICT), 0.2 OPERATIONAL EXECUTION TIERS, 0.3 HIGH-IMPACT PROJECT GOTCHAS & GUARDRAILS, 0. TECH STACK SPECIFICATION, 1.1 SUBAGENT ORCHESTRATION & DELEGATION MATRIX (STRUCTURAL DECOUPLING), 1. DYNAMIC SKILL ORCHESTRATION (5 MACRO PILLARS), 2. DESIGN ENGINEERING & CRAFT PROTOCOL (MANDATORY), 3. RECONNAISSANCE & CONTEXT PROTOCOL (+10 more)

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
- **210 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+205 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 253 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `QuickTransactionForm.tsx`, `TransactionList.tsx`, `DashboardClient.tsx`, `lucide-react`, `package.json`, `constants.ts`, `transactionStore.ts`?**
  _High betweenness centrality (0.163) - this node is a cross-community bridge._
- **Why does `vitest` connect `transactionStore.ts` to `route.test.ts`, `QuickTransactionForm.tsx`, `TransactionList.tsx`, `telemetry.ts`, `lucide-react`, `package.json`, `constants.ts`, `react`, `pdfExport.ts`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `QuickTransactionForm.tsx`, `TransactionList.tsx`, `DashboardClient.tsx`, `package.json`, `constants.ts`, `react`, `transactionStore.ts`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _210 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `DashboardClient.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.059395801331285206 - nodes in this community are weakly interconnected._
- **Should `lucide-react` be split into smaller, more focused modules?**
  _Cohesion score 0.0642243328810493 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._