# Graph Report - finacial-app  (2026-10-17)

## Corpus Check
- 118 files · ~60,980 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .ttf 2, .ico 1)

## Summary
- 610 nodes · 1447 edges · 34 communities (21 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b3f378c3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react
- DashboardLayout.tsx
- useFinancialStore
- transactionStore.ts
- QuickTransactionForm.tsx
- pdfExport.ts
- login/page.tsx
- package.json
- constants.ts
- compilerOptions
- dependencies
- layout.tsx
- devDependencies
- scripts
- expenseRowColors.ts
- AGENTS.md — Project Law (Next.js · TypeScript · Supabase Financial App)
- 20260919000000_baseline_schema.sql
- Changelog
- Feature Requests
- proxy.ts
- dateUtils.ts
- @playwright/test
- eslint.config.mjs
- pre-commit
- postcss.config.mjs
- vercel.json
- public.expense_entries
- ErrorBoundary
- Errors
- Learnings

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

## Communities (34 total, 9 thin omitted)

### Community 0 - "react"
Cohesion: 0.07
Nodes (52): @hugeicons/core-free-icons, react, @testing-library/jest-dom, @testing-library/react, vitest, zustand, CATEGORY_BAR_BG, CATEGORY_ICONS (+44 more)

### Community 1 - "DashboardLayout.tsx"
Cohesion: 0.22
Nodes (5): metadata, DashboardSkeleton(), HistorySkeleton(), DashboardLayout(), DashboardLayoutProps

### Community 2 - "useFinancialStore"
Cohesion: 0.10
Nodes (38): HistoryPage(), StatisticsPage(), useAuth(), CategoryChart(), CustomTooltip(), CustomTooltipProps, formatTooltipValue(), getCategoryColor() (+30 more)

### Community 3 - "transactionStore.ts"
Cohesion: 0.06
Nodes (50): lucide-react, @supabase/supabase-js, POST(), mockInsert, ErrorPage(), ErrorProps, ForgotPasswordPage(), forgotPasswordSchema (+42 more)

### Community 4 - "QuickTransactionForm.tsx"
Cohesion: 0.11
Nodes (26): jsqr, ExpenseFormValues, expenseSchema, IncomeFormValues, incomeSchema, QrScannerModal, TabType, CameraState (+18 more)

### Community 5 - "pdfExport.ts"
Cohesion: 0.17
Nodes (31): arrayBufferToBase64(), C, drawCategoryRanking(), DrawContext, drawFunFacts(), drawHeader(), drawIncomeBreakdown(), drawMonthlyTrends() (+23 more)

### Community 6 - "login/page.tsx"
Cohesion: 0.16
Nodes (11): react-hook-form, zod, LoginFormValues, LoginPage(), loginSchema, RegisterFormValues, RegisterPage(), registerSchema (+3 more)

### Community 7 - "package.json"
Cohesion: 0.10
Nodes (19): engines, node, name, private, version, eslint, eslint-config-next, @hookform/resolvers (+11 more)

### Community 8 - "constants.ts"
Cohesion: 0.07
Nodes (38): recharts, MonthlyTrendsChart, QuickTransactionForm(), AnnualSummary(), AnnualSummaryProps, formatCurrency(), DayRecord, FactCardProps (+30 more)

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

### Community 14 - "expenseRowColors.ts"
Cohesion: 0.47
Nodes (4): ExpenseRowColors, flagKey(), getExpenseRowColors(), allCombinations

### Community 15 - "AGENTS.md — Project Law (Next.js · TypeScript · Supabase Financial App)"
Cohesion: 0.07
Nodes (24): 0. Stack & Platform, 1. Commands, 2. Execution Tiers, 3. Project Guardrails, 4. Security & Data, 5. Design Craft, 6. Testing Conventions, 7. Reconnaissance & Context (+16 more)

### Community 16 - "20260919000000_baseline_schema.sql"
Cohesion: 0.33
Nodes (9): auth.users, idx_error_logs_action, idx_error_logs_created_at, idx_expense_entries_user_category, idx_expense_entries_user_date, idx_income_entries_user_date, public.error_logs, public.expense_entries (+1 more)

### Community 17 - "Changelog"
Cohesion: 0.07
Nodes (27): [2026-04-08], [2026-09-14], [2026-09-19], [2026-09-20], [2026-09-22], [2026-10-14], [2026-10-17], Added (+19 more)

### Community 22 - "proxy.ts"
Cohesion: 0.25
Nodes (4): @supabase/ssr, AUTH_ROUTES, config, RECOVERY_ROUTES

### Community 23 - "dateUtils.ts"
Cohesion: 0.09
Nodes (34): exceljs, buildCalendarGrid(), CalendarDay, DateNavigator(), MONTH_NAMES_SHORT, WEEKDAY_LABELS, ExportDropdown(), ExportDropdownProps (+26 more)

### Community 44 - "Learnings"
Cohesion: 0.50
Nodes (3): Learnings, Skill Extraction Fields, Status Definitions

## Knowledge Gaps
- **230 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+225 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 278 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `DashboardLayout.tsx`, `useFinancialStore`, `transactionStore.ts`, `QuickTransactionForm.tsx`, `login/page.tsx`, `package.json`, `constants.ts`, `dateUtils.ts`?**
  _High betweenness centrality (0.161) - this node is a cross-community bridge._
- **Why does `vitest` connect `react` to `transactionStore.ts`, `QuickTransactionForm.tsx`, `pdfExport.ts`, `package.json`, `layout.tsx`, `expenseRowColors.ts`, `dateUtils.ts`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _230 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.06820987654320988 - nodes in this community are weakly interconnected._
- **Should `useFinancialStore` be split into smaller, more focused modules?**
  _Cohesion score 0.09513742071881606 - nodes in this community are weakly interconnected._
- **Should `transactionStore.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._