import { useState, useEffect } from 'react';
import { fetchCollection, fetchGlobal } from './client';
import { useLanguage } from '../contexts/LanguageContext';

interface UseCmsResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

/**
 * When `initialData` is provided (the server component fetched it and passed it
 * down as a prop), the data is rendered directly and **no client fetch is made**
 * — the content is already in the SSR HTML. A locale change re-runs the server
 * component via `router.refresh()` (see LanguageContext), which delivers fresh
 * data as a new prop.
 *
 * When `initialData` is omitted (e.g. the desktop Imprint window, which is an
 * OS window with no server page behind it), it falls back to fetching on the
 * client and refetching on locale change.
 */
export function useCmsCollection<T>(
    slug: string,
    params?: Record<string, string>,
    initialData?: T[] | null
): UseCmsResult<T[]> {
    const seeded = initialData !== undefined;
    const { locale } = useLanguage();
    const [data, setData] = useState<T[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const paramsKey = JSON.stringify(params);

    useEffect(() => {
        if (seeded) return; // SSR-seeded → never fetch on the client
        let cancelled = false;
        setLoading(true);
        fetchCollection<T>(slug, { locale, ...params })
            .then((docs) => {
                if (!cancelled) {
                    setData(docs);
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(err.message);
                    setLoading(false);
                }
            });
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug, locale, paramsKey, seeded]);

    if (seeded) return { data: initialData ?? null, loading: false, error: null };
    return { data, loading, error };
}

/** See `useCmsCollection` — same SSR-seeded vs client-fetch behavior. */
export function useCmsGlobal<T>(slug: string, initialData?: T | null): UseCmsResult<T> {
    const seeded = initialData !== undefined;
    const { locale } = useLanguage();
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (seeded) return; // SSR-seeded → never fetch on the client
        let cancelled = false;
        setLoading(true);
        fetchGlobal<T>(slug, { locale })
            .then((result) => {
                if (!cancelled) {
                    setData(result);
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(err.message);
                    setLoading(false);
                }
            });
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug, locale, seeded]);

    if (seeded) return { data: initialData ?? null, loading: false, error: null };
    return { data, loading, error };
}
