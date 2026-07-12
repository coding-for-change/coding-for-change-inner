import React from 'react';
import SiteShell from '@/components/general/SiteShell';

/**
 * Persistent site shell shared by every content route. The active page renders
 * into `children`; the Next App Router keeps this layout mounted across
 * navigations. The chrome (top nav + footer, with the desktop/mobile/embedded
 * logic) lives in `SiteShell` so the global `not-found` page can reuse the exact
 * same treatment and read like a normal page of the site.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return <SiteShell>{children}</SiteShell>;
}
