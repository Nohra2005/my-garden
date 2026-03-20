'use client';
// src/components/panels/PanelBase.tsx
// Emerges from the center of the screen — as if stepping through the door.
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { CorridorSection } from '@/types/corridor';

interface PanelBaseProps {
  section: CorridorSection;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function PanelBase({ section, isOpen, onClose, children }: PanelBaseProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            style={{
              position: 'fixed', inset: 0, zIndex: 40,
              background: 'rgba(30,50,20,0.4)',
              backdropFilter: 'blur(3px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* Panel — slides up from center-bottom, as if emerging through the door */}
          <motion.div
            style={{
              position: 'fixed',
              top: '50%', left: '50%',
              width: 'min(580px, 92vw)',
              maxHeight: '80vh',
              zIndex: 50,
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(248,244,234,0.98)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(100,140,80,0.25)',
              borderTop: '3px solid #7a9a60',
              borderRadius: 16,
              boxShadow: '0 24px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(100,140,80,0.2)',
            }}
            initial={{ scale: 0.88, x: '-50%', y: '-50%', opacity: 0 }}
            animate={{ scale: 1,    x: '-50%', y: '-50%', opacity: 1 }}
            exit={{ scale: 0.88,    x: '-50%', y: '-50%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 24px 14px',
              borderBottom: '1px solid rgba(100,140,80,0.18)',
              flexShrink: 0,
            }}>
              <div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4,
                }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%', background: '#7a9a60',
                  }}/>
                  <span style={{
                    fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: '#5a8044', fontWeight: 700, fontFamily: 'Georgia, serif',
                  }}>
                    {section.sublabel}
                  </span>
                </div>
                <h2 style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: 24, fontWeight: 700, color: '#2d4a22',
                  margin: 0, letterSpacing: '-0.01em',
                }}>
                  {section.label}
                </h2>
              </div>
              <button
                onClick={onClose}
                style={{
                  width: 34, height: 34, borderRadius: '50%',
                  border: '1px solid rgba(100,140,80,0.25)',
                  background: 'rgba(180,130,50,0.08)',
                  cursor: 'pointer', color: '#c89040',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <X size={14}/>
              </button>
            </div>

            {/* Scrollable content */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: '20px 24px 32px',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(100,140,80,0.3) transparent',
            }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}