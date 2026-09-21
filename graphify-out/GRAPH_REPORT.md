# Graph Report - finacial-app  (2026-09-21)

## Corpus Check
- 105 files · ~54,334 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .ttf 2, .ico 1)

## Summary
- 555 nodes · 1305 edges · 31 communities (24 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8535d19c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- MonthlyTrendsChart.tsx
- DashboardClient.tsx
- proxy.ts
- ErrorBoundary
- statistics/page.tsx
- MonthCard.tsx
- @playwright/test
- FunFacts.tsx
- SpendingHabits.tsx
- RecordHighlights.tsx
- errorLogger.ts
- dependencies
- react
- transactionStore.ts
- pdfExport.ts
- QuickTransactionForm.tsx
- package.json
- compilerOptions
- dateUtils.ts
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
- `ForgotPasswordPage()` --calls--> `extractErrorMessage()`  [EXTRACTED]
  src/app/forgot-password/page.tsx → src/lib/errorLogger.ts
- `GlobalError()` --calls--> `logError()`  [EXTRACTED]
  src/app/global-error.tsx → src/lib/errorLogger.ts
- `HistoryPage()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/history/page.tsx → src/components/auth/AuthProvider.tsx

## Import Cycles
- None detected.

## Communities (31 total, 5 thin omitted)

### Community 0 - "MonthlyTrendsChart.tsx"
Cohesion: 0.20
Nodes (8): recharts, MonthlyTrendsChart, CustomTooltip(), CustomTooltipProps, formatValue(), LABEL_MAP, MonthlyTrendPoint, MonthlyTrendsChartProps

### Community 1 - "DashboardClient.tsx"
Cohesion: 0.16
Nodes (18): CategoryChart(), CustomTooltip(), CustomTooltipProps, formatTooltipValue(), TabType, CategoryChart, QuickTransactionForm(), AnnualSummary() (+10 more)

### Community 2 - "proxy.ts"
Cohesion: 0.25
Nodes (4): @supabase/ssr, AUTH_ROUTES, config, RECOVERY_ROUTES

### Community 4 - "statistics/page.tsx"
Cohesion: 0.25
Nodes (8): lucide-react, fmt(), IncomeBreakdown(), IncomeBreakdownProps, SplitBar(), SplitBarProps, Props, State

### Community 5 - "MonthCard.tsx"
Cohesion: 0.43
Nodes (6): DailyRow(), fmt(), formatDayDate(), MonthCard(), MonthCardProps, DailySummary

### Community 7 - "FunFacts.tsx"
Cohesion: 0.33
Nodes (5): DayRecord, FactCardProps, fmt(), FunFacts(), FunFactsProps

### Community 8 - "SpendingHabits.tsx"
Cohesion: 0.13
Nodes (18): @hugeicons/core-free-icons, @hugeicons/react, fmt(), OverviewCards(), OverviewCardsProps, CATEGORY_BAR_BG, CATEGORY_ICONS, CATEGORY_SQUIRCLE_CLASSES (+10 more)

### Community 9 - "RecordHighlights.tsx"
Cohesion: 0.33
Nodes (5): fmt(), MonthRecord, RecordCardProps, RecordHighlights(), RecordHighlightsProps

### Community 13 - "errorLogger.ts"
Cohesion: 0.09
Nodes (32): @supabase/supabase-js, POST(), mockInsert, ErrorPage(), ErrorProps, GlobalError(), GlobalErrorProps, AuthContext (+24 more)

### Community 15 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, exceljs, @hookform/resolvers, @hugeicons/core-free-icons, @hugeicons/react, jspdf, jsqr, lucide-react (+10 more)

### Community 22 - "react"
Cohesion: 0.10
Nodes (23): react, react-hook-form, zod, ForgotPasswordPage(), forgotPasswordSchema, ForgotPasswordValues, LoginFormValues, LoginPage() (+15 more)

### Community 24 - "transactionStore.ts"
Cohesion: 0.06
Nodes (52): @testing-library/jest-dom, @testing-library/react, vitest, zustand, HistoryPage(), DashboardClient(), EditTransactionModal(), EditTransactionModalProps (+44 more)

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

### Community 83 - "dateUtils.ts"
Cohesion: 0.08
Nodes (41): exceljs, buildCalendarGrid(), CalendarDay, DateNavigator(), MONTH_NAMES_SHORT, WEEKDAY_LABELS, ExportDropdown(), ExportDropdownProps (+33 more)

### Community 108 - "layout.tsx"
Cohesion: 0.19
Nodes (10): nextConfig, next, inter, metadata, WebVitals(), calculateMetricRating(), getTelemetrySessionId(), MetricRating (+2 more)

### Community 138 - "Changelog"
Cohesion: 0.11
Nodes (18): [2026-04-08], [2026-09-14], [2026-09-19], [2026-09-20], Added, Added, Added, Added (+10 more)

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
- **217 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+212 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 260 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `MonthlyTrendsChart.tsx`, `DashboardClient.tsx`, `statistics/page.tsx`, `QuickTransactionForm.tsx`, `MonthCard.tsx`, `FunFacts.tsx`, `SpendingHabits.tsx`, `RecordHighlights.tsx`, `errorLogger.ts`, `package.json`, `dateUtils.ts`, `transactionStore.ts`?**
  _High betweenness centrality (0.175) - this node is a cross-community bridge._
- **Why does `vitest` connect `transactionStore.ts` to `QuickTransactionForm.tsx`, `layout.tsx`, `errorLogger.ts`, `package.json`, `dateUtils.ts`, `react`, `pdfExport.ts`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _217 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `SpendingHabits.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12554112554112554 - nodes in this community are weakly interconnected._
- **Should `errorLogger.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08973172987974098 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._