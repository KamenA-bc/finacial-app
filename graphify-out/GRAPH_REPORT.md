# Graph Report - finacial-app  (2026-09-21)

## Corpus Check
- 105 files · ~53,824 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .ttf 2, .ico 1)

## Summary
- 558 nodes · 1318 edges · 33 communities (26 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `44fff353`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dateUtils.ts
- next
- proxy.ts
- constants.ts
- SpendingHabits.tsx
- 20260919000000_baseline_schema.sql
- @playwright/test
- statistics/page.tsx
- FunFacts.tsx
- CategoryChart.tsx
- MonthCard.tsx
- OverviewCards.tsx
- errorLogger.ts
- dependencies
- react
- transactionStore.ts
- pdfExport.ts
- QuickTransactionForm.tsx
- package.json
- compilerOptions
- MonthlyTrendsChart.tsx
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
1. `react` - 52 edges
2. `useFinancialStore` - 38 edges
3. `getCurrencySymbol()` - 33 edges
4. `logError()` - 26 edges
5. `vitest` - 25 edges
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

## Communities (33 total, 5 thin omitted)

### Community 0 - "dateUtils.ts"
Cohesion: 0.08
Nodes (40): exceljs, buildCalendarGrid(), CalendarDay, DateNavigator(), MONTH_NAMES_SHORT, WEEKDAY_LABELS, ExportDropdown(), ExportDropdownProps (+32 more)

### Community 2 - "proxy.ts"
Cohesion: 0.25
Nodes (4): @supabase/ssr, AUTH_ROUTES, config, RECOVERY_ROUTES

### Community 3 - "constants.ts"
Cohesion: 0.26
Nodes (10): AnnualSummary(), AnnualSummaryProps, formatCurrency(), formatCurrency(), StatDisplay(), StatDisplayProps, CHART_COLORS, CURRENCY_FORMAT_OPTIONS (+2 more)

### Community 4 - "SpendingHabits.tsx"
Cohesion: 0.23
Nodes (9): CATEGORY_BAR_BG, CATEGORY_ICONS, CATEGORY_SQUIRCLE_CLASSES, fmt(), SpendingHabits(), SpendingHabitsProps, Tooltip(), TooltipProps (+1 more)

### Community 5 - "20260919000000_baseline_schema.sql"
Cohesion: 0.33
Nodes (9): auth.users, idx_error_logs_action, idx_error_logs_created_at, idx_expense_entries_user_category, idx_expense_entries_user_date, idx_income_entries_user_date, public.error_logs, public.expense_entries (+1 more)

### Community 7 - "statistics/page.tsx"
Cohesion: 0.36
Nodes (6): lucide-react, fmt(), IncomeBreakdown(), IncomeBreakdownProps, SplitBar(), SplitBarProps

### Community 8 - "FunFacts.tsx"
Cohesion: 0.13
Nodes (15): @hugeicons/react, DayRecord, FactCardProps, fmt(), FunFacts(), FunFactsProps, fmt(), MonthRecord (+7 more)

### Community 9 - "CategoryChart.tsx"
Cohesion: 0.32
Nodes (7): recharts, CategoryChart(), CustomTooltip(), CustomTooltipProps, formatTooltipValue(), TabType, CategoryChart

### Community 10 - "MonthCard.tsx"
Cohesion: 0.36
Nodes (7): DailyRow(), fmt(), formatDayDate(), MonthCard(), MonthCardProps, DailySummary, NUMBER_LOCALE

### Community 11 - "OverviewCards.tsx"
Cohesion: 0.50
Nodes (4): @hugeicons/core-free-icons, fmt(), OverviewCards(), OverviewCardsProps

### Community 13 - "errorLogger.ts"
Cohesion: 0.06
Nodes (50): react-hook-form, @supabase/supabase-js, zod, POST(), mockInsert, ErrorPage(), ErrorProps, ForgotPasswordPage() (+42 more)

### Community 15 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, exceljs, @hookform/resolvers, @hugeicons/core-free-icons, @hugeicons/react, jspdf, jsqr, lucide-react (+10 more)

### Community 22 - "react"
Cohesion: 0.08
Nodes (17): react, @testing-library/jest-dom, zustand, metadata, DashboardSkeleton(), QuickTransactionForm(), HistorySkeleton(), DashboardLayout() (+9 more)

### Community 24 - "transactionStore.ts"
Cohesion: 0.08
Nodes (47): @testing-library/react, vitest, HistoryPage(), DashboardClient(), EditTransactionModal(), EditTransactionModalProps, CATEGORY_COLORS, CATEGORY_ICONS (+39 more)

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

### Community 83 - "MonthlyTrendsChart.tsx"
Cohesion: 0.22
Nodes (7): MonthlyTrendsChart, CustomTooltip(), CustomTooltipProps, formatValue(), LABEL_MAP, MonthlyTrendPoint, MonthlyTrendsChartProps

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
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `dateUtils.ts`, `constants.ts`, `QuickTransactionForm.tsx`, `SpendingHabits.tsx`, `statistics/page.tsx`, `FunFacts.tsx`, `CategoryChart.tsx`, `MonthCard.tsx`, `OverviewCards.tsx`, `errorLogger.ts`, `package.json`, `MonthlyTrendsChart.tsx`, `transactionStore.ts`?**
  _High betweenness centrality (0.170) - this node is a cross-community bridge._
- **Why does `vitest` connect `transactionStore.ts` to `dateUtils.ts`, `SpendingHabits.tsx`, `QuickTransactionForm.tsx`, `telemetry.ts`, `errorLogger.ts`, `package.json`, `react`, `pdfExport.ts`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _211 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dateUtils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08069381598793364 - nodes in this community are weakly interconnected._
- **Should `FunFacts.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13157894736842105 - nodes in this community are weakly interconnected._
- **Should `errorLogger.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._