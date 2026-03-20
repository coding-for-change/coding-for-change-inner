const API_BASE = process.env.REACT_APP_API_URL || '/api';

export interface PaginatedResponse<T> {
    docs: T[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
}

export async function fetchCollection<T>(
    slug: string,
    params?: Record<string, string>
): Promise<T[]> {
    const query = new URLSearchParams({ limit: '100', ...params });
    const res = await fetch(`${API_BASE}/${slug}?${query}`);
    if (!res.ok) throw new Error(`Failed to fetch ${slug}: ${res.status}`);
    const data: PaginatedResponse<T> = await res.json();
    return data.docs;
}

export async function fetchGlobal<T>(slug: string): Promise<T> {
    const res = await fetch(`${API_BASE}/globals/${slug}`);
    if (!res.ok) throw new Error(`Failed to fetch global ${slug}: ${res.status}`);
    return res.json();
}

export function mediaUrl(
    media: { url?: string | null } | null | undefined
): string | null {
    if (!media?.url) return null;
    // If it's already absolute, return as-is
    if (media.url.startsWith('http')) return media.url;
    // Otherwise prefix with API base (strip /api suffix)
    const base = API_BASE.replace(/\/api$/, '');
    return `${base}${media.url}`;
}
