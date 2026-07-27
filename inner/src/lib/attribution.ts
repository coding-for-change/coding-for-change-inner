/**
 * First-party campaign attribution — now **persistent across sessions**.
 *
 * On landing we read a traffic-source tag from the URL — our short `?src=` tag
 * (e.g. `?src=poster-tumsom`) or the standard `utm_*` params — plus the
 * referring site's host, and keep it against a long-lived random `visitorId`.
 * It is captured **first-touch**: the campaign that *discovered* someone is what
 * gets credit, even if they leave and come back weeks later on a bare URL. That
 * is the whole point of persisting it — a poster QR scanned in May can now be
 * credited for a membership signup in July.
 *
 * Storage layout:
 *   - `localStorage` `cfc.visitor`     → persistent `visitorId` (+ expiry)
 *   - `localStorage` `cfc.attribution` → first-touch campaign data
 *   - `sessionStorage` `cfc.session`   → per-visit `sessionId`, as before
 *
 * We use `localStorage` rather than a cookie deliberately: nothing here is
 * needed server-side, so a cookie would ship these bytes on every single request
 * (including asset and API calls) and risk ending up in server logs. Legally the
 * two are identical — TDDDG § 25 covers any storage on the device — so the
 * consent requirement is the same either way and we take the cheaper option. If
 * we ever need attribution during SSR, this becomes a cookie.
 *
 * **Consent-gated.** A persistent identifier is a materially bigger intrusion
 * than the old tab-scoped one, and § 25 has no legitimate-interest route, so
 * nothing here reads or writes storage until the visitor accepts the
 * `statistics` purpose. Withdrawal wipes it (`clearAttribution`), which the
 * consent listener in `AttributionTracker` calls.
 *
 * Tracking params are still stripped from the visible URL after capture — that
 * needs no storage and no consent, so it happens regardless.
 */
import { statisticsConsent } from './consent';

export type Channel =
  | 'campaign'
  | 'organic_search'
  | 'social'
  | 'referral'
  | 'direct';

export interface Attribution {
  source?: string;
  channel?: Channel;
  medium?: string;
  campaign?: string;
  content?: string;
  referrer?: string;
  landingPath?: string;
  /** Per-visit. Groups events within one browsing session. */
  sessionId: string;
  /** Persistent. Joins a visitor's sessions together across weeks. */
  visitorId?: string;
  firstSeenAt: string; // ISO 8601
}

// Substring matches against the referrer host. Deliberately loose (a `.`
// keeps e.g. "google." from matching "notgoogle") and covers the platforms
// that actually send us referrers. Untagged Instagram usually sends none.
const SEARCH_HOSTS = [
  'google.',
  'bing.',
  'duckduckgo.',
  'ecosia.',
  'yahoo.',
  'yandex.',
  'baidu.',
  'startpage.',
  'qwant.',
  'search.brave.',
];
const SOCIAL_HOSTS = [
  'instagram.',
  'facebook.',
  'fb.',
  't.co',
  'twitter.',
  'x.com',
  'linkedin.',
  'lnkd.in',
  'youtube.',
  'youtu.be',
  'reddit.',
  'tiktok.',
  't.me',
  'wa.me',
  'whatsapp.',
  'mastodon.',
  'discord.',
];

/** Normalise the traffic source into a channel for reporting. */
function deriveChannel(source: string | undefined, referrerHost: string | undefined): Channel {
  if (source) return 'campaign';
  if (referrerHost) {
    const host = referrerHost.toLowerCase();
    if (SEARCH_HOSTS.some((h) => host.includes(h))) return 'organic_search';
    if (SOCIAL_HOSTS.some((h) => host.includes(h))) return 'social';
    return 'referral';
  }
  return 'direct';
}

const ATTR_KEY = 'cfc.attribution';
const VISITOR_KEY = 'cfc.visitor';
const SESSION_KEY = 'cfc.session';

/**
 * How long a first-touch campaign keeps credit. Matched to the consent cookie's
 * lifetime so there is one expiry to reason about rather than two. `localStorage`
 * has no native TTL, so we store the deadline and enforce it on read.
 */
const RETENTION_DAYS = 182;

interface VisitorRecord {
  visitorId: string;
  expiresAt: number; // epoch ms
}

interface StoredAttribution extends Omit<Attribution, 'sessionId' | 'visitorId'> {
  expiresAt: number;
}

function makeId(): string {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    /* fall through */
  }
  // Fallback for non-secure contexts / very old browsers.
  return (
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).slice(2)
  );
}

function deadline(): number {
  return Date.now() + RETENTION_DAYS * 24 * 60 * 60 * 1000;
}

/** Consent gate. `null` (undecided) is treated as "no" for storage purposes. */
function allowed(): boolean {
  return statisticsConsent() === true;
}

// ---------------------------------------------------------------------------
// Storage primitives. Every one of these is a no-op without consent, so a single
// missed check can't leak a write.
// ---------------------------------------------------------------------------

function readVisitor(): string | undefined {
  if (!allowed()) return undefined;
  try {
    const raw = localStorage.getItem(VISITOR_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as VisitorRecord;
    if (!parsed?.visitorId) return undefined;
    if (parsed.expiresAt && parsed.expiresAt < Date.now()) {
      localStorage.removeItem(VISITOR_KEY);
      return undefined;
    }
    return parsed.visitorId;
  } catch {
    return undefined;
  }
}

/** Get or mint the persistent visitor id, refreshing its sliding expiry. */
function ensureVisitor(): string | undefined {
  if (!allowed()) return undefined;
  const existing = readVisitor();
  const visitorId = existing ?? makeId();
  try {
    const record: VisitorRecord = { visitorId, expiresAt: deadline() };
    localStorage.setItem(VISITOR_KEY, JSON.stringify(record));
  } catch {
    /* storage unavailable (private mode quota) — id still works for this visit */
  }
  return visitorId;
}

/** Per-visit session id. Session-scoped, so this stays in sessionStorage. */
function ensureSession(): string {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
  } catch {
    /* fall through */
  }
  const id = makeId();
  try {
    sessionStorage.setItem(SESSION_KEY, id);
  } catch {
    /* non-fatal */
  }
  return id;
}

function readStored(): StoredAttribution | null {
  if (!allowed()) return null;
  try {
    const raw = localStorage.getItem(ATTR_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredAttribution;
    if (!parsed) return null;
    if (parsed.expiresAt && parsed.expiresAt < Date.now()) {
      localStorage.removeItem(ATTR_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeStored(attr: StoredAttribution): void {
  if (!allowed()) return;
  try {
    localStorage.setItem(ATTR_KEY, JSON.stringify(attr));
  } catch {
    /* storage unavailable — non-fatal, attribution is best-effort */
  }
}

/**
 * Wipe every persistent trace. Called when `statistics` consent is withdrawn:
 * Klaro clears the cookies it declares, but it has no idea about our
 * `localStorage` keys, so withdrawal would otherwise leave the identifier behind.
 */
export function clearAttribution(): void {
  try {
    localStorage.removeItem(ATTR_KEY);
    localStorage.removeItem(VISITOR_KEY);
  } catch {
    /* nothing we can do */
  }
  try {
    sessionStorage.removeItem(SESSION_KEY);
    // Legacy key from the pre-consent, sessionStorage-only implementation.
    sessionStorage.removeItem('cfc.attribution');
    sessionStorage.removeItem('cfc.landed');
  } catch {
    /* nothing we can do */
  }
}

/** Referrer host, but only when it's an external site (not our own domain). */
function externalReferrerHost(): string | undefined {
  try {
    if (!document.referrer) return undefined;
    const ref = new URL(document.referrer);
    if (ref.host === window.location.host) return undefined;
    return ref.host || undefined;
  } catch {
    return undefined;
  }
}

// Params we read for attribution and then remove from the visible URL.
const TRACKING_PARAMS = [
  'src',
  'ref',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const;

/**
 * Remove the tracking params from the address bar without a navigation. Needs no
 * storage, so it runs regardless of consent — it's privacy-positive either way
 * (params don't get shared or bookmarked).
 */
function stripTrackingParams(): void {
  try {
    const url = new URL(window.location.href);
    let changed = false;
    for (const p of TRACKING_PARAMS) {
      if (url.searchParams.has(p)) {
        url.searchParams.delete(p);
        changed = true;
      }
    }
    if (changed) {
      const qs = url.searchParams.toString();
      const clean = url.pathname + (qs ? `?${qs}` : '') + url.hash;
      window.history.replaceState(window.history.state, '', clean);
    }
  } catch {
    /* non-fatal */
  }
}

interface LandingSnapshot {
  params: URLSearchParams;
  referrer?: string;
  path: string;
}

/**
 * The landing URL's tracking params, remembered in memory.
 *
 * Essential to the consent flow: `captureAttribution` runs once on mount (before
 * the visitor has answered the banner) and strips the params from the address
 * bar, then runs again if consent is granted. Re-reading `window.location` on
 * that second pass would find the params already gone and silently attribute the
 * visit to "direct" — losing the campaign for precisely the visitors who agreed
 * to be measured. So we snapshot the query string on the first call and every
 * later call reads the snapshot.
 *
 * In-memory only: it lives for one page load, so it is not device storage and
 * needs no consent.
 */
let landing: LandingSnapshot | null = null;

function landingSnapshot(): LandingSnapshot {
  if (!landing) {
    landing = {
      params: new URLSearchParams(window.location.search),
      referrer: externalReferrerHost(),
      path: window.location.pathname || '/',
    };
  }
  return landing;
}

/**
 * Capture attribution for this visit (idempotent, first-touch). Safe to call on
 * every mount. Without `statistics` consent it strips the URL params and returns
 * null without touching storage. No-op on the server.
 */
export function captureAttribution(): Attribution | null {
  if (typeof window === 'undefined') return null;

  const { params, referrer, path } = landingSnapshot();
  const source =
    params.get('src') || params.get('utm_source') || params.get('ref') || undefined;

  if (!allowed()) {
    stripTrackingParams();
    return null;
  }

  const existing = readStored();
  const sessionId = ensureSession();
  const visitorId = ensureVisitor();

  if (existing) {
    // First-touch wins — but only among *real* sources. If the visitor was first
    // seen source-less (direct / organic / referral) and an explicit campaign tag
    // arrives later — a later session included — upgrade to it. A campaign is
    // never overwritten by another campaign (first campaign keeps credit).
    if (source && !existing.source) {
      const upgraded: StoredAttribution = {
        ...existing,
        source,
        channel: deriveChannel(source, existing.referrer),
        medium: params.get('utm_medium') || existing.medium,
        campaign: params.get('utm_campaign') || existing.campaign,
        content: params.get('utm_content') || existing.content,
        expiresAt: deadline(),
      };
      writeStored(upgraded);
      stripTrackingParams();
      return { ...upgraded, sessionId, visitorId };
    }
    // Refresh the sliding window so an active visitor doesn't age out.
    writeStored({ ...existing, expiresAt: deadline() });
    stripTrackingParams();
    return { ...existing, sessionId, visitorId };
  }

  const stored: StoredAttribution = {
    source: source || undefined,
    channel: deriveChannel(source || undefined, referrer),
    medium: params.get('utm_medium') || undefined,
    campaign: params.get('utm_campaign') || undefined,
    content: params.get('utm_content') || undefined,
    referrer,
    landingPath: path,
    firstSeenAt: new Date().toISOString(),
    expiresAt: deadline(),
  };

  writeStored(stored);
  stripTrackingParams();
  return { ...stored, sessionId, visitorId };
}

/**
 * Current attribution, for attaching to a conversion. Captures lazily if a form
 * is submitted before the tracker effect ran. Returns null on the server and
 * whenever `statistics` consent is absent.
 */
export function getAttribution(): Attribution | null {
  if (typeof window === 'undefined') return null;
  if (!allowed()) return null;
  const existing = readStored();
  if (!existing) return captureAttribution();
  return {
    ...existing,
    sessionId: ensureSession(),
    visitorId: readVisitor(),
  };
}
