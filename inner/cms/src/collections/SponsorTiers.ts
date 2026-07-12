import { CollectionConfig } from 'payload';

/**
 * Sponsor tiers, managed in the CMS (add / rename / reorder without code).
 * Sponsors point to a tier via the `tierRef` relationship; the public site
 * groups sponsors into tier sections ordered by `order` (lower = higher tier).
 */
export const SponsorTiers: CollectionConfig = {
  slug: 'sponsor-tiers',
  labels: { singular: 'Sponsor Tier', plural: 'Sponsor Tiers' },
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'order'],
    description: 'Tier sections for the Sponsors page (e.g. Platinum, Gold …).',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'label', type: 'text', required: true, localized: true },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 100,
      admin: { description: 'Lower shows first (e.g. Platinum 10, Gold 20, Silver 30 …).' },
    },
  ],
};
