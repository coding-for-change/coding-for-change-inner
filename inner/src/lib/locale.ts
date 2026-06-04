import 'server-only';
import { cookies } from 'next/headers';
import type { Locale } from '@/i18n/translations';

/** Cookie written client-side by LanguageContext.setLocale so SSR can honor it. */
export const LOCALE_COOKIE = 'cfc-locale';

/**
 * Locale to render on the server. The browser persists the user's choice in a
 * cookie (mirrored from localStorage); absent that we default to English. New
 * `de` visitors get English HTML on first paint and the client swaps to German
 * after hydration — see the i18n decision in the migration plan.
 */
export async function getServerLocale(): Promise<Locale> {
    const stored = (await cookies()).get(LOCALE_COOKIE)?.value;
    return stored === 'de' ? 'de' : 'en';
}
