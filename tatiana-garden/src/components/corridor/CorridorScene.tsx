'use client';
import { useRef, useState, useCallback, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { urlFor } from '@/lib/sanity.image';
import {
  CORRIDOR_SECTIONS,
  CAMERA_START_Z,
  CAMERA_END_Z,
  type SectionId,
} from '@/types/corridor';
import type { CorridorPhoto } from '@/types/sanity.types';

// ─── Tuning ───────────────────────────────────────────────────────────────────
const CW       = 1.9;   // corridor HALF-width — stone passage
const CH       = 3.4;   // ceiling height — tall stone passage
const CLEN     = 62;
const SPEED    = 4.5;
const TURN_SPD = 1.6;
const LERP_P   = 0.09;
const LERP_R   = 0.11;
// Dot product threshold for "facing a door" — ~40° cone
const FACE_DOT = 0.76;
// Dot product to auto-close a door when turning away
const CLOSE_DOT = 0.40;

// Picture frame positions: between door pairs
// ─── Flagstone layout — computed once at module level ────────────────────────
interface StoneData {
  key: string; cx: number; cz: number;
  w: number; h: number; elev: number; tilt: number; color: string;
}
const FLAGSTONES: StoneData[] = (() => {
  const cols = ['#d4c9a8','#c8bc98','#ddd0b0','#ccc0a0','#e0d4b8','#bab09a','#d8ccb2'];
  let s = 42;
  const rand = () => { s=(s*1664525+1013904223)&0xffffffff; return (s>>>0)/0xffffffff; };
  const stones: StoneData[] = [];
  let z = -CLEN/2 + 0.4;
  let row = 0;
  while (z < CLEN/2 - 0.3) {
    const rowH = 0.55 + rand()*0.45;
    let x = -CW + 0.04;
    let col = 0;
    while (x < CW - 0.04) {
      const w    = 0.55 + rand()*0.7;
      const actualW = Math.min(w, CW*2 - 0.08 - (x - (-CW+0.04)));
      if (actualW < 0.25) break;
      stones.push({
        key:   `s${row}-${col}`,
        cx:    x + actualW/2,
        cz:    z + rowH/2,
        w:     actualW,
        h:     rowH,
        elev:  (rand()-0.5)*0.012,
        tilt:  (rand()-0.5)*0.008,
        color: cols[Math.floor(rand()*cols.length)],
      });
      x += actualW;
      col++;
    }
    z += rowH;
    row++;
  }
  return stones;
})();


// Doors: right@-4, left@-10, right@-16, left@-22, right@-28, left@-34, right@-40
// Frames sit BETWEEN doors, on the OPPOSITE wall to avoid any overlap
const FRAME_POSITIONS: { z: number; side: 'left' | 'right' }[] = [
  { side: 'left',  z: -7  },  // between about(R,-4) and projects(L,-10) → left wall clear
  { side: 'right', z: -13 },  // between projects(L,-10) and skills(R,-16) → right wall clear
  { side: 'left',  z: -19 },  // between skills(R,-16) and education(L,-22) → left wall clear
  { side: 'right', z: -25 },  // between education(L,-22) and experience(R,-28) → right wall clear
  { side: 'left',  z: -31 },  // between experience(R,-28) and leadership(L,-34) → left wall clear
  { side: 'right', z: -37 },  // between leadership(L,-34) and contact(R,-40) → right wall clear
];

// ─── Input ────────────────────────────────────────────────────────────────────
function useInput() {
  const keys = useRef({ fwd:false, back:false, left:false, right:false, enter:false });
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const dn = (e: KeyboardEvent) => {
      if (e.key==='ArrowUp'    || e.key==='w') keys.current.fwd   = true;
      if (e.key==='ArrowDown'  || e.key==='s') keys.current.back  = true;
      if (e.key==='ArrowLeft'  || e.key==='a') keys.current.left  = true;
      if (e.key==='ArrowRight' || e.key==='d') keys.current.right = true;
      if (e.key==='Enter')                     keys.current.enter = true;
    };
    const up = (e: KeyboardEvent) => {
      if (e.key==='ArrowUp'    || e.key==='w') keys.current.fwd   = false;
      if (e.key==='ArrowDown'  || e.key==='s') keys.current.back  = false;
      if (e.key==='ArrowLeft'  || e.key==='a') keys.current.left  = false;
      if (e.key==='ArrowRight' || e.key==='d') keys.current.right = false;
      if (e.key==='Enter')                     keys.current.enter = false;
    };
    // Touch swipe on the canvas → turn left/right
    const tstart = (e: TouchEvent) => {
      touchX.current = e.touches[0].clientX;
    };
    const tmove = (e: TouchEvent) => {
      if (touchX.current === null) return;
      const dx = e.touches[0].clientX - touchX.current;
      if (Math.abs(dx) > 12) {
        keys.current.left  = dx < 0;
        keys.current.right = dx > 0;
      } else {
        keys.current.left = keys.current.right = false;
      }
    };
    const tend = () => {
      touchX.current = null;
      keys.current.left = keys.current.right = false;
    };

    window.addEventListener('keydown',   dn);
    window.addEventListener('keyup',     up);
    window.addEventListener('touchstart', tstart, { passive: true });
    window.addEventListener('touchmove',  tmove,  { passive: true });
    window.addEventListener('touchend',   tend);
    return () => {
      window.removeEventListener('keydown',   dn);
      window.removeEventListener('keyup',     up);
      window.removeEventListener('touchstart', tstart);
      window.removeEventListener('touchmove',  tmove);
      window.removeEventListener('touchend',   tend);
    };
  }, []);
  return keys;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const _fwd   = new THREE.Vector3();
const _toDoor= new THREE.Vector3();
const _euler = new THREE.Euler(0,0,0,'YXZ');

function getDotToDoor(camPos: THREE.Vector3, camYaw: number, section: typeof CORRIDOR_SECTIONS[0]) {
  const wallX = section.side === 'left' ? -CW : CW;
  _toDoor.set(wallX - camPos.x, 0, section.zPos - camPos.z).normalize();
  _fwd.set(Math.sin(-camYaw), 0, -Math.cos(camYaw));
  return _fwd.dot(_toDoor);
}

// ─── Roman Column ─────────────────────────────────────────────────────────────
function RomanColumn({ side, z }: { side: 'left'|'right'; z: number }) {
  const CREAM  = '#f0ead8';
  const SHADOW = '#d4ccb4';
  const LIGHT  = '#f8f4ec';
  // Engaged column — half embedded in wall, half proud into corridor
  const wallX  = side === 'left' ? -CW : CW;
  const dir    = side === 'left' ? 1 : -1; // protrudes inward
  const r  = 0.13;
  const h  = CH - 0.30;

  return (
    <group position={[wallX + dir * r * 0.55, 0, z]}>
      {/* Base stylobate — wide stone step */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[r*3.8, 0.10, r*3.8]}/>
        <meshStandardMaterial color={SHADOW} roughness={0.82}/>
      </mesh>
      {/* Base plinth */}
      <mesh position={[0, 0.13, 0]}>
        <boxGeometry args={[r*3.0, 0.10, r*3.0]}/>
        <meshStandardMaterial color={CREAM} roughness={0.78}/>
      </mesh>
      {/* Torus lower moulding */}
      <mesh position={[0, 0.22, 0]} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[r*1.25, r*0.18, 10, 24]}/>
        <meshStandardMaterial color={LIGHT} roughness={0.65}/>
      </mesh>
      {/* Scotia — small cove between tori */}
      <mesh position={[0, 0.28, 0]} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[r*1.12, r*0.09, 8, 24]}/>
        <meshStandardMaterial color={SHADOW} roughness={0.75}/>
      </mesh>
      {/* Torus upper moulding */}
      <mesh position={[0, 0.34, 0]} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[r*1.2, r*0.15, 10, 24]}/>
        <meshStandardMaterial color={LIGHT} roughness={0.65}/>
      </mesh>

      {/* Shaft — classical entasis (slight bulge, then taper) */}
      <mesh position={[0, h/2 + 0.38, 0]}>
        <cylinderGeometry args={[r*0.82, r*1.0, h, 20]}/>
        <meshStandardMaterial color={CREAM} roughness={0.68} metalness={0.01}/>
      </mesh>
      {/* Fluting — 16 channels, only on corridor-facing half */}
      {Array.from({length: 16}, (_, i) => {
        const a   = (i / 16) * Math.PI * 2;
        const fx  = Math.cos(a) * r * 0.98;
        const fz  = Math.sin(a) * r * 0.98;
        // Only render grooves facing into the corridor
        const facingIn = side === 'left' ? fx > -r * 0.3 : fx < r * 0.3;
        if (!facingIn) return null;
        return (
          <mesh key={i} position={[fx, h/2 + 0.38, fz]}>
            <boxGeometry args={[0.009, h * 0.95, 0.006]}/>
            <meshStandardMaterial color={SHADOW} roughness={0.82}/>
          </mesh>
        );
      })}

      {/* Astragal — ring between shaft and capital */}
      <mesh position={[0, h + 0.40, 0]} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[r*0.9, r*0.1, 8, 24]}/>
        <meshStandardMaterial color={SHADOW} roughness={0.72}/>
      </mesh>

      {/* Capital — Corinthian inspired */}
      {/* Kalathos bell */}
      <mesh position={[0, h + 0.56, 0]}>
        <cylinderGeometry args={[r*1.7, r*0.88, 0.32, 16]}/>
        <meshStandardMaterial color={CREAM} roughness={0.65}/>
      </mesh>
      {/* Acanthus leaf suggestion — 4 angled cylinders */}
      {[0, Math.PI/2, Math.PI, Math.PI*1.5].map((a, i) => (
        <mesh key={i}
          position={[Math.cos(a)*r*1.1, h+0.52, Math.sin(a)*r*1.1]}
          rotation={[Math.cos(a)*0.5, 0, -Math.sin(a)*0.5]}>
          <cylinderGeometry args={[r*0.12, r*0.06, 0.22, 6]}/>
          <meshStandardMaterial color={SHADOW} roughness={0.7}/>
        </mesh>
      ))}
      {/* Abacus — square top slab */}
      <mesh position={[0, h + 0.74, 0]}>
        <boxGeometry args={[r*4.2, 0.10, r*4.2]}/>
        <meshStandardMaterial color={SHADOW} roughness={0.78}/>
      </mesh>
      {/* Impost — slight overhang into wall */}
      <mesh position={[0, h + 0.80, 0]}>
        <boxGeometry args={[r*3.6, 0.06, r*3.6]}/>
        <meshStandardMaterial color={CREAM} roughness={0.75}/>
      </mesh>
    </group>
  );
}

// ─── Picture Frame ─────────────────────────────────────────────────────────────
function PictureFrame({ side, z, textureUrl }: {
  side: 'left'|'right'; z: number; textureUrl?: string
}) {
  const wallX = side === 'left' ? -CW+0.10 : CW-0.10;
  const rotY  = side === 'left' ? Math.PI/2 : -Math.PI/2;
  const FW=0.60, FH=0.76, FB=0.058;
  const canvasRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!textureUrl || !canvasRef.current) return;
    new THREE.TextureLoader().load(textureUrl, (tex) => {
      if (!canvasRef.current) return;
      const mat = canvasRef.current.material as THREE.MeshStandardMaterial;
      mat.map = tex;
      mat.color.set('#ffffff');
      mat.needsUpdate = true;
    });
  }, [textureUrl]);

  return (
    <group position={[wallX, 1.72, z]} rotation={[0, rotY, 0]}>
      {/* Outer gilded frame */}
      <mesh>
        <boxGeometry args={[FW+FB*2, FH+FB*2, 0.052]}/>
        <meshStandardMaterial color="#c8b870" metalness={0.68} roughness={0.32}
          emissive={new THREE.Color('#907840')} emissiveIntensity={0.12}/>
      </mesh>
      {/* Inner cream liner */}
      <mesh position={[0, 0, 0.026]}>
        <boxGeometry args={[FW+0.016, FH+0.016, 0.018]}/>
        <meshStandardMaterial color="#e8e0c8" roughness={0.9}/>
      </mesh>
      {/* Canvas */}
      <mesh ref={canvasRef} position={[0, 0, 0.038]}>
        <boxGeometry args={[FW, FH, 0.012]}/>
        <meshStandardMaterial color="#d4cebb" roughness={0.88}/>
      </mesh>
      {/* Warm spotlight */}
      <spotLight position={[0, FH*0.5+0.55, 0.32]}
        angle={0.38} penumbra={0.55}
        intensity={5} distance={2.0} decay={2}
        color="#ffe8a0"/>
    </group>
  );
}


function CorridorDoor({
  section, facing, isOpen, onOpen,
}: {
  section: typeof CORRIDOR_SECTIONS[0];
  facing: boolean;
  isOpen: boolean;
  onOpen: () => void;
}) {
  const doorGroupRef = useRef<THREE.Group>(null);
  const frameGlowRef = useRef<THREE.Mesh>(null);
  const accentRef    = useRef<THREE.PointLight>(null);
  const openAngle    = section.side === 'left' ? -Math.PI*0.72 : Math.PI*0.72;
  const isLeft = section.side === 'left';
  const wallX  = isLeft ? -CW : CW;
  const rotY   = isLeft ? Math.PI/2 : -Math.PI/2;
  const DW=1.1, DH=2.35, FT=0.07;

  useFrame((_s, dt) => {
    if (doorGroupRef.current) {
      const target = isOpen ? openAngle : 0;
      doorGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        doorGroupRef.current.rotation.y, target, dt*4.5
      );
    }
    if (frameGlowRef.current) {
      const mat = frameGlowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = THREE.MathUtils.lerp(
        mat.emissiveIntensity, facing ? 0.9 : 0.1, dt*5
      );
    }
    if (accentRef.current) {
      accentRef.current.intensity = THREE.MathUtils.lerp(
        accentRef.current.intensity, facing ? 5.0 : 0.8, dt*5
      );
    }
  });

  const hingeX = isLeft ? DW/2 : -DW/2;

  return (
    <group position={[wallX, 0, section.zPos]} rotation={[0, rotY, 0]}>

      {/* Stone arch surround — semicircular top */}
      {/* Left jamb */}
      <mesh position={[-(DW/2+FT+0.11), DH/2, 0]}>
        <boxGeometry args={[0.22, DH, 0.28]}/>
        <meshStandardMaterial color="#7a7268" roughness={0.96}/>
      </mesh>
      {/* Right jamb */}
      <mesh position={[(DW/2+FT+0.11), DH/2, 0]}>
        <boxGeometry args={[0.22, DH, 0.28]}/>
        <meshStandardMaterial color="#7a7268" roughness={0.96}/>
      </mesh>
      {/* Lintel / arch block */}
      <mesh position={[0, DH+0.18, 0]}>
        <boxGeometry args={[DW+FT*2+0.28, 0.36, 0.28]}/>
        <meshStandardMaterial color="#6a6460" roughness={0.97}/>
      </mesh>
      {/* Keystone — slightly lighter */}
      <mesh position={[0, DH+0.3, 0.01]}>
        <boxGeometry args={[0.18, 0.2, 0.04]}/>
        <meshStandardMaterial color="#8a8478" roughness={0.94}/>
      </mesh>

      {/* Warm lantern above door */}
      <mesh position={[0, DH+0.08, 0.18]}>
        <boxGeometry args={[0.1, 0.14, 0.1]}/>
        <meshStandardMaterial color="#8a7020" metalness={0.8} roughness={0.3}
          emissive={new THREE.Color('#c86010')} emissiveIntensity={0.8}/>
      </mesh>
      <pointLight ref={accentRef}
        position={[0, DH+0.06, 0.22]}
        color="#ffaa30" intensity={0.8} distance={3.5} decay={2}/>

      {/* Door frame — warm dark wood */}
      <mesh ref={frameGlowRef}>
        <boxGeometry args={[DW+FT*2, DH+FT, 0.14]}/>
        <meshStandardMaterial color="#3a2410" metalness={0.06} roughness={0.65}
          emissive={new THREE.Color('#3a1c04')} emissiveIntensity={0.1}/>
      </mesh>

      {/* Door slab — hinged */}
      <group ref={doorGroupRef} position={[hingeX, 0, 0]}>
        {/* Main door panel — warm chestnut wood */}
        <mesh position={[-hingeX, DH/2, 0.07]}
          onClick={facing ? onOpen : undefined}>
          <boxGeometry args={[DW-FT, DH-FT, 0.09]}/>
          <meshStandardMaterial color="#5a3418" roughness={0.60} metalness={0.04}/>
        </mesh>

        {/* Horizontal rail top */}
        <mesh position={[-hingeX, DH*0.82, 0.125]}>
          <boxGeometry args={[DW-FT, 0.06, 0.025]}/>
          <meshStandardMaterial color="#4a2c12" roughness={0.65}/>
        </mesh>
        {/* Horizontal rail mid */}
        <mesh position={[-hingeX, DH*0.48, 0.125]}>
          <boxGeometry args={[DW-FT, 0.06, 0.025]}/>
          <meshStandardMaterial color="#4a2c12" roughness={0.65}/>
        </mesh>
        {/* Horizontal rail bottom */}
        <mesh position={[-hingeX, DH*0.14, 0.125]}>
          <boxGeometry args={[DW-FT, 0.06, 0.025]}/>
          <meshStandardMaterial color="#4a2c12" roughness={0.65}/>
        </mesh>

        {/* Upper panel */}
        <mesh position={[-hingeX, DH*0.67, 0.13]}>
          <boxGeometry args={[DW*0.72, DH*0.28, 0.018]}/>
          <meshStandardMaterial color="#6a3e1e" roughness={0.62}/>
        </mesh>
        {/* Lower panel */}
        <mesh position={[-hingeX, DH*0.31, 0.13]}>
          <boxGeometry args={[DW*0.72, DH*0.28, 0.018]}/>
          <meshStandardMaterial color="#6a3e1e" roughness={0.62}/>
        </mesh>

        {/* Iron ring handle */}
        <mesh position={[-hingeX+(isLeft?DW*0.28:-DW*0.28), DH*0.50, 0.17]}
          rotation={[Math.PI/2,0,0]}>
          <torusGeometry args={[0.045, 0.012, 8, 12]}/>
          <meshStandardMaterial color="#2a2420" metalness={0.85} roughness={0.3}/>
        </mesh>
        {/* Escutcheon plate */}
        <mesh position={[-hingeX+(isLeft?DW*0.28:-DW*0.28), DH*0.50, 0.155]}>
          <boxGeometry args={[0.06, 0.10, 0.01]}/>
          <meshStandardMaterial color="#2a2420" metalness={0.82} roughness={0.35}/>
        </mesh>

        {/* Iron hinges — 3 per door */}
        {[0.25, 0.50, 0.75].map((t, hi) => (
          <mesh key={hi} position={[-hingeX+(isLeft?-DW*0.43:DW*0.43), DH*t, 0.11]}>
            <boxGeometry args={[0.06, 0.1, 0.03]}/>
            <meshStandardMaterial color="#2a2420" metalness={0.88} roughness={0.25}/>
          </mesh>
        ))}

        {/* Warm glow leaking through when open */}
        {isOpen && (
          <pointLight position={[-hingeX, DH/2, -0.5]}
            color="#fff8e0" intensity={16} distance={5} decay={2}/>
        )}
      </group>

      {/* Door label — only when close and facing */}
      {facing && (
        <Html position={[0, DH*0.68, 0.22]} center occlude={false}
          style={{ pointerEvents:'none', userSelect:'none' }}>
          <div style={{ textAlign:'center', whiteSpace:'nowrap' }}>
            <div style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 15, fontWeight: 700,
              color: '#f5e8c8',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              textShadow: '0 1px 3px rgba(255,255,255,0.8)',
            }}>
              {section.label}
            </div>
            <div style={{
              width: 24, height: 1.5,
              background: '#7a9a60',
              margin: '4px auto',
              borderRadius: 1,
            }}/>
            <div style={{
              fontFamily: 'Georgia, serif', fontSize: 9,
              color: '#6a8a52', letterSpacing: '0.16em', textTransform: 'uppercase',
            }}>
              {section.sublabel}
            </div>
            <div style={{
              fontFamily: 'Georgia, serif', fontSize: 8,
              color: 'rgba(60,80,40,0.55)',
              letterSpacing: '0.12em', marginTop: 4,
            }}>
              ENTER TO OPEN
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}


// ─── Corridor shell — cream & sage with Roman columns ────────────────────────
function CorridorShell() {
  const halfLen = CLEN/2;
  const zOff = -halfLen + CAMERA_START_Z + 2;

  // Doors at world z: -4,-10,-16,-22,-28,-34,-40
  // Frames at world z midpoints: -7,-13,-19,-25,-31,-37
  // Columns flank each door at world z -2.5,-8.5,-14.5,-20.5,-26.5,-32.5,-38.5
  // (1.5 units before each door, clearly between frame and door)
  // Local = world + 27:
  const columnZPositions = [24.5, 18.5, 12.5, 6.5, 0.5, -5.5, -11.5];

  return (
    <group position={[0, 0, zOff]}>

      {/* ── FLOOR — irregular flagstone pattern ── */}
      {/* Base mortar bed */}
      <mesh receiveShadow position={[0, -0.03, 0]}>
        <boxGeometry args={[CW*2+0.1, 0.02, CLEN+0.1]}/>
        <meshStandardMaterial color="#a89e88" roughness={0.98}/>
      </mesh>
      {FLAGSTONES.map(st => (
        <mesh key={st.key}
          position={[st.cx, st.elev, st.cz]}
          receiveShadow>
          <boxGeometry args={[st.w - 0.018, 0.04, st.h - 0.018]}/>
          <meshStandardMaterial color={st.color} roughness={0.92} metalness={0.01}/>
        </mesh>
      ))}

      {/* ── LEFT WALL — cream plaster ── */}
      <mesh position={[-CW, CH/2, 0]} receiveShadow>
        <boxGeometry args={[0.14, CH, CLEN]}/>
        <meshStandardMaterial color="#f0ebd8" roughness={0.88}/>
      </mesh>
      {/* ── RIGHT WALL ── */}
      <mesh position={[CW, CH/2, 0]} receiveShadow>
        <boxGeometry args={[0.14, CH, CLEN]}/>
        <meshStandardMaterial color="#f0ebd8" roughness={0.88}/>
      </mesh>

      {/* Sage green wainscoting */}
      <mesh position={[-CW+0.07, 0.72, 0]}>
        <boxGeometry args={[0.04, 1.44, CLEN]}/>
        <meshStandardMaterial color="#7a9a6a" roughness={0.75}/>
      </mesh>
      <mesh position={[CW-0.07, 0.72, 0]}>
        <boxGeometry args={[0.04, 1.44, CLEN]}/>
        <meshStandardMaterial color="#7a9a6a" roughness={0.75}/>
      </mesh>
      {/* Wainscoting panel recesses */}
      {Array.from({length:Math.floor(CLEN/1.4)}, (_,i) => {
        const z = -halfLen + i*1.4 + 0.7;
        return (
          <group key={i}>
            <mesh position={[-CW+0.078, 0.72, z]}>
              <boxGeometry args={[0.022, 1.28, 1.12]}/>
              <meshStandardMaterial color="#6a8a5a" roughness={0.78}/>
            </mesh>
            <mesh position={[CW-0.078, 0.72, z]}>
              <boxGeometry args={[0.022, 1.28, 1.12]}/>
              <meshStandardMaterial color="#6a8a5a" roughness={0.78}/>
            </mesh>
          </group>
        );
      })}

      {/* Chair rail */}
      <mesh position={[-CW+0.07, 1.46, 0]}>
        <boxGeometry args={[0.055, 0.055, CLEN]}/>
        <meshStandardMaterial color="#d4c890" metalness={0.14} roughness={0.52}/>
      </mesh>
      <mesh position={[CW-0.07, 1.46, 0]}>
        <boxGeometry args={[0.055, 0.055, CLEN]}/>
        <meshStandardMaterial color="#d4c890" metalness={0.14} roughness={0.52}/>
      </mesh>

      {/* ── CEILING ── */}
      <mesh position={[0, CH, 0]}>
        <boxGeometry args={[CW*2, 0.08, CLEN]}/>
        <meshStandardMaterial color="#f8f4ec" roughness={0.92}/>
      </mesh>
      {/* Crown molding */}
      <mesh position={[-CW+0.07, CH-0.06, 0]}>
        <boxGeometry args={[0.09, 0.12, CLEN]}/>
        <meshStandardMaterial color="#e8e0c8" roughness={0.8}/>
      </mesh>
      <mesh position={[CW-0.07, CH-0.06, 0]}>
        <boxGeometry args={[0.09, 0.12, CLEN]}/>
        <meshStandardMaterial color="#e8e0c8" roughness={0.8}/>
      </mesh>

      {/* ── CEILING LIGHTS ── */}
      {Array.from({length:Math.floor(CLEN/5)+1}, (_,i) => {
        const z = -halfLen + i*5 + 2;
        return (
          <group key={i}>
            <mesh position={[0, CH-0.01, z]}>
              <boxGeometry args={[CW*1.2, 0.01, 2.8]}/>
              <meshStandardMaterial color="white"
                emissive={new THREE.Color('#fff8ec')} emissiveIntensity={2.0} toneMapped={false}/>
            </mesh>
            <rectAreaLight position={[0, CH-0.12, z]}
              rotation={[-Math.PI/2,0,0]}
              width={CW*1.8} height={1.0}
              intensity={18} color="#fff8ec"/>
          </group>
        );
      })}

      {/* ── BASEBOARD ── */}
      <mesh position={[-CW+0.07, 0.08, 0]}>
        <boxGeometry args={[0.05, 0.15, CLEN]}/>
        <meshStandardMaterial color="#c8c0a0" roughness={0.65}/>
      </mesh>
      <mesh position={[CW-0.07, 0.08, 0]}>
        <boxGeometry args={[0.05, 0.15, CLEN]}/>
        <meshStandardMaterial color="#c8c0a0" roughness={0.65}/>
      </mesh>

      {/* ── ROMAN COLUMNS — engaged pilasters on both walls ── */}
      {columnZPositions.map(z => (
        <group key={z}>
          <RomanColumn side="left"  z={z}/>
          <RomanColumn side="right" z={z}/>
        </group>
      ))}

      {/* ── FAR END WALL ── */}
      <mesh position={[0, CH/2, -halfLen-0.1]}>
        <boxGeometry args={[CW*2, CH, 0.14]}/>
        <meshStandardMaterial color="#f0ebd8" roughness={0.88}/>
      </mesh>
    </group>
  );
}


// ─── Camera ───────────────────────────────────────────────────────────────────
function CameraRig({ onStateChange, onInteract }: {
  onStateChange: (pos: THREE.Vector3, yaw: number) => void;
  onInteract:    (pos: THREE.Vector3, yaw: number) => void;
}) {
  const keys      = useInput();
  const targetZ   = useRef(CAMERA_START_Z);
  const targetYaw = useRef(0);
  const curYaw    = useRef(0);
  const camX      = useRef(0);
  const didInit   = useRef(false);
  const enterWas  = useRef(false);

  useFrame((state, dt) => {
    const cam = state.camera;
    if (!didInit.current) {
      cam.position.set(0, 1.65, CAMERA_START_Z);
      didInit.current = true;
    }

    const dirX = -Math.sin(curYaw.current);
    const dirZ = -Math.cos(curYaw.current);

    if (keys.current.fwd)  { camX.current += dirX*SPEED*dt; targetZ.current += dirZ*SPEED*dt; }
    if (keys.current.back) { camX.current -= dirX*SPEED*dt; targetZ.current -= dirZ*SPEED*dt; }

    targetZ.current = Math.max(CAMERA_END_Z, Math.min(CAMERA_START_Z, targetZ.current));
    camX.current    = Math.max(-CW*0.65, Math.min(CW*0.65, camX.current));

    if (keys.current.left)  targetYaw.current += TURN_SPD*dt;
    if (keys.current.right) targetYaw.current -= TURN_SPD*dt;
    targetYaw.current = Math.max(-Math.PI*0.46, Math.min(Math.PI*0.46, targetYaw.current));

    cam.position.z = THREE.MathUtils.lerp(cam.position.z, targetZ.current, LERP_P);
    cam.position.x = THREE.MathUtils.lerp(cam.position.x, camX.current,    LERP_P);
    cam.position.y = 1.65;
    curYaw.current  = THREE.MathUtils.lerp(curYaw.current, targetYaw.current, LERP_R);

    _euler.set(0, curYaw.current, 0, 'YXZ');
    cam.rotation.copy(_euler);

    if (keys.current.enter && !enterWas.current) {
      enterWas.current = true;
      onInteract(cam.position.clone(), curYaw.current);
    }
    if (!keys.current.enter) enterWas.current = false;

    onStateChange(cam.position.clone(), curYaw.current);
  });

  return null;
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function SceneInner({
  onCameraZChange, onSectionOpen, corridorPhotos,
}: {
  onCameraZChange: (z: number) => void;
  onSectionOpen:   (id: SectionId) => void;
  corridorPhotos:  CorridorPhoto[];
}) {
  const [camState, setCamState] = useState({
    pos: new THREE.Vector3(0, 1.65, CAMERA_START_Z), yaw: 0,
  });
  const [openDoor, setOpenDoor] = useState<SectionId | null>(null);

  const handleStateChange = useCallback((pos: THREE.Vector3, yaw: number) => {
    setCamState({ pos, yaw });
    onCameraZChange(pos.z);

    // Auto-close if player turns away from open door
    if (openDoor) {
      const section = CORRIDOR_SECTIONS.find(s => s.id === openDoor);
      if (section) {
        const dot = getDotToDoor(pos, yaw, section);
        if (dot < CLOSE_DOT) {
          setOpenDoor(null);
        }
      }
    }
  }, [onCameraZChange, openDoor]);

  const handleInteract = useCallback((pos: THREE.Vector3, yaw: number) => {
    const target = CORRIDOR_SECTIONS.find(s => {
      const distZ = Math.abs(pos.z - s.zPos);
      return distZ < 4.5 && getDotToDoor(pos, yaw, s) > FACE_DOT;
    });
    if (!target) return;
    if (openDoor === target.id) {
      setOpenDoor(null); // toggle close
    } else {
      setOpenDoor(target.id);
      onSectionOpen(target.id);
    }
  }, [openDoor, onSectionOpen]);

  // Expose close for X button from parent
  useEffect(() => {
    const handler = () => setOpenDoor(null);
    window.addEventListener('corridor:closedoor' as never, handler as EventListener);
    return () => window.removeEventListener('corridor:closedoor' as never, handler as EventListener);
  }, []);

  return (
    <>
      <CameraRig onStateChange={handleStateChange} onInteract={handleInteract}/>

      {/* Lighting — soft and cinematic, no harsh spotlights */}
      <ambientLight intensity={1.2} color="#fff8ec"/>
      <directionalLight position={[2, 5, 3]} intensity={0.9} color="#fffbf0"
        castShadow shadow-mapSize-width={512} shadow-mapSize-height={512}/>
      <directionalLight position={[-2, 3, -15]} intensity={0.5} color="#e8f0d8"/>

      <CorridorShell/>

      {/* Picture frames — photos from Sanity */}
      {FRAME_POSITIONS.map((fp: { z: number; side: 'left'|'right' }, i: number) => {
        const photo = corridorPhotos.find(p => p.frameIndex === i);
        const textureUrl = photo?.image
          ? urlFor(photo.image).width(600).height(760).fit('crop').url()
          : undefined;
        return (
          <PictureFrame key={i} side={fp.side} z={fp.z} textureUrl={textureUrl}/>
        );
      })}

      {/* Doors */}
      {CORRIDOR_SECTIONS.map(section => {
        const dot    = getDotToDoor(camState.pos, camState.yaw, section);
        const distZ  = Math.abs(camState.pos.z - section.zPos);
        const distX  = Math.abs(camState.pos.x - (section.side === 'left' ? -CW : CW));
        const close  = distZ < 4.5 && distX < CW * 1.4;
        const facing = close && dot > FACE_DOT;
        const isOpen = openDoor === section.id;
        return (
          <CorridorDoor
            key={section.id}
            section={section}
            facing={facing}
            isOpen={isOpen}
            onOpen={() => {
              setOpenDoor(section.id);
              onSectionOpen(section.id);
            }}
          />
        );
      })}

      <fog attach="fog" args={['#e8e4d4', 18, 55]}/>
    </>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export function CorridorScene({
  onCameraZChange, onSectionOpen, corridorPhotos,
}: {
  onCameraZChange: (z: number) => void;
  onSectionOpen:   (id: SectionId) => void;
  corridorPhotos:  CorridorPhoto[];
}) {
  return (
    <Canvas
      shadows={{ type: 2 }}
      gl={{ antialias:true, alpha:false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15 }}
      camera={{ fov:70, near:0.1, far:75 }}
      style={{ background:'#e8e4d4', touchAction: 'none' }}
    >
      <SceneInner
        onCameraZChange={onCameraZChange}
        onSectionOpen={onSectionOpen}
        corridorPhotos={corridorPhotos}
      />
    </Canvas>
  );
}

export default CorridorScene;