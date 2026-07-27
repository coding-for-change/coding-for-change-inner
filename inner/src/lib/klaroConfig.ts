/**
 * Klaro CMP configuration — the consent banner's single source of truth.
 *
 * Deliberately built against the eight things Google checks in an EU User
 * Consent Policy audit (support.google.com/google-ads/answer/16724512), because
 * failing one can suspend conversion measurement and take the Ad Grant with it:
 *
 *   1. visible banner requiring affirmative action  → `mustConsent: false` + notice
 *   2. ads personalisation disclosed BY NAME        → `googleAdsDescription` below
 *   3. accept AND reject both genuinely work        → `hideDeclineAll: false`
 *   4. third-party data sharing disclosed           → Google named in both services
 *   5. link to Google's Business Data Responsibility site → `GOOGLE_BDR_URL`
 *   6. Consent Mode v2 signals                      → wired in `ConsentManager.tsx`
 *   7. no cookies before consent                    → `default: false`, denied defaults
 *   8. CMP configured correctly                     → this file, reviewed in git
 *
 * Services are grouped by *purpose*, not vendor: consent is a purpose-level
 * decision under GDPR, and our own first-party measurement serves the same
 * purpose as GA4, so they share one toggle with both disclosed in the text.
 *
 * Bumping `CONSENT_CONFIG_VERSION` invalidates stored consent and re-asks
 * everyone. Do that whenever a service is added or a purpose materially
 * changes — it is also the value recorded against each consent record, so an
 * audit can tell which banner text a given consent was given against.
 */
import type { Locale } from '@/i18n/translations';

/** Audit criterion 5 — must be reachable from the banner. */
export const GOOGLE_BDR_URL = 'https://business.safety.google/privacy/';

/** Bump on any material change to services or purposes. See note above. */
export const CONSENT_CONFIG_VERSION = 1;

export const SERVICE_ANALYTICS = 'analytics';
export const SERVICE_GOOGLE_ADS = 'google-ads';

/**
 * Klaro accepts a cookie as a name, a pattern, or a `[pattern, path, domain]`
 * tuple. It uses these only to *delete* cookies when consent is withdrawn, so
 * patterns are enough — no need to pin path/domain.
 */
export type KlaroCookie = string | RegExp | [RegExp, string, string];

export interface KlaroService {
    name: string;
    title: string;
    description?: string;
    purposes: string[];
    cookies?: KlaroCookie[];
    required?: boolean;
    default?: boolean;
    optOut?: boolean;
    onlyOnce?: boolean;
}

export interface KlaroConfig {
    version: number;
    elementID: string;
    storageMethod: 'cookie' | 'localStorage';
    cookieName: string;
    cookieExpiresAfterDays: number;
    privacyPolicy: string;
    default: boolean;
    mustConsent: boolean;
    acceptAll: boolean;
    hideDeclineAll: boolean;
    hideLearnMore: boolean;
    noticeAsModal: boolean;
    htmlTexts: boolean;
    groupByPurpose: boolean;
    lang: string;
    testing: boolean;
    services: KlaroService[];
    translations: Record<string, unknown>;
}

const EN = {
    privacyPolicyUrl: '/privacy',
    consentNotice: {
        // Kept deliberately short: this is a banner, not the privacy policy. The
        // per-service detail lives in the modal behind "Choose individually".
        // The Google link is here rather than only in the modal so it is visible
        // without a click — audit criterion 5.
        title: 'Cookies',
        description:
            'We measure how the site is used and whether our Google Ads reach the right people. ' +
            'Nothing is stored unless you agree, and you can change your mind any time via “Cookie settings”. ' +
            '<a href="/privacy">Privacy policy</a> · ' +
            `<a href="${GOOGLE_BDR_URL}" target="_blank" rel="noopener noreferrer">How Google uses this data</a>`,
        learnMore: 'Choose individually',
    },
    consentModal: {
        title: 'Cookies and measurement',
        description:
            'Coding for Change is a non-profit student initiative. We keep tracking to the minimum we need to run the site and to report on the Google Ad Grant that funds our outreach. ' +
            'Choose per purpose below — the site works fully either way.',
    },
    purposes: {
        analytics: 'Audience measurement',
        advertising: 'Advertising measurement',
    },
    // Audit criterion 2: ads personalisation named explicitly, and criteria 4/5:
    // recipient named, with the Google data-responsibility link.
    [SERVICE_GOOGLE_ADS]: {
        title: 'Google Ads conversion tracking',
        description:
            'Lets us see which Google Ads led to a sign-up, contact request or booking. ' +
            'This shares data with <strong>Google Ireland Ltd. and Google LLC (USA)</strong> and may be used by Google for ' +
            '<strong>ads personalisation</strong> and to measure ad performance. We are required to report conversions to keep our Google Ad Grant. ' +
            `Details of how Google handles this data: <a href="${GOOGLE_BDR_URL}" target="_blank" rel="noopener noreferrer">Google Business Data Responsibility</a>.`,
    },
    [SERVICE_ANALYTICS]: {
        title: 'Site analytics',
        description:
            'Counts page views and which campaign brought you here, so we know what is worth doing again. ' +
            'Covers our own measurement, which keeps a random id on your device for <strong>182 days</strong> so a later visit can still be credited to the campaign you arrived through, and <strong>Google Analytics</strong>, which shares data with Google. ' +
            'No IP address, no fingerprint, and we never sell this data.',
    },
    ok: 'Accept all',
    acceptAll: 'Accept all',
    acceptSelected: 'Save selection',
    decline: 'Reject all',
    save: 'Save',
    close: 'Close',
    service: {
        disableAll: { title: 'Toggle all', description: 'Turn every optional purpose on or off at once.' },
        optOut: { title: '(opt-out)', description: 'Loaded by default — you can switch it off.' },
        required: { title: '(required)', description: 'Needed for the site to work, so it cannot be switched off.' },
        purposes: 'Purposes',
        purpose: 'Purpose',
    },
    poweredBy: '',
};

const DE = {
    privacyPolicyUrl: '/privacy',
    consentNotice: {
        // Siehe Kommentar in EN: absichtlich kurz, Details im Modal.
        title: 'Cookies',
        description:
            'Wir messen, wie die Seite genutzt wird und ob unsere Google Ads die richtigen Leute erreichen. ' +
            'Ohne deine Zustimmung wird nichts gespeichert, und du kannst deine Wahl jederzeit über „Cookie-Einstellungen“ ändern. ' +
            '<a href="/privacy">Datenschutz</a> · ' +
            `<a href="${GOOGLE_BDR_URL}" target="_blank" rel="noopener noreferrer">Wie Google diese Daten nutzt</a>`,
        learnMore: 'Einzeln auswählen',
    },
    consentModal: {
        title: 'Cookies und Messung',
        description:
            'Coding for Change ist eine gemeinnützige Studierendeninitiative. Wir tracken nur das Minimum, das wir brauchen, um die Seite zu betreiben und über den Google Ad Grant zu berichten, der unsere Öffentlichkeitsarbeit finanziert. ' +
            'Wähle unten pro Zweck – die Seite funktioniert in jedem Fall vollständig.',
    },
    purposes: {
        analytics: 'Reichweitenmessung',
        advertising: 'Werbemessung',
    },
    [SERVICE_GOOGLE_ADS]: {
        title: 'Google Ads Conversion-Tracking',
        description:
            'Zeigt uns, welche Google-Anzeige zu einer Anmeldung, Kontaktanfrage oder Buchung geführt hat. ' +
            'Dabei werden Daten an <strong>Google Ireland Ltd. und Google LLC (USA)</strong> übermittelt und können von Google zur ' +
            '<strong>Personalisierung von Werbung</strong> und zur Messung der Anzeigenleistung genutzt werden. Wir müssen Conversions melden, um unseren Google Ad Grant zu behalten. ' +
            `Wie Google diese Daten verarbeitet: <a href="${GOOGLE_BDR_URL}" target="_blank" rel="noopener noreferrer">Google Business Data Responsibility</a>.`,
    },
    [SERVICE_ANALYTICS]: {
        title: 'Website-Analyse',
        description:
            'Zählt Seitenaufrufe und über welche Kampagne du hergekommen bist, damit wir wissen, was sich lohnt. ' +
            'Umfasst unsere eigene Messung, die eine zufällige Kennung <strong>182 Tage</strong> auf deinem Gerät speichert, damit ein späterer Besuch noch der Kampagne zugeordnet werden kann, über die du gekommen bist, sowie <strong>Google Analytics</strong>, wobei Daten an Google übermittelt werden. ' +
            'Keine IP-Adresse, kein Fingerprint, und wir verkaufen diese Daten nicht.',
    },
    ok: 'Alle akzeptieren',
    acceptAll: 'Alle akzeptieren',
    acceptSelected: 'Auswahl speichern',
    decline: 'Alle ablehnen',
    save: 'Speichern',
    close: 'Schließen',
    service: {
        disableAll: { title: 'Alle umschalten', description: 'Alle optionalen Zwecke gleichzeitig ein- oder ausschalten.' },
        optOut: { title: '(Opt-out)', description: 'Wird standardmäßig geladen – du kannst es abschalten.' },
        required: { title: '(erforderlich)', description: 'Für den Betrieb der Seite nötig und daher nicht abschaltbar.' },
        purposes: 'Zwecke',
        purpose: 'Zweck',
    },
    poweredBy: '',
};

/**
 * Build the Klaro config for a locale.
 *
 * `default: false` + no `optOut` on any service is audit criterion 7: nothing
 * loads or stores until the visitor says yes. `hideDeclineAll: false` keeps
 * "Reject all" on the first screen with equal prominence — the German DSK
 * position, and the single most-fined banner mistake when it's missing.
 */
export function buildKlaroConfig(locale: Locale): KlaroConfig {
    return {
        version: CONSENT_CONFIG_VERSION,
        elementID: 'klaro',
        storageMethod: 'cookie',
        cookieName: 'cfc_consent',
        cookieExpiresAfterDays: 182, // ~6 months; re-ask rather than assume forever
        privacyPolicy: '/privacy',
        default: false, // nothing on by default
        mustConsent: false, // no cookie wall — the site stays usable while undecided
        acceptAll: true,
        hideDeclineAll: false, // "Reject all" must be as reachable as "Accept all"
        hideLearnMore: false,
        noticeAsModal: false,
        htmlTexts: true, // needed for the Google BDR link (criterion 5)
        groupByPurpose: true,
        lang: locale,
        testing: false,
        services: [
            {
                name: SERVICE_ANALYTICS,
                title: locale === 'de' ? DE[SERVICE_ANALYTICS].title : EN[SERVICE_ANALYTICS].title,
                purposes: ['analytics'],
                // GA4's cookies. Our own measurement uses sessionStorage, not
                // cookies, so it has nothing to list here — it's cleared by the
                // consent listener in `analytics.ts` instead.
                cookies: [/^_ga/, '_gid'],
                required: false,
                default: false,
            },
            {
                name: SERVICE_GOOGLE_ADS,
                title: locale === 'de' ? DE[SERVICE_GOOGLE_ADS].title : EN[SERVICE_GOOGLE_ADS].title,
                purposes: ['advertising'],
                cookies: [/^_gcl/],
                required: false,
                default: false,
            },
        ],
        translations: { en: EN, de: DE, zz: EN },
    };
}
