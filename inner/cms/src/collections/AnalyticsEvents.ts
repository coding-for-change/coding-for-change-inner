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
  'booking_started',
] as const;

/**
 * Cookieless, first-party behavioural analytics.
 *
 * The inner site beacons events here (page views, form starts, conversions)
 * tagged with the visit's random `sessionId` and its campaign attribution, so
 * we can measure the funnel from traffic source → interaction → conversion.
 *
 * No cookies, no IP, no fingerprint, no personal data: the only identifier is
 * the per-visit `sessionId` (sessionStorage, gone when the tab closes), which
 * also links these events to a conversion row in waitlist-signups /
 * form-submissions. Public create (the site posts anonymously); admin-only read
 * — mirrors the WaitlistSignups access model.
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
