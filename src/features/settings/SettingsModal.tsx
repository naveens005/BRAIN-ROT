import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, Eye, EyeOff, Volume2, VolumeX, ShieldCheck, Trash2, Sparkles } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useAudio } from '../../context/AudioContext';
import { useUser } from '../../context/UserContext';

export const SettingsModal: React.FC = () => {
  const {
    settingsModalOpen,
    setSettingsModalOpen,
    apiKey,
    setApiKey,
    reducedMotion,
    setReducedMotion,
  } = useSettings();

  const { isMuted, toggleMute, volume, setVolume, playSound, playUiClick } = useAudio();
  const { resetProgress, unlockAchievement } = useUser();

  const [inputKey, setInputKey] = useState<string>(apiKey);
  const [showKey, setShowKey] = useState<boolean>(false);
  const [savedAlert, setSavedAlert] = useState<boolean>(false);
  const [resetConfirm, setResetConfirm] = useState<boolean>(false);

  if (!settingsModalOpen) return null;

  const handleSaveKey = () => {
    playUiClick();
    setApiKey(inputKey);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  const handleClearKey = () => {
    playUiClick();
    setInputKey('');
    setApiKey('');
  };

  const handleResetData = () => {
    playUiClick();
    resetProgress();
    setResetConfirm(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative max-w-lg w-full bg-zinc-900 border-4 border-zinc-700 shadow-[8px_8px_0px_0px_#ec4899] p-6 text-zinc-100 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b-2 border-zinc-700 mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⚙️</span>
              <h2 className="text-xl font-black uppercase tracking-wider font-heading text-pink-400">
                COOKED SETTINGS
              </h2>
            </div>
            <button
              onClick={() => {
                playUiClick();
                setSettingsModalOpen(false);
              }}
              className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section 1: AI Provider Key */}
          <div className="mb-6 bg-zinc-950 p-4 border-2 border-zinc-800 rounded">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center text-sm font-bold uppercase tracking-wider text-cyan-400">
                <Key className="w-4 h-4 mr-2" /> Custom AI API Key (Optional)
              </label>
              <span className="text-[11px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono">
                Prompt 3 AI Mode
              </span>
            </div>

            <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
              Paste your Gemini API key (<code className="text-pink-400">AIzaSy...</code>) or OpenAI key to enable live AI neural rot and AI meme captions.
              <br />
              <strong className="text-zinc-200">Security Guarantee:</strong> Kept strictly in your browser’s localStorage. Never sent to any 3rd party backend.
            </p>

            <div className="relative mb-3">
              <input
                id="api-key-input"
                type={showKey ? 'text' : 'password'}
                placeholder="AIzaSy... or sk-..."
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="w-full bg-zinc-900 border-2 border-zinc-700 px-3 py-2 text-sm font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-cyan-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-2.5 text-zinc-400 hover:text-zinc-200"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex space-x-2">
              <button
                id="save-api-key-btn"
                onClick={handleSaveKey}
                className="flex-1 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs uppercase tracking-wider neo-btn"
              >
                Save Key
              </button>
              {inputKey && (
                <button
                  onClick={handleClearKey}
                  className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold uppercase"
                >
                  Clear
                </button>
              )}
            </div>

            {savedAlert && (
              <p className="text-xs text-green-400 font-bold mt-2 flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1" /> Key saved to browser localStorage!
              </p>
            )}
          </div>

          {/* Section 2: Motion Accessibility */}
          <div className="mb-6 bg-zinc-950 p-4 border-2 border-zinc-800 rounded">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-pink-400">
                  Reduced Motion Mode
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Disables screen shaking, aggressive glitch text, and flashing animations.
                </p>
              </div>
              <button
                id="toggle-reduced-motion-btn"
                onClick={() => {
                  playUiClick();
                  setReducedMotion(!reducedMotion);
                }}
                className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded border-2 ${
                  reducedMotion
                    ? 'bg-green-500 text-black border-black'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700'
                }`}
              >
                {reducedMotion ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
          </div>

          {/* Section 3: Audio Settings */}
          <div className="mb-6 bg-zinc-950 p-4 border-2 border-zinc-800 rounded">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {isMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-green-400" />}
                <span className="text-sm font-bold uppercase tracking-wider">
                  Global Mute: {isMuted ? 'Muted' : 'Sound On'}
                </span>
              </div>
              <button
                id="modal-toggle-mute-btn"
                onClick={() => {
                  toggleMute();
                  if (!isMuted) unlockAchievement('zen_mode');
                }}
                className={`px-3 py-1.5 text-xs font-black uppercase rounded ${
                  isMuted ? 'bg-rose-600 text-white' : 'bg-green-600 text-white'
                }`}
              >
                {isMuted ? 'UNMUTE' : 'MUTE'}
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Master Volume</span>
                <span>{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                disabled={isMuted}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full accent-pink-500 h-2 bg-zinc-800 rounded-lg cursor-pointer disabled:opacity-30"
              />
              <button
                onClick={() => playSound('vine_boom')}
                disabled={isMuted}
                className="mt-2 text-xs py-1 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded font-semibold flex items-center space-x-1 disabled:opacity-30"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1 text-yellow-400" /> Test Vine Boom
              </button>
            </div>
          </div>

          {/* Section 4: Data Reset */}
          <div className="pt-2 border-t-2 border-zinc-800">
            {!resetConfirm ? (
              <button
                onClick={() => setResetConfirm(true)}
                className="w-full py-2 bg-zinc-900 hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 border border-rose-900 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 rounded"
              >
                <Trash2 className="w-4 h-4" />
                <span>Reset User XP & Achievements</span>
              </button>
            ) : (
              <div className="bg-rose-950/70 p-3 border-2 border-rose-600 rounded text-center">
                <p className="text-xs text-rose-200 font-bold mb-2">
                  Are you sure? This deletes all your XP, ranks, and streaks!
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={handleResetData}
                    className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase"
                  >
                    Confirm Reset
                  </button>
                  <button
                    onClick={() => setResetConfirm(false)}
                    className="flex-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs uppercase"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
