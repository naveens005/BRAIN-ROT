import React, { useEffect, useState } from 'react';
import { useSettings } from '../../context/SettingsContext';

interface Particle {
  id: number;
  emoji: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const EMOJIS = ['💀', '🗿', '🔥', '🚽', '🧠', '✨', '⚡', '🍔', '🤫'];

export const EmojiParticles: React.FC = () => {
  const { reducedMotion } = useSettings();
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (reducedMotion) {
      setParticles([]);
      return;
    }

    // Generate 12 ambient floating background emojis
    const items: Particle[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      emoji: EMOJIS[i % EMOJIS.length],
      x: Math.random() * 95,
      y: Math.random() * 95,
      size: Math.floor(Math.random() * 16) + 18,
      duration: Math.floor(Math.random() * 8) + 12,
      delay: Math.floor(Math.random() * 5),
    }));

    setParticles(items);
  }, [reducedMotion]);

  if (reducedMotion || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute transition-opacity duration-1000 select-none"
          style={{
            left: `${p.x}vw`,
            top: `${p.y}vh`,
            fontSize: `${p.size}px`,
            opacity: 0.12,
            animation: `floatEmoji ${p.duration}s ease-in-out infinite alternate`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.emoji}
        </div>
      ))}
      <style>{`
        @keyframes floatEmoji {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(15deg); }
          100% { transform: translateY(-60px) rotate(-15deg); }
        }
      `}</style>
    </div>
  );
};
