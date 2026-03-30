# Architecture – Finance Tracker

> **Purpose**: This file documents how every part of the project is connected.
> Read this to quickly gather full context about the codebase.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| State Management | Zustand |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Auth & Database | Supabase (PostgreSQL + Auth) |
| Icons | Lucide React |
| Deployment | Vercel |

---

## Directory Structure

```
finacial-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout — loads Inter font, wraps with AuthProvider
│   │   ├── page.tsx            # Dashboard page (main view)
│   │   ├── globals.css         # Global styles + Tailwind import
│   │   ├── login/page.tsx      # Login page (public)
│   │   ├── register/page.tsx   # Registration page (public)
│   │   ├── history/page.tsx    # Monthly/Annual history summaries
│   │   └── api/cron/           # API routes (cron jobs)
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthProvider.tsx    # React Context providing Supabase auth state/actions
│   │   ├── layout/
│   │   │   └── DashboardLayout.tsx # Sticky header, nav links (Dashboard, History), sign-out
│   │   ├── ui/
│   │   │   ├── DateNavigator.tsx   # Day-by-day nav + calendar popup (dashboard)
│   │   │   ├── StatDisplay.tsx     # Large typographic profit/loss display
│   │   │   └── ExportButton.tsx    # CSV export button (last 30 days)
│   │   ├── forms/
│   │   │   ├── IncomeForm.tsx      # Log income (React Hook Form + Zod)
│   │   │   └── ExpenseForm.tsx     # Log expense with category (React Hook Form + Zod)
│   │   ├── charts/
│   │   │   └── CategoryChart.tsx   # Donut chart (Recharts PieChart) for expense categories
│   │   ├── transactions/
│   │   │   └── TransactionList.tsx # Income/expense rows for selected day, with delete
│   │   └── history/
│   │       ├── AnnualSummary.tsx   # Year-level income/expense/profit summary
│   │       └── MonthCard.tsx       # Expandable month card with daily breakdown table
│   │
│   ├── hooks/
│   │   ├── useFinancialData.ts     # Derived daily/monthly stats from store (memoized)
│   │   └── useHistoryData.ts       # Aggregates data by month/year for history page
│   │
│   ├── store/
│   │   └── transactionStore.ts     # Zustand store — single source of truth, syncs with Supabase
│   │
│   ├── lib/
│   │   ├── constants.ts            # MAX_PAST_DAYS, categories, chart colors, currency config
│   │   ├── dateUtils.ts            # Date formatting, navigation, month ranges
│   │   ├── csvExport.ts            # CSV generation and download trigger
│   │   ├── supabase.ts             # Browser-side Supabase client (singleton via Proxy)
│   │   └── supabaseServer.ts       # Server-side Supabase client (cookie-based)
│   │
│   ├── types/
│   │   └── index.ts                # IncomeEntry, ExpenseEntry, FinancialStore, etc.
│   │
│   └── middleware.ts               # Route protection — redirects unauthenticated users to /login
│
├── vercel.json                     # Vercel deployment config
├── package.json                    # Dependencies and scripts
├── CHANGELOG.md                    # Tracks all changes from 2026-03-30 onward
└── ARCHITECTURE.md                 # This file
```

---

## Data Flow

```
┌─────────────┐     ┌──────────────────┐     ┌────────────────┐
│  Supabase   │◄───►│  transactionStore │◄───►│   Components   │
│  (Postgres) │     │  (Zustand)        │     │  (React)       │
└─────────────┘     └──────────────────┘     └────────────────┘
       ▲                     │
       │                     ▼
  ┌─────────┐      ┌──────────────────┐
  │  Auth   │      │  useFinancialData │  (derived stats)
  │ (Supa)  │      │  useHistoryData   │  (derived aggregates)
  └─────────┘      └──────────────────┘
```

1. **Supabase** stores all `income_entries` and `expense_entries` keyed by `user_id`.
2. **transactionStore** (Zustand) is a thin client-side cache that fetches from Supabase on login/mount, then mutates locally + remotely on add/delete.
3. **Custom hooks** (`useFinancialData`, `useHistoryData`) compute derived stats (daily/monthly/annual profit, category breakdowns) from the store via `useMemo`.
4. **Components** read from hooks/store and render UI. Forms call store actions which handle Supabase mutations.

---

## Authentication Flow

```
User visits any route
        │
        ▼
  middleware.ts checks Supabase session cookie
        │
   ┌────┴────┐
   │ No auth │──────► Redirect to /login
   │         │
   │ Has auth│──────► Allow through
   └─────────┘
        │
        ▼
  AuthProvider.tsx sets user context via supabase.auth.onAuthStateChange()
        │
        ▼
  Dashboard / History page reads user from useAuth(), calls:
    • setUserId(user.id)
    • fetchTransactions(user.id)
```

**Public routes** (no auth required): `/login`, `/register`

---

## Key Component Relationships

### Dashboard Page (`/`)
- **DashboardLayout** → wraps page with header/nav
- **DateNavigator** → allows day-by-day nav + calendar popup → writes to `store.selectedDate`
- **StatDisplay** × 2 → shows daily + monthly profit (reads `useFinancialData()`)
- **ExportButton** → triggers CSV download of last 30 days
- **IncomeForm** → adds income for selected date → calls `store.addIncome()`
- **ExpenseForm** → adds expense for selected date → calls `store.addExpense()`
- **CategoryChart** → donut chart of day's expense categories
- **TransactionList** → lists day's transactions with delete buttons

### History Page (`/history`)
- **DashboardLayout** → wraps page with header/nav
- Year selector → `useState(currentYear)`
- **AnnualSummary** → reads from `useHistoryData(year)`
- **MonthCard** × 12 → expandable cards with daily breakdown table

---

## Supabase Tables

| Table | Columns | Used by |
|---|---|---|
| `income_entries` | `id`, `user_id`, `date`, `amount` | `transactionStore.addIncome/deleteIncome/fetchTransactions` |
| `expense_entries` | `id`, `user_id`, `date`, `amount`, `description`, `category` | `transactionStore.addExpense/deleteExpense/fetchTransactions` |

Auth is handled by Supabase Auth (email/password) via `@supabase/ssr`.

---

## Constants (single source of truth: `lib/constants.ts`)

| Constant | Value | Used in |
|---|---|---|
| `MAX_PAST_DAYS` | `30` | DateNavigator, csvExport, dateUtils |
| `EXPENSE_CATEGORIES` | 6 categories | ExpenseForm, CategoryChart, useFinancialData, useHistoryData |
| `CHART_COLORS` | 6 hex colors | CategoryChart |
| `CURRENCY_SYMBOL` | `€` | StatDisplay, TransactionList, CategoryChart, AnnualSummary, MonthCard |
| `NUMBER_LOCALE` | `en-US` | All formatters |
| `CURRENCY_FORMAT_OPTIONS` | `{min: 2, max: 2}` | All formatters |
