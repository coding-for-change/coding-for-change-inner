import type { Payload } from 'payload';

/**
 * Retention window for behavioural analytics events, in months. GDPR storage
 * limitation (Art. 5(1)(e)) requires we don't keep this longer than necessary
 * and that deletion is actually enforced — see `onInit` in payload.config.ts,
 * which runs the purge on boot and then daily. Override via env; set to 0 to
 * disable (e.g. if you switch to an external cron).
 */
export const RETENTION_MONTHS = Number(
  process.env.ANALYTICS_RETENTION_MONTHS ?? '12',
);

/**
 * Delete analytics-events older than the retention window. Conversion records
 * (waitlist-signups / form-submissions) are NOT touched — they follow their own
 * purpose-based retention. Returns the number of rows removed.
 */
export async function purgeAnalyticsEvents(
  payload: Payload,
  months: number = RETENTION_MONTHS,
): Promise<number> {
  if (!Number.isFinite(months) || months <= 0) return 0; // disabled

  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - months);

  const res = await payload.delete({
    collection: 'analytics-events',
    where: { createdAt: { less_than: cutoff.toISOString() } },
    overrideAccess: true, // runs unauthenticated (boot / cron), not via an admin
  });

  const count = Array.isArray(res?.docs) ? res.docs.length : 0;
  if (count > 0) {
    payload.logger.info(
      `[analytics] purged ${count} events older than ${months} months (before ${cutoff.toISOString()})`,
    );
  }
  return count;
}
