'use client';
import { useEffect } from 'react';
import { captureAttribution } from '@/lib/attribution';

/**
 * Runs once on first client render to record this visit's traffic source
 * (`?src` / `utm_*`) into sessionStorage and tidy the URL. Renders nothing.
 * Mounted high in the tree (in Providers) so it fires on every entry page.
 */
export default function AttributionTracker() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
