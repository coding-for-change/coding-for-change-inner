import { CollectionConfig } from 'payload';

export const FAQ: CollectionConfig = {
  slug: 'faq',
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'category'],
  },
  access: {
    read: () => true,
  },
  labels: {
    singular: 'FAQ',
    plural: 'FAQs',
  },
  fields: [
    { name: 'question', type: 'text', required: true, localized: true },
    { name: 'answer', type: 'textarea', required: true, localized: true },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'General', value: 'general' },
        { label: 'About', value: 'about' },
        { label: 'Membership', value: 'membership' },
        { label: 'Projects', value: 'projects' },
        { label: 'Technical', value: 'technical' },
      ],
    },
  ],
};
