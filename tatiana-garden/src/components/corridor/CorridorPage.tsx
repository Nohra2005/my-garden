'use client';
// src/components/corridor/CorridorPage.tsx
import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';
import { HUD } from '@/components/ui/HUD';
import { MobileControls } from '@/components/ui/MobileControls';
import { AboutPanel }      from '@/components/panels/AboutPanel';
import { ProjectsPanel }   from '@/components/panels/ProjectsPanel';
import { SkillsPanel }     from '@/components/panels/SkillsPanel';
import { EducationPanel }  from '@/components/panels/EducationPanel';
import { ExperiencePanel }  from '@/components/panels/ExperiencePanel';
import { LeadershipPanel }  from '@/components/panels/LeadershipPanel';
import { ContactPanel }    from '@/components/panels/ContactPanel';
import {
  CORRIDOR_SECTIONS,
  CAMERA_START_Z,
  CAMERA_END_Z,
  type SectionId,
} from '@/types/corridor';
import type { Project, SkillGroup, About, Experience, CorridorPhoto } from '@/types/sanity.types';

// ─── Loading screen (must be defined BEFORE dynamic import references it) ────
function LoadingScreen() {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#e8e4d4',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 48, height: 48, border: '2px solid rgba(255,255,255,0.1)',
        borderTop: '2px solid rgba(255,255,255,0.8)', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: 'rgba(60,90,40,0.65)', marginTop: 20, fontSize: 12,
        letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: 'Georgia, serif' }}>
        Loading corridor…
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Dynamic import — Three.js cannot run on the server ──────────────────────
const CorridorScene = dynamic<{
  onCameraZChange: (z: number) => void;
  onSectionOpen: (id: SectionId) => void;
  corridorPhotos: CorridorPhoto[];
}>(
  () => import('./CorridorScene'),
  { ssr: false, loading: () => <LoadingScreen /> }
);

interface Props {
  projects:       Project[];
  skills:         SkillGroup[];
  about:          About;
  experiences:    Experience[];
  corridorPhotos: CorridorPhoto[];
}

export function CorridorPage({ projects, skills, about, experiences, corridorPhotos }: Props) {
  const [cameraZ,       setCameraZ]       = useState(CAMERA_START_Z);
  const [openSection,   setOpenSection]   = useState<SectionId | null>(null);

  // Derive which section the camera is nearest to
  const nearestSection = CORRIDOR_SECTIONS.find(s => {
    const dist = Math.abs(cameraZ - s.zPos);
    return dist < 3.5;
  });

  const cameraProgress = (CAMERA_START_Z - cameraZ) / (CAMERA_START_Z - CAMERA_END_Z);

  const handleSectionOpen = useCallback((id: SectionId) => {
    setOpenSection(id);
  }, []);

  const handleClose = useCallback(() => {
    setOpenSection(null);
    // Tell the 3D scene to close the door
    window.dispatchEvent(new CustomEvent('corridor:closedoor'));
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden',
      position: 'relative', background: '#e8e4d4' }}>

      {/* Three.js canvas fills everything */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <CorridorScene
          onCameraZChange={setCameraZ}
          onSectionOpen={handleSectionOpen}
          corridorPhotos={corridorPhotos}
        />
      </div>

      {/* Name + title — fixed top */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px', pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(232,228,212,0.9) 0%, transparent 100%)' }}>
        <div>
          <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(60,90,40,0.65)', margin: '0 0 1px', fontFamily: 'Georgia, serif' }}>
            Portfolio
          </p>
          <p style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 16,
            color: '#2d4a22', margin: 0 }}>
            {about.name ?? 'Tatiana Nohra'}
          </p>
        </div>
        {/* Tagline — hidden on mobile */}
        <p className="hidden sm:block" style={{ fontSize: 10, color: 'rgba(60,90,40,0.55)',
          margin: 0, letterSpacing: '0.05em', fontFamily: 'Georgia, serif',
          maxWidth: 320, textAlign: 'right' }}>
          {about.tagline ?? "CS & Engineering · AI Specialist · AUB"}
        </p>
      </div>

      {/* HUD overlays */}
      <HUD
        activeSectionId={nearestSection?.id ?? null}
        cameraProgress={Math.max(0, Math.min(1, cameraProgress))}
      />

      {/* Keyboard hint — desktop only */}
      <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
        zIndex: 20, textAlign: 'center', pointerEvents: 'none' }}
        className="hidden md:block">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14,
          color: 'rgba(60,90,40,0.4)', fontSize: 11, letterSpacing: '0.1em',
          textTransform: 'uppercase', fontFamily: 'Georgia, serif' }}>
          <span>↑↓ Move</span>
          <span style={{ color: 'rgba(60,90,40,0.15)' }}>·</span>
          <span>←→ Turn</span>
          <span style={{ color: 'rgba(60,90,40,0.15)' }}>·</span>
          <span>Enter · Click to open</span>
        </div>
      </div>

      {/* Mobile touch controls — visible on mobile only */}
      <MobileControls
        nearestSectionId={nearestSection?.id ?? null}
        onOpen={() => nearestSection && handleSectionOpen(nearestSection.id)}
      />

      {/* Content panels — HTML overlays */}
      <AboutPanel
        about={about}
        isOpen={openSection === 'about'}
        onClose={handleClose}
      />
      <ProjectsPanel
        projects={projects}
        isOpen={openSection === 'projects'}
        onClose={handleClose}
      />
      <SkillsPanel
        skills={skills}
        isOpen={openSection === 'skills'}
        onClose={handleClose}
      />
      <EducationPanel
        experiences={experiences}
        isOpen={openSection === 'education'}
        onClose={handleClose}
      />
      <ExperiencePanel
        experiences={experiences}
        isOpen={openSection === 'experience'}
        onClose={handleClose}
      />
      <LeadershipPanel
        experiences={experiences}
        isOpen={openSection === 'leadership'}
        onClose={handleClose}
      />
      <ContactPanel
        about={about}
        isOpen={openSection === 'contact'}
        onClose={handleClose}
      />
    </div>
  );
}