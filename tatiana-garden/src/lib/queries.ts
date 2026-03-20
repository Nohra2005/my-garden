// src/lib/queries.ts
// All GROQ queries live here. Import and use in Server Components.

// ─── Projects ────────────────────────────────────────────────────────────────
export const PROJECTS_QUERY = `
  *[_type == "project" && featured == true] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    status,
    description,
    longDescription,
    tech,
    org,
    startDate,
    endDate,
    githubUrl,
    liveUrl,
    "coverImage": coverImage { asset->, alt, hotspot, crop },
    "gallery": gallery[] { asset->, alt, caption, hotspot, crop },
    order,
    featured,
  }
`;

// ─── Work experience (by type) ───────────────────────────────────────────────
export const EXPERIENCE_QUERY = `
  *[_type == "experience"] | order(order asc) {
    _id,
    role,
    org,
    location,
    type,
    startDate,
    endDate,
    current,
    detail,
    bullets,
    "logo": logo { asset->, hotspot, crop },
  }
`;

// ─── Skill groups ────────────────────────────────────────────────────────────
export const SKILLS_QUERY = `
  *[_type == "skillGroup"] | order(order asc) {
    _id,
    category,
    emoji,
    items,
    order,
  }
`;

// ─── Corridor photos (wall frames) ───────────────────────────────────────────
export const CORRIDOR_PHOTOS_QUERY = `
  *[_type == "corridorPhoto"] | order(frameIndex asc) {
    _id,
    title,
    frameIndex,
    "image": image { asset->, hotspot, crop },
  }
`;
export const ABOUT_QUERY = `
  *[_type == "about"][0] {
    name,
    tagline,
    subTagline,
    bio,
    "photo": photo { asset->, alt, hotspot, crop },
    languages,
    email,
    phone,
    linkedinUrl,
    githubUrl,
    nationality,
  }
`;