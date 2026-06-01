import { GlobalConfig } from 'payload';

export const Legal: GlobalConfig = {
  slug: 'legal',
  label: 'Legal (Imprint & Privacy)',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'impressum',
      type: 'richText',
      required: true,
      localized: true,
      label: 'Impressum',
    },
    {
      name: 'privacyPolicy',
      type: 'richText',
      required: true,
      localized: true,
      label: 'Datenschutzerklärung (Privacy Policy)',
    },
  ],
};
