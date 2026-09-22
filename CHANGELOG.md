# Changelog

All notable changes to the Finance Tracker project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [2026-09-22]

### Added
- **Home Expense Category**: Added `Home` expense category placed immediately before `Shopping` across the application:
  - `src/types/index.ts`: Added `'Home'` to `ExpenseCategory` union type.
  - `src/lib/constants.ts`: Registered `'Home'` in `EXPENSE_CATEGORIES`, mapped `'Home': 'Home'` in `CATEGORY_BG_MAP`, and added dedicated muted indigo palette color (`#8C85B8`) in `CHART_COLORS`.
  - `src/components/transactions/TransactionList.tsx`: Added `Home01Icon` from Hugeicons and indigo styling tokens (`bg-indigo-50 text-indigo-500 border-indigo-200/70`).
  - `src/components/statistics/SpendingHabits.tsx`: Added `Home01Icon`, category squircle classes, and progress bar background.
  - `supabase/migrations/20260922141600_add_home_expense_category.sql`: Added database migration updating `expense_entries_category_check` CHECK constraint to include `'Home'`.
  - `src/types/index.test.ts` & `src/hooks/useStatisticsData.test.ts`: Added contract tests and updated category count assertions (13 → 14).
- **Edit Modal Button Craft (`EditTransactionModal.tsx`)**: Removed static checkmark badge icon from the primary save button, established clear visual hierarchy with specular depth (`shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]`), hairline separation border, confident padding (`px-5 py-2`), and softened secondary cancel action (`font-medium text-stone-500`).
- **Mobile-First Category Breakdown Redesign (`CategoryChart.tsx`)**: Redesigned category spending breakdown for optimal mobile readability:
  - Added Pareto Top 5 + "Останали" aggregation to prevent 14-slice overcrowding on phone screens.
  - Implemented interactive center touch readout displaying category name, amount in `tabular-nums`, and percentage share without hover tooltip dependency.
  - Replaced unstructured 14-dot legend with a ranked category metric list featuring proportional progress tracks and an inline expand/collapse drawer (`Top 4` default).
  - Replaced restricted Lucide imports with Hugeicons Stroke Rounded (`PieChart01Icon`, `Calendar01Icon`, `ArrowDown01Icon`, `ArrowUp01Icon`).
  - Added component test suite in `src/components/charts/CategoryChart.test.tsx` (5 tests covering aggregation, expand/collapse, touch selection, and empty state).

## [2026-09-20]

### Added
- **In-Place Transaction Editing (`EditTransactionModal.tsx`)**: Added an accessible modal dialog allowing users to edit existing income and expense entries directly without deleting and recreating them. Supports modifying amount, date, description, category, and flag chips (`Работни`, `Kami ❤️`, `С Други`) with dynamic currency indicators (`лв.` vs. `€`) and keyboard accessibility (Escape key).
- **Zustand Store Actions (`src/store/transactionStore.ts`)**: Implemented `updateIncome` and `updateExpense` with zero-latency optimistic UI updates, automated date-sorted repositioning, snake_case DB payload mapping, Supabase persistence via `withJwtRetry`, and automatic rollback protection on failure.
- **TransactionList Edit Action (`src/components/transactions/TransactionList.tsx`)**: Added `Pencil` edit button alongside delete action on transaction rows, opening the pre-filled edit modal.
- **Unit Test Coverage**: Added comprehensive test suites in `src/store/transactionStore.test.ts` (8 new tests for store updates & rollbacks) and `src/components/transactions/EditTransactionModal.test.tsx` (9 tests for pre-filled data, form validation, tag toggling, submission, and cancelation).

### Fixed
- **Mobile Action Button Visibility & Contrast (`TransactionList.tsx`)**: Replaced desktop hover-only `opacity-60 text-stone-300` styling with solid, high-contrast action buttons (`bg-stone-100 text-stone-600` for Edit and `text-rose-500 hover:bg-rose-50` for Delete) with comfortable 36px touch hit boxes and tactile press physics (`active:scale-[0.95]`).
- **CategoryChart Mobile Text Wrapping (`CategoryChart.tsx`)**: Made header layout responsive (`flex-col sm:flex-row sm:items-center`) to eliminate collision and awkward line wrapping between category title and time period selector on narrow phone viewports.
- **Transaction Row Alignment (`TransactionList.tsx`)**: Anchored amounts and action buttons in a dedicated right-aligned container to eliminate mid-row floating.

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
- **Receipt Scanner UX Redesign (`QrScannerModal.tsx`)**: Moved file picker to root to fix gallery button failure, removed obsolete tab bar, introduced context-aware camera-first view on mobile with a single floating frosted-glass gallery shortcut (with comfortable thumb padding and refined glassmorphic transparency), eliminated the redundant bottom footer menu and duplicate gallery button, tailored mobile fallback card without drag & drop text, desktop file-first dropzone with webcam option, and added a 250ms emerald scan confirmation pulse.

### Added
- **AI Harness & Workflow Modernization**: Pruned redundant frontend skills (`frontend-design`, `design-taste-frontend`), installed official public skills (`supabase/agent-skills@supabase-postgres-best-practices` and `lombiq/tailwind-agent-skills@tailwind-4-docs`), established version-controlled Supabase baseline schema migration (`supabase/migrations/20260919000000_baseline_schema.sql`) with strict RLS and composite indexes, consolidated Fintech Calibration Dials and radius hierarchy into `AGENTS.md`, introduced FSM Section 0.2 Operational Tiers (Tier 0 Advisory Mode for read-only Q&A/audits, Tier 1 Express Mode for micro-patches, and Tier 2 Standard Mode), codified Section 0.3 High-Impact Project Gotchas (PGRST303 clock-skew retry, Cyrillic Excel UTF-8 BOM, Next.js 16 dynamic imports `{ ssr: false }`, Sofia timezone anchoring, declarative database migration protocol), codified Section 1.1 Subagent Orchestration Matrix (`security-auditor`, `code-reviewer`, `web-performance-auditor`, `test-engineer`), added `"graph:update"` and `"validate"` npm scripts in `package.json`, added `.graphifyignore` pruning 4,066 noisy skill and parser nodes from the AST knowledge graph (`graphify`), migrated `vitest.config.ts` to `vitest.config.mts` with native ESM `fileURLToPath` to eliminate configLoader warnings, added local mechanical pre-commit hook (`.git/hooks/pre-commit`), and established GitHub Actions CI pipeline (`.github/workflows/ci.yml`).
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
