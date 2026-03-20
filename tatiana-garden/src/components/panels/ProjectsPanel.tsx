'use client';
// src/components/panels/ProjectsPanel.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity.image';
import { PanelBase } from './PanelBase';
import { CORRIDOR_SECTIONS } from '@/types/corridor';
import type { Project } from '@/types/sanity.types';

interface Props { projects: Project[]; isOpen: boolean; onClose: () => void; }

const S  = '#2d4a22';
const SM = '#3d5c30';
const SL = '#5a7a48';
const BG = 'rgba(80,120,60,0.07)';
const BD = 'rgba(80,120,60,0.18)';

function ProjectCard({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false);
  const coverUrl = project.coverImage
    ? urlFor(project.coverImage).width(520).height(220).fit('crop').url()
    : null;

  return (
    <motion.div layout style={{
      background: BG, borderRadius: 12,
      border: `1px solid ${BD}`, overflow: 'hidden', marginBottom: 8,
    }}>
      <button onClick={() => setExpanded(e => !e)}
        style={{ width: '100%', padding: '13px 15px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', background: 'none', border: 'none',
          cursor: 'pointer', gap: 10 }}>
        <div style={{ textAlign: 'left', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: S, fontFamily: 'Georgia, serif' }}>
              {project.title}
            </span>
            {project.status === 'active' && (
              <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 10,
                background: 'rgba(80,120,60,0.12)', color: SM,
                fontWeight: 700, letterSpacing: '0.06em' }}>
                ACTIVE
              </span>
            )}
          </div>
          <p style={{ fontSize: 11, color: SL, margin: 0 }}>
            {project.tech?.slice(0, 4).join(' · ')}
          </p>
        </div>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} color={SL}/>
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            style={{ overflow: 'hidden' }}>
            <div style={{ borderTop: `1px solid ${BD}` }}>
              {/* Cover image from Sanity */}
              {coverUrl && (
                <div style={{ position: 'relative', width: '100%', height: 160 }}>
                  <Image src={coverUrl} alt={project.title} fill
                    style={{ objectFit: 'cover' }} sizes="520px"/>
                </div>
              )}
              <div style={{ padding: '12px 15px 15px' }}>
                <p style={{ fontSize: 13, color: SM, lineHeight: 1.65,
                  margin: '0 0 10px', fontFamily: 'Georgia, serif' }}>
                  {project.description}
                </p>
                {project.org && (
                  <p style={{ fontSize: 11, color: SL, margin: '0 0 10px' }}>
                    {project.org}
                  </p>
                )}
                {project.tech && project.tech.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
                    {project.tech.map(t => (
                      <span key={t} style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20,
                        background: 'rgba(80,120,60,0.1)', color: SM,
                        border: `1px solid ${BD}` }}>{t}</span>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8 }}>
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: 5,
                        fontSize: 11, color: SM, padding: '5px 12px', borderRadius: 20,
                        border: `1px solid ${BD}`, textDecoration: 'none',
                        background: 'rgba(80,120,60,0.08)' }}>
                      <Github size={11}/> GitHub
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: 5,
                        fontSize: 11, color: 'white', padding: '5px 12px', borderRadius: 20,
                        border: 'none', textDecoration: 'none', background: '#5a7a48' }}>
                      <ExternalLink size={11}/> Live
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function ProjectsPanel({ projects, isOpen, onClose }: Props) {
  return (
    <PanelBase section={CORRIDOR_SECTIONS.find(s => s.id === 'projects')!} isOpen={isOpen} onClose={onClose}>
      {projects.length === 0 && (
        <p style={{ color: SL, fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 13 }}>
          No projects yet — add them in Sanity Studio under 🌺 Projects.
        </p>
      )}
      <p style={{ fontSize: 12, color: SL, marginBottom: 14,
        fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
        Click any project to expand details.
      </p>
      {projects.map(p => <ProjectCard key={p._id} project={p}/>)}
    </PanelBase>
  );
}