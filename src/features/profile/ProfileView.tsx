import React from 'react';
import { Trophy, Flame, Zap, Award, Sparkles, Lock } from 'lucide-react';
import { ACHIEVEMENTS, getRankTier, getNextRank } from './achievements';
import { useUser } from '../../context/UserContext';
import { useAudio } from '../../context/AudioContext';
import confetti from 'canvas-confetti';

export const ProfileView: React.FC = () => {
  const { profile } = useUser();
  const { playSound, playUiClick } = useAudio();


  const currentRank = getRankTier(profile.xp);
  const nextInfo = getNextRank(profile.xp);

  const unlockedCount = profile.unlockedAchievements.length;
  const totalCount = ACHIEVEMENTS.length;
  const achievementPercent = Math.round((unlockedCount / totalCount) * 100);

  const handleConfettiBlast = () => {
    playUiClick();
    playSound('critical_win');
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ec4899', '#a855f7', '#06b6d4', '#eab308', '#22c55e'],
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* View Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase">
          <Trophy className="w-3.5 h-3.5" />
          <span>OFFLINE LOCALSTORAGE STATUS</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black uppercase font-heading tracking-tight text-white">
          YOUR BRAIN ROT PROFILE
        </h1>
        <p className="text-zinc-400 text-sm md:text-base max-w-lg mx-auto">
          Track your progression from an oblivious civilian NPC to the Terminally Online Final Boss.
        </p>
      </div>

      {/* Hero Rank Card */}
      <div className={`relative bg-gradient-to-r ${currentRank.color} p-6 md:p-8 rounded-3xl border-4 border-black text-white shadow-[8px_8px_0px_0px_#ffffff] space-y-4`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider">
              {currentRank.badge}
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase font-heading mt-2">
              {currentRank.title}
            </h2>
            <p className="text-white/90 text-sm font-medium mt-1">
              {currentRank.tagline}
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 bg-black/30 p-3 rounded-2xl">
            <span className="text-3xl md:text-4xl font-black font-heading">{profile.xp}</span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-yellow-300">
              Total XP Earned
            </span>
          </div>
        </div>

        {/* Level Progression */}
        <div className="bg-black/40 p-4 rounded-2xl border border-white/20 space-y-2">
          <div className="flex justify-between text-xs font-mono font-bold uppercase">
            <span>
              {nextInfo.next ? `Next: ${nextInfo.next.title}` : 'MAX LEVEL ACHIEVED'}
            </span>
            <span>{nextInfo.next ? `${nextInfo.remaining} XP REMAINING` : 'ASCENDED'}</span>
          </div>
          <div className="w-full bg-black/50 h-3 rounded-full overflow-hidden border border-white/30">
            <div
              className="h-full bg-gradient-to-r from-yellow-300 via-white to-cyan-300 transition-all duration-500"
              style={{ width: `${nextInfo.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-zinc-900 border-2 border-zinc-700 p-4 rounded-2xl shadow-[4px_4px_0px_0px_#000000]">
          <div className="flex items-center space-x-2 text-amber-400 mb-1">
            <Flame className="w-4 h-4" />
            <span className="text-xs font-bold uppercase font-heading">Streak</span>
          </div>
          <div className="text-2xl font-black text-white font-heading">{profile.streak} Days</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">Active daily check-in</div>
        </div>

        <div className="bg-zinc-900 border-2 border-zinc-700 p-4 rounded-2xl shadow-[4px_4px_0px_0px_#000000]">
          <div className="flex items-center space-x-2 text-cyan-400 mb-1">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-bold uppercase font-heading">Translations</span>
          </div>
          <div className="text-2xl font-black text-white font-heading">{profile.totalTranslations}</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">Slang sentences baked</div>
        </div>

        <div className="bg-zinc-900 border-2 border-zinc-700 p-4 rounded-2xl shadow-[4px_4px_0px_0px_#000000]">
          <div className="flex items-center space-x-2 text-pink-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase font-heading">Doomscrolls</span>
          </div>
          <div className="text-2xl font-black text-white font-heading">{profile.totalScrolls}</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">Posts consumed</div>
        </div>

        <div className="bg-zinc-900 border-2 border-zinc-700 p-4 rounded-2xl shadow-[4px_4px_0px_0px_#000000]">
          <div className="flex items-center space-x-2 text-purple-400 mb-1">
            <Award className="w-4 h-4" />
            <span className="text-xs font-bold uppercase font-heading">Memes Baked</span>
          </div>
          <div className="text-2xl font-black text-white font-heading">{profile.totalMemesCreated}</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">Images crafted</div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-zinc-900 border-3 border-zinc-700 p-5 md:p-6 rounded-2xl shadow-[6px_6px_0px_0px_#000000] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-black uppercase text-white font-heading">
              ACHIEVEMENTS ({unlockedCount} / {totalCount})
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-yellow-400">{achievementPercent}% UNLOCKED</span>
            <button
              onClick={handleConfettiBlast}
              className="text-xs bg-yellow-400 hover:bg-yellow-300 text-black px-2.5 py-1 rounded font-black uppercase tracking-wider"
              title="Celebrate progress"
            >
              🎉 Confetti
            </button>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = profile.unlockedAchievements.includes(ach.id);

            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-xl border-2 transition-all flex items-start space-x-3 select-none ${
                  isUnlocked
                    ? 'border-yellow-400/80 bg-yellow-400/10 shadow-[2px_2px_0px_0px_#eab308]'
                    : 'border-zinc-800 bg-zinc-950/60 opacity-60'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0 ${
                  isUnlocked ? 'bg-yellow-400/20 text-yellow-300' : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {isUnlocked ? ach.icon : <Lock className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-white uppercase font-heading truncate">
                      {ach.title}
                    </span>
                    <span className="text-[10px] font-mono text-yellow-400 font-bold">
                      +{ach.xpReward} XP
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-tight">
                    {ach.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
