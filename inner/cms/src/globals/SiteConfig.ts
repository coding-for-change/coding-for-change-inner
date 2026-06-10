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
      // Impact figures shown on the About page. Editable here so the numbers
      // can be bumped without a code deploy. The label is localized; the value
      // (e.g. "10+") is locale-agnostic.
      name: 'stats',
      type: 'array',
      label: 'About-page stats',
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true, localized: true },
      ],
    },
  ],
};
