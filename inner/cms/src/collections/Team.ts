import { CollectionConfig } from 'payload';

export const Team: CollectionConfig = {
  slug: 'team',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'category'],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', required: true, localized: true },
    {
      // Splits the Team page into the core team and a separate "Advisers"
      // section. Defaults to a regular member.
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'member',
      options: [
        { label: 'Team member', value: 'member' },
        { label: 'Adviser', value: 'adviser' },
      ],
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'bio', type: 'textarea', required: true, localized: true },
    {
      name: 'links',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      // Companies this person has worked at. Their logos are revealed on the
      // Team page when hovering the person's card.
      name: 'companies',
      type: 'relationship',
      relationTo: 'companies',
      hasMany: true,
    },
  ],
};
