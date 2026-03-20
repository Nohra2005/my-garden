// src/lib/sanity.image.ts
import imageUrlBuilder from '@sanity/image-url';
import { sanityConfig } from '@/sanity/config';
import { createClient } from 'next-sanity';

const client = createClient(sanityConfig);
const builder = imageUrlBuilder(client);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source);
}