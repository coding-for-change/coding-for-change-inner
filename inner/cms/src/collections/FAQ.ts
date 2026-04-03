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
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'General', value: 'general' },
        { label: 'Membership', value: 'membership' },
        { label: 'Projects', value: 'projects' },
        { label: 'Technical', value: 'technical' },
      ],
    },
  ],
};
