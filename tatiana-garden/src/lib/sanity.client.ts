// src/lib/sanity.client.ts
import { createClient } from 'next-sanity';
import { sanityConfig } from '@/sanity/config';

// Server-side read client (used in Server Components & generateStaticParams)
export const sanityClient = createClient({
  ...sanityConfig,
  useCdn: false, // always fresh on server
});

// Public read client (used in Client Components — no token needed, read-only)
export const publicClient = createClient({
  ...sanityConfig,
  useCdn: sanityConfig.useCdn,
});