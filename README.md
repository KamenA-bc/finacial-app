# Finance Tracker

Mobile-first personal finance app (Next.js App Router, TypeScript, Tailwind v4, Zustand, Supabase).
Architecture: [ARCHITECTURE.md](ARCHITECTURE.md) · Change history: [CHANGELOG.md](CHANGELOG.md) · Contributor/agent rules: [AGENTS.md](AGENTS.md)

## Setup

Requires Node 22+.

```bash
npm install          # also enables the versioned git hooks (.githooks/pre-commit)
# create .env.local with the variables below
npm run dev
```

Environment variables (`.env.local`, never committed):

| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | client | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | Used by `/api/log-error` |
| `CRON_SECRET` | server only | Authorizes `/api/cron/keepalive` |

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` / `npm run dev:https` | Dev server (`dev:https` for camera/QR testing, needs `certificates/`) |
| `npm run validate` | Lint + typecheck + unit tests (also runs on pre-commit) |
| `npm run build` | Production build |
| `npm run test:e2e` | Playwright (needs a real Supabase test project) |
| `npm run graph:update` | Refresh `graphify-out/GRAPH_REPORT.md` (`pip install "graphifyy[sql]"`) |

## Database

SQL migrations in `supabase/migrations/` (apply in order with the Supabase CLI or SQL editor).
