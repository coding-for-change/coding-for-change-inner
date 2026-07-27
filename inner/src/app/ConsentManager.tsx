'use client';
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildKlaroConfig, SERVICE_ANALYTICS, SERVICE_GOOGLE_ADS } from '@/lib/klaroConfig';
import { setConsent, registerDialogOpener } from '@/lib/consent';
import { updateGoogleConsent } from '@/lib/googleConsent';
import { recordConsent } from '@/lib/consentRecord';

/**
 * Owns the Klaro CMP: renders the banner, translates its per-service consent
 * into (a) Google Consent Mode v2 signals and (b) our app-facing consent store,
 * and files a consent record for GDPR Art. 7(1) accountability.
 *
 * This is the *only* CMP-aware module in the app. Everything else reads
 * `lib/consent`, so replacing Klaro means rewriting this file alone.
 *
 * Not rendered when embedded in the 3D scene's monitor iframe — the banner would
 * appear inside a tiny simulated CRT, angled in 3D space. `/3d` instead shows a
 * "Cookie settings" link back to `/` (see `outer/.../ConsentLink.tsx`); that is
 * lawful because with no consent stored nothing is stored on `/3d` either. Both
 * surfaces share an origin, so a choice made on `/` applies inside the iframe.
 */
export default function ConsentManager() {
    const { locale } = useLanguage();

    useEffect(() => {
        // Don't stack a second banner inside the 3D monitor iframe.
        let embedded = false;
        try {
            embedded = window.self !== window.top;
        } catch {
            // Cross-origin parent — we're framed by something we can't inspect.
            embedded = true;
        }
        if (embedded) return;

        let cancelled = false;
        let watcher: { update: (...args: unknown[]) => void } | null = null;

        (async () => {
            // Dynamic import keeps Klaro (~212 KB) out of the initial bundle
            // and off the server — it touches `document` at module scope.
            // The vendored file is a UMD bundle (`module.exports = …`), so
            // interop may or may not park it under `.default` depending on how
            // the bundler treats it; accept either.
            const mod = await import('@/vendor/klaro/klaro-no-css.js');
            const klaro = ((mod as { default?: unknown }).default ?? mod) as
                typeof import('@/vendor/klaro/klaro-no-css.js');
            if (cancelled) return;

            const config = buildKlaroConfig(locale);
            klaro.setup(config);

            const manager = klaro.getManager(config);

            const publish = (interactive: boolean) => {
                // Unconfirmed means the visitor hasn't answered yet. Leave the
                // consent store unresolved so callers queue instead of
                // discarding — otherwise every consenting visitor loses the
                // events fired before they clicked.
                if (!manager.confirmed) return;

                const snapshot = {
                    statistics: manager.consents[SERVICE_ANALYTICS] === true,
                    marketing: manager.consents[SERVICE_GOOGLE_ADS] === true,
                };
                updateGoogleConsent(snapshot);
                setConsent(snapshot);
                if (interactive) recordConsent(snapshot);
            };

            watcher = {
                update: (_m: unknown, eventType: unknown) => {
                    // 'saveConsents' is an actual click; other events are
                    // internal re-applications we shouldn't log as new consent.
                    publish(eventType === 'saveConsents');
                },
            };
            manager.watch(watcher as never);

            // Returning visitor with a stored decision: resolve immediately.
            publish(false);

            registerDialogOpener(() => klaro.show(config, { modal: true }));
        })().catch(() => {
            // If the CMP fails to load we must fail *closed*: no consent, so no
            // cookies and no tracking. The consent store simply stays
            // unresolved, which every caller already treats as "don't track".
        });

        return () => {
            cancelled = true;
            registerDialogOpener(null);
        };
        // Rebuilding on locale change would re-run setup and re-render the
        // banner mid-visit; Klaro reads `lang` once. Locale changes are rare
        // and the stored consent still applies, so we intentionally bind to the
        // locale present on mount.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Klaro renders itself into this element.
    return <div id="klaro" />;
}
