// src/sanity/config.ts
// Replace YOUR_PROJECT_ID with the one from sanity.io/manage after creating your project
// Replace YOUR_DATASET with "production" (default)

export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'YOUR_PROJECT_ID',
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET   ?? 'production',
  apiVersion: '2024-01-01', // keep this fixed — update manually when needed
  useCdn: process.env.NODE_ENV === 'production', // CDN in prod, live API in dev
} as const;