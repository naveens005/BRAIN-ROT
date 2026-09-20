import React, { useEffect } from 'react';
import { Volume2, VolumeX, Keyboard, Zap } from 'lucide-react';

import { SOUND_EFFECTS } from './synthesizer';
import { useAudio } from '../../context/AudioContext';
import { useUser } from '../../context/UserContext';
import { useSettings } from '../../context/SettingsContext';

export const SoundboardView: React.FC = () => {
  const { playSound, isMuted, toggleMute, volume, setVolume, activePlayingId } = useAudio();
  const { addXp, incrementStat, unlockAchievement } = useUser();
  const { triggerScreenShake } = useSettings();

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const pressedKey = e.key.toUpperCase();
      const matchedSound = SOUND_EFFECTS.find(
        (s) => s.shortcut.toUpperCase() === pressedKey
      );

      if (matchedSound) {
        e.preventDefault();
        playSound(matchedSound.id);
        incrementStat('totalSoundsPlayed');
        addXp(5, 'Keyboard Sound Trigger');
        unlockAchievement('hotkey_master');

        if (['vine_boom', 'metal_pipe', 'sub_drop'].includes(matchedSound.id)) {
          triggerScreenShake(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playSound, incrementStat, addXp, unlockAchievement, triggerScreenShake]);

  const handlePadClick = (id: string) => {
    playSound(id);
    incrementStat('totalSoundsPlayed');
    addXp(3, 'Soundboard Pad');

    if (['vine_boom', 'metal_pipe'].includes(id)) {
      triggerScreenShake(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/30 text-green-400 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase">
          <Zap className="w-3.5 h-3.5" />
          <span>100% SYNTHESIZED WEB AUDIO ENGINE</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black uppercase font-heading tracking-tight text-white">
          CHAOS SOUNDBOARD
        </h1>
        <p className="text-zinc-400 text-sm md:text-base max-w-lg mx-auto">
          16 pure synthesized meme SFX crafted in the Web Audio API. Zero copyrighted samples. Hit keyboard shortcuts or tap pads to blast audio.
        </p>
      </div>

      {/* Control Bar */}
      <div className="bg-zinc-900 border-2 border-zinc-800 p-4 rounded-xl shadow-[4px_4px_0px_0px_#000000] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            id="soundboard-mute-toggle"
            onClick={toggleMute}
            className={`px-3 py-2 rounded-lg font-black text-xs uppercase flex items-center space-x-2 border-2 transition-all cursor-pointer ${
              isMuted
                ? 'bg-rose-900/50 border-rose-500 text-rose-300'
                : 'bg-green-900/50 border-green-500 text-green-300'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isMuted ? 'UNMUTE MASTER' : 'MUTED OFF'}</span>
          </button>

          <div className="hidden sm:flex items-center space-x-2 text-xs text-zinc-400">
            <span>Vol:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              disabled={isMuted}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="accent-pink-500 w-24 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center space-x-1.5 text-xs text-zinc-400 font-mono">
          <Keyboard className="w-4 h-4 text-cyan-400" />
          <span>Shortcuts: [1-8], [Q-I]</span>
        </div>
      </div>

      {/* Sound Pads Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {SOUND_EFFECTS.map((sound) => {
          const isPlaying = activePlayingId === sound.id;

          return (
            <button
              key={sound.id}
              id={`sound-pad-${sound.id}`}
              onClick={() => handlePadClick(sound.id)}
              className={`relative p-4 rounded-2xl border-3 text-left transition-all duration-100 flex flex-col justify-between min-h-[120px] select-none cursor-pointer group ${
                isPlaying
                  ? 'border-yellow-300 bg-yellow-400/20 scale-95 shadow-[1px_1px_0px_0px_#ffffff]'
                  : 'border-zinc-700 bg-zinc-900/90 hover:border-pink-500 shadow-[5px_5px_0px_0px_#000000] hover:-translate-y-1'
              }`}
            >
              {/* Top Row: Emoji & Hotkey badge */}
              <div className="flex items-center justify-between w-full">
                <span className="text-3xl group-hover:scale-110 transition-transform">
                  {sound.emoji}
                </span>
                <span className="w-7 h-7 rounded-lg bg-zinc-950 border border-zinc-700 flex items-center justify-center font-mono font-black text-xs text-cyan-400 group-hover:border-pink-400">
                  {sound.shortcut}
                </span>
              </div>

              {/* Bottom Row: Name & Tag */}
              <div className="mt-3">
                <div className="font-heading font-black text-xs md:text-sm text-white uppercase tracking-tight group-hover:text-pink-400 truncate">
                  {sound.name}
                </div>
                <div className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">
                  {sound.desc}
                </div>
              </div>

              {/* Active Sound Indicator Ring */}
              {isPlaying && (
                <span className="absolute inset-0 rounded-2xl border-2 border-yellow-400 animate-ping pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
