import { GlobalConfig } from 'payload';

export const SiteConfig: GlobalConfig = {
  slug: 'site-config',
  label: 'Site Configuration',
  access: {
    read: () => true,
  },
  fields: [
    { name: 'clubName', type: 'text', required: true },
    { name: 'tagline', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
    { name: 'email', type: 'email', required: true },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        { name: 'platform', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    { name: 'copyrightText', type: 'text' },
    { name: 'windowTitle', type: 'text' },
  ],
};
