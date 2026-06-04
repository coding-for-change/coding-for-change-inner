# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Coding For Change (codingforchange.com) website — a multi-service architecture with three main components orchestrated via Docker Compose.

## Architecture

The repo has three services under `outer/`, `inner/`, and `inner/cms/`:

- **Inner site** (`inner/`): A React (CRA) app styled as a Windows 95-like desktop OS. This is the **canonical site, served at `/`**. Uses react-router-dom, framer-motion, and usehooks-ts.
- **Outer site** (`outer/`): A 3D Three.js scene (a retro computer on a desk) built with TypeScript and Webpack. It is the opt-in "enhanced experience" served at **`/3d`** (the inner desktop OS is rendered inside the 3D monitor screen via iframe). The Express server (`outer/server/index.ts`) is the single entry point on port 8080 and reverse-proxies to the inner site and CMS. The 3D scene is marked `noindex`, and mobile User-Agents requesting `/3d` are redirected to `/`.
- **CMS** (`inner/cms/`): Payload CMS v3 on Next.js 15, backed by PostgreSQL. Provides REST API at `/api/` and admin panel at `/admin/`. Collections: Events, FAQ, Media, Projects, Sponsors, Team. Globals: Membership, SiteConfig.

**Request flow** (all through outer Express, port 80→8080, see `outer/server/index.ts`):
- `/admin`, `/api`, `/_next`, `/media` → proxied to the CMS
- `/3d` → the 3D scene's static webpack build (served from `outer/public`)
- `/inner/*` → `301` redirect to `/*` (legacy path; inner is no longer embedded there)
- everything else (`/`, `/about`, `/team`, …) → proxied to the inner app, which serves the SPA

> Note: the 3D scene's webpack build sets `publicPath` to `/3d/`, and the inner app's `index.html` is what's served at `/` — its bundle is CRA's non-content-hashed `/static/js/bundle.js`.

## Development Commands

### Outer site (3D scene)
```bash
cd outer
npm install
npm run dev      # webpack dev server
npm run build    # production build
npm start        # serve production build via Express
```

### Inner site (React desktop)
```bash
cd inner
npm install
npm start        # CRA dev server (port 3000)
npm run build    # production build
npm test         # Jest tests
```

### CMS
```bash
cd inner/cms
pnpm install     # has pnpm-lock.yaml
pnpm dev         # Next.js dev server
pnpm build       # production build
pnpm generate:types  # generate Payload TypeScript types
```

### Full stack (Docker)
```bash
cp .env.example .env  # configure PAYLOAD_SECRET and DATABASE_URL
docker compose up --build                        # default stack
docker compose -f docker-compose.dev.yml up      # hot-reloading dev stack
docker compose -f docker-compose.prod.yml up     # production stack
```
Runs all services: outer (port 80), inner (also direct on 3001 in dev), CMS (port 3000), and PostgreSQL.

The **dev stack** (`docker-compose.dev.yml`) bind-mounts host source into each container and runs the dev servers (webpack `--watch` for outer, CRA `npm start` for inner, `pnpm dev` for CMS) with polling-based file watching, so edits hot-reload. Note: the inner CRA bundle (`/static/js/bundle.js`) is **not** content-hashed and is served without a `Cache-Control` header — if the browser shows a stale UI, hard-refresh (Cmd+Shift+R) or enable "Disable cache" in DevTools. The 3D scene at `/3d` has no HMR and always requires a manual browser refresh after a rebuild.

## CMS schema changes — REQUIRED process

**Any change to a Payload collection, global, or field (anything that alters the DB schema) MUST ship with a committed migration.** Production runs `db.push: false` (only dev uses `push: true`), so prod's schema is updated *only* by migration files. Skipping this leaves prod querying tables/columns that don't exist → `relation "..." does not exist` 500s and "missing content / no Create button" in the admin. This is what caused the June 2026 outage.

Follow these steps exactly when updating the CMS:

1. **Make the code change** in `inner/cms/src/` (collection/global/`payload.config.ts`).
2. **Generate the migration against the last-deployed schema** — *not* against a dev DB that `push` has already mutated, or the diff comes out empty/wrong. Use a throwaway Postgres:
   ```bash
   cd inner/cms
   docker run -d --name cfc-pg-mig -e POSTGRES_USER=payload -e POSTGRES_PASSWORD=payload -e POSTGRES_DB=payload -p 55432:5432 postgres:16-alpine
   export DATABASE_URL=postgresql://payload:payload@localhost:55432/payload PAYLOAD_SECRET=$(head -c32 /dev/urandom | base64 | tr -dc a-zA-Z0-9 | head -c32)
   pnpm payload migrate            # apply existing committed migrations → baseline state
   pnpm payload migrate:create my_change_name   # diffs config vs baseline → writes src/migrations/<ts>_my_change_name.{ts,json}
   docker rm -f cfc-pg-mig
   ```
3. **Review** the generated `up`/`down` SQL. If it drops a column that holds data you must keep, hand-edit the migration to copy the data first (see `scripts/prod-localize-reconcile.sql` for the pattern).
4. **Verify the build:** `pnpm build` (this also runs the type-check that the prod Docker build gates on).
5. **Commit** the new `src/migrations/*` files **together with** the code change. Never commit one without the other.
6. **Deploy.** The CMS Dockerfile `CMD` is `pnpm payload migrate && pnpm start`, so pending migrations auto-apply on boot before the server starts. A migration failure blocks startup (loud crash-loop) rather than silently serving a broken schema — check `docker logs homepage-cms-1` if a deploy crash-loops.

Hard rules / gotchas:
- **Never enable `push` in production**, and never "fix" a schema drift by toggling it — `push` can drop columns non-interactively and destroy data.
- `inner/cms/package.json` **must keep `"type": "module"`** — `payload migrate` loads the TS config via tsx and without it the extensionless `./collections/*` imports fail with `ERR_MODULE_NOT_FOUND` (the boot crash fixed in `9dcc818`). `next build`/`next start` bundle the config so they hide this; only the migrate CLI exposes it.
- To repair a DB that already drifted (has the old schema, no matching migrations): restore a backup into a local Postgres, write a transactional reconcile script that creates the missing tables, copies data, drops old columns, and records the baseline migration as applied; diff the result against a fresh `pnpm payload migrate` (`pg_dump --schema-only`) to prove it matches, and boot the CMS against it before touching prod. `scripts/prod-localize-reconcile.sql` is the worked example.

## Key Architectural Details

- The outer site uses a **singleton pattern** for the `Application` class (`outer/src/Application/Application.ts`) which manages the Three.js scene, camera, renderer, and world objects.
- The outer site's 3D world includes: Computer, MonitorScreen (renders the iframe), CoffeeSteam, Cursor, Decor, Environment, and Hitboxes.
- The inner site's UI component (`outer/src/Application/UI/`) is a React app rendered alongside the Three.js canvas for overlay controls.
- The inner site mimics a desktop OS with Window, Desktop, Toolbar, and DesktopShortcut components under `inner/src/components/os/`.
- Content pages (Home, About, Team, Events, Projects, Sponsors, etc.) live in `inner/src/components/showcase/`.
- The `INNER_SITE_URL` env var is baked into the 3D bundle at build time (webpack DefinePlugin) and controls the iframe URL the 3D monitor loads. It is set to `/` in Docker so the iframe loads the inner site through the outer Express proxy (same as production).

## Environment Variables

See `.env.example`:
- `PAYLOAD_SECRET` — required for CMS (min 32 chars)
- `DATABASE_URL` — PostgreSQL connection string
- `CMS_URL` / `INNER_URL` — set automatically in Docker Compose
