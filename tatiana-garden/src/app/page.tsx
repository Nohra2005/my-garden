'use client';
import { motion } from 'framer-motion';
import { ProjectFlower } from '@/components/ProjectFlower';
import { SeedPacket } from '@/components/SeedPacket';
import { GardenShed } from '@/components/Shed';
import { LanguageToggle } from '@/components/LanguageToggle';

const projects = [
  { id: 1, title: "Locus", tech: ["YOLOv8", "AWS", "FastAPI"], desc: "Retail Visual Search Platform using CLIP ViT-B/16[cite: 24, 27]." },
  { id: 2, title: "Conut AI", tech: ["Microservices", "Python"], desc: "AI Ops platform with 5 FastAPI services for F&B optimization[cite: 28, 30]." },
  { id: 3, title: "Jumanji", tech: ["ESP32", "Sensors"], desc: "Smart board game with 24+ sensors and Gemini API[cite: 36, 38]." },
  { id: 4, title: "Sports App", tech: ["React Native", "Node.js"], desc: "Matchmaking & booking platform for Lebanese sports courts[cite: 32, 34]." }
];

export default function Home() {
  return (
    <main className="relative min-h-screen bg-linear-to-b from-[#f0f9ff] via-[#f0fdf4] to-[#fff7ed] overflow-hidden">
      <LanguageToggle />
      
      {/* Identity Section */}
      <section className="relative z-10 pt-24 pb-12 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-black text-green-950 tracking-tight">
            Tatiana Nohra
          </h1>
          <p className="text-lg md:text-xl text-green-800 mt-4 font-semibold tracking-wide uppercase">
            Computer Science & Engineering | AI Specialist | US Citizen [cite: 2, 4]
          </p>
          <p className="text-green-600 mt-2 max-w-2xl mx-auto italic">
            Presidential Merit Scholar at AUB with international exposure at the University of Sydney[cite: 5, 46].
          </p>
        </motion.div>
      </section>

      {/* Project Meadow */}
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-wrap justify-center gap-x-20 gap-y-32 relative z-10">
        {projects.map((proj, idx) => (
          <ProjectFlower 
            key={proj.id} 
            title={proj.title} 
            tech={proj.tech} 
            description={proj.desc} 
            index={idx}
          />
        ))}
      </div>

      <GardenShed />

      {/* Stable Wind-Blown Grass */}
      <div className="fixed bottom-0 left-0 w-full h-32 pointer-events-none flex items-end justify-around px-4 opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div 
            key={i}
            animate={{ height: [30, 50, 30], rotate: [-3, 3, -3] }}
            transition={{ repeat: Infinity, duration: 2 + (i % 4), ease: "easeInOut" }}
            className="w-1 bg-green-700 rounded-t-full origin-bottom"
          />
        ))}
      </div>

      <SeedPacket />
    </main>
  );
}