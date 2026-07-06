import { GlobalConfig } from 'payload';

export const Membership: GlobalConfig = {
  slug: 'membership',
  label: 'Membership Page',
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'description', type: 'textarea', required: true, localized: true },
    {
      name: 'benefits',
      type: 'array',
      fields: [{ name: 'text', type: 'text', required: true, localized: true }],
    },
    {
      name: 'requirements',
      type: 'array',
      fields: [{ name: 'text', type: 'text', required: true, localized: true }],
    },
    {
      name: 'tracks',
      label: 'Ways to contribute',
      type: 'array',
      admin: {
        description:
          'The disciplines people can join in (e.g. Engineering, Consulting, Marketing, People & Ops). Shown as cards on the Join page to encourage cross-disciplinary applications.',
        initCollapsed: true,
      },
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          localized: true,
        },
      ],
    },
    { name: 'contactEmail', type: 'email', required: true },
  ],
};
