# Coding for Change — Website

Multi-service website: a 3D Three.js outer scene (outer), a Windows 95-style React desktop (inner), and a Payload CMS (inner/cms) backed by PostgreSQL.

## Local development

### Prerequisites

- Docker Desktop running
- `.env` file in the repo root (copy from `.env.example` and set `PAYLOAD_SECRET` to any 32+ character string)

### Start the dev stack

```bash
docker compose -f docker-compose.dev.yml up -d
```

Wait ~30 seconds for the CMS to boot, then open:

| URL | What it is |
|-----|------------|
| `http://localhost` | Full site — 3D scene + inner desktop proxied together |
| `http://localhost:3001` | Inner React app direct (CRA with hot reload) |
| `http://localhost:3000/admin` | CMS admin panel direct (Next.js with hot reload) |
| `http://localhost/admin` | CMS admin panel proxied through outer |

Hot reload behaviour:
- **Inner site** (React/CRA): edits show instantly via HMR at `localhost:3001`
- **CMS** (Next.js): edits show instantly via HMR at `localhost:3000`
- **Outer site** (Three.js/webpack): webpack watch rebuilds on save — needs a manual browser refresh

### Seed sample content (first run)

After starting the stack for the first time, populate the CMS with sample data in both English and German:

```bash
docker compose -f docker-compose.dev.yml exec cms pnpm seed
```

Admin credentials after seeding: `admin@codingforchange.com` / `ChangeMe!1234`

### Stop

```bash
docker compose -f docker-compose.dev.yml down
```

---

## Schema changes (adding/removing fields)

Payload uses `push: true` in development, which automatically applies schema changes to the database on startup. **If you change field definitions** (add a field, remove one, or toggle `localized`) and the database already has data, Payload will detect destructive changes and hang silently inside Docker — the CMS will appear to start but return 404 on every request.

**Fix: wipe the volume and reseed.**

```bash
docker compose -f docker-compose.dev.yml down -v   # removes the postgres volume
docker compose -f docker-compose.dev.yml up -d
# wait ~30s, then:
docker compose -f docker-compose.dev.yml exec cms pnpm seed
```

`down -v` deletes all data. Only do this in local dev — never against a shared or production database.

---

## Localisation (EN / DE)

The site supports English and German. Language is switched via the 🇬🇧 / 🇩🇪 flags in the bottom-right taskbar of the desktop UI.

- **Static UI strings** live in `inner/src/i18n/translations.ts`
- **CMS content** (events, projects, team bios, FAQ, etc.) is stored per-locale in Payload. To add a German translation for a content item, open the CMS admin, select the item, switch the locale switcher in the top-right to **Deutsch**, and fill in the fields.
- The seed script populates both locales automatically.

---

## Production

The production stack uses pre-built images pushed to a local registry:

```bash
docker compose -f docker-compose.prod.yml up -d
```

### Migrations (production)

Production does **not** use `push: true`. Schema changes must be captured as migration files before deploying:

```bash
# 1. With the dev stack running, generate a migration file:
docker compose -f docker-compose.dev.yml exec cms pnpm migrate:create

# 2. Commit the generated file from inner/cms/src/migrations/

# 3. On next prod deploy, the container runs `payload migrate` automatically before starting.
```

---

## Architecture

```
Browser → outer Express (port 80)
            ├── /admin, /api, /_next, /media  → Payload CMS (port 3000)
            ├── /3d                           → Three.js static bundle
            └── /                            → Inner React app (port 3000/nginx)
```

| Service | Stack | Dev port |
|---------|-------|----------|
| outer | Three.js + Express + webpack | 80 |
| inner | React (CRA) | 3001 |
| cms | Payload CMS v3 + Next.js 15 | 3000 |
| postgres | PostgreSQL 16 | 5432 |

### CMS collections

`Team`, `Projects`, `Events`, `FAQ`, `Sponsors`, `Media`

### CMS globals

`SiteConfig` (club name, tagline, social links), `Membership` (title, benefits, requirements)
