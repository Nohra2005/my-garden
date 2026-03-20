// src/types/corridor.ts

export type DoorSide = 'left' | 'right';

export type SectionId =
  | 'about'
  | 'projects'
  | 'skills'
  | 'education'
  | 'experience'
  | 'leadership'
  | 'contact';

export interface CorridorSection {
  id: SectionId;
  label: string;
  sublabel: string;
  side: DoorSide;
  zPos: number;
  color: string;
}

export const CORRIDOR_SECTIONS: CorridorSection[] = [
  { id: 'about',      label: 'About Me',       sublabel: 'who I am',              side: 'right', zPos: -4,   color: '#7a9a60' },
  { id: 'projects',   label: 'Projects',       sublabel: 'selected works',        side: 'left',  zPos: -10,  color: '#7a9a60' },
  { id: 'skills',     label: 'Skills',         sublabel: 'tools & stack',         side: 'right', zPos: -16,  color: '#7a9a60' },
  { id: 'education',  label: 'Education',      sublabel: 'academic background',   side: 'left',  zPos: -22,  color: '#7a9a60' },
  { id: 'experience', label: 'Work',           sublabel: 'professional experience',side: 'right', zPos: -28,  color: '#7a9a60' },
  { id: 'leadership', label: 'Leadership',     sublabel: 'activities & giving back',side: 'left', zPos: -34,  color: '#7a9a60' },
  { id: 'contact',    label: 'Contact',        sublabel: 'let\'s talk',           side: 'right', zPos: -40,  color: '#7a9a60' },
];

export const CAMERA_START_Z = 2;
export const CAMERA_END_Z   = -44;
export const DOOR_ACTIVATE_DISTANCE = 3.5;