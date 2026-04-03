# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Coding For Change (codingforchange.com) website — a multi-service architecture with three main components orchestrated via Docker Compose.

## Architecture

The repo has three services under `outer/`, `inner/`, and `inner/cms/`:

- **Outer site** (`outer/`): A 3D Three.js scene (a retro computer on a desk) built with TypeScript and Webpack. The Express server (`outer/server/index.ts`) is the single entry point on port 8080 and reverse-proxies to the inner site and CMS.
- **Inner site** (`inner/`): A React (CRA) app styled as a Windows 95-likWhat e desktop OS. Embedded inside the outer site's 3D monitor screen via iframe at `/inner/`. Uses react-router-dom, framer-motion, and usehooks-ts.
- **CMS** (`inner/cms/`): Payload CMS v3 on Next.js 15, backed by PostgreSQL. Provides REST API at `/api/` and admin panel at `/admin/`. Collections: Events, FAQ, Media, Projects, Sponsors, Team. Globals: Membership, SiteConfig.

**Request flow**: Browser → outer Express (port 80→8080) → proxies `/inner/*` to inner nginx, `/api/*` and `/admin/*` to CMS.

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
docker compose up --build
```
Runs all services: outer (port 80), inner, CMS, and PostgreSQL.

## Key Architectural Details

- The outer site uses a **singleton pattern** for the `Application` class (`outer/src/Application/Application.ts`) which manages the Three.js scene, camera, renderer, and world objects.
- The outer site's 3D world includes: Computer, MonitorScreen (renders the iframe), CoffeeSteam, Cursor, Decor, Environment, and Hitboxes.
- The inner site's UI component (`outer/src/Application/UI/`) is a React app rendered alongside the Three.js canvas for overlay controls.
- The inner site mimics a desktop OS with Window, Desktop, Toolbar, and DesktopShortcut components under `inner/src/components/os/`.
- Content pages (Home, About, Team, Events, Projects, Sponsors, etc.) live in `inner/src/components/showcase/`.
- The `INNER_SITE_URL` env var controls the iframe URL path (defaults to `/inner/` in Docker).

## Environment Variables

See `.env.example`:
- `PAYLOAD_SECRET` — required for CMS (min 32 chars)
- `DATABASE_URL` — PostgreSQL connection string
- `CMS_URL` / `INNER_URL` — set automatically in Docker Compose
