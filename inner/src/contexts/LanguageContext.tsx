'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Locale, Translations, translations } from '../i18n/translations';

const STORAGE_KEY = 'cfc-locale';

/**
 * SSR-safe: `window`/`localStorage`/`navigator` only exist in the browser.
 *
 * Precedence matters. `?lang=` wins over the stored preference because an
 * inbound link asking for a language is an explicit, current request — a German
 * Google Ad, say. Without this, a visitor who once picked English would click a
 * German ad, get German HTML from the middleware, then get silently flipped back
 * to English on hydration. See `src/middleware.ts` for the server half.
 */
function getClientLocale(fallback: Locale): Locale {
    if (typeof window === 'undefined') return fallback;
    try {
        const requested = new URLSearchParams(window.location.search).get('lang');
        if (requested === 'en' || requested === 'de') return requested;
    } catch {
        /* malformed query string — fall through to the stored preference */
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'de') return stored;
    if (navigator.language.startsWith('de')) return 'de';
    return fallback;
}

/** Mirror the locale to a cookie so the next SSR request renders in it. */
function writeLocaleCookie(locale: Locale) {
    document.cookie = `${STORAGE_KEY}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

interface LanguageState {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: Translations;
}

const LanguageContext = createContext<LanguageState>({
    locale: 'en',
    setLocale: () => {},
    t: translations.en,
});

export const LanguageProvider: React.FC<{
    children: React.ReactNode;
    initialLocale?: Locale;
}> = ({ children, initialLocale = 'en' }) => {
    const router = useRouter();
    // Start from the server-rendered locale so the first client render matches
    // the SSR HTML (no hydration mismatch), then reconcile with the browser's
    // stored/navigator preference after mount.
    const [locale, setLocaleState] = useState<Locale>(initialLocale);

    useEffect(() => {
        const client = getClientLocale(initialLocale);
        if (client !== initialLocale) {
            // The server rendered a different locale than this visitor prefers
            // (e.g. first visit by a German speaker → server defaulted to 'en').
            // Persist the preference and re-render server-side so the CMS
            // content matches — no client-side CMS fetch needed.
            // Persist to localStorage too, not just the cookie: otherwise a
            // `?lang=de` arrival is forgotten the moment the visitor clicks
            // through to a URL without the param, and `getClientLocale` falls
            // back to navigator/stored and flips the language mid-session.
            try {
                localStorage.setItem(STORAGE_KEY, client);
            } catch {
                /* private mode / quota — the cookie still carries the choice */
            }
            writeLocaleCookie(client);
            setLocaleState(client);
            router.refresh();
        }
        // initialLocale is fixed for the provider's lifetime
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setLocale = (next: Locale) => {
        localStorage.setItem(STORAGE_KEY, next);
        writeLocaleCookie(next);
        // Reflect the language on <html> immediately so locale-aware CSS (e.g.
        // the wider German nav) applies before the server refresh completes.
        try {
            document.documentElement.lang = next;
        } catch {
            /* ignore */
        }
        setLocaleState(next); // instant UI-label (translations) switch
        // Re-run the server components with the new locale cookie so the SSR'd
        // CMS content updates — the client never fetches the CMS directly.
        router.refresh();
    };

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageState => useContext(LanguageContext);
