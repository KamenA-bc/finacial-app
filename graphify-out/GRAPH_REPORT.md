# Graph Report - finacial-app  (2026-09-22)

## Corpus Check
- 108 files · ~56,173 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .ttf 2, .ico 1)

## Summary
- 566 nodes · 1347 edges · 34 communities (24 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `83e5051f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- DashboardClient.tsx
- SpendingHabits.tsx
- proxy.ts
- getCurrencySymbol
- ErrorBoundary
- 20260919000000_baseline_schema.sql
- @playwright/test
- MonthCard.tsx
- DashboardLayout.tsx
- MonthlyTrendsChart.tsx
- statistics/page.tsx
- FunFacts.tsx
- public.expense_entries
- errorLogger.ts
- dependencies
- react
- transactionStore.ts
- pdfExport.ts
- QuickTransactionForm.tsx
- package.json
- compilerOptions
- next
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
1. `react` - 54 edges
2. `useFinancialStore` - 39 edges
3. `getCurrencySymbol()` - 33 edges
4. `vitest` - 27 edges
5. `logError()` - 26 edges
6. `ExpenseEntry` - 20 edges
7. `IncomeEntry` - 19 edges
8. `useAuth()` - 18 edges
9. `lucide-react` - 17 edges
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
- `HistoryPage()` --calls--> `useFinancialStore`  [EXTRACTED]
  src/app/history/page.tsx → src/store/transactionStore.ts

## Import Cycles
- None detected.

## Communities (34 total, 7 thin omitted)

### Community 0 - "DashboardClient.tsx"
Cohesion: 0.08
Nodes (37): metadata, StatisticsPage(), CategoryChart, DashboardClient(), DashboardSkeleton(), buildCalendarGrid(), CalendarDay, DateNavigator() (+29 more)

### Community 1 - "SpendingHabits.tsx"
Cohesion: 0.22
Nodes (10): @testing-library/jest-dom, CATEGORY_BAR_BG, CATEGORY_ICONS, CATEGORY_SQUIRCLE_CLASSES, fmt(), SpendingHabits(), SpendingHabitsProps, Tooltip() (+2 more)

### Community 2 - "proxy.ts"
Cohesion: 0.25
Nodes (4): @supabase/ssr, AUTH_ROUTES, config, RECOVERY_ROUTES

### Community 3 - "getCurrencySymbol"
Cohesion: 0.19
Nodes (14): AnnualSummary(), AnnualSummaryProps, formatCurrency(), fmt(), IncomeBreakdown(), IncomeBreakdownProps, SplitBar(), SplitBarProps (+6 more)

### Community 4 - "ErrorBoundary"
Cohesion: 0.18
Nodes (3): ErrorBoundary, Props, State

### Community 5 - "20260919000000_baseline_schema.sql"
Cohesion: 0.33
Nodes (9): auth.users, idx_error_logs_action, idx_error_logs_created_at, idx_expense_entries_user_category, idx_expense_entries_user_date, idx_income_entries_user_date, public.error_logs, public.expense_entries (+1 more)

### Community 7 - "MonthCard.tsx"
Cohesion: 0.43
Nodes (6): DailyRow(), fmt(), formatDayDate(), MonthCard(), MonthCardProps, DailySummary

### Community 8 - "DashboardLayout.tsx"
Cohesion: 0.14
Nodes (15): @hugeicons/core-free-icons, @hugeicons/react, DashboardLayoutProps, fmt(), OverviewCards(), OverviewCardsProps, fmt(), MonthRecord (+7 more)

### Community 9 - "MonthlyTrendsChart.tsx"
Cohesion: 0.20
Nodes (8): recharts, MonthlyTrendsChart, CustomTooltip(), CustomTooltipProps, formatValue(), LABEL_MAP, MonthlyTrendPoint, MonthlyTrendsChartProps

### Community 11 - "FunFacts.tsx"
Cohesion: 0.33
Nodes (5): DayRecord, FactCardProps, fmt(), FunFacts(), FunFactsProps

### Community 13 - "errorLogger.ts"
Cohesion: 0.05
Nodes (56): lucide-react, react-hook-form, @supabase/supabase-js, zod, POST(), mockInsert, ErrorPage(), ErrorProps (+48 more)

### Community 15 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, exceljs, @hookform/resolvers, @hugeicons/core-free-icons, @hugeicons/react, jspdf, jsqr, lucide-react (+10 more)

### Community 22 - "react"
Cohesion: 0.36
Nodes (5): react, HistoryPage(), HistorySkeleton(), sumAmount(), useHistoryData()

### Community 24 - "transactionStore.ts"
Cohesion: 0.06
Nodes (59): exceljs, @testing-library/react, vitest, CategoryChart(), CustomTooltip(), CustomTooltipProps, formatTooltipValue(), getCategoryColor() (+51 more)

### Community 25 - "pdfExport.ts"
Cohesion: 0.17
Nodes (31): arrayBufferToBase64(), C, drawCategoryRanking(), DrawContext, drawFunFacts(), drawHeader(), drawIncomeBreakdown(), drawMonthlyTrends() (+23 more)

### Community 36 - "QuickTransactionForm.tsx"
Cohesion: 0.09
Nodes (31): jsqr, zustand, ExpenseFormValues, expenseSchema, IncomeFormValues, incomeSchema, QuickTransactionForm(), TabType (+23 more)

### Community 47 - "package.json"
Cohesion: 0.12
Nodes (16): name, private, version, eslint, eslint-config-next, @hookform/resolvers, jsdom, jspdf (+8 more)

### Community 66 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 138 - "Changelog"
Cohesion: 0.10
Nodes (20): [2026-04-08], [2026-09-14], [2026-09-19], [2026-09-20], [2026-09-22], Added, Added, Added (+12 more)

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
- **212 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+207 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 258 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `DashboardClient.tsx`, `SpendingHabits.tsx`, `getCurrencySymbol`, `QuickTransactionForm.tsx`, `ErrorBoundary`, `MonthCard.tsx`, `DashboardLayout.tsx`, `MonthlyTrendsChart.tsx`, `statistics/page.tsx`, `FunFacts.tsx`, `errorLogger.ts`, `package.json`, `transactionStore.ts`?**
  _High betweenness centrality (0.168) - this node is a cross-community bridge._
- **Why does `vitest` connect `transactionStore.ts` to `DashboardClient.tsx`, `SpendingHabits.tsx`, `ErrorBoundary`, `QuickTransactionForm.tsx`, `statistics/page.tsx`, `errorLogger.ts`, `package.json`, `react`, `pdfExport.ts`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _212 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `DashboardClient.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07676767676767676 - nodes in this community are weakly interconnected._
- **Should `DashboardLayout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14210526315789473 - nodes in this community are weakly interconnected._
- **Should `errorLogger.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05189873417721519 - nodes in this community are weakly interconnected._