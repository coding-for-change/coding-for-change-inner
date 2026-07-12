import { CollectionConfig } from 'payload';

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'ngoPartner', 'status', 'featured'],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'ngoPartner', type: 'text', required: true, label: 'NGO Partner', localized: true },
    {
      // URL slug for the case-study detail page (/projects/<slug>). Optional so
      // the migration adds a nullable column over existing rows; set it in the
      // admin for every project you want a detail page for. Not localized — the
      // URL is shared across languages.
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Lowercase, hyphenated (e.g. "lebenshilfe-muenchen"). Needed for the detail page.',
      },
    },
    {
      // Marks the flagship project — highlighted on the homepage / projects list.
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    { name: 'description', type: 'textarea', required: true, localized: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'technologies',
      type: 'array',
      fields: [{ name: 'name', type: 'text', required: true, localized: true }],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
        { label: 'Recruiting', value: 'recruiting' },
      ],
    },
    {
      name: 'links',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    // ---- Case-study fields (all optional; shown on /projects/<slug>) ----
    {
      type: 'collapsible',
      label: 'Case study',
      admin: {
        initCollapsed: true,
        description:
          'The in-depth story shown on the project detail page. Leave blank to show only the summary card.',
      },
      fields: [
        {
          name: 'problem',
          type: 'textarea',
          localized: true,
          admin: { description: 'The problem the partner faced, in their terms.' },
        },
        {
          name: 'approach',
          type: 'textarea',
          localized: true,
          admin: { description: 'How the team approached and built the solution.' },
        },
        {
          name: 'outcome',
          type: 'textarea',
          localized: true,
          admin: { description: 'What shipped and what changed as a result.' },
        },
        {
          name: 'impact',
          type: 'text',
          localized: true,
          admin: { description: 'A one-line impact highlight (e.g. "Saves ~150 companions hours of paperwork a month").' },
        },
        {
          name: 'quote',
          type: 'group',
          fields: [
            { name: 'text', type: 'textarea', localized: true },
            { name: 'author', type: 'text' },
            { name: 'role', type: 'text', localized: true },
          ],
        },
        {
          name: 'gallery',
          type: 'array',
          labels: { singular: 'Screenshot', plural: 'Screenshots' },
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media', required: true },
            { name: 'caption', type: 'text', localized: true },
          ],
        },
      ],
    },
  ],
};
