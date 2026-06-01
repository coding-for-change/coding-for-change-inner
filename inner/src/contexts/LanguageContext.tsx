import React, { createContext, useContext, useState } from 'react';
import { Locale, Translations, translations } from '../i18n/translations';

const STORAGE_KEY = 'cfc-locale';

function getInitialLocale(): Locale {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'de') return stored;
    if (navigator.language.startsWith('de')) return 'de';
    return 'en';
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

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

    const setLocale = (next: Locale) => {
        localStorage.setItem(STORAGE_KEY, next);
        setLocaleState(next);
    };

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageState => useContext(LanguageContext);
