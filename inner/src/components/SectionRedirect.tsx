'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Legacy section URLs (/about, /events, …) are anchors on the single-scroll
 * landing page. They remain real routes (so they resolve and stay in the
 * sitemap) but client-redirect to the matching hash on `/`, where the Landing
 * component performs the smooth scroll. A server redirect() would drop the
 * fragment, so this runs on the client.
 */
export default function SectionRedirect({ hash }: { hash: string }) {
    const router = useRouter();
    useEffect(() => {
        router.replace(`/#${hash}`);
    }, [hash, router]);
    return null;
}
