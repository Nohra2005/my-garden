'use client';
// src/components/panels/ContactPanel.tsx
import { Mail, Phone, Linkedin, Github } from 'lucide-react';
import { PanelBase } from './PanelBase';
import { CORRIDOR_SECTIONS } from '@/types/corridor';
import type { About } from '@/types/sanity.types';

interface Props { about: About; isOpen: boolean; onClose: () => void; }

export function ContactPanel({ about, isOpen, onClose }: Props) {
  return (
    <PanelBase section={CORRIDOR_SECTIONS.find(s => s.id === 'contact')!} isOpen={isOpen} onClose={onClose}>
      <p style={{ fontSize: 14, color: '#5a7a48', lineHeight: 1.7,
        margin: '0 0 24px', fontFamily: 'Georgia, serif' }}>
        I&apos;m always open to new opportunities, interesting problems, and good conversations.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {about.email && (
          <a href={`mailto:${about.email}`}
            style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#2d4a22',
              padding: '14px 18px', borderRadius: 12, border: '1px solid rgba(232,121,249,0.3)',
              background: 'rgba(232,121,249,0.08)', textDecoration: 'none', fontWeight: 600 }}>
            <Mail size={16} color="#e879f9" />{about.email}
          </a>
        )}
        {about.phone && (
          <a href={`tel:${about.phone.replace(/\s/g, '')}`}
            style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#2d4a22',
              padding: '14px 18px', borderRadius: 12, border: '1px solid rgba(232,121,249,0.2)',
              background: 'rgba(90,130,60,0.05)', textDecoration: 'none', fontWeight: 500 }}>
            <Phone size={16} color="#e879f9" />{about.phone}
          </a>
        )}
        {about.linkedinUrl && (
          <a href={about.linkedinUrl} target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#2d4a22',
              padding: '14px 18px', borderRadius: 12, border: '1px solid rgba(232,121,249,0.2)',
              background: 'rgba(90,130,60,0.05)', textDecoration: 'none', fontWeight: 500 }}>
            <Linkedin size={16} color="#e879f9" />linkedin.com/in/tatiana-nohra
          </a>
        )}
        {about.githubUrl && (
          <a href={about.githubUrl} target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#2d4a22',
              padding: '14px 18px', borderRadius: 12, border: '1px solid rgba(232,121,249,0.2)',
              background: 'rgba(90,130,60,0.05)', textDecoration: 'none', fontWeight: 500 }}>
            <Github size={16} color="#e879f9" />GitHub
          </a>
        )}
      </div>
    </PanelBase>
  );
}