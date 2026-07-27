import { CollectionConfig } from 'payload';
import { attributionField } from '../fields/attribution';

// The behavioural events the site beacons in. Kept as a fixed list so the data
// stays queryable; extend here (and in the inner `lib/analytics.ts` helpers)
// when a new step is added to the funnel.
export const EVENT_TYPES = [
  'landing',
  'pageview',
  'cta_click',
  'form_start',
  'conversion',
  'outbound_click',
  // Booking widget scrolled into view. An impression, not intent — kept for
  // funnel shape only, never used as an ad conversion.
  'booking_started',
  // A booking actually submitted on cal.com (embed `bookingSuccessful` event).
  // This is the real conversion.
  'booking_completed',
] as const;

/**
 * First-party behavioural analytics.
 *
 * The inner site beacons events here (page views, form starts, conversions)
 * tagged with the visit's `sessionId`, its persistent `visitorId` and its
 * campaign attribution, so we can measure the funnel from traffic source →
 * interaction → conversion.
 *
 * No IP, no fingerprint, no personal data beyond the two random identifiers:
 * `sessionId` (sessionStorage, gone when the tab closes) groups one visit, and
 * `visitorId` (localStorage, 180 days) joins a person's visits across sessions
 * so a poster QR scanned in May can be credited for a signup in July.
 *
 * **Consent-gated.** `visitorId` is a persistent identifier and every write here
 * is device storage under TDDDG § 25, so nothing is collected until the visitor
 * accepts the `statistics` purpose in the consent banner. Withdrawal wipes the
 * stored identifiers client-side. Public create (the site posts anonymously);
 * admin-only read — mirrors the WaitlistSignups access model.
 */
export const AnalyticsEvents: CollectionConfig = {
  slug: 'analytics-events',
  labels: { singular: 'Analytics Event', plural: 'Analytics Events' },
  admin: {
    useAsTitle: 'type',
    defaultColumns: ['type', 'label', 'path', 'createdAt'],
    group: 'Analytics',
    description:
      'Cookieless behavioural events (page views, form starts, conversions) for campaign & funnel analysis. No cookies, no IP, no personal data — a random per-visit session id links events to a conversion.',
  },
  access: {
    // The public site beacons events in anonymously…
    create: () => true,
    // …only logged-in admins may read / manage them.
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      index: true,
      options: EVENT_TYPES.map((v) => ({ label: v, value: v })),
    },
    {
      name: 'path',
      type: 'text',
      maxLength: 512,
      admin: {
        readOnly: true,
        description: 'Page path where the event occurred.',
      },
    },
    {
      name: 'label',
      type: 'text',
      maxLength: 256,
      admin: {
        readOnly: true,
        description:
          'Event detail — CTA id, form name, conversion kind, or link host.',
      },
    },
    {
      name: 'locale',
      type: 'text',
      maxLength: 16,
      admin: { readOnly: true, description: 'Site language at the time.' },
    },
    // Same shared group as the conversion collections, so events and
    // conversions expose identical, joinable attribution columns.
    attributionField,
    {
      name: 'meta',
      type: 'json',
      admin: { readOnly: true, description: 'Optional extra event data.' },
    },
  ],
  // createdAt / updatedAt are added automatically and drive time-range reporting
  // and the (Phase 4) retention purge.
};
