'use client';
import React, { useEffect, useState } from 'react';
import TopNav from '@/components/showcase/TopNav';
import SiteFooter from '@/components/general/SiteFooter';
import MobileLayout from '@/components/mobile/MobileLayout';
import useIsMobile from '@/hooks/useIsMobile';

/**
 * Persistent site shell shared by every content route. The active page renders
 * into `children` — the Next App Router keeps this layout mounted across
 * navigations.
 *
 * The site is now a normal website (the old Windows-95 desktop chrome is gone).
 * Desktop renders a fixed top nav over a single scroll container, mobile gets
 * its own nav/footer. The desktop shell reuses the `.site-page` / `.site-scroll`
 * structure the in-window view used, so `TopNav`'s scroll detection and the
 * landing page's hash-scroll keep working unchanged.
 *
 * Desktop vs mobile chrome is a viewport decision and only known on the client,
 * so we render the desktop shell on the server and during the first client
 * render (keeping the page content in the SSR HTML and avoiding a hydration
 * mismatch), then swap to the mobile chrome after mount if needed.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
    const isMobile = useIsMobile();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (mounted && isMobile) {
        return (
            <div className="App">
                <MobileLayout>{children}</MobileLayout>
            </div>
        );
    }

    return (
        <div className="App">
            <div className="site-page">
                <TopNav />
                <div className="site-scroll">
                    {children}
                    <SiteFooter />
                </div>
            </div>
        </div>
    );
}
