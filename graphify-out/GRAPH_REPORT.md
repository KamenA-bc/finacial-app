# Graph Report - finacial-app  (2026-10-17)

## Corpus Check
- 117 files · ~60,515 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .ttf 2, .ico 1)

## Summary
- 602 nodes · 1440 edges · 45 communities (32 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6ea485b7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- TransactionList.tsx
- react
- useFinancialStore
- errorLogger.ts
- QrScannerModal.tsx
- pdfExport.ts
- FunFacts.tsx
- package.json
- getCurrencySymbol
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
- dateUtils.ts
- @playwright/test
- [2026-04-08]
- excelExport.ts
- [2026-10-14]
- [2026-09-19]
- [Unreleased]
- eslint.config.mjs
- pre-commit
- postcss.config.mjs
- vercel.json
- public.expense_entries
- DashboardClient.tsx
- constants.ts
- ErrorBoundary
- RecordHighlights.tsx
- ERRORS.md
- LEARNINGS.md

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
- `GlobalError()` --calls--> `logError()`  [EXTRACTED]
  src/app/global-error.tsx → src/lib/errorLogger.ts
- `HistoryPage()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/history/page.tsx → src/components/auth/AuthProvider.tsx
- `LoginPage()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/login/page.tsx → src/components/auth/AuthProvider.tsx

## Import Cycles
- None detected.

## Communities (45 total, 9 thin omitted)

### Community 0 - "TransactionList.tsx"
Cohesion: 0.07
Nodes (46): @testing-library/jest-dom, @testing-library/react, vitest, EditTransactionModal(), EditTransactionModalProps, CATEGORY_COLORS, CATEGORY_ICONS, DeleteDialog() (+38 more)

### Community 1 - "react"
Cohesion: 0.14
Nodes (12): react, zustand, metadata, DashboardSkeleton(), HistorySkeleton(), DashboardLayout(), DashboardLayoutProps, StatisticsSkeleton() (+4 more)

### Community 2 - "useFinancialStore"
Cohesion: 0.11
Nodes (29): lucide-react, HistoryPage(), StatisticsPage(), DailyRow(), fmt(), formatDayDate(), MonthCard(), MonthCardProps (+21 more)

### Community 3 - "errorLogger.ts"
Cohesion: 0.05
Nodes (54): react-hook-form, @supabase/supabase-js, zod, POST(), mockInsert, ErrorPage(), ErrorProps, ForgotPasswordPage() (+46 more)

### Community 4 - "QrScannerModal.tsx"
Cohesion: 0.14
Nodes (21): jsqr, QrScannerModal, CameraState, isMobileDevice(), QrScannerModal(), QrScannerModalProps, ScannerTab, BarcodeDetectorConstructor (+13 more)

### Community 5 - "pdfExport.ts"
Cohesion: 0.17
Nodes (31): arrayBufferToBase64(), C, drawCategoryRanking(), DrawContext, drawFunFacts(), drawHeader(), drawIncomeBreakdown(), drawMonthlyTrends() (+23 more)

### Community 6 - "FunFacts.tsx"
Cohesion: 0.16
Nodes (13): @hugeicons/core-free-icons, DayRecord, FactCardProps, fmt(), FunFacts(), FunFactsProps, fmt(), OverviewCards() (+5 more)

### Community 7 - "package.json"
Cohesion: 0.10
Nodes (19): engines, node, name, private, version, eslint, eslint-config-next, @hookform/resolvers (+11 more)

### Community 8 - "getCurrencySymbol"
Cohesion: 0.19
Nodes (14): AnnualSummary(), AnnualSummaryProps, formatCurrency(), fmt(), IncomeBreakdown(), IncomeBreakdownProps, SplitBar(), SplitBarProps (+6 more)

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
Cohesion: 0.36
Nodes (7): CategoryChart(), CustomTooltip(), CustomTooltipProps, formatTooltipValue(), getCategoryColor(), TabType, CHART_COLORS

### Community 19 - "MonthlyTrendsChart.tsx"
Cohesion: 0.20
Nodes (8): recharts, MonthlyTrendsChart, CustomTooltip(), CustomTooltipProps, formatValue(), LABEL_MAP, MonthlyTrendPoint, MonthlyTrendsChartProps

### Community 20 - "Architecture – Finance Tracker"
Cohesion: 0.22
Nodes (9): Architecture – Finance Tracker, Authentication Flow, Constants (`lib/constants.ts`), Data Flow, Directory Structure, Key Component Relationships, Quality Gates, Supabase Tables (+1 more)

### Community 21 - "README.md"
Cohesion: 0.25
Nodes (4): Database, Finance Tracker, Scripts, Setup

### Community 22 - "proxy.ts"
Cohesion: 0.25
Nodes (4): @supabase/ssr, AUTH_ROUTES, config, RECOVERY_ROUTES

### Community 23 - "dateUtils.ts"
Cohesion: 0.33
Nodes (13): buildCalendarGrid(), CalendarDay, DateNavigator(), MONTH_NAMES_SHORT, WEEKDAY_LABELS, MAX_PAST_DAYS, addDays(), daysAgoString() (+5 more)

### Community 25 - "[2026-04-08]"
Cohesion: 0.40
Nodes (5): [2026-04-08], Added, Changed, Docs, Fixed

### Community 26 - "excelExport.ts"
Cohesion: 0.23
Nodes (10): exceljs, MONTH_NAMES_BG, buildWorkbook(), COLUMNS_HEADERS, EXCEL_COLORS, ExcelRow, exportToExcel(), getMonthlyTransactions() (+2 more)

### Community 27 - "[2026-10-14]"
Cohesion: 0.50
Nodes (4): [2026-10-14], Added, Changed, Known issue (not changed here)

### Community 28 - "[2026-09-19]"
Cohesion: 0.67
Nodes (3): [2026-09-19], Added, Fixed

### Community 29 - "[Unreleased]"
Cohesion: 0.67
Nodes (3): Added, Changed, [Unreleased]

### Community 39 - "DashboardClient.tsx"
Cohesion: 0.18
Nodes (9): CategoryChart, DashboardClient(), emptySubscribe(), ExpenseFormValues, expenseSchema, IncomeFormValues, incomeSchema, QuickTransactionForm() (+1 more)

### Community 40 - "constants.ts"
Cohesion: 0.27
Nodes (8): CATEGORY_BG_MAP, CURRENCY_TRANSITION_DATE, MAX_EXPORT_DAYS, CSV_HEADERS, CsvRow, escapeCell(), FORMULA_TRIGGER_CHARS, rowToCsv()

### Community 42 - "RecordHighlights.tsx"
Cohesion: 0.33
Nodes (5): fmt(), MonthRecord, RecordCardProps, RecordHighlights(), RecordHighlightsProps

## Knowledge Gaps
- **227 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+222 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 274 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `TransactionList.tsx`, `useFinancialStore`, `errorLogger.ts`, `QrScannerModal.tsx`, `FunFacts.tsx`, `package.json`, `DashboardClient.tsx`, `getCurrencySymbol`, `RecordHighlights.tsx`, `SpendingHabits.tsx`, `CategoryChart.tsx`, `MonthlyTrendsChart.tsx`, `dateUtils.ts`?**
  _High betweenness centrality (0.165) - this node is a cross-community bridge._
- **Why does `vitest` connect `TransactionList.tsx` to `react`, `useFinancialStore`, `errorLogger.ts`, `QrScannerModal.tsx`, `pdfExport.ts`, `package.json`, `layout.tsx`, `excelExport.ts`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _227 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TransactionList.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07063063063063063 - nodes in this community are weakly interconnected._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.1402116402116402 - nodes in this community are weakly interconnected._
- **Should `useFinancialStore` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._