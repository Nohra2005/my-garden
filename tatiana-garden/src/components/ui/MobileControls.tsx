'use client';
// src/components/ui/MobileControls.tsx
import { useEffect, useRef, useState } from 'react';
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
        background: 'rgba(245,242,234,0.90)',
        border: '1.5px solid rgba(80,120,60,0.35)',
        color: '#2d4a22', fontSize: 20, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', userSelect: 'none', touchAction: 'none',
        boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
        WebkitTapHighlightColor: 'transparent',
      }}
    >{label}</button>
  );
}

export function MobileControls({ nearestSectionId, onOpen }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!isMobile) return null;

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
      pointerEvents: 'none', paddingBottom: 'env(safe-area-inset-bottom, 12px)' }}>

      {/* D-pad — bottom left */}
      <div style={{ position: 'absolute', bottom: 20, left: 20, pointerEvents: 'auto' }}>
        {/* Up */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
          <DPadButton label="↑" keyName="ArrowUp"/>
        </div>
        {/* Left + Right */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
          <DPadButton label="◀" keyName="ArrowLeft"/>
          <div style={{ width: 56 }}/>
          <DPadButton label="▶" keyName="ArrowRight"/>
        </div>
        {/* Down */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <DPadButton label="↓" keyName="ArrowDown"/>
        </div>
      </div>

      {/* Open button — bottom right */}
      {nearestSectionId && (
        <div style={{ position: 'absolute', bottom: 52, right: 20, pointerEvents: 'auto' }}>
          <button
            onPointerDown={onOpen}
            style={{
              height: 56, paddingInline: 24, borderRadius: 16,
              background: 'rgba(122,154,96,0.95)',
              border: '1.5px solid rgba(80,120,60,0.5)',
              color: 'white', fontSize: 14, fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              fontFamily: 'Georgia, serif',
              cursor: 'pointer', userSelect: 'none', touchAction: 'none',
              boxShadow: '0 3px 14px rgba(80,120,60,0.4)',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            Open
          </button>
        </div>
      )}
    </div>
  );
}