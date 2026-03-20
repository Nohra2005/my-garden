// src/types/sanity.types.ts

export interface SanityImageAsset {
  _ref?: string;
  url?: string;
  hotspot?: { x: number; y: number; width: number; height: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

export interface SanityImage {
  asset: SanityImageAsset;
  alt?: string;
  caption?: string;
  hotspot?: { x: number; y: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

export type ProjectStatus = 'active' | 'complete' | 'concept';

export interface Project {
  _id: string;
  title: string;
  slug: string;
  status: ProjectStatus;
  description: string;
  longDescription?: unknown[];
  tech?: string[];
  org?: string;
  startDate?: string;
  endDate?: string;
  githubUrl?: string;
  liveUrl?: string;
  coverImage?: SanityImage;
  gallery?: SanityImage[];
  order: number;
  featured: boolean;
}

export type ExperienceType = 'work' | 'leadership' | 'education';

export interface Experience {
  _id: string;
  role: string;
  org: string;
  location?: string;
  type: ExperienceType;
  startDate: string;
  endDate?: string;
  current: boolean;
  detail?: string;
  bullets?: string[];
  logo?: SanityImage;
}

export interface SkillGroup {
  _id: string;
  category: string;
  emoji?: string;
  items: string[];
  order: number;
}

export interface Language {
  label: string;
  level?: string;
}

export interface CorridorPhoto {
  _id: string;
  title?: string;
  frameIndex: number;
  image: SanityImage;
}

export interface About {
  name: string;
  tagline?: string;
  subTagline?: string;
  bio?: string;
  photo?: SanityImage;
  languages?: Language[];
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  nationality?: string;
}