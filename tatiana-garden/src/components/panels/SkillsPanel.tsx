'use client';
// src/components/panels/SkillsPanel.tsx
import { PanelBase } from './PanelBase';
import { CORRIDOR_SECTIONS } from '@/types/corridor';
import type { SkillGroup } from '@/types/sanity.types';

interface Props { skills: SkillGroup[]; isOpen: boolean; onClose: () => void; }

const S  = '#2d4a22';
const SM = '#3d5c30';
const SL = '#5a7a48';
const BG = 'rgba(80,120,60,0.07)';
const BD = 'rgba(80,120,60,0.18)';

export function SkillsPanel({ skills, isOpen, onClose }: Props) {
  return (
    <PanelBase section={CORRIDOR_SECTIONS.find(s => s.id === 'skills')!} isOpen={isOpen} onClose={onClose}>
      {skills.length === 0 && (
        <p style={{ color: SL, fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 13 }}>
          No skills yet — add groups in Sanity Studio under 🛠️ Skills.
        </p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {skills.map(group => (
          <div key={group._id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
              {group.emoji && <span style={{ fontSize: 14 }}>{group.emoji}</span>}
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase' as const, color: SM }}>
                {group.category}
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {group.items.map(item => (
                <span key={item} style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20,
                  background: BG, color: S, border: `1px solid ${BD}`, fontWeight: 500 }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PanelBase>
  );
}