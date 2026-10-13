# Graph Report - finacial-app  (2026-10-13)

## Corpus Check
- 114 files · ~60,442 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .ttf 2, .ico 1)

## Summary
- 591 nodes · 1429 edges · 30 communities (21 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e3d12c1d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- constants.ts
- CategoryChart.tsx
- proxy.ts
- getCurrencySymbol
- ErrorBoundary
- 20260919000000_baseline_schema.sql
- @playwright/test
- public.expense_entries
- transactionStore.ts
- dependencies
- react
- TransactionList.tsx
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

## Communities (30 total, 5 thin omitted)

### Community 0 - "constants.ts"
Cohesion: 0.07
Nodes (46): exceljs, StatisticsPage(), buildCalendarGrid(), CalendarDay, DateNavigator(), MONTH_NAMES_SHORT, WEEKDAY_LABELS, ExportDropdown() (+38 more)

### Community 1 - "CategoryChart.tsx"
Cohesion: 0.22
Nodes (13): CategoryChart(), CustomTooltip(), CustomTooltipProps, formatTooltipValue(), getCategoryColor(), TabType, CategoryChart, buildCategoryBreakdown() (+5 more)

### Community 2 - "proxy.ts"
Cohesion: 0.25
Nodes (4): @supabase/ssr, AUTH_ROUTES, config, RECOVERY_ROUTES

### Community 3 - "getCurrencySymbol"
Cohesion: 0.05
Nodes (56): @hugeicons/core-free-icons, @hugeicons/react, lucide-react, recharts, MonthlyTrendsChart, AnnualSummary(), AnnualSummaryProps, formatCurrency() (+48 more)

### Community 4 - "ErrorBoundary"
Cohesion: 0.20
Nodes (3): ErrorBoundary, Props, State

### Community 5 - "20260919000000_baseline_schema.sql"
Cohesion: 0.33
Nodes (9): auth.users, idx_error_logs_action, idx_error_logs_created_at, idx_expense_entries_user_category, idx_expense_entries_user_date, idx_income_entries_user_date, public.error_logs, public.expense_entries (+1 more)

### Community 13 - "transactionStore.ts"
Cohesion: 0.07
Nodes (45): @supabase/supabase-js, POST(), mockInsert, ErrorPage(), ErrorProps, GlobalError(), GlobalErrorProps, AuthContext (+37 more)

### Community 15 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, exceljs, @hookform/resolvers, @hugeicons/core-free-icons, @hugeicons/react, jspdf, jsqr, lucide-react (+10 more)

### Community 22 - "react"
Cohesion: 0.09
Nodes (25): react, react-hook-form, zod, ForgotPasswordPage(), forgotPasswordSchema, ForgotPasswordValues, HistoryPage(), LoginFormValues (+17 more)

### Community 24 - "TransactionList.tsx"
Cohesion: 0.07
Nodes (44): @testing-library/jest-dom, @testing-library/react, vitest, zustand, EditTransactionModal(), EditTransactionModalProps, CATEGORY_COLORS, CATEGORY_ICONS (+36 more)

### Community 25 - "pdfExport.ts"
Cohesion: 0.17
Nodes (31): arrayBufferToBase64(), C, drawCategoryRanking(), DrawContext, drawFunFacts(), drawHeader(), drawIncomeBreakdown(), drawMonthlyTrends() (+23 more)

### Community 36 - "QuickTransactionForm.tsx"
Cohesion: 0.10
Nodes (28): jsqr, ExpenseFormValues, expenseSchema, IncomeFormValues, incomeSchema, QrScannerModal, QuickTransactionForm(), TabType (+20 more)

### Community 47 - "package.json"
Cohesion: 0.12
Nodes (16): name, private, version, eslint, eslint-config-next, @hookform/resolvers, jsdom, jspdf (+8 more)

### Community 66 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 108 - "layout.tsx"
Cohesion: 0.18
Nodes (11): nextConfig, next, inter, metadata, viewport, WebVitals(), calculateMetricRating(), getTelemetrySessionId() (+3 more)

### Community 138 - "Changelog"
Cohesion: 0.09
Nodes (21): [2026-04-08], [2026-09-14], [2026-09-19], [2026-09-20], [2026-09-22], Added, Added, Added (+13 more)

### Community 139 - "AGENT DIRECTIVE: SENIOR STAFF FULL-STACK ARCHITECT & DESIGN ENGINEER"
Cohesion: 0.15
Nodes (12): 0. TECH STACK & PLATFORM TARGET SPECIFICATION, 1. EXECUTION TIERS & STATE MACHINE, 2. HIGH-IMPACT PROJECT GOTCHAS & GUARDRAILS (CRITICAL), 3. DESIGN ENGINEERING & FINTECH CRAFT PROTOCOL, 4. RECONNAISSANCE & CONTEXT PROTOCOL, 5. VALIDATION & SUBAGENT DELEGATION, 6. LEAN RESPONSE PROTOCOL (STRICT), AGENT DIRECTIVE: SENIOR STAFF FULL-STACK ARCHITECT & DESIGN ENGINEER (+4 more)

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
- **220 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+215 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 266 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `constants.ts`, `CategoryChart.tsx`, `getCurrencySymbol`, `QuickTransactionForm.tsx`, `ErrorBoundary`, `transactionStore.ts`, `package.json`, `TransactionList.tsx`?**
  _High betweenness centrality (0.169) - this node is a cross-community bridge._
- **Why does `vitest` connect `TransactionList.tsx` to `constants.ts`, `QuickTransactionForm.tsx`, `layout.tsx`, `transactionStore.ts`, `package.json`, `react`, `pdfExport.ts`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _220 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `constants.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07288135593220339 - nodes in this community are weakly interconnected._
- **Should `getCurrencySymbol` be split into smaller, more focused modules?**
  _Cohesion score 0.05242566510172144 - nodes in this community are weakly interconnected._
- **Should `transactionStore.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06994535519125683 - nodes in this community are weakly interconnected._