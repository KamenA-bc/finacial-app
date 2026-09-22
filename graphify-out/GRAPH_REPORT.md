# Graph Report - finacial-app  (2026-09-22)

## Corpus Check
- 107 files · ~54,498 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .ttf 2, .ico 1)

## Summary
- 563 nodes · 1329 edges · 34 communities (26 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b322a8d9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dateUtils.ts
- SpendingHabits.tsx
- proxy.ts
- constants.ts
- react
- 20260919000000_baseline_schema.sql
- @playwright/test
- TransactionList.tsx
- EditTransactionModal.tsx
- MonthlyTrendsChart.tsx
- statistics/page.tsx
- FunFacts.tsx
- public.expense_entries
- errorLogger.ts
- dependencies
- useFinancialStore
- transactionStore.ts
- pdfExport.ts
- QuickTransactionForm.tsx
- package.json
- compilerOptions
- layout.tsx
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
- `LoginPage()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/login/page.tsx → src/components/auth/AuthProvider.tsx
- `RegisterPage()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/register/page.tsx → src/components/auth/AuthProvider.tsx
- `UpdatePasswordPage()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/update-password/page.tsx → src/components/auth/AuthProvider.tsx
- `ErrorPage()` --calls--> `logError()`  [EXTRACTED]
  src/app/error.tsx → src/lib/errorLogger.ts
- `ForgotPasswordPage()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/forgot-password/page.tsx → src/components/auth/AuthProvider.tsx

## Import Cycles
- None detected.

## Communities (34 total, 5 thin omitted)

### Community 0 - "dateUtils.ts"
Cohesion: 0.10
Nodes (31): exceljs, buildCalendarGrid(), CalendarDay, DateNavigator(), MONTH_NAMES_SHORT, WEEKDAY_LABELS, ExportDropdown(), ExportDropdownProps (+23 more)

### Community 1 - "SpendingHabits.tsx"
Cohesion: 0.15
Nodes (15): CATEGORY_BAR_BG, CATEGORY_ICONS, CATEGORY_SQUIRCLE_CLASSES, fmt(), SpendingHabits(), SpendingHabitsProps, CategoryRankEntry, DayRecord (+7 more)

### Community 2 - "proxy.ts"
Cohesion: 0.25
Nodes (4): @supabase/ssr, AUTH_ROUTES, config, RECOVERY_ROUTES

### Community 3 - "constants.ts"
Cohesion: 0.25
Nodes (11): AnnualSummary(), AnnualSummaryProps, formatCurrency(), EditTransactionModal(), formatCurrency(), StatDisplay(), StatDisplayProps, CURRENCY_FORMAT_OPTIONS (+3 more)

### Community 4 - "react"
Cohesion: 0.09
Nodes (14): react, @testing-library/jest-dom, zustand, HistorySkeleton(), StatisticsSkeleton(), ErrorBoundary, Props, State (+6 more)

### Community 5 - "20260919000000_baseline_schema.sql"
Cohesion: 0.33
Nodes (9): auth.users, idx_error_logs_action, idx_error_logs_created_at, idx_expense_entries_user_category, idx_expense_entries_user_date, idx_income_entries_user_date, public.error_logs, public.expense_entries (+1 more)

### Community 7 - "TransactionList.tsx"
Cohesion: 0.17
Nodes (12): CATEGORY_COLORS, CATEGORY_ICONS, DeleteDialogProps, ExpenseRow(), FilterMode, formatAmount(), IncomeRow(), PendingDelete (+4 more)

### Community 8 - "EditTransactionModal.tsx"
Cohesion: 0.17
Nodes (13): @hugeicons/core-free-icons, fmt(), OverviewCards(), OverviewCardsProps, fmt(), MonthRecord, RecordCardProps, RecordHighlights() (+5 more)

### Community 9 - "MonthlyTrendsChart.tsx"
Cohesion: 0.20
Nodes (8): recharts, MonthlyTrendsChart, CustomTooltip(), CustomTooltipProps, formatValue(), LABEL_MAP, MonthlyTrendPoint, MonthlyTrendsChartProps

### Community 10 - "statistics/page.tsx"
Cohesion: 0.38
Nodes (5): fmt(), IncomeBreakdown(), IncomeBreakdownProps, SplitBar(), SplitBarProps

### Community 11 - "FunFacts.tsx"
Cohesion: 0.33
Nodes (5): DayRecord, FactCardProps, fmt(), FunFacts(), FunFactsProps

### Community 13 - "errorLogger.ts"
Cohesion: 0.06
Nodes (47): lucide-react, react-hook-form, @supabase/supabase-js, zod, POST(), mockInsert, ErrorPage(), ErrorProps (+39 more)

### Community 15 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, exceljs, @hookform/resolvers, @hugeicons/core-free-icons, @hugeicons/react, jspdf, jsqr, lucide-react (+10 more)

### Community 22 - "useFinancialStore"
Cohesion: 0.11
Nodes (28): HistoryPage(), metadata, StatisticsPage(), useAuth(), CategoryChart(), CustomTooltip(), CustomTooltipProps, formatTooltipValue() (+20 more)

### Community 24 - "transactionStore.ts"
Cohesion: 0.12
Nodes (26): @testing-library/react, vitest, DailyRow(), fmt(), formatDayDate(), MonthCard(), MonthCardProps, EditTransactionModalProps (+18 more)

### Community 25 - "pdfExport.ts"
Cohesion: 0.16
Nodes (32): CHART_COLORS, arrayBufferToBase64(), C, drawCategoryRanking(), DrawContext, drawFunFacts(), drawHeader(), drawIncomeBreakdown() (+24 more)

### Community 36 - "QuickTransactionForm.tsx"
Cohesion: 0.11
Nodes (25): jsqr, ExpenseFormValues, expenseSchema, IncomeFormValues, incomeSchema, TabType, CameraState, isMobileDevice() (+17 more)

### Community 47 - "package.json"
Cohesion: 0.11
Nodes (17): name, private, version, eslint, eslint-config-next, @hookform/resolvers, @hugeicons/react, jsdom (+9 more)

### Community 66 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 108 - "layout.tsx"
Cohesion: 0.19
Nodes (10): nextConfig, next, inter, metadata, WebVitals(), calculateMetricRating(), getTelemetrySessionId(), MetricRating (+2 more)

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
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 257 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `dateUtils.ts`, `SpendingHabits.tsx`, `constants.ts`, `QuickTransactionForm.tsx`, `TransactionList.tsx`, `EditTransactionModal.tsx`, `MonthlyTrendsChart.tsx`, `statistics/page.tsx`, `FunFacts.tsx`, `errorLogger.ts`, `package.json`, `useFinancialStore`, `transactionStore.ts`?**
  _High betweenness centrality (0.168) - this node is a cross-community bridge._
- **Why does `vitest` connect `transactionStore.ts` to `dateUtils.ts`, `SpendingHabits.tsx`, `react`, `QuickTransactionForm.tsx`, `TransactionList.tsx`, `layout.tsx`, `errorLogger.ts`, `package.json`, `pdfExport.ts`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _212 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dateUtils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09872241579558652 - nodes in this community are weakly interconnected._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.09243697478991597 - nodes in this community are weakly interconnected._
- **Should `errorLogger.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._