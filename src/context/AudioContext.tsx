import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { SOUND_EFFECTS } from '../features/soundboard/synthesizer';

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playSound: (id: string) => void;
  playUiClick: () => void;
  volume: number;
  setVolume: (v: number) => void;
  activePlayingId: string | null;
}

const AudioContextInstance = createContext<AudioContextType | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    return localStorage.getItem('cooked_muted') === 'true';
  });
  const [volume, setVolumeState] = useState<number>(0.8);
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  // Initialize Web Audio Context lazily on first user gesture
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtxClass();
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime);
      gain.connect(ctx.destination);

      audioCtxRef.current = ctx;
      masterGainRef.current = gain;
    } else if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    localStorage.setItem('cooked_muted', String(next));
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(next ? 0 : volume, audioCtxRef.current.currentTime);
    }
  };

  const setVolume = (v: number) => {
    setVolumeState(v);
    if (masterGainRef.current && audioCtxRef.current && !isMuted) {
      masterGainRef.current.gain.setValueAtTime(v, audioCtxRef.current.currentTime);
    }
  };

  const playSound = (id: string) => {
    if (isMuted) return;
    initAudio();
    if (!audioCtxRef.current || !masterGainRef.current) return;

    const sound = SOUND_EFFECTS.find((s) => s.id === id);
    if (!sound) return;

    try {
      sound.play(audioCtxRef.current, masterGainRef.current);
      setActivePlayingId(id);
      setTimeout(() => {
        setActivePlayingId((curr) => (curr === id ? null : curr));
      }, 400);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  };

  // Subtle snappy micro-interaction click sound for buttons
  const playUiClick = () => {
    if (isMuted) return;
    initAudio();
    if (!audioCtxRef.current || !masterGainRef.current) return;

    try {
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.05);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(masterGainRef.current);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Ignore click sound error
    }
  };

  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(isMuted ? 0 : volume, audioCtxRef.current.currentTime);
    }
  }, [isMuted, volume]);

  return (
    <AudioContextInstance.Provider
      value={{
        isMuted,
        toggleMute,
        playSound,
        playUiClick,
        volume,
        setVolume,
        activePlayingId,
      }}
    >
      {children}
    </AudioContextInstance.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContextInstance);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
