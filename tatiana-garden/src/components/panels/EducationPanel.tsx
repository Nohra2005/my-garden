'use client';
// src/components/panels/EducationPanel.tsx
import { urlFor } from '@/lib/sanity.image';
import Image from 'next/image';
import { PanelBase } from './PanelBase';
import { CORRIDOR_SECTIONS } from '@/types/corridor';
import type { Experience } from '@/types/sanity.types';

interface Props { experiences: Experience[]; isOpen: boolean; onClose: () => void; }

const S  = '#2d4a22';
const SM = '#3d5c30';
const SL = '#5a7a48';
const BG = 'rgba(80,120,60,0.07)';
const BD = 'rgba(80,120,60,0.18)';

function fmtYear(d?: string) {
  if (!d) return 'present';
  return new Date(d).getFullYear().toString();
}

export function EducationPanel({ experiences, isOpen, onClose }: Props) {
  const items = experiences.filter(e => e.type === 'education')
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  return (
    <PanelBase section={CORRIDOR_SECTIONS.find(s => s.id === 'education')!} isOpen={isOpen} onClose={onClose}>
      {items.length === 0 && (
        <p style={{ color: SL, fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 13 }}>
          No education entries yet — add them in Sanity Studio under 🎓 Education.
        </p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(ed => {
          const logoUrl = ed.logo?.asset ? urlFor(ed.logo).width(96).height(96).fit('crop').url() : null;
          return (
            <div key={ed._id} style={{
              padding: '16px 18px', borderRadius: 12,
              background: BG, border: `1px solid ${BD}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 8 }}>
                {/* Only show logo if uploaded in Sanity */}
                {logoUrl && (
                  <Image src={logoUrl} alt={ed.org} width={48} height={48}
                    style={{ borderRadius: 10, objectFit: 'contain',
                      border: `1px solid ${BD}`, flexShrink: 0,
                      background: 'rgba(80,120,60,0.05)', padding: 4 }}/>
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: 14, fontWeight: 700,
                    color: S, margin: '0 0 2px' }}>{ed.org}</p>
                  <p style={{ fontSize: 12, color: SM, margin: '0 0 2px', fontWeight: 600 }}>{ed.role}</p>
                  <p style={{ fontSize: 11, color: SL, margin: 0 }}>
                    {fmtYear(ed.startDate)} – {ed.current ? 'present' : fmtYear(ed.endDate)}
                  </p>
                </div>
              </div>
              {ed.detail && (
                <p style={{ fontSize: 12, color: SM, fontStyle: 'italic',
                  margin: '0 0 6px', lineHeight: 1.55, fontFamily: 'Georgia, serif' }}>
                  {ed.detail}
                </p>
              )}
              {ed.bullets && ed.bullets.length > 0 && (
                <ul style={{ margin: '4px 0 0', paddingLeft: 16 }}>
                  {ed.bullets.map((b, i) => (
                    <li key={i} style={{ fontSize: 12, color: SM, lineHeight: 1.5, marginBottom: 2 }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </PanelBase>
  );
}