import { GlobalConfig } from 'payload';

/**
 * "Partner with us / For NGOs" page content. A dedicated pitch for non-profit
 * organisations — distinct from student recruiting — rendered at /partner.
 */
export const Partner: GlobalConfig = {
  slug: 'partner',
  label: 'Partner Page (For NGOs)',
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', localized: true, admin: { description: 'Page headline.' } },
    { name: 'intro', type: 'textarea', localized: true, admin: { description: 'Lead paragraph under the headline.' } },
    {
      name: 'valueProps',
      label: 'What we bring',
      type: 'array',
      admin: { initCollapsed: true, description: 'The concrete things a partner gets from working with us.' },
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'description', type: 'textarea', required: true, localized: true },
      ],
    },
    {
      name: 'process',
      label: 'How it works',
      type: 'array',
      admin: { initCollapsed: true, description: 'The steps of a partnership, from first conversation to hand-off.' },
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'description', type: 'textarea', required: true, localized: true },
      ],
    },
    {
      name: 'commitment',
      type: 'textarea',
      localized: true,
      admin: { description: 'Optional: what we ask of a partner (time, a point of contact, etc.).' },
    },
    { name: 'ctaHeading', type: 'text', localized: true },
    { name: 'ctaText', type: 'textarea', localized: true },
    { name: 'contactEmail', type: 'email' },
  ],
};
