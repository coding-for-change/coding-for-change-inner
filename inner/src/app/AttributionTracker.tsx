'use client';
import { useEffect } from 'react';
import { captureAttribution, clearAttribution } from '@/lib/attribution';
import { onConsentChange } from '@/lib/consent';

/**
 * Records this visit's traffic source (`?src` / `utm_*`) and tidies the URL.
 * Renders nothing. Mounted high in the tree (in Providers) so it fires on every
 * entry page.
 *
 * Runs twice by design. The first call happens on mount, before the CMP has
 * resolved, and only strips the URL params — it can't touch storage yet. The
 * consent subscription then re-runs the capture once the visitor accepts, which
 * is what actually persists the campaign. Doing it in that order matters:
 * the tracking params must be read *before* they're stripped, and stripping has
 * to happen on the first paint whether or not consent ever arrives.
 *
 * On withdrawal it wipes the persistent visitor id and stored campaign, since
 * Klaro only knows how to clear the cookies it declares — not our localStorage.
 */
export default function AttributionTracker() {
  useEffect(() => {
    // Strips params immediately; persists only if consent is already in place
    // (returning visitor with a stored decision).
    captureAttribution();

    return onConsentChange((snap) => {
      if (snap.statistics) {
        captureAttribution();
      } else {
        clearAttribution();
      }
    });
  }, []);

  return null;
}
