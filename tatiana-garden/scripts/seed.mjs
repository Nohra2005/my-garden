// scripts/seed.mjs
// Usage:
//   node scripts/seed.mjs          — adds data (safe to run on empty project)
//   node scripts/seed.mjs --clean  — deletes ALL existing docs first, then seeds fresh
//
// Requires in .env.local:
//   NEXT_PUBLIC_SANITY_PROJECT_ID=...
//   NEXT_PUBLIC_SANITY_DATASET=production
//   SANITY_WRITE_TOKEN=...  (Editor token from sanity.io/manage → API → Tokens)

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter(l => l.includes('='))
    .map(l => { const [k, ...v] = l.split('='); return [k.trim(), v.join('=').trim()]; })
);

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:   env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const CLEAN = process.argv.includes('--clean');

// ─── Skills — intersection over union, mutually exclusive categories ──────────
const SKILLS = [
  { _type: 'skillGroup', order: 1, category: 'Programming Languages', emoji: '🐍',
    items: ['Python', 'C++', 'Java', 'JavaScript', 'Verilog'] },
  { _type: 'skillGroup', order: 2, category: 'AI & Data', emoji: '🤖',
    items: ['PyTorch', 'scikit-learn', 'pandas', 'NumPy', 'MLflow', 'YOLOv8', 'CLIP'] },
  { _type: 'skillGroup', order: 3, category: 'Backend & Cloud', emoji: '☁️',
    items: ['FastAPI', 'Node.js', 'Docker', 'AWS ECS', 'Vercel', 'SQL', 'SQLite'] },
  { _type: 'skillGroup', order: 4, category: 'Frontend', emoji: '🖥️',
    items: ['Next.js', 'React Native', 'Expo Go', 'Sanity CMS', 'PyQt5'] },
  { _type: 'skillGroup', order: 5, category: 'Embedded & Hardware', emoji: '⚙️',
    items: ['ESP32', 'Raspberry Pi', 'Arduino', 'FPGA (Vivado)', 'BLE', 'Linux/Unix'] },
  { _type: 'skillGroup', order: 6, category: 'Prototyping & Design', emoji: '🖨️',
    items: ['Fusion 360', 'CAD', '3D Printing', 'Laser Cutting'] },
  { _type: 'skillGroup', order: 7, category: 'Dev Tools & IDEs', emoji: '🛠️',
    items: ['IntelliJ', 'Android Studio', 'VS Code', 'Git', 'GitHub', 'Postman', 'Grafana', 'Prometheus'] },
];

const PROJECTS = [
  { _type: 'project', order: 1, featured: true, status: 'active',
    title: 'Locus', slug: { _type: 'slug', current: 'locus' },
    org: 'American University of Beirut · AI in Industry', startDate: '2026-01-01',
    description: 'Computer vision PWA — shoppers upload a photo and find matching items across nearby stores. Microservices backend on AWS ECS with YOLOv8, CLIP ViT-B/16, and Qdrant vector search.',
    tech: ['YOLOv8', 'CLIP ViT-B/16', 'FastAPI', 'AWS ECS', 'Qdrant', 'Docker'] },
  { _type: 'project', order: 2, featured: true, status: 'complete',
    title: 'Conut AI', slug: { _type: 'slug', current: 'conut-ai' },
    org: 'AUB · AI Engineering Hackathon', startDate: '2026-02-01', endDate: '2026-02-28',
    description: 'AI ops platform for a multi-branch F&B business — 5 FastAPI microservices covering demand forecasting, combo optimisation, growth strategy, expansion planning, and staff scheduling. Integrated with OpenClaw for plain-language insights.',
    tech: ['FastAPI', 'Microservices', 'OpenClaw', 'Python', 'LLM Agents'] },
  { _type: 'project', order: 3, featured: true, status: 'active',
    title: 'Sports Booking App', slug: { _type: 'slug', current: 'sports-booking-app' },
    org: 'Independent Startup', startDate: '2025-12-01',
    description: 'Sports court booking platform with a skill-based matchmaking algorithm. Built with React Native, Node.js, and Expo Go. Currently in beta outreach to court owners across Lebanon.',
    tech: ['React Native', 'Node.js', 'Expo Go'] },
  { _type: 'project', order: 4, featured: true, status: 'complete',
    title: 'Jumanji', slug: { _type: 'slug', current: 'jumanji' },
    org: 'University of Sydney', startDate: '2025-09-01', endDate: '2025-10-31',
    description: 'AI-integrated smart board game with ESP32/Raspberry Pi, 24+ sensors, 4 servos, and a BLE die. Used Gemini API for dynamic trivia and challenge generation.',
    tech: ['ESP32', 'Raspberry Pi', 'BLE', 'Gemini API', '24+ Sensors'] },
  { _type: 'project', order: 5, featured: true, status: 'complete',
    title: 'PyQt Online Shop', slug: { _type: 'slug', current: 'pyqt-online-shop' },
    org: 'AUB · Networks and Communication Course', startDate: '2024-10-01', endDate: '2024-11-30',
    description: 'Multithreaded desktop shop app with cart, messaging, and product management. PyQt5 with a 5-table SQLite database, built as part of a 3-member team.',
    tech: ['PyQt5', 'SQLite', 'Multithreading', 'Python'] },
];

const EXPERIENCE = [
  { _type: 'experience', type: 'work', order: 1, current: true,
    role: 'Web Developer', org: 'Slimco Trading Company', location: 'Beirut', startDate: '2025-10-01',
    detail: 'Leading migration to Next.js + headless CMS pipeline + serverless Vercel deployment.',
    bullets: ['Migrating legacy site to Next.js + Sanity CMS', 'Serverless deployment on Vercel'] },
  { _type: 'experience', type: 'work', order: 2, current: true,
    role: 'Co-Founder', org: 'Kaizen 3D Solutions', location: 'Beirut', startDate: '2025-11-01',
    detail: '3D printing startup supplying custom items to local art workshops — Fusion 360 design to delivery.',
    bullets: ['Custom 3D-printed items for art workshops', 'Full lifecycle: Fusion 360 → print → delivery'] },
  { _type: 'experience', type: 'work', order: 3, current: false,
    role: 'AI Integration Intern', org: 'Student World', location: 'Sydney',
    startDate: '2025-08-01', endDate: '2025-10-31',
    detail: 'Diagnosed CRM issues on Microsoft Azure, improved the StudyLink API pipeline.',
    bullets: ['Traced data flow on Microsoft Azure', 'Improved StudyLink API pipeline reliability'] },
  { _type: 'experience', type: 'leadership', order: 1, current: true,
    role: 'Founder & President', org: 'AUB Running Club', location: 'Beirut', startDate: '2024-03-01',
    detail: 'Founded a 50+ member community, organising weekly runs and charity events.' },
  { _type: 'experience', type: 'leadership', order: 2, current: false,
    role: 'Charity Run Organiser', org: 'Self-organised', location: 'Beirut',
    startDate: '2024-10-01', endDate: '2024-11-30',
    detail: 'Organised a 10 km charity run supporting war survivors and cancer patients.' },
  { _type: 'experience', type: 'leadership', order: 3, current: false,
    role: 'Unit Leader', org: 'Guides du Liban', location: 'Lebanon',
    startDate: '2023-09-01', endDate: '2025-09-01',
    detail: 'Mentored a group of 17–18-year-old girls in leadership development.' },
  { _type: 'experience', type: 'leadership', order: 4, current: false,
    role: 'Volunteer', org: 'Offre Joie', location: 'Beirut',
    startDate: '2020-08-01', endDate: '2020-08-31',
    detail: 'Contributed to post-Beirut Port explosion rebuilding efforts.' },
];

const ABOUT = {
  _type: 'about', _id: 'singleton-about',
  name: 'Tatiana Nohra',
  tagline: "CS & Engineering · AI Specialist · US Citizen · Valedictorian '23",
  bio: "Computer Science & Engineering student at AUB who gets too excited about making things actually work — from computer vision pipelines to board games with 24 sensors. I love sports, I love building efficient systems, and I think AI is most interesting when it solves something real. I've studied in Beirut and Sydney, speak four languages, and I do my best work when the problem doesn't have an obvious solution yet.",
  email: 'tatiananohra5@gmail.com',
  phone: '+961 81 879 612',
  linkedinUrl: 'https://linkedin.com/in/tatiana-nohra',
  nationality: 'US Citizen',
  languages: [
    { _key: 'en', label: '🇬🇧 English', level: 'Fluent' },
    { _key: 'fr', label: '🇫🇷 French',  level: 'Fluent' },
    { _key: 'ar', label: '🇱🇧 Arabic',  level: 'Fluent' },
    { _key: 'ru', label: '🇷🇺 Russian', level: 'Fluent' },
  ],
};

async function deleteAll() {
  console.log('🧹 Cleaning existing documents...');
  for (const type of ['project', 'experience', 'skillGroup']) {
    const docs = await client.fetch(`*[_type == "${type}"]{ _id }`);
    for (const doc of docs) {
      await client.delete(doc._id);
      console.log(`  deleted ${doc._id}`);
    }
  }
  console.log('✅ Clean done\n');
}

async function seed() {
  if (CLEAN) await deleteAll();

  console.log('🌱 Seeding...\n');

  await client.createOrReplace(ABOUT);
  console.log('✅ About');

  for (const p of PROJECTS) {
    await client.create(p);
    console.log(`✅ Project: ${p.title}`);
  }

  for (const e of EXPERIENCE) {
    await client.create(e);
    console.log(`✅ Experience: ${e.role} @ ${e.org}`);
  }

  for (const s of SKILLS) {
    await client.create(s);
    console.log(`✅ Skills: ${s.emoji} ${s.category}`);
  }

  console.log('\n🌸 Done! Go to /studio and publish all drafts.');
  console.log('💡 Tip: next time run with --clean to reset: node scripts/seed.mjs --clean');
}

seed().catch(err => { console.error('❌', err.message); process.exit(1); });
