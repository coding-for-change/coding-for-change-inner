import type { Field } from 'payload';

/**
 * Campaign / traffic-source attribution attached to a conversion (a waitlist
 * signup or a form submission).
 *
 * These values are captured client-side on the inner site: when a visitor lands
 * with a tracking param (`?src=poster-tumsom` or standard `utm_*`) the tag is
 * held in the page's JavaScript memory and carried to the conversion in that same
 * tab. Empty for direct / organic visitors.
 *
 * All fields are system-populated (read-only in the admin) and hold no name,
 * email, IP or free text. The only identifier is `sessionId`, which is random and
 * lives in page memory — nothing is written to the visitor's device, so this
 * needs no cookie consent and is recorded for every visitor rather than the small
 * minority who answer a banner. Scope is one tab: a refresh or a new tab starts
 * fresh, and there is no cross-session or cross-device linkage by design.
 *
 * A persistent `visitorId` existed briefly and was removed: it required consent
 * under TDDDG § 25, and with almost nobody answering the banner it produced
 * nearly no data in exchange for real legal surface.
 *
 * Defined once and reused by the WaitlistSignups collection and the form-builder
 * `form-submissions` collection so both expose identical, joinable columns.
 */
export const attributionField: Field = {
  name: 'attribution',
  type: 'group',
  label: 'Attribution',
  admin: {
    readOnly: true,
    description:
      'Where this submission came from — captured from the landing URL (?src / utm_*) and carried through the session. Empty for direct/organic visits. Used only in aggregate for campaign analysis.',
  },
  fields: [
    {
      name: 'source',
      type: 'text',
      label: 'Source',
      index: true,
      admin: {
        readOnly: true,
        description:
          'Campaign tag from ?src=, or utm_source (e.g. "poster-tumsom").',
      },
    },
    {
      name: 'channel',
      type: 'select',
      label: 'Channel',
      index: true,
      options: [
        { label: 'Campaign (tagged)', value: 'campaign' },
        { label: 'Organic search', value: 'organic_search' },
        { label: 'Social', value: 'social' },
        { label: 'Referral', value: 'referral' },
        { label: 'Direct', value: 'direct' },
      ],
      admin: {
        readOnly: true,
        description:
          'Normalised traffic channel, derived from the tag + referrer: campaign (tagged link), organic_search, social, referral, or direct.',
      },
    },
    {
      name: 'medium',
      type: 'text',
      label: 'Medium',
      admin: {
        readOnly: true,
        description: 'utm_medium (e.g. poster, qr, social, newsletter).',
      },
    },
    {
      name: 'campaign',
      type: 'text',
      label: 'Campaign',
      admin: { readOnly: true, description: 'utm_campaign.' },
    },
    {
      name: 'content',
      type: 'text',
      label: 'Content',
      admin: {
        readOnly: true,
        description: 'utm_content — distinguishes creatives/variants.',
      },
    },
    {
      name: 'referrer',
      type: 'text',
      label: 'Referrer',
      admin: {
        readOnly: true,
        description:
          'Referring site host (e.g. instagram.com), when the browser sends one.',
      },
    },
    {
      name: 'landingPath',
      type: 'text',
      label: 'Landing page',
      admin: {
        readOnly: true,
        description: 'First path the visitor landed on this session.',
      },
    },
    {
      name: 'sessionId',
      type: 'text',
      label: 'Session ID',
      index: true,
      admin: {
        readOnly: true,
        description:
          'Random per-visit id (sessionStorage). Links this conversion to the behavioural funnel; not a stable identifier, not personal data.',
      },
    },
    {
      name: 'firstSeenAt',
      type: 'date',
      label: 'First seen',
      admin: {
        readOnly: true,
        description: 'When attribution was first captured this session.',
      },
    },
  ],
};
