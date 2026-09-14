# Graph Report - finacial-app  (2026-09-14)

## Corpus Check
- 91 files · ~363,569 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .ttf 2, (none) 1, .ico 1)

## Summary
- 431 nodes · 1056 edges · 23 communities (16 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Data Export & History Page
- Annual Summary & Analytics
- Global Error Boundaries & Testing
- Dashboard & Core UI State
- PDF Generation & Reporting
- Insights & Fun Facts Component
- Category Visualization & Charts
- Transaction Management & Lists
- TypeScript Configuration
- Project Manifest & Next.js Setup
- Root Layout & Font Configuration
- Forms & Zustand Transaction Store
- Production Dependencies
- Development & Testing Tooling
- Build & CI Scripts
- Supabase Authentication & Server Client
- Playwright End-to-End Testing
- API Transactions Mutation Route
- ESLint Configuration
- PostCSS Styling Pipeline
- Vercel Deployment & Cron Jobs

## God Nodes (most connected - your core abstractions)
1. `react` - 39 edges
2. `useFinancialStore` - 35 edges
3. `getCurrencySymbol()` - 31 edges
4. `logError()` - 26 edges
5. `lucide-react` - 24 edges
6. `vitest` - 19 edges
7. `useAuth()` - 18 edges
8. `IncomeEntry` - 16 edges
9. `ExpenseEntry` - 16 edges
10. `compilerOptions` - 16 edges

## Surprising Connections (you probably didn't know these)
- `MonthCardProps` --references--> `MonthlySummary`  [EXTRACTED]
  src/components/history/MonthCard.tsx → src/hooks/useHistoryData.ts
- `ExpenseRowProps` --references--> `ExpenseEntry`  [EXTRACTED]
  src/components/transactions/TransactionList.tsx → src/types/index.ts
- `IncomeRowProps` --references--> `IncomeEntry`  [EXTRACTED]
  src/components/transactions/TransactionList.tsx → src/types/index.ts
- `ErrorPage()` --calls--> `logError()`  [EXTRACTED]
  src/app/error.tsx → src/lib/errorLogger.ts
- `ForgotPasswordPage()` --calls--> `extractErrorMessage()`  [EXTRACTED]
  src/app/forgot-password/page.tsx → src/lib/errorLogger.ts

## Import Cycles
- None detected.

## Communities (23 total, 5 thin omitted)

### Community 0 - "Data Export & History Page"
Cohesion: 0.07
Nodes (43): exceljs, @testing-library/react, vitest, HistoryPage(), FinancialData, MonthlySummary, sumAmount(), useHistoryData() (+35 more)

### Community 1 - "Annual Summary & Analytics"
Cohesion: 0.06
Nodes (48): recharts, MonthlyTrendsChart, AnnualSummary(), AnnualSummaryProps, formatCurrency(), DailyRow(), fmt(), formatDayDate() (+40 more)

### Community 2 - "Global Error Boundaries & Testing"
Cohesion: 0.09
Nodes (25): @testing-library/jest-dom, ErrorPage(), ErrorProps, GlobalError(), GlobalErrorProps, AuthProvider(), GlobalErrorListener(), ErrorBoundary (+17 more)

### Community 3 - "Dashboard & Core UI State"
Cohesion: 0.12
Nodes (25): lucide-react, react, react-hook-form, @supabase/supabase-js, zod, ForgotPasswordPage(), forgotPasswordSchema, ForgotPasswordValues (+17 more)

### Community 4 - "PDF Generation & Reporting"
Cohesion: 0.17
Nodes (31): arrayBufferToBase64(), C, drawCategoryRanking(), DrawContext, drawFunFacts(), drawHeader(), drawIncomeBreakdown(), drawMonthlyTrends() (+23 more)

### Community 5 - "Insights & Fun Facts Component"
Cohesion: 0.19
Nodes (18): DayRecord, FactCardProps, fmt(), FunFacts(), FunFactsProps, buildCalendarGrid(), CalendarDay, DateNavigator() (+10 more)

### Community 6 - "Category Visualization & Charts"
Cohesion: 0.16
Nodes (15): metadata, CategoryChart(), CustomTooltip(), CustomTooltipProps, formatTooltipValue(), TabType, CategoryChart, DashboardClient() (+7 more)

### Community 7 - "Transaction Management & Lists"
Cohesion: 0.15
Nodes (15): CATEGORY_COLORS, CATEGORY_ICONS, DeleteDialogProps, ExpenseRow(), ExpenseRowProps, FilterMode, formatAmount(), IncomeRow() (+7 more)

### Community 8 - "TypeScript Configuration"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 9 - "Project Manifest & Next.js Setup"
Cohesion: 0.12
Nodes (16): name, private, version, eslint, eslint-config-next, @hookform/resolvers, jsdom, jspdf (+8 more)

### Community 10 - "Root Layout & Font Configuration"
Cohesion: 0.19
Nodes (10): nextConfig, next, inter, metadata, WebVitals(), calculateMetricRating(), getTelemetrySessionId(), MetricRating (+2 more)

### Community 11 - "Forms & Zustand Transaction Store"
Cohesion: 0.18
Nodes (12): zustand, ExpenseFormValues, expenseSchema, IncomeFormValues, incomeSchema, QuickTransactionForm(), TabType, StatusNotification() (+4 more)

### Community 12 - "Production Dependencies"
Cohesion: 0.13
Nodes (15): dependencies, exceljs, @hookform/resolvers, jspdf, lucide-react, next, react, react-dom (+7 more)

### Community 13 - "Development & Testing Tooling"
Cohesion: 0.14
Nodes (14): devDependencies, eslint, eslint-config-next, jsdom, @playwright/test, tailwindcss, @tailwindcss/postcss, @testing-library/jest-dom (+6 more)

### Community 14 - "Build & CI Scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, start, test, test:e2e, test:watch

### Community 15 - "Supabase Authentication & Server Client"
Cohesion: 0.29
Nodes (3): @supabase/ssr, config, PUBLIC_ROUTES

## Knowledge Gaps
- **162 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+157 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 198 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Dashboard & Core UI State` to `Data Export & History Page`, `Annual Summary & Analytics`, `Global Error Boundaries & Testing`, `Insights & Fun Facts Component`, `Category Visualization & Charts`, `Transaction Management & Lists`, `Project Manifest & Next.js Setup`, `Forms & Zustand Transaction Store`?**
  _High betweenness centrality (0.169) - this node is a cross-community bridge._
- **Why does `vitest` connect `Data Export & History Page` to `Global Error Boundaries & Testing`, `Dashboard & Core UI State`, `PDF Generation & Reporting`, `Transaction Management & Lists`, `Project Manifest & Next.js Setup`, `Root Layout & Font Configuration`, `Forms & Zustand Transaction Store`, `API Transactions Mutation Route`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `Dashboard & Core UI State` to `Annual Summary & Analytics`, `Global Error Boundaries & Testing`, `Insights & Fun Facts Component`, `Category Visualization & Charts`, `Transaction Management & Lists`, `Project Manifest & Next.js Setup`, `Forms & Zustand Transaction Store`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _162 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Data Export & History Page` be split into smaller, more focused modules?**
  _Cohesion score 0.07431693989071038 - nodes in this community are weakly interconnected._
- **Should `Annual Summary & Analytics` be split into smaller, more focused modules?**
  _Cohesion score 0.05792349726775956 - nodes in this community are weakly interconnected._
- **Should `Global Error Boundaries & Testing` be split into smaller, more focused modules?**
  _Cohesion score 0.09302325581395349 - nodes in this community are weakly interconnected._