'use client';
// src/components/ui/MobileControls.tsx
// On-screen touch controls for mobile. Hidden on desktop.
import { useRef } from 'react';
import type { SectionId } from '@/types/corridor';

interface Props {
  nearestSectionId: SectionId | null;
  onOpen: () => void;
}

// We dispatch synthetic keydown/keyup events so CorridorScene picks them up
// without any changes to the existing input hook.
function pressKey(key: string) {
  window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}
function releaseKey(key: string) {
  window.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }));
}

function DPadButton({
  label, keyName, style,
}: {
  label: string; keyName: string; style?: React.CSSProperties;
}) {
  const held = useRef(false);

  const start = () => {
    if (held.current) return;
    held.current = true;
    pressKey(keyName);
  };
  const end = () => {
    if (!held.current) return;
    held.current = false;
    releaseKey(keyName);
  };

  return (
    <button
      onPointerDown={start}
      onPointerUp={end}
      onPointerLeave={end}
      onPointerCancel={end}
      style={{
        width: 52, height: 52, borderRadius: 12,
        background: 'rgba(245,242,234,0.85)',
        backdropFilter: 'blur(8px)',
        border: '1.5px solid rgba(80,120,60,0.3)',
        color: '#2d4a22', fontSize: 18, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', userSelect: 'none', touchAction: 'none',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        ...style,
      }}
    >
      {label}
    </button>
  );
}

export function MobileControls({ nearestSectionId, onOpen }: Props) {
  return (
    /* Only visible on mobile — hidden md:hidden */
    <div className="md:hidden" style={{ position: 'fixed', bottom: 0, left: 0, right: 0,
      zIndex: 40, pointerEvents: 'none' }}>

      {/* D-pad — bottom left */}
      <div style={{ position: 'absolute', bottom: 24, left: 24, pointerEvents: 'auto' }}>
        {/* Forward */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
          <DPadButton label="↑" keyName="ArrowUp"/>
        </div>
        {/* Left / Right */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
          <DPadButton label="←" keyName="ArrowLeft"/>
          {/* Center spacer */}
          <div style={{ width: 52 }}/>
          <DPadButton label="→" keyName="ArrowRight"/>
        </div>
        {/* Back */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <DPadButton label="↓" keyName="ArrowDown"/>
        </div>
      </div>

      {/* Open button — bottom right, only when near a door */}
      {nearestSectionId && (
        <div style={{ position: 'absolute', bottom: 24, right: 24, pointerEvents: 'auto' }}>
          <button
            onPointerDown={onOpen}
            style={{
              height: 52, paddingInline: 20, borderRadius: 14,
              background: 'rgba(122,154,96,0.92)',
              backdropFilter: 'blur(8px)',
              border: '1.5px solid rgba(80,120,60,0.5)',
              color: 'white', fontSize: 13, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              fontFamily: 'Georgia, serif',
              display: 'flex', alignItems: 'center', gap: 8,
              cursor: 'pointer', userSelect: 'none', touchAction: 'none',
              boxShadow: '0 2px 12px rgba(80,120,60,0.35)',
            }}
          >
            Open
          </button>
        </div>
      )}
    </div>
  );
}