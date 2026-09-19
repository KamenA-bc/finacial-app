# Graph Report - finacial-app  (2026-09-19)

## Corpus Check
- 100 files · ~49,231 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .ttf 2, .ico 1)

## Summary
- 528 nodes · 1211 edges · 32 communities (23 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6bbaa680`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- DashboardClient.tsx
- MonthlyTrendsChart.tsx
- proxy.ts
- ErrorBoundary
- app/page.tsx
- RecordHighlights.tsx
- @playwright/test
- SpendingHabits.tsx
- getCurrencySymbol
- next
- errorLogger.ts
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
1. `react` - 47 edges
2. `useFinancialStore` - 35 edges
3. `getCurrencySymbol()` - 31 edges
4. `logError()` - 26 edges
5. `lucide-react` - 25 edges
6. `vitest` - 23 edges
7. `useAuth()` - 18 edges
8. `IncomeEntry` - 16 edges
9. `ExpenseEntry` - 16 edges
10. `compilerOptions` - 16 edges

## Surprising Connections (you probably didn't know these)
- `LoginPage()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/login/page.tsx → src/components/auth/AuthProvider.tsx
- `RegisterPage()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/register/page.tsx → src/components/auth/AuthProvider.tsx
- `UpdatePasswordPage()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/update-password/page.tsx → src/components/auth/AuthProvider.tsx
- `ExpenseRowProps` --references--> `ExpenseEntry`  [EXTRACTED]
  src/components/transactions/TransactionList.tsx → src/types/index.ts
- `IncomeRowProps` --references--> `IncomeEntry`  [EXTRACTED]
  src/components/transactions/TransactionList.tsx → src/types/index.ts

## Import Cycles
- None detected.

## Communities (32 total, 7 thin omitted)

### Community 0 - "DashboardClient.tsx"
Cohesion: 0.19
Nodes (14): recharts, CategoryChart(), CustomTooltip(), CustomTooltipProps, formatTooltipValue(), TabType, CategoryChart, DashboardClient() (+6 more)

### Community 1 - "MonthlyTrendsChart.tsx"
Cohesion: 0.22
Nodes (7): MonthlyTrendsChart, CustomTooltip(), CustomTooltipProps, formatValue(), LABEL_MAP, MonthlyTrendPoint, MonthlyTrendsChartProps

### Community 2 - "proxy.ts"
Cohesion: 0.25
Nodes (4): @supabase/ssr, AUTH_ROUTES, config, RECOVERY_ROUTES

### Community 5 - "RecordHighlights.tsx"
Cohesion: 0.33
Nodes (5): fmt(), MonthRecord, RecordCardProps, RecordHighlights(), RecordHighlightsProps

### Community 7 - "SpendingHabits.tsx"
Cohesion: 0.40
Nodes (5): CategoryRankEntry, fmt(), SpendingHabits(), SpendingHabitsProps, CHART_COLORS

### Community 8 - "getCurrencySymbol"
Cohesion: 0.16
Nodes (17): AnnualSummary(), AnnualSummaryProps, formatCurrency(), fmt(), IncomeBreakdown(), IncomeBreakdownProps, SplitBar(), SplitBarProps (+9 more)

### Community 13 - "errorLogger.ts"
Cohesion: 0.06
Nodes (46): lucide-react, react-hook-form, @supabase/supabase-js, zod, POST(), mockInsert, ErrorPage(), ErrorProps (+38 more)

### Community 15 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, exceljs, @hookform/resolvers, jspdf, jsqr, lucide-react, next, react (+8 more)

### Community 22 - "react"
Cohesion: 0.19
Nodes (9): react, @testing-library/jest-dom, useAuth(), HistorySkeleton(), DashboardLayout(), DashboardLayoutProps, StatisticsSkeleton(), Props (+1 more)

### Community 24 - "transactionStore.ts"
Cohesion: 0.09
Nodes (39): @testing-library/react, vitest, HistoryPage(), StatisticsPage(), DailyRow(), fmt(), formatDayDate(), MonthCard() (+31 more)

### Community 25 - "pdfExport.ts"
Cohesion: 0.17
Nodes (31): arrayBufferToBase64(), C, drawCategoryRanking(), DrawContext, drawFunFacts(), drawHeader(), drawIncomeBreakdown(), drawMonthlyTrends() (+23 more)

### Community 36 - "QuickTransactionForm.tsx"
Cohesion: 0.09
Nodes (32): jsqr, zustand, ExpenseFormValues, expenseSchema, IncomeFormValues, incomeSchema, QuickTransactionForm(), TabType (+24 more)

### Community 47 - "package.json"
Cohesion: 0.12
Nodes (16): name, private, version, eslint, eslint-config-next, @hookform/resolvers, jsdom, jspdf (+8 more)

### Community 66 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 71 - "TransactionList.tsx"
Cohesion: 0.15
Nodes (14): CATEGORY_COLORS, CATEGORY_ICONS, DeleteDialogProps, ExpenseRow(), ExpenseRowProps, FilterMode, formatAmount(), IncomeRow() (+6 more)

### Community 83 - "constants.ts"
Cohesion: 0.09
Nodes (36): exceljs, DayRecord, FactCardProps, fmt(), FunFacts(), FunFactsProps, buildCalendarGrid(), CalendarDay (+28 more)

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
- **207 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+202 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 250 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `DashboardClient.tsx`, `MonthlyTrendsChart.tsx`, `app/page.tsx`, `QuickTransactionForm.tsx`, `RecordHighlights.tsx`, `SpendingHabits.tsx`, `getCurrencySymbol`, `TransactionList.tsx`, `errorLogger.ts`, `package.json`, `constants.ts`, `transactionStore.ts`?**
  _High betweenness centrality (0.166) - this node is a cross-community bridge._
- **Why does `vitest` connect `transactionStore.ts` to `QuickTransactionForm.tsx`, `TransactionList.tsx`, `telemetry.ts`, `errorLogger.ts`, `package.json`, `constants.ts`, `react`, `pdfExport.ts`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `errorLogger.ts` to `DashboardClient.tsx`, `MonthlyTrendsChart.tsx`, `QuickTransactionForm.tsx`, `RecordHighlights.tsx`, `SpendingHabits.tsx`, `getCurrencySymbol`, `TransactionList.tsx`, `package.json`, `constants.ts`, `react`, `transactionStore.ts`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _207 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `errorLogger.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `transactionStore.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08636363636363636 - nodes in this community are weakly interconnected._