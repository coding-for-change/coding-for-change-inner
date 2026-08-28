import { GlobalConfig } from 'payload';

export const SiteConfig: GlobalConfig = {
  slug: 'site-config',
  label: 'Site Configuration',
  access: {
    read: () => true,
  },
  fields: [
    { name: 'clubName', type: 'text', required: true },
    { name: 'tagline', type: 'text', required: true, localized: true },
    { name: 'description', type: 'textarea', required: true, localized: true },
    { name: 'email', type: 'email', required: true },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        { name: 'platform', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    { name: 'copyrightText', type: 'text', localized: true },
    { name: 'windowTitle', type: 'text', localized: true },
    {
      // Public Cal.com booking-page URL. Embedded as an iframe on the Contact
      // and home pages. Paste the Cal.com event link (cal.com/<user>/<event>).
      name: 'bookingUrl',
      type: 'text',
      label: 'Booking page URL (Cal.com)',
    },
    {
      // Group hero shown at the top of the /team page. Lives here because there
      // is no dedicated Team-page global; SiteConfig is already read app-wide
      // via useSiteConfig(), so the team page can pick it up without a new fetch.
      name: 'teamHeroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Team page group photo',
      admin: {
        description:
          'Optional wide group photo shown at the top of the Team page. Left empty, the page starts straight at the member grid.',
      },
    },
    {
      // Impact figures shown above the Team page roster. Editable here so the
      // numbers can be bumped without a code deploy. The label is localized;
      // the value (e.g. "10+") is locale-agnostic.
      //
      // Deliberately NOT derived from the `team` collection: only part of the
      // club has a profile on the site, so a headcount taken off that page
      // under-reports the club (it read 12 against 20 actual members).
      name: 'stats',
      type: 'array',
      label: 'Team-page stats',
      admin: {
        description:
          'Shown as a row above the team photos. Keep it to three or four — the member count belongs here rather than being counted off the profiles, since not everyone has one.',
      },
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true, localized: true },
      ],
    },
    {
      // Site-wide colour theme. "Auto" lets each visitor see light or dark based
      // on their own device setting; the forced options apply one theme to all.
      name: 'colorMode',
      type: 'select',
      label: 'Color mode',
      required: true,
      defaultValue: 'auto',
      options: [
        { label: "Auto — follow each visitor's device setting", value: 'auto' },
        { label: 'Always dark', value: 'dark' },
        { label: 'Always light', value: 'light' },
      ],
      admin: {
        description:
          'Controls the site colour theme. "Auto" shows each visitor light or dark based on their device/browser preference; the forced options apply one theme for everyone.',
      },
    },
  ],
};
