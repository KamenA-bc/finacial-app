# Architecture – Finance Tracker

> **Purpose:** how every part of the project fits together. Keep it in sync with the code (see Definition of Done in `AGENTS.md`). For a machine-generated map of symbols and communities see `graphify-out/GRAPH_REPORT.md`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (strict light theme, `color-scheme: light`) |
| State | Zustand (`useFinancialStore`, persisted cache) |
| Forms | React Hook Form + Zod |
| Charts | Recharts (dynamic import, `ssr: false`) |
| Auth & DB | Supabase (PostgreSQL + Auth) via `@supabase/ssr` |
| Icons | Hugeicons Stroke Rounded via `@/components/ui/AppIcon` (`lucide-react` is legacy, 16 files pending migration) |
| Export | jsPDF, ExcelJS, CSV (UTF-8 BOM) |
| Tests | Vitest + Testing Library (colocated), Playwright (`e2e/`) |
| Deployment | Vercel (cron: `/api/cron/keepalive`, Mon & Thu 09:00) |

---

## Directory Structure

```
finacial-app/
├── src/
│   ├── proxy.ts                      # Auth gate (Next.js 16 proxy, replaces middleware)
│   ├── app/
│   │   ├── layout.tsx                # Root layout: Inter font, AuthProvider, telemetry, light color-scheme
│   │   ├── page.tsx / loading.tsx    # Dashboard (renders DashboardClient)
│   │   ├── globals.css               # Tailwind import, tokens, @variant dark safety net
│   │   ├── error.tsx, global-error.tsx
│   │   ├── login/ register/ forgot-password/ update-password/
│   │   ├── history/ (page, loading)
│   │   ├── statistics/ (page, loading)
│   │   └── api/
│   │       ├── cron/keepalive/route.ts   # Bearer CRON_SECRET; pings Supabase to avoid pausing
│   │       └── log-error/route.ts        # Client error telemetry sink (unauthenticated; field + 2KB metadata caps; uses SUPABASE_SERVICE_ROLE_KEY if set, else anon key)
│   ├── components/
│   │   ├── auth/AuthProvider.tsx
│   │   ├── dashboard/                # DashboardClient, DashboardSkeleton
│   │   ├── layout/DashboardLayout.tsx
│   │   ├── forms/QuickTransactionForm.tsx
│   │   ├── scanner/QrScannerModal.tsx    # Camera + jsQR (dynamic, ssr: false)
│   │   ├── charts/CategoryChart.tsx
│   │   ├── transactions/             # TransactionList, View/EditTransactionModal
│   │   ├── history/                  # AnnualSummary, MonthCard, HistorySkeleton
│   │   ├── statistics/               # OverviewCards, RecordHighlights, SpendingHabits,
│   │   │                             # IncomeBreakdown, MonthlyTrendsChart, FunFacts, StatisticsSkeleton
│   │   ├── telemetry/                # GlobalErrorListener, WebVitals
│   │   └── ui/                       # AppIcon (+IconSquircle), DateNavigator, ExportDropdown, StatDisplay,
│   │                                 # StatusNotification, Tooltip, ErrorBoundary
│   ├── hooks/                        # useFinancialData, useHistoryData, useStatisticsData, useBodyScrollLock
│   ├── store/                        # transactionStore (data), toastStore (notifications)
│   ├── lib/
│   │   ├── constants.ts              # categories, colors, locale, currency rules
│   │   ├── dateUtils.ts              # toISODateString and date helpers (timezone-safe)
│   │   ├── supabase.ts / supabaseServer.ts / supabaseRetry.ts   # clients + withJwtRetry
│   │   ├── errorLogger.ts, telemetry.ts
│   │   ├── csvExport.ts, excelExport.ts, pdfExport.ts, expenseRowColors.ts
│   │   └── qrDetector.ts, qrParser.ts
│   └── types/index.ts                # IncomeEntry, ExpenseEntry, ExpenseCategory, FinancialStore…
├── supabase/migrations/              # Incremental SQL (baseline, Home category, error_logs hardening)
├── e2e/                              # Playwright: auth, dashboard, export, navigation
├── .githooks/pre-commit              # Versioned hook (runs npm run validate); enabled by `prepare`
├── .github/workflows/ci.yml          # validate+build job, graph-sync job
├── .agents/skills/                   # Workspace skills (design, tailwind, react, supabase, graphify)
├── graphify-out/GRAPH_REPORT.md      # Tracked code map (other graph files are local-only)
├── AGENTS.md  ARCHITECTURE.md  CHANGELOG.md
└── vercel.json                       # Cron schedule
```

---

## Data Flow

```
┌─────────────┐   withJwtRetry   ┌───────────────────┐       ┌────────────────┐
│  Supabase   │◄────────────────►│ transactionStore  │◄─────►│  Components    │
│  (Postgres) │                  │ (Zustand+persist) │       │  (React)       │
└─────────────┘                  └───────────────────┘       └────────────────┘
       ▲                                   │
       │                                   ▼
  ┌─────────┐              ┌────────────────────────────┐
  │  Auth   │              │ useFinancialData / History │  (memoized derived stats)
  │ (Supa)  │              │ / StatisticsData           │
  └─────────┘              └────────────────────────────┘
```

1. **Supabase** stores `income_entries`, `expense_entries` (RLS by `user_id`) and `error_logs`.
2. **`useFinancialStore`** actions: `setUserId`, `fetchTransactions(userId, year?)`, `addIncome/Expense`, `updateIncome/Expense`, `deleteIncome/Expense`, `setSelectedDate`, `clearStoreCache`. Mutations update the client cache and Supabase; every client call is wrapped in `withJwtRetry`. The cache is persisted (`partialize`), so it must be cleared on sign-out via `clearStoreCache`.
3. **Hooks** derive daily/monthly/annual stats from the store with `useMemo`; no extra API calls.
4. **Errors** flow through `logError` (`lib/errorLogger.ts`) → `/api/log-error` → `error_logs`.

---

## Authentication Flow

`src/proxy.ts` runs on every non-API, non-static route:

- `RECOVERY_ROUTES` (`/forgot-password`, `/update-password`): always public.
- `AUTH_ROUTES` (`/login`, `/register`): public; authenticated users are redirected to `/`.
- Everything else: no session cookie → immediate redirect to `/login`; otherwise the session is verified and refreshed cookies are forwarded.
- API routes handle their own auth (`keepalive` via `CRON_SECRET`; `log-error` is currently open and relies on payload caps; note that with only the anon key the insert is rejected by the hardened `error_logs` RLS, so it needs `SUPABASE_SERVICE_ROLE_KEY` on the server).

`AuthProvider` exposes `useAuth()` and listens to `supabase.auth.onAuthStateChange()`; pages call `setUserId` / `fetchTransactions`.

---

## Key Component Relationships

- **Dashboard (`/`)**: `DashboardLayout` → `DateNavigator`, `StatDisplay` ×2, `ExportDropdown`, `QuickTransactionForm` (+ `QrScannerModal`), `CategoryChart`, `TransactionList` (View/Edit modals).
- **History (`/history`)**: year selector → `AnnualSummary`, `MonthCard` ×12 via `useHistoryData(year)`.
- **Statistics (`/statistics`)**: year selector → `OverviewCards`, `RecordHighlights`, `MonthlyTrendsChart`, `SpendingHabits`, `IncomeBreakdown`, `FunFacts` via `useStatisticsData(year)`.

---

## Supabase Tables

| Table | Key columns | Notes |
|---|---|---|
| `income_entries` | `id`, `user_id`→`auth.users` (cascade), `date`, `amount NUMERIC(12,2) ≥ 0`, `description`, flags (`is_work_income`, `is_with_kami`), `created_at` | Index `(user_id, date)`; 4 RLS policies `auth.uid() = user_id` |
| `expense_entries` | as above + `category` (CHECK list, incl. `Home`), flags (`is_work_expense`, `is_with_kami`, `is_with_others`) | Indexes `(user_id, date)`, `(user_id, category)`; 4 RLS policies |
| `error_logs` | `action`, `message`, `stack`, `severity` (`error`/`warning`/`info`), `metadata` JSON, `created_at` | Insert only for `authenticated` (anon insert dropped by hardening migration); select only for `service_role`; indexes on `created_at`, `action` |

Migrations live in `supabase/migrations/` as `YYYYMMDDHHMMSS_<name>.sql` (baseline 20260919…, `Home` category 20260922…, error_logs hardening 20261013…).

---

## Constants (`lib/constants.ts`)

| Constant | Value / purpose |
|---|---|
| `MAX_PAST_DAYS` | `730` – how far back navigation/export may go |
| `MAX_EXPORT_DAYS` | `30` |
| `EXPENSE_CATEGORIES` | 14 categories (type `ExpenseCategory`) |
| `CATEGORY_BG_MAP` | Category → Bulgarian label |
| `CHART_COLORS` | 14 chart hex colors |
| `CURRENCY_TRANSITION_DATE` | `2026-01-01` |
| `getCurrencySymbol(date?)` | **`лв.` before 2026-01-01, `€` from then on** (and `€` when no date is given). Never hardcode a symbol. |
| `NUMBER_LOCALE` | `bg-BG` |
| `CURRENCY_FORMAT_OPTIONS` | min/max 2 fraction digits |
| `MONTH_NAMES_BG` | Bulgarian month names |

---

## Quality Gates

- **Local:** `.githooks/pre-commit` → `npm run validate` (lint, `tsc --noEmit`, vitest).
- **CI (`ci.yml`):** job `validate` (lint, tsc, vitest, `next build`, Node 22) and job `graph-sync` (rebuilds the graph and fails when `GRAPH_REPORT.md` structure is stale).
- **Not in CI:** Playwright e2e (requires a real Supabase project).
