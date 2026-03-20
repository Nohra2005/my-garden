'use client';
// src/components/panels/AboutPanel.tsx
import { Mail, Phone, Linkedin, Github } from 'lucide-react';
import { PanelBase } from './PanelBase';
import { CORRIDOR_SECTIONS } from '@/types/corridor';
import type { About } from '@/types/sanity.types';

interface Props { about: About; isOpen: boolean; onClose: () => void; }

const SAGE      = '#2d4a22';
const SAGE_MED  = '#3d5c30';
const SAGE_LIGHT= '#5a7a48';
const SAGE_BG   = 'rgba(80,120,60,0.07)';
const SAGE_BDR  = 'rgba(80,120,60,0.2)';

export function AboutPanel({ about, isOpen, onClose }: Props) {
  return (
    <PanelBase section={CORRIDOR_SECTIONS.find(s => s.id === 'about')!} isOpen={isOpen} onClose={onClose}>

      {/* Bio */}
      {about.bio && (
        <p style={{ fontSize: 14, color: SAGE, lineHeight: 1.78,
          margin: '0 0 28px', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
          &ldquo;{about.bio}&rdquo;
        </p>
      )}

      {/* Languages */}
      {about.languages && about.languages.length > 0 && (
        <div style={{ marginBottom: 26 }}>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: SAGE_LIGHT, margin: '0 0 10px' }}>
            Languages
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {about.languages.map(l => (
              <span key={l.label} style={{
                fontSize: 12, padding: '5px 13px', borderRadius: 20,
                background: SAGE_BG, border: `1px solid ${SAGE_BDR}`,
                color: SAGE_MED, fontWeight: 500,
              }}>
                {l.label}
                {l.level && (
                  <span style={{ color: SAGE_LIGHT, fontSize: 11 }}> · {l.level}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contact */}
      <div>
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.16em',
          textTransform: 'uppercase', color: SAGE_LIGHT, margin: '0 0 10px' }}>
          Contact
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {about.email && (
            <a href={`mailto:${about.email}`}
              style={{ display: 'flex', alignItems: 'center', gap: 10,
                fontSize: 13, color: SAGE, padding: '11px 14px', borderRadius: 10,
                border: `1px solid ${SAGE_BDR}`, background: SAGE_BG,
                textDecoration: 'none', fontWeight: 500 }}>
              <Mail size={14} color={SAGE_LIGHT} />
              {about.email}
            </a>
          )}
          {about.phone && (
            <a href={`tel:${about.phone.replace(/\s/g, '')}`}
              style={{ display: 'flex', alignItems: 'center', gap: 10,
                fontSize: 13, color: SAGE, padding: '11px 14px', borderRadius: 10,
                border: `1px solid ${SAGE_BDR}`, background: SAGE_BG,
                textDecoration: 'none', fontWeight: 500 }}>
              <Phone size={14} color={SAGE_LIGHT} />
              {about.phone}
            </a>
          )}
          {about.linkedinUrl && (
            <a href={about.linkedinUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 10,
                fontSize: 13, color: SAGE, padding: '11px 14px', borderRadius: 10,
                border: `1px solid ${SAGE_BDR}`, background: SAGE_BG,
                textDecoration: 'none', fontWeight: 500 }}>
              <Linkedin size={14} color={SAGE_LIGHT} />
              LinkedIn
            </a>
          )}
          {about.githubUrl && (
            <a href={about.githubUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 10,
                fontSize: 13, color: SAGE, padding: '11px 14px', borderRadius: 10,
                border: `1px solid ${SAGE_BDR}`, background: SAGE_BG,
                textDecoration: 'none', fontWeight: 500 }}>
              <Github size={14} color={SAGE_LIGHT} />
              GitHub
            </a>
          )}
        </div>
      </div>
    </PanelBase>
  );
}