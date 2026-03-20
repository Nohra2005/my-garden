'use client';
// src/hooks/useDoorState.ts
// Given current camera Z, returns the nearest section + manages open/closed state.
import { useState, useCallback } from 'react';
import {
  CORRIDOR_SECTIONS,
  DOOR_ACTIVATE_DISTANCE,
  type SectionId,
  type CorridorSection,
} from '@/types/corridor';

export function useDoorState(cameraZ: number) {
  const [openSection, setOpenSection] = useState<SectionId | null>(null);

  // Find the section nearest to the camera
  const nearest = CORRIDOR_SECTIONS.reduce<CorridorSection | null>((best, s) => {
    const dist = Math.abs(cameraZ - s.zPos);
    if (dist > DOOR_ACTIVATE_DISTANCE) return best;
    if (!best) return s;
    return dist < Math.abs(cameraZ - best.zPos) ? s : best;
  }, null);

  const isActive  = (id: SectionId) => nearest?.id === id;
  const isOpen    = (id: SectionId) => openSection === id;

  const openDoor  = useCallback((id: SectionId) => setOpenSection(id), []);
  const closeDoor = useCallback(() => setOpenSection(null), []);

  return { nearest, isActive, isOpen, openDoor, closeDoor, openSection };
}