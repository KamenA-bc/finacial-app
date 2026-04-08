# Changelog

All notable changes to the Finance Tracker project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
