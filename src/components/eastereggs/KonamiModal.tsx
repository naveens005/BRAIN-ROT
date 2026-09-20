import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../../context/SettingsContext';
import { useAudio } from '../../context/AudioContext';

export const KonamiModal: React.FC = () => {
  const { konamiModalOpen, setKonamiModalOpen } = useSettings();
  const { playUiClick } = useAudio();

  if (!konamiModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.8, rotate: -5, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative max-w-md w-full bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-600 border-4 border-black p-6 text-black shadow-[8px_8px_0px_0px_#ffffff] text-center"
        >
          <div className="text-6xl mb-2 animate-bounce">🗿👑</div>
          <h2 className="text-3xl font-black uppercase tracking-wider mb-2">
            KONAMI CODE ACTIVATED!
          </h2>
          <p className="font-extrabold text-sm mb-4 bg-black text-amber-300 py-1 px-2 uppercase tracking-wide">
            Golden GigaChad Mode Unlocked (+200 XP)
          </p>
          <p className="font-medium text-black/90 mb-6 text-sm">
            You just bypassed the security firewalls of Ohio. Your aura has officially broken the sound barrier.
          </p>

          <button
            onClick={() => {
              playUiClick();
              setKonamiModalOpen(false);
            }}
            className="w-full py-3 bg-black text-amber-400 font-black text-lg uppercase tracking-wider hover:bg-zinc-900 border-2 border-white shadow-[4px_4px_0px_0px_#ffffff] active:translate-y-1"
          >
            CLAIM 200 XP & RESUME MOGGING
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
