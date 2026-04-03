import { useState, useEffect } from 'react';
import { fetchCollection, fetchGlobal } from './client';

interface UseCmsResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export function useCmsCollection<T>(slug: string): UseCmsResult<T[]> {
    const [data, setData] = useState<T[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetchCollection<T>(slug)
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
    }, [slug]);

    return { data, loading, error };
}

export function useCmsGlobal<T>(slug: string): UseCmsResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetchGlobal<T>(slug)
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
    }, [slug]);

    return { data, loading, error };
}
