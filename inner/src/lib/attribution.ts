/**
 * Cookieless, first-party campaign attribution.
 *
 * On landing we read a traffic-source tag from the URL — our short `?src=` tag
 * (e.g. `?src=poster-tumsom`) or the standard `utm_*` params — plus the
 * referring site's host, and stash it in `sessionStorage` together with a
 * random per-visit `sessionId`. It is captured first-touch (the source that
 * *brought* the visitor is kept; later navigations don't overwrite it) and
 * carried through the visit so it can be attached to a conversion (waitlist
 * signup / form submission).
 *
 * No cookies, no persistent identifier, no IP, no fingerprinting: everything
 * lives in `sessionStorage` and is gone when the tab closes. This is what lets
 * us attribute campaigns without a cookie banner, under legitimate interest.
 * The tracking params are stripped from the visible URL after capture so they
 * aren't shared or bookmarked.
 */

export interface Attribution {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  referrer?: string;
  landingPath?: string;
  sessionId: string;
  firstSeenAt: string; // ISO 8601
}

const STORAGE_KEY = 'cfc.attribution';

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

function makeSessionId(): string {
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

function readStored(): Attribution | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Attribution;
    return parsed?.sessionId ? parsed : null;
  } catch {
    return null;
  }
}

function writeStored(attr: Attribution): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attr));
  } catch {
    /* sessionStorage unavailable (private mode quota, etc.) — non-fatal */
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

/** Remove the tracking params from the address bar without a navigation. */
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

/**
 * Capture attribution for this visit (idempotent, first-touch). Safe to call on
 * every mount: it only records the source the first time in a session, always
 * ensures a `sessionId` exists, and always strips tracking params from the URL.
 * No-op on the server.
 */
export function captureAttribution(): Attribution | null {
  if (typeof window === 'undefined') return null;

  const existing = readStored();
  const params = new URLSearchParams(window.location.search);

  if (existing) {
    // First-touch already recorded this session — keep it, just tidy the URL.
    stripTrackingParams();
    return existing;
  }

  const source =
    params.get('src') || params.get('utm_source') || params.get('ref') || undefined;

  const attr: Attribution = {
    source: source || undefined,
    medium: params.get('utm_medium') || undefined,
    campaign: params.get('utm_campaign') || undefined,
    content: params.get('utm_content') || undefined,
    referrer: externalReferrerHost(),
    landingPath: window.location.pathname || '/',
    sessionId: makeSessionId(),
    firstSeenAt: new Date().toISOString(),
  };

  writeStored(attr);
  stripTrackingParams();
  return attr;
}

/**
 * Current attribution for this visit, for attaching to a conversion. Ensures a
 * session exists (captures lazily if a form is submitted before the tracker
 * effect ran). Returns null only on the server.
 */
export function getAttribution(): Attribution | null {
  if (typeof window === 'undefined') return null;
  return readStored() ?? captureAttribution();
}
