# Changelog

All notable changes to the Finance Tracker project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [2026-09-19]

### Fixed
- **Auth Route Redirection (`src/proxy.ts`)**: Redirect authenticated users visiting `/login` or `/register` to `/` while preserving fast unauthenticated pass-through (`0ms` bypass) and ensuring password recovery routes (`/forgot-password`, `/update-password`) remain accessible.
- **Premature Optimistic Toast (`QuickTransactionForm.tsx`)**: Transaction submission now awaits Supabase persistence before triggering a success toast; on network or database errors, an error toast is surfaced and user input is preserved for retry.
- **Cross-User Cache Leak (`src/store/transactionStore.ts`)**: Persisted state now stores `userId` in local storage; `setUserId` and `fetchTransactions` immediately wipe cached records when switching accounts to prevent data bleed across users.
- **Multi-Device Remote Deletion Sync (`src/store/transactionStore.ts`)**: Remote deletions in Supabase are now purged locally on data sync by treating remote entries for the queried year as authoritative while safely preserving transactions from non-queried years.
- **Barcode Fall-Through Glitch (`src/lib/qrDetector.ts`)**: Replaced single-item check with an iteration loop over all candidate detections from native `BarcodeDetector.detect()`, preventing invalid non-QR or unparsable barcodes from blocking valid receipt QR codes.
- **UTF-8 BOM in CSV Export (`src/lib/csvExport.ts`)**: Prepended UTF-8 Byte Order Mark (`\uFEFF`) to CSV exports to ensure seamless Cyrillic text decoding in desktop Microsoft Excel.
- **Playwright Strict Mode Locator (`e2e/dashboard.spec.ts`)**: Replaced ambiguous `page.locator('header')` query with `page.getByRole('banner')` to eliminate strict mode locator violations during SSR streaming hydration.
- **Telemetry Noise & Extension Suppression (`GlobalErrorListener.tsx`)**: Filtered out unhandled rejections with empty/undefined reasons and ignored third-party browser extension origins (`chrome-extension://`) and benign DOM engine notices (`ResizeObserver loop`).
- **Stale Chunk Auto-Recovery (`ErrorBoundary.tsx`)**: Detected dynamic bundle chunk load errors (`ChunkLoadError`, `Failed to load chunk`) and rendered an update recovery banner with an interactive page reload button.
- **Auth Session Error Handling (`AuthProvider.tsx`)**: Added explicit `.catch()` handler to initial `supabase.auth.getSession()` to prevent unhandled promise rejections on storage/auth failures.
- **Receipt Scanner UX Redesign (`QrScannerModal.tsx`)**: Moved file picker to root to fix gallery button failure, removed obsolete tab bar, introduced context-aware camera-first view on mobile with floating frosted-glass gallery shortcut, tailored mobile fallback card without drag & drop text, desktop file-first dropzone with webcam option, and added a 250ms emerald scan confirmation pulse.

### Added
- **Unit & Integration Tests**: Added regression tests for UTF-8 CSV BOM export (`csvExport.test.ts`), multi-barcode fallback detection (`qrDetector.test.ts`), user-switch cache flush / remote deletion sync (`transactionStore.test.ts`), telemetry extension/undefined noise filtering (`GlobalErrorListener.test.tsx`), chunk load error reload (`ErrorBoundary.test.tsx`), and auth getSession catch (`AuthProvider.test.tsx`).
- **E2E Test**: Added authenticated user redirect test on `/login` in `e2e/auth.spec.ts`.

---

## [2026-09-14]

### Added
- **HistorySkeleton component** (`src/components/history/HistorySkeleton.tsx`) — Zero-overhead, GPU-accelerated skeleton UI matching the Year Selector, AnnualSummary card, and MonthCard list.
- **StatisticsSkeleton component** (`src/components/statistics/StatisticsSkeleton.tsx`) — Comprehensive skeleton matching KPI cards, Record Highlights, Monthly Trends Chart, Spending Habits, and Fun Facts.
- **Next.js App Router streaming fallbacks** (`src/app/loading.tsx`, `src/app/history/loading.tsx`, `src/app/statistics/loading.tsx`) — Instant server-rendered skeleton streaming across page transitions.
- **Unit test suites for Skeletons** (`HistorySkeleton.test.tsx`, `StatisticsSkeleton.test.tsx`) — Ensuring accessibility compliance (`aria-busy="true"`) and structural integrity.

### Changed
- `src/app/history/page.tsx` — Replaced generic centered spinner (`Loader2`) with `HistorySkeleton`.
- `src/app/statistics/page.tsx` — Replaced generic centered spinner (`Loader2`) with `StatisticsSkeleton` and upgraded `MonthlyTrendsChart` dynamic import fallback to a tailored bar chart skeleton.
- `src/components/dashboard/DashboardClient.tsx` — Upgraded `CategoryChart` dynamic import fallback from spinner to donut chart skeleton matching the rest of the dashboard.

---

## [2026-04-08]

### Added
- **"Работни разходи" checkbox** in the Expense Form — Users can now mark an expense as a work expense. Work expenses are visually distinguished with amber-colored amounts (instead of the default rose-red) and a small "Работни" badge in the transaction list, making it easy to tell personal spending from work.
- **"Подаръци" expense category** — New gift category with a `Gift` icon and dedicated chart color.
- `is_work_expense` column support in `expense_entries` Supabase table — New boolean field tracked across insert, select, and CSV export.
- CSV export now includes a **"Работни разходи"** column (Да/Не) for filtering in Google Sheets.

### Changed
- **Expense categories completely replaced** to match `options.md`: Магазини (Храна/Вода), Eating out, Гориво, Градски транспорт, Health/Аптека, Beauty, Shopping, Entertainment, Пътуване, Сметки/Разходи, Фирмени разходи, Подаръци, Други.
- `src/types/index.ts` — `ExpenseCategory` type updated to 13 new categories; added `isWorkExpense` field to `ExpenseEntry`.
- `src/lib/constants.ts` — `EXPENSE_CATEGORIES`, `CATEGORY_BG_MAP`, and `CHART_COLORS` updated to new 13-category set.
- `src/components/transactions/TransactionList.tsx` — `CATEGORY_ICONS` and `CATEGORY_COLORS` maps rewritten for new categories; added new icon imports (`Plane`, `Receipt`, `Sparkles`, `Gift`); removed unused `Zap` import. **Newest transactions now appear at the top** of the list (reversed render order).
- `src/store/transactionStore.ts` — `addExpense` and `fetchTransactions` now handle `is_work_expense` field with snake_case ↔ camelCase mapping.
- `src/components/forms/ExpenseForm.tsx` — Added `isWorkExpense` boolean field to Zod schema; added styled checkbox with amber accent and briefcase icon.
- `src/lib/csvExport.ts` — Added "Работни разходи" column to CSV headers and row output.

### Fixed
- **Broken expense rendering** — `CATEGORY_ICONS` and `CATEGORY_COLORS` in `TransactionList.tsx` still referenced old category names after the category update, causing `undefined` lookups at runtime.
- **Transaction order** — New transactions now appear at the top of the daily list instead of the bottom.

### Docs
- `ARCHITECTURE.md` — Fixed stale values in Constants table: `MAX_PAST_DAYS` (30 → 730), `EXPENSE_CATEGORIES` (6 → 13), `CHART_COLORS` (6 → 13), `NUMBER_LOCALE` (`en-US` → `bg-BG`).
- `types/index.ts` — Fixed stale comment "6 allowed expense categories" → "All allowed expense categories".

---

## [Unreleased]

### Added
- `CHANGELOG.md` — Tracks all changes made to the project from this point forward.
- `ARCHITECTURE.md` — Documents how every file and component in the project is connected, for fast context gathering.
- **Calendar date picker** in the Dashboard's `DateNavigator` — The date label is now a clickable link that opens a compact calendar popup, allowing the user to jump to any date within the last 2 years without tedious day-by-day arrow clicking. Includes month/year navigation, "Today" quick-jump, smooth animations, and click-outside-to-close.
- **New Expense Categories**: Added Medicine/Health, Fuel, Firm Expenses, and Shopping categories, along with their respective icons and chart colors.

### Changed
- `src/components/ui/DateNavigator.tsx` — Rewritten to include an inline calendar dropdown triggered by clicking the date text. The previous/next arrow buttons remain for single-day navigation. Fixed month navigation to properly disable the "previous month" arrow when reaching the 2-year calendar limit.
- `src/lib/constants.ts` — `MAX_PAST_DAYS` expanded from 30 to 730 (~2 years). Added separate `MAX_EXPORT_DAYS = 30` so CSV export continues to cover only the last 30 days.
- `src/lib/csvExport.ts` — Updated to use `MAX_EXPORT_DAYS` instead of `MAX_PAST_DAYS`.
