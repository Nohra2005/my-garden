// src/app/page.tsx — Server Component, fetches from Sanity, no fallback mix
import { sanityClient } from '@/lib/sanity.client';
import { PROJECTS_QUERY, SKILLS_QUERY, ABOUT_QUERY, EXPERIENCE_QUERY, CORRIDOR_PHOTOS_QUERY } from '@/lib/queries';
import type { Project, SkillGroup, About, Experience, CorridorPhoto } from '@/types/sanity.types';
import { CorridorPage } from '@/components/corridor/CorridorPage';

// Static fallback — only used when Sanity project ID is not configured at all
const FALLBACK_PROJECTS: Project[] = [
  { _id: '1', title: 'Locus',            slug: 'locus',            status: 'active',   order: 1, featured: true, description: 'Computer vision PWA — shoppers upload a photo to find matching items across nearby stores.', tech: ['YOLOv8','CLIP ViT-B/16','FastAPI','AWS ECS','Qdrant','Docker'] },
  { _id: '2', title: 'Conut AI',         slug: 'conut-ai',         status: 'complete', order: 2, featured: true, description: 'AI ops platform for multi-branch F&B — 5 microservices + conversational agent.', tech: ['FastAPI','Microservices','OpenClaw','Python'] },
  { _id: '3', title: 'Sports Booking',   slug: 'sports-booking',   status: 'active',   order: 3, featured: true, description: 'Sports court booking & skill-based matchmaking platform.', tech: ['React Native','Node.js','Expo Go'] },
  { _id: '4', title: 'Jumanji',          slug: 'jumanji',          status: 'complete', order: 4, featured: true, description: 'AI-integrated smart board game — ESP32, 24+ sensors, BLE die, Gemini API.', tech: ['ESP32','Raspberry Pi','BLE','Gemini API'] },
  { _id: '5', title: 'PyQt Online Shop', slug: 'pyqt-online-shop', status: 'complete', order: 5, featured: true, description: 'Multithreaded desktop shop with cart, messaging, and 5-table SQLite database.', tech: ['PyQt5','SQLite','Python'] },
];

const FALLBACK_SKILLS: SkillGroup[] = [
  { _id: 's1', category: 'Programming Languages', emoji: '🐍', order: 1, items: ['Python','C++','Java','JavaScript','Verilog'] },
  { _id: 's2', category: 'AI & Data',             emoji: '🤖', order: 2, items: ['PyTorch','scikit-learn','pandas','NumPy','MLflow','YOLOv8','CLIP'] },
  { _id: 's3', category: 'Backend & Cloud',        emoji: '☁️', order: 3, items: ['FastAPI','Node.js','Docker','AWS ECS','Vercel','SQL','SQLite'] },
  { _id: 's4', category: 'Frontend',              emoji: '🖥️', order: 4, items: ['Next.js','React Native','Expo Go','Sanity CMS','PyQt5'] },
  { _id: 's5', category: 'Embedded & Hardware',   emoji: '⚙️', order: 5, items: ['ESP32','Raspberry Pi','Arduino','FPGA (Vivado)','BLE','Linux/Unix'] },
  { _id: 's6', category: 'Prototyping & Design',  emoji: '🖨️', order: 6, items: ['Fusion 360','CAD','3D Printing','Laser Cutting'] },
  { _id: 's7', category: 'Dev Tools & IDEs',      emoji: '🛠️', order: 7, items: ['IntelliJ','Android Studio','VS Code','Git','GitHub','Postman'] },
];

const FALLBACK_ABOUT: About = {
  name: 'Tatiana Nohra',
  tagline: "CS & Engineering · AI Specialist · US Citizen · Valedictorian '23",
  bio: "Computer Science & Engineering student at AUB who gets too excited about making things actually work — from computer vision pipelines to board games with 24 sensors. I love sports, I love building efficient systems, and I think AI is most interesting when it solves something real.",
  languages: [
    { label: '🇬🇧 English', level: 'Fluent' },
    { label: '🇫🇷 French',  level: 'Fluent' },
    { label: '🇱🇧 Arabic',  level: 'Fluent' },
    { label: '🇷🇺 Russian', level: 'Fluent' },
  ],
  email: 'tatiananohra5@gmail.com',
  phone: '+961 81 879 612',
  linkedinUrl: 'https://linkedin.com/in/tatiana-nohra',
};

const FALLBACK_EXPERIENCE: Experience[] = [
  { _id: 'e1', role: 'Web Developer',       org: 'Slimco Trading Company', location: 'Beirut', type: 'work',       startDate: '2025-10-01', current: true,  detail: 'Leading migration to Next.js + headless CMS + serverless Vercel deployment.' },
  { _id: 'e2', role: 'Co-Founder',          org: 'Kaizen 3D Solutions',    location: 'Beirut', type: 'work',       startDate: '2025-11-01', current: true,  detail: '3D printing startup — Fusion 360 design to delivery.' },
  { _id: 'e3', role: 'AI Integration Intern', org: 'Student World',        location: 'Sydney', type: 'work',       startDate: '2025-08-01', endDate: '2025-10-31', current: false, detail: 'Diagnosed CRM issues on Azure, improved StudyLink API pipeline.' },
  { _id: 'e4', role: 'Founder & President', org: 'AUB Running Club',       location: 'Beirut', type: 'leadership', startDate: '2024-03-01', current: true,  detail: '50+ member community, weekly runs & charity events.' },
  { _id: 'e5', role: 'Unit Leader',         org: 'Guides du Liban',        location: 'Lebanon',type: 'leadership', startDate: '2023-09-01', endDate: '2025-09-01', current: false, detail: 'Mentored 17–18-year-old girls in leadership development.' },
];

async function getData() {
  const isConfigured = sanityClient.config().projectId !== 'YOUR_PROJECT_ID';

  if (!isConfigured) {
    return { projects: FALLBACK_PROJECTS, skills: FALLBACK_SKILLS, about: FALLBACK_ABOUT, experiences: FALLBACK_EXPERIENCE, corridorPhotos: [] };
  }

  try {
    const [projects, skills, about, experiences, corridorPhotos] = await Promise.all([
      sanityClient.fetch<Project[]>      (PROJECTS_QUERY),
      sanityClient.fetch<SkillGroup[]>   (SKILLS_QUERY),
      sanityClient.fetch<About>          (ABOUT_QUERY),
      sanityClient.fetch<Experience[]>   (EXPERIENCE_QUERY),
      sanityClient.fetch<CorridorPhoto[]>(CORRIDOR_PHOTOS_QUERY),
    ]);
    return {
      projects:       projects?.length    ? projects    : FALLBACK_PROJECTS,
      skills:         skills?.length      ? skills      : FALLBACK_SKILLS,
      about:          about?.name         ? about       : FALLBACK_ABOUT,
      experiences:    experiences?.length ? experiences : FALLBACK_EXPERIENCE,
      corridorPhotos: corridorPhotos ?? [],
    };
  } catch {
    return { projects: FALLBACK_PROJECTS, skills: FALLBACK_SKILLS, about: FALLBACK_ABOUT, experiences: FALLBACK_EXPERIENCE, corridorPhotos: [] };
  }
}

export const revalidate = 60;

export default async function Home() {
  const { projects, skills, about, experiences, corridorPhotos } = await getData();
  return <CorridorPage projects={projects} skills={skills} about={about} experiences={experiences} corridorPhotos={corridorPhotos} />;
}