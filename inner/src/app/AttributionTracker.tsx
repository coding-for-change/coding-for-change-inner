'use client';
import { useEffect } from 'react';
import { captureAttribution } from '@/lib/attribution';

/**
 * Records this page context's traffic source (`?src` / `utm_*`) and tidies the
 * URL. Renders nothing. Mounted high in the tree (in Providers) so it runs on
 * every entry page.
 *
 * No consent subscription any more: `attribution.ts` keeps its state in page
 * memory rather than on the device, so there is no TDDDG § 25 storage event to
 * gate and nothing persisted for a withdrawal to clear. See the rationale at the
 * top of that file — in short, gating this behind consent took measurement to
 * zero, because almost nobody answers a banner that doesn't block them.
 */
export default function AttributionTracker() {
  useEffect(() => {
    captureAttribution();
  }, []);

  return null;
}
