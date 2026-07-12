import { CollectionConfig } from 'payload';

export const Sponsors: CollectionConfig = {
  slug: 'sponsors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'tier'],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'url', type: 'text' },
    {
      name: 'tierRef',
      label: 'Tier',
      type: 'relationship',
      relationTo: 'sponsor-tiers',
      admin: {
        description:
          'Which tier section this sponsor appears in (managed in Sponsor Tiers).',
      },
    },
    {
      // Deprecated: superseded by the `tierRef` relationship. Kept (nullable,
      // hidden) so existing data survives the migration; the site falls back to
      // it when a sponsor has no tierRef yet.
      name: 'tier',
      type: 'select',
      admin: {
        hidden: true,
        description: 'Deprecated — use the Tier relationship above.',
      },
      options: [
        { label: 'Platinum', value: 'platinum' },
        { label: 'Gold', value: 'gold' },
        { label: 'Silver', value: 'silver' },
        { label: 'Bronze', value: 'bronze' },
        { label: 'Partner', value: 'partner' },
      ],
    },
    { name: 'description', type: 'textarea', localized: true },
  ],
};
