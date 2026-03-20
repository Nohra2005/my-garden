'use client';
// src/components/LanguageToggle.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Globe } from 'lucide-react';

type Lang = 'en' | 'fr' | 'ar';

const LABELS: Record<Lang, string> = { en: 'EN', fr: 'FR', ar: 'عر' };
const LANGS: Lang[] = ['en', 'fr', 'ar'];

export function LanguageToggle() {
  const [lang, setLang]         = useState<Lang>('en');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
      <motion.button
        onClick={() => setMenuOpen(v => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: 20, padding: '7px 14px',
          color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: 12,
          cursor: 'pointer', letterSpacing: '0.08em',
        }}
      >
        <Globe size={13} strokeWidth={2.2} />
        {LABELS[lang]}
      </motion.button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.92 }}
            transition={{ duration: 0.16 }}
            style={{
              display: 'flex', flexDirection: 'column', gap: 2,
              background: 'rgba(20,24,36,0.92)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 12, padding: 6,
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            {LANGS.map(l => (
              <button key={l}
                onClick={() => { setLang(l); setMenuOpen(false); }}
                style={{
                  padding: '6px 14px', borderRadius: 8, fontWeight: 700, fontSize: 12,
                  textAlign: 'left', cursor: 'pointer', border: 'none', letterSpacing: '0.06em',
                  background: lang === l ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: lang === l ? 'white' : 'rgba(255,255,255,0.5)',
                  transition: 'all 0.15s',
                }}
              >
                {LABELS[l]}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}