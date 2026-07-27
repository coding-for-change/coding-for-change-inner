/**
 * Cookie-consent state — the app-facing read side.
 *
 * We need a consent gate because the Google Ads conversion tag (required by the
 * Google Ad Grants programme) writes `_gcl_*` cookies, and GA4 writes `_ga*`.
 * Under TDDDG § 25 that is consent-or-nothing: legitimate interest is not
 * available for device storage that isn't strictly necessary. Our own
 * first-party analytics rides on the same gate — it writes to `sessionStorage`,
 * which is also § 25 storage, so now that a banner exists we use it rather than
 * arguing the point.
 *
 * Two categories matter to us:
 *   - `statistics` → our first-party analytics + campaign attribution, GA4
 *   - `marketing`  → Google Ads conversion tracking
 *
 * Resolution is **asynchronous**: the state is unknown until Klaro has read its
 * stored consent cookie (returning visitor) or the visitor has answered the
 * banner. Until then `consentFor()` returns `null` and callers must queue —
 * otherwise every consenting visitor loses the `landing` event to a race with
 * the CMP.
 *
 * This module is intentionally CMP-agnostic: `ConsentManager.tsx` owns the Klaro
 * wiring and pushes state in here via `setConsent()`. Swapping CMP means
 * rewriting that one component, not the twenty call sites that read this.
 */

export type ConsentCategory = 'statistics' | 'marketing';

export interface ConsentSnapshot {
    statistics: boolean;
    marketing: boolean;
}

/** `null` until the CMP has resolved (stored cookie or banner answer). */
let snapshot: ConsentSnapshot | null = null;

type Listener = (snap: ConsentSnapshot) => void;
const listeners = new Set<Listener>();

/**
 * Publish a resolved consent state. Called by `ConsentManager` on Klaro's init
 * and on every subsequent change (including withdrawal via the footer link, so
 * a visitor who grants consent mid-visit starts being counted without a reload).
 */
export function setConsent(next: ConsentSnapshot): void {
    const changed =
        snapshot === null ||
        snapshot.statistics !== next.statistics ||
        snapshot.marketing !== next.marketing;
    snapshot = next;
    if (!changed) return;
    for (const fn of Array.from(listeners)) {
        try {
            fn(next);
        } catch {
            /* one bad listener must not stop the others */
        }
    }
}

/** Synchronous snapshot. `null` = not resolved yet, so callers should queue. */
export function consentFor(category: ConsentCategory): boolean | null {
    if (snapshot === null) return null;
    return snapshot[category];
}

export const statisticsConsent = (): boolean | null => consentFor('statistics');
export const marketingConsent = (): boolean | null => consentFor('marketing');

/** Has the CMP resolved at all yet? */
export function consentResolved(): boolean {
    return snapshot !== null;
}

/**
 * Subscribe to consent changes. Fires immediately if the state is already
 * resolved, so callers don't need a separate "already decided" path.
 * Returns an unsubscribe function.
 */
export function onConsentChange(fn: Listener): () => void {
    listeners.add(fn);
    if (snapshot !== null) {
        try {
            fn(snapshot);
        } catch {
            /* non-fatal */
        }
    }
    return () => {
        listeners.delete(fn);
    };
}

/**
 * Reopen the consent dialog. GDPR Art. 7(3): withdrawing consent must be as
 * easy as giving it — that's what the footer "Cookie settings" link is for.
 * Set by `ConsentManager` once Klaro is loaded.
 */
let showDialog: (() => void) | null = null;
const uiListeners = new Set<() => void>();

export function registerDialogOpener(fn: (() => void) | null): void {
    showDialog = fn;
    // Distinct from `onConsentChange`: the CMP becoming *available* is not a
    // consent decision, and it usually happens with no decision to report at all
    // (a first-time visitor staring at the banner). The footer's "Cookie
    // settings" link needs this signal, since a consent event may never come.
    for (const l of Array.from(uiListeners)) {
        try {
            l();
        } catch {
            /* non-fatal */
        }
    }
}

/**
 * Subscribe to the CMP becoming available or going away. Fires immediately with
 * the current state. Returns an unsubscribe function.
 */
export function onConsentUiChange(fn: () => void): () => void {
    uiListeners.add(fn);
    try {
        fn();
    } catch {
        /* non-fatal */
    }
    return () => {
        uiListeners.delete(fn);
    };
}

export function openConsentSettings(): void {
    try {
        showDialog?.();
    } catch {
        /* non-fatal */
    }
}

/** Whether to render the "Cookie settings" affordance at all. */
export function consentUiAvailable(): boolean {
    return showDialog !== null;
}
