export type TabType = 'translator' | 'doomscroll' | 'quiz' | 'soundboard' | 'mememaker' | 'profile';

export type IntensityLevel = 'mild' | 'cooked' | 'terminally_online';

export interface SlangEntry {
  slang: string;
  normal: string;
  definition: string;
  example: string;
  category?: 'reaction' | 'compliment' | 'insult' | 'lifestyle' | 'absurd';
}

export interface PostItem {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  badge?: string;
  content: string;
  tag: string;
  likes: number;
  comments: number;
  shares: number;
  rotPoints: number;
  timestamp: string;
  mediaType?: 'quote' | 'alert' | 'stat' | 'code' | 'reaction';
  mediaContent?: string;
  isLiked?: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  context?: string;
  options: {
    label: string;
    text: string;
    points: number; // 1 to 5 points of "cookedness"
    flavor: string;
  }[];
}

export interface QuizResult {
  title: string;
  level: number;
  percentage: number;
  badge: string;
  diagnosis: string;
  prescription: string;
  color: string;
}

export interface SoundEffect {
  id: string;
  name: string;
  emoji: string;
  shortcut: string;
  tag: string;
  color: string;
  desc: string;
  play: (ctx: AudioContext, destination: AudioNode) => void;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlockedAt?: string;
}

export interface UserProfile {
  xp: number;
  streak: number;
  lastActiveDate: string;
  unlockedAchievements: string[];
  totalTranslations: number;
  totalScrolls: number;
  totalSoundsPlayed: number;
  totalMemesCreated: number;
  quizScore?: number;
  quizRank?: string;
}

export type RankTier = {
  title: string;
  minXp: number;
  color: string;
  badge: string;
  tagline: string;
};
