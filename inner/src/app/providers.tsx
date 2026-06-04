'use client';
import React from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SiteConfigProvider } from '@/api/SiteConfigContext';
import type { CmsSiteConfig } from '@/api/types';
import type { Locale } from '@/i18n/translations';

/**
 * Client context providers, seeded with values fetched on the server so the
 * first render (and the SSR HTML) already has the real site config and the
 * visitor's locale — the existing CMS hooks then refetch on locale change.
 */
export default function Providers({
    children,
    initialLocale,
    initialConfig,
}: {
    children: React.ReactNode;
    initialLocale: Locale;
    initialConfig: CmsSiteConfig | null;
}) {
    return (
        <LanguageProvider initialLocale={initialLocale}>
            <SiteConfigProvider initialConfig={initialConfig}>
                {children}
            </SiteConfigProvider>
        </LanguageProvider>
    );
}
