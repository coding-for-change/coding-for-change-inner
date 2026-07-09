/**
 * Cookieless, first-party behavioural analytics — the client side.
 *
 * Beacons small events (page views, form starts, conversions) to the CMS
 * `analytics-events` collection, each tagged with the visit's campaign
 * attribution + random `sessionId` (see `attribution.ts`). No cookies, no IP,
 * no personal data.
 *
 * Opt-out: we honour the browser's Do-Not-Track / Global-Privacy-Control
 * signals — when either is set, nothing is sent. (This gates *analytics* only;
 * a form the visitor chooses to submit still carries its own attribution.)
 */
import { getAttribution } from './attribution';

export type EventType =
  | 'landing'
  | 'pageview'
  | 'cta_click'
  | 'form_start'
  | 'conversion'
  | 'outbound_click'
  | 'booking_started';

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
 * Session entry. Fires `landing` once per browser session; a later mount in the
 * same session (e.g. a hard refresh) records a `pageview` instead, so the entry
 * isn't double-counted.
 */
export function trackLanding(): void {
  if (typeof window === 'undefined') return;
  let alreadyLanded = false;
  try {
    alreadyLanded = sessionStorage.getItem(LANDED_KEY) === '1';
    sessionStorage.setItem(LANDED_KEY, '1');
  } catch {
    /* sessionStorage unavailable — treat as a fresh landing */
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
