# Changelog

All notable changes to the Finance Tracker project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Added
- `CHANGELOG.md` — Tracks all changes made to the project from this point forward.
- `ARCHITECTURE.md` — Documents how every file and component in the project is connected, for fast context gathering.
- **Calendar date picker** in the Dashboard's `DateNavigator` — The date label is now a clickable link that opens a compact calendar popup, allowing the user to jump to any date within the last 30 days without tedious day-by-day arrow clicking. Includes month/year navigation, "Today" quick-jump, smooth animations, and click-outside-to-close.

### Changed
- `src/components/ui/DateNavigator.tsx` — Rewritten to include an inline calendar dropdown triggered by clicking the date text. The previous/next arrow buttons remain for single-day navigation.
