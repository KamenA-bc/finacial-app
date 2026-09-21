# Graph Report - finacial-app  (2026-09-21)

## Corpus Check
- 103 files · ~52,797 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .ttf 2, .ico 1)

## Summary
- 549 nodes · 1285 edges · 27 communities (21 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ee8ce2e5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- login/page.tsx
- lucide-react
- proxy.ts
- @playwright/test
- constants.ts
- errorLogger.ts
- dependencies
- react
- transactionStore.ts
- pdfExport.ts
- QrScannerModal.tsx
- package.json
- compilerOptions
- TransactionList.tsx
- DashboardClient.tsx
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
1. `react` - 50 edges
2. `useFinancialStore` - 38 edges
3. `getCurrencySymbol()` - 33 edges
4. `logError()` - 26 edges
5. `vitest` - 24 edges
6. `lucide-react` - 19 edges
7. `IncomeEntry` - 19 edges
8. `ExpenseEntry` - 19 edges
9. `useAuth()` - 18 edges
10. `compilerOptions` - 16 edges

## Surprising Connections (you probably didn't know these)
- `ErrorPage()` --calls--> `logError()`  [EXTRACTED]
  src/app/error.tsx → src/lib/errorLogger.ts
- `LoginPage()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/login/page.tsx → src/components/auth/AuthProvider.tsx
- `RegisterPage()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/register/page.tsx → src/components/auth/AuthProvider.tsx
- `UpdatePasswordPage()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/update-password/page.tsx → src/components/auth/AuthProvider.tsx
- `MonthCardProps` --references--> `MonthlySummary`  [EXTRACTED]
  src/components/history/MonthCard.tsx → src/hooks/useHistoryData.ts

## Import Cycles
- None detected.

## Communities (27 total, 4 thin omitted)

### Community 0 - "login/page.tsx"
Cohesion: 0.22
Nodes (8): react-hook-form, zod, LoginFormValues, LoginPage(), loginSchema, UpdatePasswordPage(), updatePasswordSchema, UpdatePasswordValues

### Community 1 - "lucide-react"
Cohesion: 0.25
Nodes (6): lucide-react, ErrorPage(), ErrorProps, RegisterFormValues, RegisterPage(), registerSchema

### Community 2 - "proxy.ts"
Cohesion: 0.25
Nodes (4): @supabase/ssr, AUTH_ROUTES, config, RECOVERY_ROUTES

### Community 8 - "constants.ts"
Cohesion: 0.05
Nodes (54): @hugeicons/core-free-icons, @hugeicons/react, recharts, MonthlyTrendsChart, AnnualSummary(), AnnualSummaryProps, formatCurrency(), DailyRow() (+46 more)

### Community 13 - "errorLogger.ts"
Cohesion: 0.09
Nodes (33): @supabase/supabase-js, POST(), mockInsert, ForgotPasswordPage(), forgotPasswordSchema, ForgotPasswordValues, GlobalError(), GlobalErrorProps (+25 more)

### Community 15 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, exceljs, @hookform/resolvers, @hugeicons/core-free-icons, @hugeicons/react, jspdf, jsqr, lucide-react (+10 more)

### Community 22 - "react"
Cohesion: 0.11
Nodes (14): react, @testing-library/jest-dom, HistoryPage(), metadata, StatisticsPage(), useAuth(), DashboardSkeleton(), HistorySkeleton() (+6 more)

### Community 24 - "transactionStore.ts"
Cohesion: 0.09
Nodes (35): @testing-library/react, vitest, zustand, ExpenseFormValues, expenseSchema, IncomeFormValues, incomeSchema, QuickTransactionForm() (+27 more)

### Community 25 - "pdfExport.ts"
Cohesion: 0.17
Nodes (31): arrayBufferToBase64(), C, drawCategoryRanking(), DrawContext, drawFunFacts(), drawHeader(), drawIncomeBreakdown(), drawMonthlyTrends() (+23 more)

### Community 36 - "QrScannerModal.tsx"
Cohesion: 0.15
Nodes (20): jsqr, CameraState, isMobileDevice(), QrScannerModal(), QrScannerModalProps, ScannerTab, BarcodeDetectorConstructor, BarcodeDetectorInstance (+12 more)

### Community 47 - "package.json"
Cohesion: 0.12
Nodes (16): name, private, version, eslint, eslint-config-next, @hookform/resolvers, jsdom, jspdf (+8 more)

### Community 66 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 71 - "TransactionList.tsx"
Cohesion: 0.15
Nodes (14): CATEGORY_COLORS, CATEGORY_ICONS, DeleteDialogProps, ExpenseRow(), ExpenseRowProps, FilterMode, formatAmount(), IncomeRow() (+6 more)

### Community 83 - "DashboardClient.tsx"
Cohesion: 0.06
Nodes (54): exceljs, CategoryChart(), CustomTooltip(), CustomTooltipProps, formatTooltipValue(), TabType, CategoryChart, DashboardClient() (+46 more)

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
- **216 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+211 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 259 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `login/page.tsx`, `lucide-react`, `QrScannerModal.tsx`, `TransactionList.tsx`, `constants.ts`, `errorLogger.ts`, `package.json`, `DashboardClient.tsx`, `transactionStore.ts`?**
  _High betweenness centrality (0.169) - this node is a cross-community bridge._
- **Why does `vitest` connect `transactionStore.ts` to `QrScannerModal.tsx`, `TransactionList.tsx`, `layout.tsx`, `errorLogger.ts`, `package.json`, `DashboardClient.tsx`, `react`, `pdfExport.ts`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _216 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `constants.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05328218243819267 - nodes in this community are weakly interconnected._
- **Should `errorLogger.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08776595744680851 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._