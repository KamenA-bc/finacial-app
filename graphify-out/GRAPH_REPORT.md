# Graph Report - finacial-app  (2026-09-21)

## Corpus Check
- 105 files · ~52,888 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .ttf 2, .ico 1)

## Summary
- 548 nodes · 1298 edges · 26 communities (19 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `677ff531`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dateUtils.ts
- next
- proxy.ts
- @playwright/test
- constants.ts
- errorLogger.ts
- dependencies
- react
- transactionStore.ts
- pdfExport.ts
- QuickTransactionForm.tsx
- package.json
- compilerOptions
- statistics/page.tsx
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
- `ForgotPasswordPage()` --calls--> `extractErrorMessage()`  [EXTRACTED]
  src/app/forgot-password/page.tsx → src/lib/errorLogger.ts
- `GlobalError()` --calls--> `logError()`  [EXTRACTED]
  src/app/global-error.tsx → src/lib/errorLogger.ts
- `HistoryPage()` --calls--> `useHistoryData()`  [EXTRACTED]
  src/app/history/page.tsx → src/hooks/useHistoryData.ts

## Import Cycles
- None detected.

## Communities (26 total, 5 thin omitted)

### Community 0 - "dateUtils.ts"
Cohesion: 0.16
Nodes (20): buildCalendarGrid(), CalendarDay, DateNavigator(), MONTH_NAMES_SHORT, WEEKDAY_LABELS, MAX_EXPORT_DAYS, MAX_PAST_DAYS, CSV_HEADERS (+12 more)

### Community 2 - "proxy.ts"
Cohesion: 0.25
Nodes (4): @supabase/ssr, AUTH_ROUTES, config, RECOVERY_ROUTES

### Community 8 - "constants.ts"
Cohesion: 0.07
Nodes (45): @hugeicons/core-free-icons, AnnualSummary(), AnnualSummaryProps, formatCurrency(), DailyRow(), fmt(), formatDayDate(), MonthCard() (+37 more)

### Community 13 - "errorLogger.ts"
Cohesion: 0.06
Nodes (39): @supabase/supabase-js, @testing-library/react, vitest, POST(), mockInsert, ErrorPage(), ErrorProps, GlobalError() (+31 more)

### Community 15 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, exceljs, @hookform/resolvers, @hugeicons/core-free-icons, @hugeicons/react, jspdf, jsqr, lucide-react (+10 more)

### Community 22 - "react"
Cohesion: 0.08
Nodes (28): react, react-hook-form, @testing-library/jest-dom, zod, ForgotPasswordPage(), forgotPasswordSchema, ForgotPasswordValues, HistoryPage() (+20 more)

### Community 24 - "transactionStore.ts"
Cohesion: 0.09
Nodes (40): EditTransactionModal(), EditTransactionModalProps, CATEGORY_COLORS, CATEGORY_ICONS, DeleteDialogProps, ExpenseRow(), ExpenseRowProps, FilterMode (+32 more)

### Community 25 - "pdfExport.ts"
Cohesion: 0.17
Nodes (31): arrayBufferToBase64(), C, drawCategoryRanking(), DrawContext, drawFunFacts(), drawHeader(), drawIncomeBreakdown(), drawMonthlyTrends() (+23 more)

### Community 36 - "QuickTransactionForm.tsx"
Cohesion: 0.09
Nodes (31): jsqr, zustand, ExpenseFormValues, expenseSchema, IncomeFormValues, incomeSchema, QuickTransactionForm(), TabType (+23 more)

### Community 47 - "package.json"
Cohesion: 0.11
Nodes (17): name, private, version, eslint, eslint-config-next, @hookform/resolvers, @hugeicons/react, jsdom (+9 more)

### Community 66 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 83 - "statistics/page.tsx"
Cohesion: 0.06
Nodes (40): exceljs, lucide-react, recharts, MonthlyTrendsChart, StatisticsPage(), CategoryChart(), CustomTooltip(), CustomTooltipProps (+32 more)

### Community 108 - "telemetry.ts"
Cohesion: 0.42
Nodes (6): WebVitals(), calculateMetricRating(), getTelemetrySessionId(), MetricRating, PerformanceMetricEvent, recordWebVital()

### Community 138 - "Changelog"
Cohesion: 0.11
Nodes (18): [2026-04-08], [2026-09-14], [2026-09-19], [2026-09-20], Added, Added, Added, Added (+10 more)

### Community 139 - "AGENT DIRECTIVE: SENIOR STAFF FULL-STACK ARCHITECT & DESIGN ENGINEER"
Cohesion: 0.17
Nodes (11): 0. TECH STACK SPECIFICATION, 1. EXECUTION TIERS & STATE MACHINE, 2. HIGH-IMPACT PROJECT GOTCHAS & GUARDRAILS (CRITICAL), 3. DESIGN ENGINEERING & FINTECH CRAFT PROTOCOL, 4. RECONNAISSANCE & CONTEXT PROTOCOL, 5. VALIDATION & SUBAGENT DELEGATION, 6. AGENT RESPONSE FORMAT, AGENT DIRECTIVE: SENIOR STAFF FULL-STACK ARCHITECT & DESIGN ENGINEER (+3 more)

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

- **Why does `react` connect `react` to `dateUtils.ts`, `QuickTransactionForm.tsx`, `constants.ts`, `errorLogger.ts`, `package.json`, `statistics/page.tsx`, `transactionStore.ts`?**
  _High betweenness centrality (0.179) - this node is a cross-community bridge._
- **Why does `vitest` connect `errorLogger.ts` to `dateUtils.ts`, `QuickTransactionForm.tsx`, `telemetry.ts`, `package.json`, `statistics/page.tsx`, `react`, `transactionStore.ts`, `pdfExport.ts`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _211 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `constants.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07017543859649122 - nodes in this community are weakly interconnected._
- **Should `errorLogger.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06151062867480778 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._