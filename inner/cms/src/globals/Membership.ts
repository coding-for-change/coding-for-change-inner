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
    { name: 'contactEmail', type: 'email', required: true },
  ],
};
