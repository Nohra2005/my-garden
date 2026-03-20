'use client';
// src/components/ui/HUD.tsx
// Fixed overlay — section indicator, navigation hint, progress dots
import { motion, AnimatePresence } from 'framer-motion';
import { CORRIDOR_SECTIONS, type SectionId } from '@/types/corridor';

interface Props {
  activeSectionId: SectionId | null;
  cameraProgress: number; // 0–1
}

export function HUD({ activeSectionId, cameraProgress }: Props) {
  const activeSection = CORRIDOR_SECTIONS.find(s => s.id === activeSectionId);

  return (
    <>
      {/* Top center — active section name */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 30,
        display: 'flex', justifyContent: 'center', padding: '24px 0', pointerEvents: 'none' }}>
        <AnimatePresence mode="wait">
          {activeSection ? (
            <motion.div key={activeSection.id}
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
              style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
                color: activeSection.color, fontWeight: 700, margin: '0 0 3px',
                fontFamily: 'Georgia, serif' }}>
                press enter to open
              </p>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#2d4a22', margin: 0,
                fontFamily: 'Georgia, serif', textShadow: `0 0 20px ${activeSection.color}60` }}>
                {activeSection.label}
              </p>
            </motion.div>
          ) : (
            <motion.div key="hint"
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}>
              <p style={{ fontSize: 10, color: 'rgba(60,90,40,0.6)', margin: 0,
                letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Georgia, serif' }}>
                ↑ ↓ move · ← → turn · enter to open
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right side — progress dots */}
      <div style={{ position: 'fixed', right: 24, top: '50%', transform: 'translateY(-50%)',
        zIndex: 30, display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: 'none' }}>
        {CORRIDOR_SECTIONS.map(s => (
          <motion.div key={s.id}
            style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
            <AnimatePresence>
              {activeSectionId === s.id && (
                <motion.span initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.15 }}
                  style={{ fontSize: 9, color: s.color, fontWeight: 700, letterSpacing: '0.08em',
                    textTransform: 'uppercase', fontFamily: 'Georgia, serif' }}>
                  {s.label}
                </motion.span>
              )}
            </AnimatePresence>
            <div style={{
              width:  activeSectionId === s.id ? 10 : 6,
              height: activeSectionId === s.id ? 10 : 6,
              borderRadius: '50%',
              background: activeSectionId === s.id ? s.color : 'rgba(255,255,255,0.25)',
              transition: 'all 0.3s',
              boxShadow: activeSectionId === s.id ? `0 0 8px ${s.color}` : 'none',
            }}/>
          </motion.div>
        ))}
      </div>

      {/* Bottom left — floor progress bar */}
      <div style={{ position: 'fixed', bottom: 28, left: 28, zIndex: 30, pointerEvents: 'none' }}>
        <p style={{ fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'rgba(60,90,40,0.45)', margin: '0 0 6px', fontFamily: 'Georgia, serif' }}>
          Progress
        </p>
        <div style={{ width: 120, height: 2, background: 'rgba(80,120,60,0.08)', borderRadius: 1 }}>
          <motion.div style={{ height: '100%', background: 'rgba(255,255,255,0.6)', borderRadius: 1,
            width: `${cameraProgress * 100}%` }} transition={{ duration: 0.1 }}/>
        </div>
      </div>
    </>
  );
}