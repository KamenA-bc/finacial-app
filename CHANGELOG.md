# Changelog

All notable changes to the Finance Tracker project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Added
- `CHANGELOG.md` — Tracks all changes made to the project from this point forward.
- `ARCHITECTURE.md` — Documents how every file and component in the project is connected, for fast context gathering.
- **Calendar date picker** in the Dashboard's `DateNavigator` — The date label is now a clickable link that opens a compact calendar popup, allowing the user to jump to any date within the last 2 years without tedious day-by-day arrow clicking. Includes month/year navigation, "Today" quick-jump, smooth animations, and click-outside-to-close.

### Changed
- `src/components/ui/DateNavigator.tsx` — Rewritten to include an inline calendar dropdown triggered by clicking the date text. The previous/next arrow buttons remain for single-day navigation.
- `src/lib/constants.ts` — `MAX_PAST_DAYS` expanded from 30 to 730 (~2 years). Added separate `MAX_EXPORT_DAYS = 30` so CSV export continues to cover only the last 30 days.
- `src/lib/csvExport.ts` — Updated to use `MAX_EXPORT_DAYS` instead of `MAX_PAST_DAYS`.
