# Graph Report - finacial-app  (2026-11-07)

## Corpus Check
- 122 files · ~67,315 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .ttf 2, .ico 1)

## Summary
- 667 nodes · 1618 edges · 40 communities (26 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `70fd849b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- transactionStore.ts
- TransactionFilterBar.tsx
- forgot-password/page.tsx
- errorLogger.ts
- QuickTransactionForm.tsx
- pdfExport.ts
- react
- package.json
- getCurrencySymbol
- compilerOptions
- dependencies
- telemetry.ts
- devDependencies
- scripts
- AppIcon.tsx
- AGENTS.md — Project Law (Next.js · TypeScript · Supabase Financial App)
- 20260919000000_baseline_schema.sql
- Changelog
- Feature Requests
- SpendingHabits.tsx
- MonthlyTrendsChart.tsx
- FunFacts.tsx
- proxy.ts
- constants.ts
- @playwright/test
- RecordHighlights.tsx
- MonthCard.tsx
- next
- eslint.config.mjs
- pre-commit
- postcss.config.mjs
- vercel.json
- public.expense_entries
- ErrorBoundary
- Errors
- [LRN-20261019-002] best_practice

## God Nodes (most connected - your core abstractions)
1. `react` - 60 edges
2. `useFinancialStore` - 44 edges
3. `getCurrencySymbol()` - 37 edges
4. `vitest` - 32 edges
5. `@hugeicons/core-free-icons` - 28 edges
6. `AppIcon()` - 28 edges
7. `logError()` - 28 edges
8. `ExpenseEntry` - 28 edges
9. `IncomeEntry` - 27 edges
10. `@testing-library/react` - 19 edges

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

## Communities (40 total, 10 thin omitted)

### Community 0 - "transactionStore.ts"
Cohesion: 0.06
Nodes (60): @testing-library/jest-dom, @testing-library/react, vitest, mockPush, SAMPLE_MONTH, EditTransactionModal(), EditTransactionModalProps, CATEGORY_COLORS (+52 more)

### Community 1 - "TransactionFilterBar.tsx"
Cohesion: 0.10
Nodes (25): formatAmount(), getCategoryDotColor(), SCOPE_OPTIONS, TransactionFilterBar(), TransactionFilterBarProps, TYPE_OPTIONS, CHART_COLORS, CATEGORY_SEARCH_SYNONYMS (+17 more)

### Community 2 - "forgot-password/page.tsx"
Cohesion: 0.13
Nodes (14): react-hook-form, zod, ForgotPasswordPage(), forgotPasswordSchema, ForgotPasswordValues, LoginFormValues, LoginPage(), loginSchema (+6 more)

### Community 3 - "errorLogger.ts"
Cohesion: 0.07
Nodes (38): @supabase/supabase-js, POST(), mockInsert, ErrorPage(), GlobalError(), inter, metadata, viewport (+30 more)

### Community 4 - "QuickTransactionForm.tsx"
Cohesion: 0.10
Nodes (27): jsqr, ExpenseFormValues, expenseSchema, IncomeFormValues, incomeSchema, QrScannerModal, QuickTransactionForm(), TabType (+19 more)

### Community 5 - "pdfExport.ts"
Cohesion: 0.17
Nodes (31): arrayBufferToBase64(), C, drawCategoryRanking(), DrawContext, drawFunFacts(), drawHeader(), drawIncomeBreakdown(), drawMonthlyTrends() (+23 more)

### Community 6 - "react"
Cohesion: 0.18
Nodes (11): @hugeicons/core-free-icons, react, HistoryPage(), metadata, StatisticsPage(), useAuth(), DashboardSkeleton(), HistorySkeleton() (+3 more)

### Community 7 - "package.json"
Cohesion: 0.10
Nodes (20): engines, node, name, private, version, eslint, eslint-config-next, @hookform/resolvers (+12 more)

### Community 8 - "getCurrencySymbol"
Cohesion: 0.12
Nodes (23): CategoryChart(), CustomTooltip(), CustomTooltipProps, formatTooltipValue(), getCategoryColor(), TabType, CategoryChart, DashboardClient() (+15 more)

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, exceljs, @hookform/resolvers, @hugeicons/core-free-icons, @hugeicons/react, jspdf, jsqr, next (+9 more)

### Community 11 - "telemetry.ts"
Cohesion: 0.42
Nodes (6): WebVitals(), calculateMetricRating(), getTelemetrySessionId(), MetricRating, PerformanceMetricEvent, recordWebVital()

### Community 12 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, eslint, eslint-config-next, jsdom, @playwright/test, tailwindcss, @tailwindcss/postcss, @testing-library/jest-dom (+6 more)

### Community 13 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, build, dev, dev:https, graph:update, lint, prepare, start (+4 more)

### Community 14 - "AppIcon.tsx"
Cohesion: 0.20
Nodes (11): ErrorProps, GlobalErrorProps, fmt(), OverviewCards(), OverviewCardsProps, AppIcon(), AppIconProps, IconSquircle() (+3 more)

### Community 15 - "AGENTS.md — Project Law (Next.js · TypeScript · Supabase Financial App)"
Cohesion: 0.07
Nodes (25): 0. Stack & Platform, 1. Commands, 2. Execution Tiers, 3. Project Guardrails, 4. Security & Data, 5. Design Craft, 6. Testing Conventions, 7. Reconnaissance & Context (+17 more)

### Community 16 - "20260919000000_baseline_schema.sql"
Cohesion: 0.33
Nodes (9): auth.users, idx_error_logs_action, idx_error_logs_created_at, idx_expense_entries_user_category, idx_expense_entries_user_date, idx_income_entries_user_date, public.error_logs, public.expense_entries (+1 more)

### Community 17 - "Changelog"
Cohesion: 0.06
Nodes (35): [2026-04-08], [2026-09-14], [2026-09-19], [2026-09-20], [2026-09-22], [2026-10-14], [2026-10-17], [2026-10-19] (+27 more)

### Community 19 - "SpendingHabits.tsx"
Cohesion: 0.24
Nodes (9): CATEGORY_BAR_BG, CATEGORY_ICONS, CATEGORY_SQUIRCLE_CLASSES, fmt(), SpendingHabits(), SpendingHabitsProps, Tooltip(), TooltipProps (+1 more)

### Community 20 - "MonthlyTrendsChart.tsx"
Cohesion: 0.20
Nodes (8): recharts, MonthlyTrendsChart, CustomTooltip(), CustomTooltipProps, formatValue(), LABEL_MAP, MonthlyTrendPoint, MonthlyTrendsChartProps

### Community 21 - "FunFacts.tsx"
Cohesion: 0.33
Nodes (5): DayRecord, FactCardProps, fmt(), FunFacts(), FunFactsProps

### Community 22 - "proxy.ts"
Cohesion: 0.25
Nodes (4): @supabase/ssr, AUTH_ROUTES, config, RECOVERY_ROUTES

### Community 23 - "constants.ts"
Cohesion: 0.07
Nodes (46): exceljs, buildCalendarGrid(), CalendarDay, DateNavigator(), MONTH_NAMES_SHORT, WEEKDAY_LABELS, ExportDropdown(), ExportDropdownProps (+38 more)

### Community 25 - "RecordHighlights.tsx"
Cohesion: 0.33
Nodes (5): fmt(), MonthRecord, RecordCardProps, RecordHighlights(), RecordHighlightsProps

### Community 26 - "MonthCard.tsx"
Cohesion: 0.36
Nodes (8): DailyRow(), DailyRowProps, fmt(), formatDayDate(), MonthCard(), MonthCardProps, DailySummary, MonthlySummary

### Community 44 - "[LRN-20261019-002] best_practice"
Cohesion: 0.12
Nodes (16): Context Maintenance, Context Maintenance, Details, Details, Learnings, [LRN-20261019-001] correction, [LRN-20261019-002] best_practice, Metadata (+8 more)

## Knowledge Gaps
- **260 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+255 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 310 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `transactionStore.ts`, `TransactionFilterBar.tsx`, `forgot-password/page.tsx`, `errorLogger.ts`, `QuickTransactionForm.tsx`, `package.json`, `getCurrencySymbol`, `AppIcon.tsx`, `SpendingHabits.tsx`, `MonthlyTrendsChart.tsx`, `FunFacts.tsx`, `constants.ts`, `RecordHighlights.tsx`, `MonthCard.tsx`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **Why does `vitest` connect `transactionStore.ts` to `TransactionFilterBar.tsx`, `errorLogger.ts`, `QuickTransactionForm.tsx`, `pdfExport.ts`, `package.json`, `telemetry.ts`, `SpendingHabits.tsx`, `constants.ts`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Why does `@hugeicons/core-free-icons` connect `react` to `transactionStore.ts`, `TransactionFilterBar.tsx`, `forgot-password/page.tsx`, `QuickTransactionForm.tsx`, `package.json`, `getCurrencySymbol`, `AppIcon.tsx`, `SpendingHabits.tsx`, `MonthlyTrendsChart.tsx`, `FunFacts.tsx`, `constants.ts`, `RecordHighlights.tsx`, `MonthCard.tsx`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _260 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `transactionStore.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.060073260073260075 - nodes in this community are weakly interconnected._
- **Should `TransactionFilterBar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10114942528735632 - nodes in this community are weakly interconnected._
- **Should `forgot-password/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13071895424836602 - nodes in this community are weakly interconnected._