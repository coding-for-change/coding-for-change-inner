/**
 * Manually purge behavioural analytics events past the retention window.
 * The CMS already does this automatically (on boot + daily, see payload.config
 * onInit) — this script is for on-demand or external-cron use.
 *
 *   cd inner/cms && pnpm purge:analytics
 */
import { getPayload } from 'payload';
import config from '../src/payload.config.ts';
import { purgeAnalyticsEvents, RETENTION_MONTHS } from '../src/lib/purgeAnalytics.ts';

const payload = await getPayload({ config });
const removed = await purgeAnalyticsEvents(payload);
payload.logger.info(
  `[analytics] manual purge complete: removed ${removed} events (retention ${RETENTION_MONTHS} months)`,
);
process.exit(0);
