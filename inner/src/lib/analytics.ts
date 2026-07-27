/**
 * First-party behavioural analytics — the client side.
 *
 * Beacons small events (page views, form starts, conversions) to the CMS
 * `analytics-events` collection, each tagged with the visit's campaign
 * attribution + random `sessionId` (see `attribution.ts`). No cookies, no device
 * storage of any kind, no IP, no personal data.
 *
 * ## Not consent-gated, and why that's the right call
 *
 * It briefly was. When the consent banner shipped for the Google Ads tag, this
 * subsystem was put behind the same `statistics` switch — and measurement went to
 * zero. Of roughly 35 landings a day, **three** visitors ever answered the
 * banner at all. The banner isn't a cookie wall (deliberately — those are legally
 * dubious in Germany), so most people simply browse without deciding, and a
 * gated subsystem records nothing for them.
 *
 * The gate was over-broad. TDDDG § 25 is triggered by *storing on or reading
 * from the device*, not by measurement as such. Now that `attribution.ts` keeps
 * its state in page memory rather than `sessionStorage`, there is no § 25 event
 * to consent to, and the ordinary GDPR basis applies — Art. 6(1)(f), counting
 * how our own campaigns and pages perform, with no identifier outliving the tab.
 *
 * Google Ads and GA4 remain fully consent-gated: they set real cookies, so § 25
 * applies to them and nothing about this changes that.
 *
 * ## Opt-out
 *
 * We honour Do-Not-Track and Global-Privacy-Control. That matters more now than
 * it did before: under legitimate interest the visitor has an Art. 21 right to
 * object, and respecting those signals is how that right is delivered without
 * making everyone click something.
 */
import { getAttribution } from './attribution';

export type EventType =
  | 'landing'
  | 'pageview'
  | 'cta_click'
  | 'form_start'
  | 'conversion'
  | 'outbound_click'
  // Widget scrolled into view — an impression, not intent. Kept for funnel
  // shape only; never used as an ad conversion.
  | 'booking_started'
  // A booking actually submitted on cal.com, via the embed's `bookingSuccessful`
  // event. This is the real conversion.
  | 'booking_completed';

const ENDPOINT = '/api/analytics-events';

interface TrackOptions {
  path?: string;
  label?: string;
  meta?: Record<string, unknown>;
}

/**
 * Respect Do-Not-Track / Global Privacy Control as a zero-friction opt-out, and
 * as the practical form of the Art. 21 right to object.
 */
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

/** Record a behavioural event. No-op on the server or when opted out. */
export function trackEvent(type: EventType, opts: TrackOptions = {}): void {
  if (!trackingAllowed()) return;

  const attribution = getAttribution() ?? undefined;
  const body: Record<string, unknown> = {
    type,
    path: opts.path ?? window.location.pathname,
    locale: document.documentElement.lang || undefined,
  };
  if (opts.label) body.label = opts.label;
  if (attribution) body.attribution = attribution;
  if (opts.meta) body.meta = opts.meta;

  send(body);
}

export function trackPageview(path?: string): void {
  trackEvent('pageview', { path });
}

/**
 * Session entry. Fires `landing` once per page context; a later call in the same
 * context records a `pageview` instead, so the entry isn't double-counted.
 *
 * The flag is a module variable rather than a `sessionStorage` key — same reason
 * as the rest of this subsystem. One consequence: a hard refresh starts a new
 * page context and therefore counts as a new landing, where the old
 * `sessionStorage` version would have called it a pageview. Landing counts are
 * marginally inflated by refreshes; that is the price of touching no storage,
 * and it is uniform across campaigns so comparisons stay valid.
 */
let landedThisContext = false;

export function trackLanding(): void {
  if (typeof window === 'undefined') return;
  if (landedThisContext) {
    trackPageview();
    return;
  }
  landedThisContext = true;
  trackEvent('landing');
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
