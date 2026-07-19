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
    // ---- Case-study head (shown at the top of /projects/<slug>) ----
    {
      name: 'impactHeadline',
      type: 'text',
      localized: true,
      admin: { description: 'The case-study page headline (falls back to the project title).' },
    },
    {
      name: 'impact',
      type: 'text',
      localized: true,
      admin: { description: 'A one-line impact highlight shown under the headline (e.g. "Saves ~150 companions hours of paperwork a month").' },
    },
    // ---- Case-study body: freely-orderable content blocks ----
    {
      name: 'layout',
      label: 'Case study content',
      type: 'blocks',
      admin: {
        description:
          'The body of the case-study page. Add, remove and reorder blocks freely — text sections, quote, gallery, timeline, team and FAQ.',
      },
      blocks: [
        {
          slug: 'text',
          labels: { singular: 'Text section', plural: 'Text sections' },
          fields: [
            {
              name: 'heading',
              type: 'text',
              localized: true,
              admin: { description: 'Optional section heading (e.g. "The challenge").' },
            },
            {
              name: 'body',
              type: 'textarea',
              required: true,
              localized: true,
              admin: { description: 'Paragraph text. Separate paragraphs with a blank line.' },
            },
          ],
        },
        {
          slug: 'quote',
          labels: { singular: 'Quote', plural: 'Quotes' },
          fields: [
            { name: 'text', type: 'textarea', required: true, localized: true },
            { name: 'author', type: 'text' },
            { name: 'role', type: 'text', localized: true },
          ],
        },
        {
          slug: 'gallery',
          labels: { singular: 'Gallery', plural: 'Galleries' },
          fields: [
            {
              name: 'images',
              type: 'array',
              minRows: 1,
              labels: { singular: 'Image', plural: 'Images' },
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', required: true },
                { name: 'caption', type: 'text', localized: true },
              ],
            },
          ],
        },
        {
          slug: 'timeline',
          labels: { singular: 'Timeline', plural: 'Timelines' },
          fields: [
            {
              name: 'heading',
              type: 'text',
              localized: true,
              admin: { description: 'Optional section heading (e.g. "How it came together").' },
            },
            {
              name: 'points',
              type: 'array',
              minRows: 1,
              labels: { singular: 'Point', plural: 'Points' },
              fields: [
                {
                  name: 'marker',
                  type: 'text',
                  admin: {
                    description:
                      'Shown inside the circle — a number (1, 2, 3) or a symbol (e.g. ✓). Leave blank to auto-number by position.',
                  },
                },
                { name: 'title', type: 'text', required: true, localized: true },
                { name: 'subtitle', type: 'text', localized: true },
              ],
            },
          ],
        },
        {
          slug: 'team',
          labels: { singular: 'Team', plural: 'Teams' },
          fields: [
            {
              name: 'heading',
              type: 'text',
              localized: true,
              admin: { description: 'Optional section heading (e.g. "The team behind it").' },
            },
            {
              name: 'members',
              type: 'array',
              minRows: 1,
              labels: { singular: 'Member', plural: 'Members' },
              fields: [
                { name: 'member', type: 'relationship', relationTo: 'team', required: true },
                {
                  name: 'role',
                  type: 'text',
                  localized: true,
                  admin: {
                    description:
                      'Role on this project (e.g. "Project Lead"). Falls back to the member\'s main role if blank.',
                  },
                },
              ],
            },
          ],
        },
        {
          slug: 'faq',
          labels: { singular: 'FAQ', plural: 'FAQs' },
          fields: [
            {
              name: 'items',
              type: 'array',
              minRows: 1,
              labels: { singular: 'Question', plural: 'Questions' },
              fields: [
                { name: 'question', type: 'text', required: true, localized: true },
                { name: 'answer', type: 'textarea', required: true, localized: true },
              ],
            },
          ],
        },
      ],
    },
  ],
};
