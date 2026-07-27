/**
 * Cookieless, first-party behavioural analytics — the client side.
 *
 * Beacons small events (page views, form starts, conversions) to the CMS
 * `analytics-events` collection, each tagged with the visit's campaign
 * attribution + random `sessionId` (see `attribution.ts`). No cookies, no IP,
 * no personal data.
 *
 * **Consent-gated since the Ad Grants work.** This used to run for everyone
 * under legitimate interest, on the grounds that nothing here is a cookie. That
 * reasoning doesn't survive TDDDG § 25, which covers *any* storage on a
 * visitor's device — including the `sessionStorage` writes in `attribution.ts` —
 * and offers no legitimate-interest route. Now that the site has a consent
 * banner for the Google Ads tag anyway, we gate on the `statistics` purpose
 * instead of arguing the point.
 *
 * Events fired before the visitor answers the banner are **queued**, then
 * flushed on accept or dropped on decline. Without that, every consenting
 * visitor would lose their `landing` event to the race with the CMP.
 *
 * Opt-out: we still honour Do-Not-Track / Global-Privacy-Control as a
 * zero-friction opt-out on top of consent — DNT set means nothing is sent even
 * if the banner was accepted.
 */
import { getAttribution } from './attribution';
import { statisticsConsent, onConsentChange } from './consent';

export type EventType =
  | 'landing'
  | 'pageview'
  | 'cta_click'
  | 'form_start'
  | 'conversion'
  | 'outbound_click'
  // Widget scrolled into view — an impression, not an intent. Kept for funnel
  // shape only; never used as an ad conversion.
  | 'booking_started'
  // A booking actually submitted on cal.com, via the embed's `bookingSuccessful`
  // event. This is the real conversion.
  | 'booking_completed';

const ENDPOINT = '/api/analytics-events';
const LANDED_KEY = 'cfc.landed';

interface TrackOptions {
  path?: string;
  label?: string;
  meta?: Record<string, unknown>;
}

/** Respect Do-Not-Track / Global Privacy Control as a zero-friction opt-out. */
function trackingAllowed(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const nav = navigator as Navigator & {
    globalPrivacyControl?: boolean;
    msDoNotTrack?: string;
  };
  const dnt =
    nav.doNotTrack ??
    (window as unknown as { doNotTrack?: string }).doNotTrack ??
    nav.msDoNotTrack;
  if (dnt === '1' || dnt === 'yes') return false;
  if (nav.globalPrivacyControl === true) return false;
  return true;
}

function send(body: Record<string, unknown>): void {
  try {
    const json = JSON.stringify(body);
    // Prefer sendBeacon: fire-and-forget, survives page unload, non-blocking.
    if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
      const blob = new Blob([json], { type: 'application/json' });
      if (navigator.sendBeacon(ENDPOINT, blob)) return;
    }
    // Fallback for browsers without sendBeacon (or if it refused the payload).
    void fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* analytics must never break the page */
  }
}

/**
 * Events fired before consent resolves. Bounded: a visitor who never answers the
 * banner must not grow this without limit. Twenty is far more than a real visit
 * produces before the banner is answered, so the cap only ever trims noise.
 */
const MAX_QUEUED = 20;
let queue: Record<string, unknown>[] = [];
let flushWired = false;

/** Attach the one-shot consent listener that drains or discards the queue. */
function wireFlush(): void {
  if (flushWired) return;
  flushWired = true;
  onConsentChange((snap) => {
    const pending = queue;
    queue = [];
    if (!snap.statistics) return; // declined — drop, don't send
    // The landing flag couldn't be written pre-consent (it's § 25 storage too).
    // Write it now, so a hard refresh later in this session records a pageview
    // rather than a second landing.
    try {
      sessionStorage.setItem(LANDED_KEY, '1');
    } catch {
      /* non-fatal */
    }
    for (const body of pending) dispatch(body);
  });
}

/**
 * Attach attribution and beacon it. Attribution is resolved *here* rather than
 * when the event was created: `getAttribution()` writes to sessionStorage, which
 * mustn't happen before consent, and a queued event that captured a null
 * attribution pre-consent would otherwise stay unattributed after the visitor
 * accepts — silently losing campaign data for exactly the visitors who said yes.
 */
function dispatch(body: Record<string, unknown>): void {
  const attribution = getAttribution() ?? undefined;
  send(attribution ? { ...body, attribution } : body);
}

/** Record a behavioural event. No-op on the server or when opted out. */
export function trackEvent(type: EventType, opts: TrackOptions = {}): void {
  if (!trackingAllowed()) return;

  const consent = statisticsConsent();
  if (consent === false) return; // declined

  const body: Record<string, unknown> = {
    type,
    path: opts.path ?? window.location.pathname,
    locale: document.documentElement.lang || undefined,
  };
  if (opts.label) body.label = opts.label;
  if (opts.meta) body.meta = opts.meta;

  if (consent === null) {
    // Banner not answered yet — hold it rather than lose it.
    wireFlush();
    if (queue.length < MAX_QUEUED) queue.push(body);
    return;
  }

  dispatch(body);
}

export function trackPageview(path?: string): void {
  trackEvent('pageview', { path });
}

/**
 * Session entry. Fires `landing` once per browser session; a later mount in the
 * same session (e.g. a hard refresh) records a `pageview` instead, so the entry
 * isn't double-counted.
 */
export function trackLanding(): void {
  if (typeof window === 'undefined') return;

  let alreadyLanded = false;
  // Reading *or* writing this flag is § 25 storage, so it waits for consent.
  // While consent is pending we optimistically treat the visit as a landing and
  // let `trackEvent` queue it; `wireFlush` writes the flag if consent arrives.
  if (statisticsConsent() === true) {
    try {
      alreadyLanded = sessionStorage.getItem(LANDED_KEY) === '1';
      sessionStorage.setItem(LANDED_KEY, '1');
    } catch {
      /* sessionStorage unavailable — treat as a fresh landing */
    }
  }

  if (alreadyLanded) {
    trackPageview();
  } else {
    trackEvent('landing');
  }
}

export function trackCtaClick(label: string): void {
  trackEvent('cta_click', { label });
}

export function trackFormStart(label: string): void {
  trackEvent('form_start', { label });
}

export function trackConversion(label: string): void {
  trackEvent('conversion', { label });
}
