/**
 * Consent records — GDPR Art. 7(1) accountability.
 *
 * A self-hosted CMP means nobody else keeps our proof of consent, so we keep it
 * ourselves. This also matters for Google's periodic EU User Consent Policy
 * audit (support.google.com/google-ads/answer/16724512), where failing can
 * suspend conversion measurement and take the Ad Grant with it.
 *
 * What we store is deliberately thin: a random consent ID, which purposes were
 * accepted, the banner config version the choice was made against, the locale
 * (so we can show which language the text was read in) and the path. **No IP,
 * no user agent, no fingerprint** — consistent with the rest of our analytics.
 *
 * The random ID is mirrored into a first-party `cfc_consent_id` cookie so a
 * visitor's stored consent can actually be matched to its record — a record that
 * can't be tied to anything proves nothing. That cookie is strictly necessary
 * for this legal-obligation purpose and therefore needs no consent of its own
 * under TDDDG § 25; it carries no other function and is never used for tracking.
 */
import { CONSENT_CONFIG_VERSION } from './klaroConfig';

const ENDPOINT = '/api/consent-records';
const ID_COOKIE = 'cfc_consent_id';
const ID_MAX_AGE_DAYS = 182; // matches the consent cookie's lifetime

function readIdCookie(): string | null {
    try {
        const match = document.cookie.match(
            new RegExp(`(?:^|;\\s*)${ID_COOKIE}=([^;]*)`)
        );
        return match ? decodeURIComponent(match[1]) : null;
    } catch {
        return null;
    }
}

function makeId(): string {
    try {
        if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
            return crypto.randomUUID();
        }
    } catch {
        /* fall through */
    }
    return (
        Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
    );
}

/** Stable per-visitor consent ID, created on first recorded decision. */
function ensureId(): string {
    const existing = readIdCookie();
    if (existing) return existing;
    const id = makeId();
    try {
        const maxAge = ID_MAX_AGE_DAYS * 24 * 60 * 60;
        const secure = window.location.protocol === 'https:' ? '; Secure' : '';
        document.cookie =
            `${ID_COOKIE}=${encodeURIComponent(id)}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
    } catch {
        /* non-fatal — we still send the record, just unlinked */
    }
    return id;
}

/**
 * File a record of an *interactive* consent decision. Called only when the
 * visitor actually clicks (Klaro's `saveConsents`), not on the silent
 * re-application of a stored choice — otherwise every page load would append a
 * duplicate and the log would be useless as evidence.
 */
export function recordConsent(snapshot: {
    statistics: boolean;
    marketing: boolean;
}): void {
    if (typeof window === 'undefined') return;

    const body = JSON.stringify({
        consentId: ensureId(),
        statistics: snapshot.statistics,
        marketing: snapshot.marketing,
        configVersion: CONSENT_CONFIG_VERSION,
        locale: document.documentElement.lang || undefined,
        path: window.location.pathname,
    });

    try {
        if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
            const blob = new Blob([body], { type: 'application/json' });
            if (navigator.sendBeacon(ENDPOINT, blob)) return;
        }
        void fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
            keepalive: true,
        }).catch(() => {});
    } catch {
        /* recording must never break the banner */
    }
}
