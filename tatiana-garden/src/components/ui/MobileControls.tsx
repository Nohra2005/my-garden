'use client';
// src/components/ui/MobileControls.tsx
import { useRef } from 'react';
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

function DPadButton({ label, keyName }: { label: string; keyName: string }) {
  const held = useRef(false);
  const start = () => { if (held.current) return; held.current = true; pressKey(keyName); };
  const end   = () => { if (!held.current) return; held.current = false; releaseKey(keyName); };
  return (
    <button
      onPointerDown={start} onPointerUp={end} onPointerLeave={end} onPointerCancel={end}
      style={{
        width: 56, height: 56, borderRadius: 14,
        background: 'rgba(245,242,234,0.92)',
        border: '1.5px solid rgba(80,120,60,0.35)',
        color: '#2d4a22', fontSize: 11, fontWeight: 700,
        fontFamily: 'Georgia, serif', letterSpacing: '0.06em',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', userSelect: 'none' as const, touchAction: 'none' as const,
        boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
        WebkitUserSelect: 'none' as const,
      }}
    >
      {label}
    </button>
  );
}

export function MobileControls({ nearestSectionId, onOpen }: Props) {
  return (
    <div className="md:hidden" style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      zIndex: 40, pointerEvents: 'none',
    }}>
      {/* D-pad */}
      <div style={{ position: 'absolute', bottom: 28, left: 24, pointerEvents: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
          <DPadButton label="FWD" keyName="ArrowUp"/>
        </div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
          <DPadButton label="L" keyName="ArrowLeft"/>
          <div style={{ width: 56 }}/>
          <DPadButton label="R" keyName="ArrowRight"/>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <DPadButton label="BCK" keyName="ArrowDown"/>
        </div>
      </div>

      {/* Open button */}
      {nearestSectionId && (
        <div style={{ position: 'absolute', bottom: 52, right: 24, pointerEvents: 'auto' }}>
          <button onPointerDown={onOpen}
            style={{
              height: 52, paddingInline: 22, borderRadius: 14,
              background: 'rgba(122,154,96,0.92)',
              border: '1.5px solid rgba(80,120,60,0.5)',
              color: 'white', fontSize: 13, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase' as const,
              fontFamily: 'Georgia, serif',
              display: 'flex', alignItems: 'center',
              cursor: 'pointer', userSelect: 'none' as const, touchAction: 'none' as const,
              boxShadow: '0 2px 12px rgba(80,120,60,0.35)',
            }}>
            Open
          </button>
        </div>
      )}
    </div>
  );
}