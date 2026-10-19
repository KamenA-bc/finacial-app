# Graph Report - finacial-app  (2026-10-19)

## Corpus Check
- 122 files · ~66,101 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .ttf 2, .ico 1)

## Summary
- 659 nodes · 1569 edges · 35 communities (21 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0458edc1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- transactionStore.ts
- TransactionList.tsx
- filterTransactions.ts
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
- next
- AGENTS.md — Project Law (Next.js · TypeScript · Supabase Financial App)
- 20260919000000_baseline_schema.sql
- Changelog
- Feature Requests
- MonthlyTrendsChart.tsx
- proxy.ts
- constants.ts
- @playwright/test
- eslint.config.mjs
- pre-commit
- postcss.config.mjs
- vercel.json
- public.expense_entries
- ErrorBoundary
- Errors
- [LRN-20261019-001] correction

## God Nodes (most connected - your core abstractions)
1. `react` - 60 edges
2. `useFinancialStore` - 44 edges
3. `getCurrencySymbol()` - 37 edges
4. `vitest` - 32 edges
5. `logError()` - 28 edges
6. `ExpenseEntry` - 28 edges
7. `IncomeEntry` - 27 edges
8. `@testing-library/react` - 19 edges
9. `useAuth()` - 18 edges
10. `lucide-react` - 16 edges

## Surprising Connections (you probably didn't know these)
- `MonthCardProps` --references--> `MonthlySummary`  [EXTRACTED]
  src/components/history/MonthCard.tsx → src/hooks/useHistoryData.ts
- `ExpenseRowProps` --references--> `ExpenseEntry`  [EXTRACTED]
  src/components/transactions/TransactionList.tsx → src/types/index.ts
- `IncomeRowProps` --references--> `IncomeEntry`  [EXTRACTED]
  src/components/transactions/TransactionList.tsx → src/types/index.ts
- `ErrorPage()` --calls--> `logError()`  [EXTRACTED]
  src/app/error.tsx → src/lib/errorLogger.ts
- `GlobalError()` --calls--> `logError()`  [EXTRACTED]
  src/app/global-error.tsx → src/lib/errorLogger.ts

## Import Cycles
- None detected.

## Communities (35 total, 10 thin omitted)

### Community 0 - "transactionStore.ts"
Cohesion: 0.07
Nodes (52): exceljs, @testing-library/jest-dom, @testing-library/react, vitest, zustand, HistoryPage(), StatisticsPage(), mockPush (+44 more)

### Community 1 - "TransactionList.tsx"
Cohesion: 0.12
Nodes (22): CATEGORY_COLORS, CATEGORY_ICONS, DeleteDialog(), DeleteDialogProps, ExpenseRow(), ExpenseRowProps, formatAmount(), formatShortRowDate() (+14 more)

### Community 2 - "filterTransactions.ts"
Cohesion: 0.18
Nodes (15): CATEGORY_SEARCH_SYNONYMS, DEFAULT_TRANSACTION_FILTERS, EXPENSE_TYPE_KEYWORDS, filterTransactions(), INCOME_TYPE_KEYWORDS, KAMI_KEYWORDS, matchesAmountQuery(), matchesAnyKeyword() (+7 more)

### Community 3 - "errorLogger.ts"
Cohesion: 0.05
Nodes (58): lucide-react, react-hook-form, @supabase/supabase-js, zod, POST(), mockInsert, ErrorPage(), ErrorProps (+50 more)

### Community 4 - "QuickTransactionForm.tsx"
Cohesion: 0.11
Nodes (26): jsqr, ExpenseFormValues, expenseSchema, IncomeFormValues, incomeSchema, QrScannerModal, TabType, CameraState (+18 more)

### Community 5 - "pdfExport.ts"
Cohesion: 0.17
Nodes (31): arrayBufferToBase64(), C, drawCategoryRanking(), DrawContext, drawFunFacts(), drawHeader(), drawIncomeBreakdown(), drawMonthlyTrends() (+23 more)

### Community 6 - "react"
Cohesion: 0.08
Nodes (29): react, metadata, DashboardSkeleton(), HistorySkeleton(), DashboardLayout(), DashboardLayoutProps, fmt(), IncomeBreakdown() (+21 more)

### Community 7 - "package.json"
Cohesion: 0.11
Nodes (18): engines, node, name, private, version, eslint, eslint-config-next, @hookform/resolvers (+10 more)

### Community 8 - "getCurrencySymbol"
Cohesion: 0.05
Nodes (60): @hugeicons/core-free-icons, @hugeicons/react, CategoryChart(), CustomTooltip(), CustomTooltipProps, formatTooltipValue(), getCategoryColor(), TabType (+52 more)

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, exceljs, @hookform/resolvers, @hugeicons/core-free-icons, @hugeicons/react, jspdf, jsqr, lucide-react (+10 more)

### Community 11 - "telemetry.ts"
Cohesion: 0.42
Nodes (6): WebVitals(), calculateMetricRating(), getTelemetrySessionId(), MetricRating, PerformanceMetricEvent, recordWebVital()

### Community 12 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, eslint, eslint-config-next, jsdom, @playwright/test, tailwindcss, @tailwindcss/postcss, @testing-library/jest-dom (+6 more)

### Community 13 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, build, dev, dev:https, graph:update, lint, prepare, start (+4 more)

### Community 15 - "AGENTS.md — Project Law (Next.js · TypeScript · Supabase Financial App)"
Cohesion: 0.07
Nodes (25): 0. Stack & Platform, 1. Commands, 2. Execution Tiers, 3. Project Guardrails, 4. Security & Data, 5. Design Craft, 6. Testing Conventions, 7. Reconnaissance & Context (+17 more)

### Community 16 - "20260919000000_baseline_schema.sql"
Cohesion: 0.33
Nodes (9): auth.users, idx_error_logs_action, idx_error_logs_created_at, idx_expense_entries_user_category, idx_expense_entries_user_date, idx_income_entries_user_date, public.error_logs, public.expense_entries (+1 more)

### Community 17 - "Changelog"
Cohesion: 0.06
Nodes (32): [2026-04-08], [2026-09-14], [2026-09-19], [2026-09-20], [2026-09-22], [2026-10-14], [2026-10-17], [2026-10-19] (+24 more)

### Community 20 - "MonthlyTrendsChart.tsx"
Cohesion: 0.20
Nodes (8): recharts, MonthlyTrendsChart, CustomTooltip(), CustomTooltipProps, formatValue(), LABEL_MAP, MonthlyTrendPoint, MonthlyTrendsChartProps

### Community 22 - "proxy.ts"
Cohesion: 0.25
Nodes (4): @supabase/ssr, AUTH_ROUTES, config, RECOVERY_ROUTES

### Community 23 - "constants.ts"
Cohesion: 0.15
Nodes (23): buildCalendarGrid(), CalendarDay, DateNavigator(), MONTH_NAMES_SHORT, WEEKDAY_LABELS, CATEGORY_BG_MAP, CURRENCY_TRANSITION_DATE, MAX_EXPORT_DAYS (+15 more)

### Community 44 - "[LRN-20261019-001] correction"
Cohesion: 0.20
Nodes (9): Context Maintenance, Details, Learnings, [LRN-20261019-001] correction, Metadata, Skill Extraction Fields, Status Definitions, Suggested Action (+1 more)

## Knowledge Gaps
- **253 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+248 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 303 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `transactionStore.ts`, `TransactionList.tsx`, `errorLogger.ts`, `QuickTransactionForm.tsx`, `package.json`, `getCurrencySymbol`, `MonthlyTrendsChart.tsx`, `constants.ts`?**
  _High betweenness centrality (0.150) - this node is a cross-community bridge._
- **Why does `vitest` connect `transactionStore.ts` to `TransactionList.tsx`, `filterTransactions.ts`, `errorLogger.ts`, `QuickTransactionForm.tsx`, `pdfExport.ts`, `react`, `package.json`, `telemetry.ts`, `constants.ts`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _253 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `transactionStore.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06801093643198906 - nodes in this community are weakly interconnected._
- **Should `TransactionList.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12169312169312169 - nodes in this community are weakly interconnected._
- **Should `errorLogger.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05031645569620253 - nodes in this community are weakly interconnected._