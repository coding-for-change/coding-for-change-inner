/**
 * First-party campaign attribution — **in-memory, no device storage at all.**
 *
 * On landing we read a traffic-source tag from the URL — our short `?src=` tag
 * (e.g. `?src=poster-tumsom`) or the standard `utm_*` params — plus the
 * referring site's host, and hold it in a module-level variable together with a
 * random `sessionId`. Scope is **one tab, one page context**: it survives
 * client-side navigation (poster QR → homepage → `/join`, which is the flow that
 * matters), and it is gone on a hard refresh, in a new tab, and when the tab
 * closes. Nothing is written to `localStorage`, `sessionStorage` or a cookie.
 *
 * ## Why it works this way
 *
 * This subsystem previously used `localStorage` + `sessionStorage`, which is
 * storage on the visitor's device and therefore consent-only under TDDDG § 25 —
 * no legitimate-interest route exists for that. Once the consent banner shipped,
 * measurement collapsed: of ~35 landings a day, **three** people ever answered
 * the banner. The banner deliberately isn't a cookie wall, so the vast majority
 * simply browse without deciding, and a consent-gated subsystem sees nothing.
 *
 * § 25 is triggered by *storing on / reading from the device*, not by
 * "measurement" in the abstract. A variable living in the page's own JavaScript
 * context is not persisted anywhere — no more than the DOM is — so § 25 is not
 * engaged and the ordinary GDPR basis applies: Art. 6(1)(f), counting how our
 * own campaigns perform, with no identifier that outlives the tab.
 *
 * Honest caveat: EDPB Guidelines 02/2023 on the technical scope of Art. 5(3)
 * ePrivacy read "storage" broadly enough that a maximalist application could
 * reach RAM. The mainstream position — and what privacy-first analytics rely on
 * — is that ephemeral page memory isn't caught. If that position is ever
 * rejected, the zero-ambiguity fallback is to keep the tag in the URL and read
 * it at submit time; that is a contained change to this file.
 *
 * ## What was given up deliberately
 *
 * No cross-session or cross-tab attribution. A poster scanned in May cannot be
 * credited for a signup in July any more, and repeat visits are separate
 * sessions. That capability needed a persistent identifier, which needed
 * consent, which almost nobody gives — so it was costing complexity and legal
 * surface while delivering nearly no data.
 *
 * Tracking params are still stripped from the visible URL after capture: it
 * needs no storage, and keeps them from being shared or bookmarked.
 */

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
  /** Random, per page context. Groups this tab's events; never persisted. */
  sessionId: string;
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
 * The whole of our state, for the lifetime of this page context. Module scope in
 * a client bundle means one instance per tab, shared across client-side route
 * changes — which is exactly the tab-scoped behaviour we want.
 */
let current: Attribution | null = null;

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
 * Capture attribution for this page context. Idempotent: the first call wins, so
 * a later client-side navigation can't overwrite the campaign that brought the
 * visitor here. No-op on the server.
 */
export function captureAttribution(): Attribution | null {
  if (typeof window === 'undefined') return null;
  if (current) {
    // Already captured this page context. Still strip, in case a later
    // navigation put tracking params back in the address bar.
    stripTrackingParams();
    return current;
  }

  const params = new URLSearchParams(window.location.search);
  const source =
    params.get('src') || params.get('utm_source') || params.get('ref') || undefined;
  const referrer = externalReferrerHost();

  current = {
    source: source || undefined,
    channel: deriveChannel(source || undefined, referrer),
    medium: params.get('utm_medium') || undefined,
    campaign: params.get('utm_campaign') || undefined,
    content: params.get('utm_content') || undefined,
    referrer,
    landingPath: window.location.pathname || '/',
    sessionId: makeId(),
    firstSeenAt: new Date().toISOString(),
  };

  stripTrackingParams();
  return current;
}

/**
 * Current attribution, for attaching to a conversion. Captures lazily if a form
 * is submitted before the tracker effect ran. Returns null only on the server.
 */
export function getAttribution(): Attribution | null {
  if (typeof window === 'undefined') return null;
  return current ?? captureAttribution();
}

/**
 * Forget everything for this page context.
 *
 * Nothing is persisted, so this is only needed for the DNT/GPC path and for
 * tests — there is no stored state for a consent withdrawal to clear any more.
 */
export function clearAttribution(): void {
  current = null;
}
