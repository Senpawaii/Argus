# Argus 👁️

A playground for learning [Sentry](https://sentry.io) on the frontend, against a **self-hosted** Sentry.
The app is a tiny fantasy shop (Angular + Express mock API) with deliberately seeded bugs, so there is always something real to look at in Sentry.

```
web/    Angular 22 app (@sentry/angular: errors, tracing, session replay, user feedback)
api/    Express mock API (@sentry/node: server errors + distributed traces)
infra/  sentry.sh - install/manage self-hosted Sentry (runs in WSL + Docker Desktop)
```

## Quick start

### 1. Self-hosted Sentry (Windows: WSL2 + Docker Desktop)

Needs Docker Desktop with WSL integration enabled for your distro (Settings > Resources > WSL integration), ~4 CPU / 16 GB RAM, ~20 GB disk.

```bash
# inside WSL (Ubuntu)
./infra/sentry.sh install                  # clones getsentry/self-hosted 26.9.0 to ~/sentry-self-hosted, installs, starts (first run: 10-20 min)
./infra/sentry.sh user you@example.com 'a-password'
```

Open <http://localhost:9000>, log in, and create two projects: **argus-web** (Angular) and **argus-api** (Node/Express). Copy each DSN.
Later: `./infra/sentry.sh up | down | status | logs`.

### 2. Configure DSNs (both files are gitignored)

```bash
cp web/public/runtime-config.example.json web/public/runtime-config.json   # set sentryDsn
cp api/.env.example api/.env                                               # set SENTRY_DSN
```

Without a DSN the SDKs stay disabled and the app still runs.

### 3. Run

```bash
cd api && npm install && npm start        # :3000
cd web && npm install && npm start        # :4200 (proxies /api to :3000)
```

## Seeded bugs (what to click)

| # | Where | Action | What Sentry shows |
|---|-------|--------|-------------------|
| 1 | `/product/13` (Mystery Box) | open it | `TypeError ... reading 'weight'` - API omits `specs`, template assumes it |
| 2 | Shop page | type in the search box | slow `/api/products?q=` - ~1.75 s of sequential `db.scan_product` spans in the trace |
| 3 | Cart | apply coupon `TILT` | frontend HTTP 500 linked to the API exception (distributed trace) |
| 4 | Checkout | country `XX` | unhandled 422; Pay button stays disabled |
| 5 | Shop + Checkout | add *Boots of Slightly Faster* (out of stock), pay | unhandled 409 |
| 6 | `/cart` | open it with an empty cart | `TypeError ... reading 'product'` |

## Sentry features wired up

- **Errors**: `Sentry.createErrorHandler()` as Angular `ErrorHandler`
- **Tracing**: `browserTracingIntegration()` (route changes + fetch), trace propagation to the API
- **Session Replay**: 100% of sessions (playground only)
- **User Feedback**: floating "Report a Bug" widget
- **Context**: `setUser` (Log in as Merlin), cart breadcrumbs, custom span `checkout.submit`
- **Release / environment**: `argus-web@0.1.0`, `local`

## Ideas to explore next

Source map upload (`@sentry/cli`), alerts, release health, ignore/resolve/assign issue workflows, sampling rates, `beforeSend` scrubbing.
