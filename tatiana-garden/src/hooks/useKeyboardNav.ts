'use client';
// src/hooks/useKeyboardNav.ts
// Tracks which arrow keys are currently held. Used by CorridorCamera.
import { useEffect, useRef, useState } from 'react';

export interface KeyState {
  forward:  boolean;  // ArrowUp  / W
  backward: boolean;  // ArrowDown / S
  interact: boolean;  // Enter / Space — open nearest door
}

export function useKeyboardNav() {
  const [keys, setKeys] = useState<KeyState>({ forward: false, backward: false, interact: false });
  // Track interact as a single-fire event
  const interactFired = useRef(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (['ArrowUp','w','W'].includes(e.key))
        setKeys(k => ({ ...k, forward: true }));
      if (['ArrowDown','s','S'].includes(e.key))
        setKeys(k => ({ ...k, backward: true }));
      if (['Enter',' '].includes(e.key) && !interactFired.current) {
        interactFired.current = true;
        setKeys(k => ({ ...k, interact: true }));
      }
    };
    const up = (e: KeyboardEvent) => {
      if (['ArrowUp','w','W'].includes(e.key))
        setKeys(k => ({ ...k, forward: false }));
      if (['ArrowDown','s','S'].includes(e.key))
        setKeys(k => ({ ...k, backward: false }));
      if (['Enter',' '].includes(e.key)) {
        interactFired.current = false;
        setKeys(k => ({ ...k, interact: false }));
      }
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  return keys;
}