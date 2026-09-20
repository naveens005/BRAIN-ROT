import React, { useRef } from 'react';
import { Volume2, VolumeX, Settings, Flame, Trophy } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { useUser } from '../../context/UserContext';
import { useSettings } from '../../context/SettingsContext';
import { getRankTier } from '../../features/profile/achievements';

interface HeaderProps {
  onNavigateProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateProfile }) => {
  const { isMuted, toggleMute, playSound, playUiClick } = useAudio();
  const { profile } = useUser();
  const { setBrainDeletedModalOpen, setSettingsModalOpen, triggerScreenShake } = useSettings();

  const rank = getRankTier(profile.xp);

  // 7-tap detector on logo
  const tapCountRef = useRef<number>(0);
  const tapTimerRef = useRef<number | null>(null);

  const handleLogoTap = () => {
    playUiClick();
    tapCountRef.current += 1;

    if (tapTimerRef.current) {
      window.clearTimeout(tapTimerRef.current);
    }

    if (tapCountRef.current >= 7) {
      tapCountRef.current = 0;
      playSound('error_buzz');
      triggerScreenShake(true);
      setBrainDeletedModalOpen(true);
      return;
    }

    tapTimerRef.current = window.setTimeout(() => {
      tapCountRef.current = 0;
    }, 1800);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/90 backdrop-blur-md border-b-2 border-zinc-800 px-4 py-3 select-none">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Left: Glitch Logo & Easter Egg Trigger */}
        <div
          onClick={handleLogoTap}
          id="cooked-logo-btn"
          className="cursor-pointer group flex items-center space-x-2"
          title="Tapping 7 times might break your brain..."
        >
          <div className="relative font-black text-2xl md:text-3xl tracking-tighter uppercase font-heading">
            <span
              data-text="COOKED"
              className="glitch-text text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 font-extrabold"
            >
              COOKED
            </span>
          </div>
          <span className="text-xl md:text-2xl animate-pulse">🔥</span>
          <span className="hidden sm:inline-block text-[10px] font-mono font-bold bg-pink-500/20 text-pink-400 border border-pink-500/40 px-1.5 py-0.5 rounded uppercase">
            v2.0 ROT
          </span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Daily Streak */}
          <div
            className="flex items-center space-x-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2.5 py-1 rounded-full text-xs font-bold font-heading cursor-default"
            title="Daily Active Streak"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-bounce" />
            <span>{profile.streak}d</span>
          </div>

          {/* User Rank Pill */}
          <button
            onClick={() => {
              playUiClick();
              if (onNavigateProfile) onNavigateProfile();
            }}
            id="header-rank-badge"
            className={`hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r ${rank.color} text-white shadow-sm hover:scale-105 transition-transform`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>{rank.title.split(' ')[0]}</span>
            <span className="bg-black/30 px-1.5 py-0.2 rounded font-mono text-[10px]">
              {profile.xp} XP
            </span>
          </button>

          {/* Global Mute Toggle */}
          <button
            id="global-mute-btn"
            onClick={() => {
              toggleMute();
              playUiClick();
            }}
            className={`p-2 rounded-lg border-2 transition-all cursor-pointer ${
              isMuted
                ? 'bg-rose-950/40 border-rose-600 text-rose-400 hover:bg-rose-900/50'
                : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-cyan-400 hover:text-cyan-400'
            }`}
            title={isMuted ? 'Unmute audio' : 'Mute audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Settings Modal Button */}
          <button
            id="open-settings-btn"
            onClick={() => {
              playUiClick();
              setSettingsModalOpen(true);
            }}
            className="p-2 rounded-lg border-2 border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-pink-500 hover:text-pink-400 transition-all cursor-pointer"
            title="Settings & AI key"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
