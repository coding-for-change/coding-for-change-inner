'use client';
import React, { useEffect, useState } from 'react';
import Desktop from '@/components/os/Desktop';
import ExperienceModal from '@/components/general/ExperienceModal';
import MobileLayout from '@/components/mobile/MobileLayout';
import useIsMobile from '@/hooks/useIsMobile';

/**
 * Persistent OS shell shared by every content route. The active page renders
 * into `children` — the Next App Router keeps this layout mounted across
 * navigations, so the desktop window's drag position, z-index, and open
 * windows survive route changes (replacing the old in-window router).
 *
 * Desktop vs mobile chrome is a viewport decision and only known on the client,
 * so we render the desktop chrome on the server and during the first client
 * render (keeping the page content in the SSR HTML and avoiding a hydration
 * mismatch), then swap to the mobile chrome after mount if needed.
 */
export default function OsLayout({ children }: { children: React.ReactNode }) {
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
            <Desktop>{children}</Desktop>
            <ExperienceModal />
        </div>
    );
}
