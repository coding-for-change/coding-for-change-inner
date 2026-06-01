import { useState, useEffect } from 'react';
import { fetchCollection, fetchGlobal } from './client';
import { useLanguage } from '../contexts/LanguageContext';

interface UseCmsResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export function useCmsCollection<T>(slug: string, params?: Record<string, string>): UseCmsResult<T[]> {
    const { locale } = useLanguage();
    const [data, setData] = useState<T[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const paramsKey = JSON.stringify(params);

    useEffect(() => {
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
        // paramsKey is a stable serialisation of params — avoids object identity re-renders
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug, locale, paramsKey]);

    return { data, loading, error };
}

export function useCmsGlobal<T>(slug: string): UseCmsResult<T> {
    const { locale } = useLanguage();
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
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
    }, [slug, locale]);

    return { data, loading, error };
}
