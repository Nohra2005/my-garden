'use client';
import { useRef } from 'react';
import type { ReactElement } from 'react';
import type { SectionId } from '@/types/corridor';

interface Props {
  nearestSectionId: SectionId | null;
  onOpen: () => void;
}

function pressKey(key: string) {
  window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}
function releaseKey(key: string) {
  window.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }));
}

// SVG arrows — never render as emoji
const ARROWS: Record<string, ReactElement> = {
  up: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M11 17V5M11 5L5 11M11 5L17 11" stroke="#2d4a22" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  down: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M11 5V17M11 17L5 11M11 17L17 11" stroke="#2d4a22" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  left: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M17 11H5M5 11L11 5M5 11L11 17" stroke="#2d4a22" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  right: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M5 11H17M17 11L11 5M17 11L11 17" stroke="#2d4a22" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

function DPadButton({ arrow, keyName }: { arrow: keyof typeof ARROWS; keyName: string }) {
  const held = useRef(false);
  const start = () => { if (held.current) return; held.current = true; pressKey(keyName); };
  const end   = () => { if (!held.current) return; held.current = false; releaseKey(keyName); };
  return (
    <button
      onPointerDown={start} onPointerUp={end} onPointerLeave={end} onPointerCancel={end}
      style={{
        width: 58, height: 58, borderRadius: 14,
        background: 'rgba(245,242,234,0.94)',
        border: '1.5px solid rgba(80,120,60,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', touchAction: 'none',
        boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
        WebkitUserSelect: 'none' as const, userSelect: 'none' as const,
      }}
    >
      {ARROWS[arrow]}
    </button>
  );
}

export function MobileControls({ nearestSectionId, onOpen }: Props) {
  return (
    <>
      <style>{`@media (min-width: 768px) { .mob-ctrl { display: none !important; } }`}</style>
      <div className="mob-ctrl" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        zIndex: 40, pointerEvents: 'none',
      }}>
        {/* D-pad — bottom left */}
        <div style={{ position: 'absolute', bottom: 28, left: 20, pointerEvents: 'auto',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <DPadButton arrow="up"   keyName="ArrowUp"/>
          <div style={{ display: 'flex', gap: 4 }}>
            <DPadButton arrow="left"  keyName="ArrowLeft"/>
            <div style={{ width: 58 }}/>
            <DPadButton arrow="right" keyName="ArrowRight"/>
          </div>
          <DPadButton arrow="down" keyName="ArrowDown"/>
        </div>

        {/* Open button */}
        {nearestSectionId && (
          <div style={{ position: 'absolute', bottom: 52, right: 20, pointerEvents: 'auto' }}>
            <button onPointerDown={onOpen} style={{
              height: 54, paddingInline: 24, borderRadius: 14,
              background: 'rgba(122,154,96,0.94)',
              border: '1.5px solid rgba(80,120,60,0.5)',
              color: 'white', fontSize: 13, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase' as const,
              fontFamily: 'Georgia, serif',
              display: 'flex', alignItems: 'center',
              cursor: 'pointer', touchAction: 'none',
              boxShadow: '0 2px 12px rgba(80,120,60,0.35)',
              WebkitUserSelect: 'none' as const, userSelect: 'none' as const,
            }}>
              Open
            </button>
          </div>
        )}
      </div>
    </>
  );
}