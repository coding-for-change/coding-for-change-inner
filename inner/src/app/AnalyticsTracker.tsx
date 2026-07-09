'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackLanding, trackPageview } from '@/lib/analytics';

/**
 * Fires the session `landing` event once on entry, then a `pageview` on every
 * client-side route change. Renders nothing. Mounted in Providers, just after
 * AttributionTracker so the visit's attribution is captured first.
 */
export default function AnalyticsTracker() {
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      trackLanding(); // covers the entry page; won't double-count as pageview
      return;
    }
    trackPageview(pathname ?? undefined);
  }, [pathname]);

  return null;
}
