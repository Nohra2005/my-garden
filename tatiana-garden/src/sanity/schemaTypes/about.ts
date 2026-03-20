// src/sanity/schemaTypes/about.ts
import { defineType, defineField } from 'sanity';

export const aboutSchema = defineType({
  name: 'about',
  title: 'About / Bio',
  type: 'document',
  icon: () => '🌸',
  fields: [
    defineField({
      name: 'name',
      title: 'Full name',
      type: 'string',
      initialValue: 'Tatiana Nohra',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline (under the name)',
      type: 'string',
      description: 'e.g. "CS & Engineering · AI Specialist · US Citizen"',
    }),
    defineField({
      name: 'subTagline',
      title: 'Sub-tagline (italic, smaller)',
      type: 'string',
      description: 'e.g. "Presidential Merit Scholar at AUB · Exchange at the University of Sydney"',
    }),
    defineField({
      name: 'bio',
      title: 'Bio paragraph',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'photo',
      title: 'Profile photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'languages',
      title: 'Languages (with flag emoji)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', title: 'Label', description: 'e.g. "🇬🇧 English"' }),
            defineField({ name: 'level', type: 'string', title: 'Level', description: 'e.g. "Fluent"' }),
          ],
          preview: { select: { title: 'label', subtitle: 'level' } },
        },
      ],
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
    }),
    defineField({
      name: 'nationality',
      title: 'Nationality / Citizenship notes',
      type: 'string',
      description: 'e.g. "US Citizen"',
    }),
  ],
  preview: {
    select: { title: 'name', media: 'photo' },
  },
});