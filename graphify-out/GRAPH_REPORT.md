# Graph Report - finacial-app  (2026-10-14)

## Corpus Check
- 115 files · ~60,444 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .ttf 2, .ico 1)

## Summary
- 598 nodes · 1438 edges · 39 communities (29 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f634d7a5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- TransactionList.tsx
- react
- dateUtils.ts
- errorLogger.ts
- QuickTransactionForm.tsx
- pdfExport.ts
- FunFacts.tsx
- package.json
- constants.ts
- compilerOptions
- dependencies
- layout.tsx
- devDependencies
- scripts
- SpendingHabits.tsx
- AGENTS.md — Project Law (Next.js · TypeScript · Supabase Financial App)
- 20260919000000_baseline_schema.sql
- Changelog
- CategoryChart.tsx
- MonthlyTrendsChart.tsx
- Architecture – Finance Tracker
- README.md
- proxy.ts
- MonthCard.tsx
- @playwright/test
- [2026-04-08]
- OverviewCards.tsx
- [2026-10-14]
- [2026-09-19]
- [Unreleased]
- eslint.config.mjs
- pre-commit
- postcss.config.mjs
- vercel.json
- public.expense_entries

## God Nodes (most connected - your core abstractions)
1. `react` - 58 edges
2. `useFinancialStore` - 40 edges
3. `getCurrencySymbol()` - 35 edges
4. `vitest` - 30 edges
5. `logError()` - 28 edges
6. `ExpenseEntry` - 25 edges
7. `IncomeEntry` - 24 edges
8. `@testing-library/react` - 18 edges
9. `useAuth()` - 18 edges
10. `lucide-react` - 17 edges

## Surprising Connections (you probably didn't know these)
- `MonthCardProps` --references--> `MonthlySummary`  [EXTRACTED]
  src/components/history/MonthCard.tsx → src/hooks/useHistoryData.ts
- `ErrorPage()` --calls--> `logError()`  [EXTRACTED]
  src/app/error.tsx → src/lib/errorLogger.ts
- `ForgotPasswordPage()` --calls--> `extractErrorMessage()`  [EXTRACTED]
  src/app/forgot-password/page.tsx → src/lib/errorLogger.ts
- `GlobalError()` --calls--> `logError()`  [EXTRACTED]
  src/app/global-error.tsx → src/lib/errorLogger.ts
- `HistoryPage()` --calls--> `useHistoryData()`  [EXTRACTED]
  src/app/history/page.tsx → src/hooks/useHistoryData.ts

## Import Cycles
- None detected.

## Communities (39 total, 6 thin omitted)

### Community 0 - "TransactionList.tsx"
Cohesion: 0.07
Nodes (52): @testing-library/jest-dom, @testing-library/react, vitest, EditTransactionModal(), EditTransactionModalProps, CATEGORY_COLORS, CATEGORY_ICONS, DeleteDialog() (+44 more)

### Community 1 - "react"
Cohesion: 0.07
Nodes (31): lucide-react, react, react-hook-form, zod, ForgotPasswordPage(), forgotPasswordSchema, ForgotPasswordValues, HistoryPage() (+23 more)

### Community 2 - "dateUtils.ts"
Cohesion: 0.07
Nodes (43): exceljs, buildCalendarGrid(), CalendarDay, DateNavigator(), MONTH_NAMES_SHORT, WEEKDAY_LABELS, ExportDropdown(), ExportDropdownProps (+35 more)

### Community 3 - "errorLogger.ts"
Cohesion: 0.08
Nodes (37): @supabase/supabase-js, POST(), mockInsert, ErrorPage(), ErrorProps, GlobalError(), GlobalErrorProps, AuthContext (+29 more)

### Community 4 - "QuickTransactionForm.tsx"
Cohesion: 0.09
Nodes (32): jsqr, zustand, ExpenseFormValues, expenseSchema, IncomeFormValues, incomeSchema, QrScannerModal, QuickTransactionForm() (+24 more)

### Community 5 - "pdfExport.ts"
Cohesion: 0.17
Nodes (31): arrayBufferToBase64(), C, drawCategoryRanking(), DrawContext, drawFunFacts(), drawHeader(), drawIncomeBreakdown(), drawMonthlyTrends() (+23 more)

### Community 6 - "FunFacts.tsx"
Cohesion: 0.13
Nodes (15): @hugeicons/react, DayRecord, FactCardProps, fmt(), FunFacts(), FunFactsProps, fmt(), MonthRecord (+7 more)

### Community 7 - "package.json"
Cohesion: 0.11
Nodes (18): engines, node, name, private, version, eslint, eslint-config-next, @hookform/resolvers (+10 more)

### Community 8 - "constants.ts"
Cohesion: 0.19
Nodes (15): AnnualSummary(), AnnualSummaryProps, formatCurrency(), fmt(), IncomeBreakdown(), IncomeBreakdownProps, SplitBar(), SplitBarProps (+7 more)

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, exceljs, @hookform/resolvers, @hugeicons/core-free-icons, @hugeicons/react, jspdf, jsqr, lucide-react (+10 more)

### Community 11 - "layout.tsx"
Cohesion: 0.18
Nodes (11): nextConfig, next, inter, metadata, viewport, WebVitals(), calculateMetricRating(), getTelemetrySessionId() (+3 more)

### Community 12 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, eslint, eslint-config-next, jsdom, @playwright/test, tailwindcss, @tailwindcss/postcss, @testing-library/jest-dom (+6 more)

### Community 13 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, build, dev, dev:https, graph:update, lint, prepare, start (+4 more)

### Community 14 - "SpendingHabits.tsx"
Cohesion: 0.24
Nodes (9): CATEGORY_BAR_BG, CATEGORY_ICONS, CATEGORY_SQUIRCLE_CLASSES, fmt(), SpendingHabits(), SpendingHabitsProps, Tooltip(), TooltipProps (+1 more)

### Community 15 - "AGENTS.md — Project Law (Next.js · TypeScript · Supabase Financial App)"
Cohesion: 0.18
Nodes (11): 0. Stack & Platform, 1. Commands, 2. Execution Tiers, 3. Project Guardrails, 4. Security & Data, 5. Design Craft, 6. Testing Conventions, 7. Reconnaissance & Context (+3 more)

### Community 16 - "20260919000000_baseline_schema.sql"
Cohesion: 0.33
Nodes (9): auth.users, idx_error_logs_action, idx_error_logs_created_at, idx_expense_entries_user_category, idx_expense_entries_user_date, idx_income_entries_user_date, public.error_logs, public.expense_entries (+1 more)

### Community 17 - "Changelog"
Cohesion: 0.20
Nodes (10): [2026-09-14], [2026-09-20], [2026-09-22], Added, Added, Added, Changed, Changelog (+2 more)

### Community 18 - "CategoryChart.tsx"
Cohesion: 0.27
Nodes (9): recharts, CategoryChart(), CustomTooltip(), CustomTooltipProps, formatTooltipValue(), getCategoryColor(), TabType, CategoryChart (+1 more)

### Community 19 - "MonthlyTrendsChart.tsx"
Cohesion: 0.22
Nodes (7): MonthlyTrendsChart, CustomTooltip(), CustomTooltipProps, formatValue(), LABEL_MAP, MonthlyTrendPoint, MonthlyTrendsChartProps

### Community 20 - "Architecture – Finance Tracker"
Cohesion: 0.22
Nodes (9): Architecture – Finance Tracker, Authentication Flow, Constants (`lib/constants.ts`), Data Flow, Directory Structure, Key Component Relationships, Quality Gates, Supabase Tables (+1 more)

### Community 21 - "README.md"
Cohesion: 0.25
Nodes (4): Database, Finance Tracker, Scripts, Setup

### Community 22 - "proxy.ts"
Cohesion: 0.25
Nodes (4): @supabase/ssr, AUTH_ROUTES, config, RECOVERY_ROUTES

### Community 23 - "MonthCard.tsx"
Cohesion: 0.43
Nodes (6): DailyRow(), fmt(), formatDayDate(), MonthCard(), MonthCardProps, DailySummary

### Community 25 - "[2026-04-08]"
Cohesion: 0.40
Nodes (5): [2026-04-08], Added, Changed, Docs, Fixed

### Community 26 - "OverviewCards.tsx"
Cohesion: 0.50
Nodes (4): @hugeicons/core-free-icons, fmt(), OverviewCards(), OverviewCardsProps

### Community 27 - "[2026-10-14]"
Cohesion: 0.50
Nodes (4): [2026-10-14], Added, Changed, Known issue (not changed here)

### Community 28 - "[2026-09-19]"
Cohesion: 0.67
Nodes (3): [2026-09-19], Added, Fixed

### Community 29 - "[Unreleased]"
Cohesion: 0.67
Nodes (3): Added, Changed, [Unreleased]

## Knowledge Gaps
- **225 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+220 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 270 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `TransactionList.tsx`, `dateUtils.ts`, `errorLogger.ts`, `QuickTransactionForm.tsx`, `FunFacts.tsx`, `package.json`, `constants.ts`, `SpendingHabits.tsx`, `CategoryChart.tsx`, `MonthlyTrendsChart.tsx`, `MonthCard.tsx`, `OverviewCards.tsx`?**
  _High betweenness centrality (0.167) - this node is a cross-community bridge._
- **Why does `vitest` connect `TransactionList.tsx` to `react`, `dateUtils.ts`, `errorLogger.ts`, `QuickTransactionForm.tsx`, `pdfExport.ts`, `package.json`, `layout.tsx`, `SpendingHabits.tsx`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _225 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TransactionList.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07172995780590717 - nodes in this community are weakly interconnected._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.06775956284153005 - nodes in this community are weakly interconnected._
- **Should `dateUtils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07474747474747474 - nodes in this community are weakly interconnected._