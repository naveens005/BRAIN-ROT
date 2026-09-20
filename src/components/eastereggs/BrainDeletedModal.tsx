import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../../context/SettingsContext';
import { useAudio } from '../../context/AudioContext';
import { useUser } from '../../context/UserContext';

export const BrainDeletedModal: React.FC = () => {
  const { brainDeletedModalOpen, setBrainDeletedModalOpen, triggerScreenShake } = useSettings();
  const { playSound, playUiClick } = useAudio();
  const { unlockAchievement, addXp } = useUser();

  const [clicksNeeded, setClicksNeeded] = useState<number>(5);
  const [isRestored, setIsRestored] = useState<boolean>(false);

  if (!brainDeletedModalOpen) return null;

  const handleDefragClick = () => {
    playUiClick();
    triggerScreenShake(false);
    const next = clicksNeeded - 1;
    setClicksNeeded(next);

    if (next <= 0) {
      setIsRestored(true);
      playSound('critical_win');
      unlockAchievement('brain_reboot');
      addXp(150);

      setTimeout(() => {
        setBrainDeletedModalOpen(false);
        setIsRestored(false);
        setClicksNeeded(5);
      }, 1500);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/95 backdrop-blur-md font-mono text-white select-none">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="max-w-xl w-full border-4 border-white bg-blue-900 p-6 md:p-8 shadow-[12px_12px_0px_0px_#000000]"
        >
          {!isRestored ? (
            <>
              <div className="flex items-center space-x-3 mb-4 border-b-2 border-white pb-3">
                <span className="text-3xl">:(</span>
                <h2 className="text-2xl font-black uppercase tracking-wider text-yellow-300">
                  CRITICAL ROT EXCEPTION
                </h2>
              </div>

              <p className="text-lg font-bold mb-4 text-cyan-200">
                Your brain ran into a problem and has been deleted to protect the remaining neurons.
              </p>

              <div className="bg-black/40 p-4 border border-blue-400/30 text-xs text-blue-200 mb-6 space-y-1 overflow-x-auto">
                <p>STOP_CODE: 0xDEAD_BRAIN_ROT</p>
                <p>FAULT_MODULE: TikTok_Infinite_Loop.sys</p>
                <p>MEM_DUMP: 0xSKIBIDI 0xRIZZ 0xGYATT 0xMOG</p>
                <p>NEURON_STATUS: 0 / 86,000,000,000 active</p>
              </div>

              <div className="text-center">
                <p className="text-sm font-semibold mb-3 text-yellow-200">
                  Tap the Defrost button rapidly to reboot your prefrontal cortex! ({clicksNeeded} clicks remaining)
                </p>
                <button
                  id="reboot-brain-btn"
                  onClick={handleDefragClick}
                  className="w-full py-4 bg-yellow-400 text-black font-black text-xl uppercase tracking-widest border-4 border-black hover:bg-yellow-300 active:translate-y-1 transition-all shadow-[4px_4px_0px_0px_#000000]"
                >
                  ⚡ REBOOT BRAIN ({clicksNeeded}) ⚡
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-6xl mb-4"
              >
                🧠✨
              </motion.div>
              <h3 className="text-2xl font-black text-green-400 mb-2">
                BRAIN RESTORED SUCCESSFULLY!
              </h3>
              <p className="text-sm text-cyan-200">
                +150 XP awarded for surviving the digital singularity.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
