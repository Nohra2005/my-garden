// src/sanity/schemaTypes/corridorPhoto.ts
import { defineType, defineField } from 'sanity';

export const corridorPhotoSchema = defineType({
  name: 'corridorPhoto',
  title: 'Corridor Photos',
  type: 'document',
  icon: () => '🖼️',
  description: 'Photos displayed in the picture frames along the corridor walls.',
  fields: [
    defineField({
      name: 'title',
      title: 'Title / Caption',
      type: 'string',
      description: 'Short label shown as the frame caption (optional)',
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'frameIndex',
      title: 'Frame Position (0–5)',
      type: 'number',
      description: '0–5 map left to right, between each pair of doors',
      validation: Rule => Rule.required().min(0).max(5).integer(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      hidden: true,
    }),
  ],
  preview: {
    select: { title: 'title', media: 'image', subtitle: 'frameIndex' },
    prepare({ title, media, subtitle }) {
      return {
        title: title ?? 'Untitled photo',
        subtitle: `Frame #${subtitle}`,
        media,
      };
    },
  },
  orderings: [
    { title: 'Frame position', name: 'frameIndex', by: [{ field: 'frameIndex', direction: 'asc' }] },
  ],
});