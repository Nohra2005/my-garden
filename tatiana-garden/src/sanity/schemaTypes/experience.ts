// src/sanity/schemaTypes/experience.ts
import { defineType, defineField } from 'sanity';

export const experienceSchema = defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  icon: () => '🔨',
  fields: [
    defineField({
      name: 'role',
      title: 'Role / Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'org',
      title: 'Organisation',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g. "Beirut" or "Sydney"',
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: '💼 Work',       value: 'work'       },
          { title: '🌱 Leadership', value: 'leadership' },
          { title: '🎓 Education',  value: 'education'  },
        ],
        layout: 'radio',
      },
      initialValue: 'work',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Start date',
      type: 'date',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End date (leave blank if current)',
      type: 'date',
    }),
    defineField({
      name: 'current',
      title: 'Currently active?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'detail',
      title: 'Short detail (one line)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'bullets',
      title: 'Bullet points',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'logo',
      title: 'Organisation logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      initialValue: 99,
    }),
  ],
  preview: {
    select: {
      title: 'role',
      subtitle: 'org',
      media: 'logo',
    },
  },
});