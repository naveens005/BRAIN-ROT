import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export const AchievementToast: React.FC = () => {
  const { recentUnlocked } = useUser();

  if (!recentUnlocked) return null;

  return (
    <AnimatePresence>
      <div className="fixed top-18 right-4 z-50 pointer-events-none select-none max-w-sm w-full">
        <motion.div
          initial={{ y: -40, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -20, opacity: 0, scale: 0.9 }}
          className="bg-zinc-950 border-3 border-yellow-400 p-4 shadow-[6px_6px_0px_0px_#000000] flex items-center space-x-3 rounded"
        >
          <div className="p-2.5 bg-yellow-400 text-black rounded font-black">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-1 text-xs font-black uppercase text-yellow-400 tracking-wider font-heading">
              <Sparkles className="w-3 h-3" />
              <span>ACHIEVEMENT UNLOCKED!</span>
            </div>
            <p className="text-base font-extrabold text-white font-heading mt-0.5">
              {recentUnlocked}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
