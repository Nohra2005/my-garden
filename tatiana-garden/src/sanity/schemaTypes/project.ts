// src/sanity/schemaTypes/project.ts
import { defineType, defineField } from 'sanity';

export const projectSchema = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: () => '🌸',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 64 },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: '🚀 Active / In Progress', value: 'active' },
          { title: '✅ Complete',              value: 'complete' },
          { title: '🌱 Concept',               value: 'concept' },
        ],
        layout: 'radio',
      },
      initialValue: 'complete',
    }),
    defineField({
      name: 'description',
      title: 'Short description (shown on hover)',
      type: 'text',
      rows: 2,
      validation: Rule => Rule.required().max(180),
    }),
    defineField({
      name: 'longDescription',
      title: 'Full description (rich text)',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'tech',
      title: 'Tech stack tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Photo gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
            defineField({ name: 'caption', type: 'string', title: 'Caption' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
    }),
    defineField({
      name: 'liveUrl',
      title: 'Live / demo URL',
      type: 'url',
    }),
    defineField({
      name: 'org',
      title: 'Organisation / Context',
      type: 'string',
      description: 'e.g. "American University of Beirut · AI in Industry"',
    }),
    defineField({
      name: 'startDate',
      title: 'Start date',
      type: 'date',
    }),
    defineField({
      name: 'endDate',
      title: 'End date (leave blank if ongoing)',
      type: 'date',
    }),
    defineField({
      name: 'order',
      title: 'Display order (lower = first)',
      type: 'number',
      initialValue: 99,
    }),
    defineField({
      name: 'featured',
      title: 'Featured (shown in garden)',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'org', media: 'coverImage' },
  },
});