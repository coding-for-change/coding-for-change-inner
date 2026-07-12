/**
 * One-off backfill for the sponsor-tiers migration. After deploying (the
 * migration adds the `sponsor-tiers` collection + a `tierRef` relationship on
 * sponsors), run this to:
 *   1. create the five default tier records if none exist, and
 *   2. point each sponsor's `tierRef` at the tier matching its old fixed `tier`.
 *
 * Idempotent: skips tiers that already exist and sponsors already assigned.
 * Run it against the target CMS, e.g.:
 *   docker compose exec cms node scripts/backfill-sponsor-tiers.mjs
 */
const BASE = (process.env.SEED_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@codingforchange.com';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe!1234';

const TIER_DEFS = [
  { value: 'platinum', label: 'Platinum', labelDe: 'Platin', order: 10 },
  { value: 'gold', label: 'Gold', labelDe: 'Gold', order: 20 },
  { value: 'silver', label: 'Silver', labelDe: 'Silber', order: 30 },
  { value: 'bronze', label: 'Bronze', labelDe: 'Bronze', order: 40 },
  { value: 'partner', label: 'Partners', labelDe: 'Partner', order: 50 },
];

const req = async (method, path, body, cookie) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'content-type': 'application/json', ...(cookie ? { cookie } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res;
};

const login = async () => {
  const res = await req('POST', '/api/users/login', { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  if (!res.ok) throw new Error(`login failed ${res.status}`);
  const cookie = (res.headers.getSetCookie?.() || [])
    .find((c) => c.startsWith('payload-token='))?.split(';')[0];
  if (!cookie) throw new Error('no auth cookie');
  return cookie;
};

const run = async () => {
  const cookie = await login();

  // 1) Ensure tier records exist; build value -> id (match by label).
  const existing = await (await req('GET', '/api/sponsor-tiers?limit=100&locale=en', null, cookie)).json();
  const idByLabel = new Map((existing.docs || []).map((d) => [d.label, d.id]));
  const idByValue = {};
  for (const td of TIER_DEFS) {
    let id = idByLabel.get(td.label);
    if (!id) {
      const res = await req('POST', '/api/sponsor-tiers', { label: td.label, order: td.order }, cookie);
      if (!res.ok) throw new Error(`create tier ${td.value}: ${res.status} ${await res.text()}`);
      id = (await res.json())?.doc?.id;
      await req('PATCH', `/api/sponsor-tiers/${id}?locale=de`, { label: td.labelDe }, cookie);
      console.log(`created tier ${td.label} (#${id})`);
    }
    idByValue[td.value] = id;
  }

  // 2) Assign tierRef on sponsors that have a fixed tier but no relationship.
  const sponsors = await (await req('GET', '/api/sponsors?limit=200&depth=0', null, cookie)).json();
  let updated = 0;
  for (const s of sponsors.docs || []) {
    if (s.tierRef) continue;
    const id = idByValue[s.tier];
    if (!id) continue;
    const res = await req('PATCH', `/api/sponsors/${s.id}`, { tierRef: id }, cookie);
    if (res.ok) updated++;
  }
  console.log(`assigned tierRef on ${updated} sponsor(s). Done.`);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
