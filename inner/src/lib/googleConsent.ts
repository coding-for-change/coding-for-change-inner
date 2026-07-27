/**
 * Google Consent Mode v2 signals.
 *
 * Google requires advertisers serving EEA traffic to pass consent signals — via
 * a certified CMP *or* their own banner (support.google.com/google-ads/answer/13695607).
 * We do the latter, so these `gtag('consent', 'update', …)` calls are the whole
 * of that obligation, and audit criterion 6 depends on them firing correctly.
 *
 * The *defaults* (everything denied) are set by an inline script in
 * `layout.tsx`, which must run before `gtag.js` loads. That ordering is what
 * makes this Advanced Consent Mode: the Google tag loads immediately but sets no
 * cookies, sending cookieless pings until — and unless — consent arrives.
 *
 * v2 added `ad_user_data` and `ad_personalization` on top of v1's `ad_storage`
 * and `analytics_storage`. All four must be sent or Google treats the setup as
 * incomplete.
 */

type ConsentValue = 'granted' | 'denied';

interface ConsentUpdate {
    ad_storage: ConsentValue;
    ad_user_data: ConsentValue;
    ad_personalization: ConsentValue;
    analytics_storage: ConsentValue;
}

declare global {
    interface Window {
        dataLayer?: unknown[];
        gtag?: (...args: unknown[]) => void;
    }
}

const yn = (granted: boolean): ConsentValue => (granted ? 'granted' : 'denied');

/**
 * Push the visitor's choice to Google. Safe to call before `gtag.js` has
 * finished loading: the inline shim in `layout.tsx` defines `gtag` as a
 * `dataLayer.push` wrapper immediately, so calls queue rather than vanish.
 */
export function updateGoogleConsent(snapshot: {
    statistics: boolean;
    marketing: boolean;
}): void {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

    const update: ConsentUpdate = {
        // Ads conversion measurement and personalisation.
        ad_storage: yn(snapshot.marketing),
        ad_user_data: yn(snapshot.marketing),
        ad_personalization: yn(snapshot.marketing),
        // GA4.
        analytics_storage: yn(snapshot.statistics),
    };

    try {
        window.gtag('consent', 'update', update);
    } catch {
        /* never break the page over a consent ping */
    }
}
