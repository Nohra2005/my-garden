// src/sanity/schemaTypes/skillGroup.ts
import { defineType, defineField } from 'sanity';

export const skillGroupSchema = defineType({
  name: 'skillGroup',
  title: 'Skill Group',
  type: 'document',
  icon: () => '🌱',
  fields: [
    defineField({
      name: 'category',
      title: 'Category name',
      type: 'string',
      description: 'e.g. "AI & Data", "Embedded & Hardware"',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'emoji',
      title: 'Emoji icon',
      type: 'string',
      description: 'Single emoji, e.g. 🤖',
      initialValue: '🌿',
    }),
    defineField({
      name: 'items',
      title: 'Skills',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      validation: Rule => Rule.required().min(1),
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      initialValue: 99,
    }),
  ],
  preview: {
    select: { title: 'category', subtitle: 'emoji' },
    prepare(selection) {
      const { title, subtitle } = selection as { title: string; subtitle: string };
      return { title: `${subtitle ?? ''} ${title}` };
    },
  },
});