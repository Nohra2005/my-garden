# Sanity CMS Setup Guide — Tatiana's Garden

## What you're getting

- `/studio` route in your Next.js app → your private editor
- Recruiters see `yoursite.com` → the garden portfolio
- You log in at `yoursite.com/studio` with your Sanity account → full CMS editor
- Manage: Projects (with photos), Work experience, Skills, About/bio, Profile photo

---

## Step 1 — Install packages

```bash
cd tatiana-garden
npm install next-sanity @sanity/image-url @sanity/vision sanity sanity-plugin-media
```

---

## Step 2 — Create your Sanity project

1. Go to **https://sanity.io/manage**
2. Click **"New project"**
3. Name it `tatiana-garden`
4. Choose dataset: `production`
5. Copy your **Project ID** (looks like `abc12def`)

---

## Step 3 — Add environment variables

Create `.env.local` in your project root:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
```

Then open `src/sanity/config.ts` and confirm the fallback values match if needed.

---

## Step 4 — Update next.config.ts to allow Sanity image domain

```ts
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
};

export default nextConfig;
```

---

## Step 5 — Run the dev server

```bash
npm run dev
```

Visit:
- `http://localhost:3000` → your portfolio (garden)
- `http://localhost:3000/studio` → your CMS editor (Sanity Studio)

The first time you open `/studio` it will ask you to log in with your Sanity account. Only accounts you add in sanity.io/manage can log in.

---

## Step 6 — Add your content in the Studio

### Order to fill in:

1. **🌸 About & Bio** (singleton)
   - Your name, tagline, bio paragraph
   - Upload your profile photo
   - Add your 4 languages
   - Add email, phone, LinkedIn, GitHub

2. **🌱 Skill Groups** — create one document per category:
   - `🐍 Programming & ML` → Python, C++, Java, JavaScript, Verilog
   - `🤖 AI & Data` → PyTorch, scikit-learn, pandas, NumPy, MLflow, YOLOv8, CLIP
   - `☁️ Backend & Cloud` → FastAPI, Node.js, Docker, AWS ECS, Vercel, SQL
   - `🖥️ Frontend` → Next.js, React Native, Expo Go, Sanity CMS, PyQt5
   - `⚙️ Embedded` → ESP32, Raspberry Pi, Arduino, FPGA (Vivado), BLE
   - `🖨️ Prototyping` → Fusion 360, CAD, 3D Printing, Laser Cutting
   - Set `order` field: 1, 2, 3... to control display sequence

3. **🌺 Projects** — create one per project, set `Featured: true` for garden display:
   - Locus, Conut AI, Sports App, Jumanji, PyQt Shop
   - Upload cover images and gallery photos for each
   - Set GitHub/live URLs if public
   - Set `order` field to control flower sequence

4. **🔨 Experience & Leadership** — create entries for:
   - Work: Slimco (type: work), Kaizen 3D (type: work), Student World (type: work)
   - Leadership: AUB Running Club, Charity Run, Guides du Liban, Offre Joie
   - Set `order` field for display sequence

---

## Step 7 — Deploy to Vercel

### Add environment variables in Vercel:

Go to your project → Settings → Environment Variables:

```
NEXT_PUBLIC_SANITY_PROJECT_ID = your_project_id
NEXT_PUBLIC_SANITY_DATASET    = production
```

### Add your Vercel domain to Sanity CORS:

1. Go to https://sanity.io/manage → your project → API → CORS Origins
2. Add: `https://your-vercel-domain.vercel.app`
3. Check **Allow credentials**

### Deploy:
```bash
git add .
git commit -m "Add Sanity CMS integration"
git push
```

Vercel will auto-deploy. Your studio will be live at `https://yoursite.vercel.app/studio`.

---

## How content updates work

```
You edit in /studio
       ↓
Sanity stores in cloud
       ↓
Next.js revalidates every 60 seconds (ISR)
       ↓
Portfolio updates automatically
```

No redeploy needed when you update content — changes appear within 60 seconds.

---

## File structure added

```
src/
├── sanity/
│   ├── config.ts                    ← project ID, dataset
│   ├── sanity.config.ts             ← Studio config + plugins
│   └── schemaTypes/
│       ├── index.ts                 ← registers all schemas
│       ├── project.ts               ← Project schema
│       ├── experience.ts            ← Experience schema
│       ├── skillGroup.ts            ← Skill Group schema
│       └── about.ts                 ← About (singleton) schema
├── lib/
│   ├── sanity.client.ts             ← server + public read clients
│   ├── sanity.image.ts              ← image URL builder
│   └── queries.ts                   ← all GROQ queries
├── types/
│   └── sanity.types.ts              ← TypeScript types for all schemas
├── app/
│   ├── page.tsx                     ← Server Component, fetches data
│   └── studio/
│       └── [[...tool]]/
│           └── page.tsx             ← Mounts Sanity Studio at /studio
└── components/
    ├── GardenPage.tsx               ← Client Component, renders the garden
    ├── ProjectFlower.tsx            ← Now accepts coverImage, status, links
    ├── SeedPacket.tsx               ← Now accepts skills[] from Sanity
    └── Shed.tsx                     ← Now accepts about + experiences from Sanity
```

---

## Security — who can access /studio?

The studio is protected by Sanity's own auth. Only users you add at:
`https://sanity.io/manage → your project → Members`

Recruiters visiting `/studio` will see a Sanity login screen — they can't get in.
You log in with your Google/GitHub account linked to sanity.io.

No additional auth middleware needed.