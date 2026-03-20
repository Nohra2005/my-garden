'use client';
// src/components/panels/ExperiencePanel.tsx — Work only
import Image from 'next/image';
import { urlFor } from '@/lib/sanity.image';
import { PanelBase } from './PanelBase';
import { CORRIDOR_SECTIONS } from '@/types/corridor';
import type { Experience } from '@/types/sanity.types';

interface Props { experiences: Experience[]; isOpen: boolean; onClose: () => void; }

const S  = '#2d4a22';
const SM = '#3d5c30';
const SL = '#5a7a48';
const BG = 'rgba(80,120,60,0.07)';
const BD = 'rgba(80,120,60,0.18)';

function fmt(d?: string) {
  if (!d) return 'present';
  return new Date(d).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

export function ExperiencePanel({ experiences, isOpen, onClose }: Props) {
  const items = [...experiences]
    .filter(e => e.type === 'work')
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  return (
    <PanelBase section={CORRIDOR_SECTIONS.find(s => s.id === 'experience')!} isOpen={isOpen} onClose={onClose}>
      {items.length === 0 && (
        <p style={{ color: SL, fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 13 }}>
          No work experience yet — add entries in Sanity Studio under 💼 Work Experience.
        </p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(exp => {
          const logoUrl = exp.logo?.asset ? urlFor(exp.logo).width(80).height(80).fit('crop').url() : null;
          return (
            <div key={exp._id} style={{
              padding: '14px 16px', borderRadius: 12,
              background: BG, border: `1px solid ${BD}`,
              borderLeft: '3px solid #7a9a60',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                {/* Only show logo if one exists in Sanity */}
                {logoUrl && (
                  <Image src={logoUrl} alt={exp.org} width={40} height={40}
                    style={{ borderRadius: 8, objectFit: 'cover',
                      border: `1px solid ${BD}`, flexShrink: 0 }}/>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div>
                      <p style={{ fontFamily: 'Georgia, serif', fontSize: 14, fontWeight: 700,
                        color: S, margin: '0 0 1px' }}>{exp.role}</p>
                      <p style={{ fontSize: 12, color: SM, margin: '0 0 1px', fontWeight: 600 }}>{exp.org}</p>
                      {exp.location && (
                        <p style={{ fontSize: 10, color: SL, margin: 0 }}>{exp.location}</p>
                      )}
                    </div>
                    <p style={{ fontSize: 10, color: SL, margin: 0, flexShrink: 0, textAlign: 'right' }}>
                      {fmt(exp.startDate)} –{' '}{exp.current ? 'present' : fmt(exp.endDate)}
                    </p>
                  </div>
                  {exp.detail && (
                    <p style={{ fontSize: 12, color: SM, margin: '7px 0 0',
                      lineHeight: 1.55, fontFamily: 'Georgia, serif' }}>
                      {exp.detail}
                    </p>
                  )}
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul style={{ margin: '6px 0 0', paddingLeft: 16 }}>
                      {exp.bullets.map((b, i) => (
                        <li key={i} style={{ fontSize: 12, color: SM, lineHeight: 1.5, marginBottom: 2 }}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PanelBase>
  );
}