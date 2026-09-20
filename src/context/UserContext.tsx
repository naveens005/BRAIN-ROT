import React, { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import type { UserProfile } from '../types';
import { ACHIEVEMENTS, getRankTier } from '../features/profile/achievements';


interface UserContextType {
  profile: UserProfile;
  addXp: (amount: number, reason?: string) => void;
  unlockAchievement: (id: string) => void;
  incrementStat: (key: keyof Pick<UserProfile, 'totalTranslations' | 'totalScrolls' | 'totalSoundsPlayed' | 'totalMemesCreated'>) => void;
  recordQuizResult: (score: number, rankTitle: string) => void;
  resetProgress: () => void;
  recentUnlocked: string | null;
}

const STORAGE_KEY = 'cooked_user_profile_v1';

const DEFAULT_PROFILE: UserProfile = {
  xp: 0,
  streak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  unlockedAchievements: [],
  totalTranslations: 0,
  totalScrolls: 0,
  totalSoundsPlayed: 0,
  totalMemesCreated: 0,
};

const UserContextInstance = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_PROFILE, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to parse user profile from localStorage:', e);
    }
    return DEFAULT_PROFILE;
  });

  const [recentUnlocked, setRecentUnlocked] = useState<string | null>(null);

  // Check Daily Streak
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = profile.lastActiveDate;

    if (lastDate !== today) {
      const last = new Date(lastDate);
      const now = new Date(today);
      const diffTime = Math.abs(now.getTime() - last.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let newStreak = profile.streak;
      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }

      setProfile((prev) => {
        const updated = {
          ...prev,
          streak: newStreak,
          lastActiveDate: today,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  }, [profile.lastActiveDate]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#a855f7', '#06b6d4', '#22c55e', '#eab308'],
      });
    } catch {
      // Confetti fallback
    }
  };

  const addXp = (amount: number) => {
    setProfile((prev) => {
      const oldRank = getRankTier(prev.xp);
      const newXp = prev.xp + amount;
      const newRank = getRankTier(newXp);

      // Rank up celebration
      if (newRank.title !== oldRank.title) {
        triggerConfetti();
      }

      const updated = { ...prev, xp: newXp };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // Check max rank achievement
      if (newXp >= 2800 && !updated.unlockedAchievements.includes('terminal_boss')) {
        setTimeout(() => unlockAchievement('terminal_boss'), 500);
      }

      return updated;
    });
  };

  const unlockAchievement = (id: string) => {
    setProfile((prev) => {
      if (prev.unlockedAchievements.includes(id)) return prev;

      const achievement = ACHIEVEMENTS.find((a) => a.id === id);
      const xpReward = achievement?.xpReward || 50;
      const nextUnlocked = [...prev.unlockedAchievements, id];

      triggerConfetti();
      setRecentUnlocked(achievement?.title || id);
      setTimeout(() => setRecentUnlocked(null), 4500);

      const updated: UserProfile = {
        ...prev,
        xp: prev.xp + xpReward,
        unlockedAchievements: nextUnlocked,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const incrementStat = (key: keyof Pick<UserProfile, 'totalTranslations' | 'totalScrolls' | 'totalSoundsPlayed' | 'totalMemesCreated'>) => {
    setProfile((prev) => {
      const currentVal = (prev[key] || 0) + 1;
      const updated = { ...prev, [key]: currentVal };

      // Check threshold achievements
      if (key === 'totalTranslations') {
        if (currentVal >= 1 && !updated.unlockedAchievements.includes('first_cook')) {
          unlockAchievement('first_cook');
        }
        if (currentVal >= 10 && !updated.unlockedAchievements.includes('deep_translator')) {
          unlockAchievement('deep_translator');
        }
      } else if (key === 'totalScrolls') {
        if (currentVal >= 12 && !updated.unlockedAchievements.includes('doomscroll_novice')) {
          unlockAchievement('doomscroll_novice');
        }
      } else if (key === 'totalSoundsPlayed') {
        if (currentVal >= 15 && !updated.unlockedAchievements.includes('soundboard_spammer')) {
          unlockAchievement('soundboard_spammer');
        }
      } else if (key === 'totalMemesCreated') {
        if (currentVal >= 1 && !updated.unlockedAchievements.includes('meme_creator')) {
          unlockAchievement('meme_creator');
        }
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const recordQuizResult = (score: number, rankTitle: string) => {
    setProfile((prev) => {
      const updated: UserProfile = {
        ...prev,
        quizScore: score,
        quizRank: rankTitle,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    unlockAchievement('quiz_complete');
  };

  const resetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(DEFAULT_PROFILE);
  };

  return (
    <UserContextInstance.Provider
      value={{
        profile,
        addXp,
        unlockAchievement,
        incrementStat,
        recordQuizResult,
        resetProgress,
        recentUnlocked,
      }}
    >
      {children}
    </UserContextInstance.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContextInstance);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
