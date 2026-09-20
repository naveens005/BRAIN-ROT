import type { Achievement, RankTier } from '../../types';


export const RANK_TIERS: RankTier[] = [
  {
    title: 'NPC Civilian',
    minXp: 0,
    color: 'from-zinc-500 to-zinc-700',
    badge: '👤 LEVEL 1',
    tagline: 'Oblivious mortal functioning in conventional society.',
  },
  {
    title: 'Skibidi Recruit',
    minXp: 150,
    color: 'from-blue-500 to-cyan-500',
    badge: '🚽 LEVEL 2',
    tagline: 'First symptoms of digital delirium detected.',
  },
  {
    title: 'Mewing Master',
    minXp: 450,
    color: 'from-emerald-500 to-teal-600',
    badge: '🤫 LEVEL 3',
    tagline: 'Jawline razor sharp, speaks only through glances.',
  },
  {
    title: 'Rizz God',
    minXp: 900,
    color: 'from-purple-500 to-pink-500',
    badge: '✨ LEVEL 4',
    tagline: 'Unspoken aura radiates within a 50-meter radius.',
  },
  {
    title: 'Certified Sigma',
    minXp: 1600,
    color: 'from-amber-500 to-red-600',
    badge: '🗿 LEVEL 5',
    tagline: 'Mogged the entire algorithm and broke the matrix.',
  },
  {
    title: 'TERMINAL FINAL BOSS',
    minXp: 2800,
    color: 'from-rose-500 via-purple-600 to-indigo-600',
    badge: '👑 LEVEL MAX',
    tagline: 'The supreme ruler of internet brain rot.',
  },
];

export function getRankTier(xp: number): RankTier {
  for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
    if (xp >= RANK_TIERS[i].minXp) {
      return RANK_TIERS[i];
    }
  }
  return RANK_TIERS[0];
}

export function getNextRank(xp: number): { next: RankTier | null; progress: number; remaining: number } {
  const current = getRankTier(xp);
  const currentIndex = RANK_TIERS.findIndex((r) => r.title === current.title);
  if (currentIndex >= RANK_TIERS.length - 1) {
    return { next: null, progress: 100, remaining: 0 };
  }
  const next = RANK_TIERS[currentIndex + 1];
  const range = next.minXp - current.minXp;
  const currentProgress = xp - current.minXp;
  const progress = Math.min(100, Math.max(0, Math.round((currentProgress / range) * 100)));
  const remaining = Math.max(0, next.minXp - xp);
  return { next, progress, remaining };
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_cook',
    title: 'First Cook',
    description: 'Translate your very first sentence into brain rot.',
    icon: '🍳',
    xpReward: 50,
  },
  {
    id: 'deep_translator',
    title: 'Ohio Polyglot',
    description: 'Complete 10 slang translations.',
    icon: '🗣️',
    xpReward: 100,
  },
  {
    id: 'reverse_scholar',
    title: 'Slang Decryptor',
    description: 'Use the reverse translator to decrypt brain rot into plain English.',
    icon: '🔍',
    xpReward: 60,
  },
  {
    id: 'doomscroll_novice',
    title: 'Dopamine Drip',
    description: 'Scroll through 12 fake posts in Doomscroll.',
    icon: '📱',
    xpReward: 75,
  },
  {
    id: 'doomscroll_fiend',
    title: 'Rot Meter 100%',
    description: 'Fill the Doomscroll Rot Meter completely to terminal chaos.',
    icon: '🧪',
    xpReward: 150,
  },
  {
    id: 'quiz_complete',
    title: 'Clinically Diagnosed',
    description: 'Complete the "How Cooked Are You?" 12-question quiz.',
    icon: '📋',
    xpReward: 120,
  },
  {
    id: 'card_download',
    title: 'Certified Cooked',
    description: 'Download your official Brain Rot evaluation card as PNG.',
    icon: '🪪',
    xpReward: 80,
  },
  {
    id: 'soundboard_spammer',
    title: 'Noise Hazard',
    description: 'Play 15 synthesized chaotic sound effects.',
    icon: '💥',
    xpReward: 90,
  },
  {
    id: 'hotkey_master',
    title: 'Keyboard Maestro',
    description: 'Trigger a sound using its physical keyboard hotkey.',
    icon: '⌨️',
    xpReward: 70,
  },
  {
    id: 'meme_creator',
    title: 'Meme Architect',
    description: 'Generate and download a custom meme from the Meme Maker.',
    icon: '🖼️',
    xpReward: 100,
  },
  {
    id: 'konami_master',
    title: 'Konami Sigma',
    description: 'Unlock the secret Easter Egg with the Konami Code.',
    icon: '🕹️',
    xpReward: 200,
  },
  {
    id: 'brain_reboot',
    title: 'Brain Defrosted',
    description: 'Survive the fake "Your Brain Has Been Deleted" crisis.',
    icon: '🧠',
    xpReward: 150,
  },
  {
    id: 'streak_keeper',
    title: 'Daily Rizzler',
    description: 'Maintain an active daily streak.',
    icon: '🔥',
    xpReward: 100,
  },
  {
    id: 'zen_mode',
    title: 'Ears Spared',
    description: 'Use the Global Mute switch to silence the chaos.',
    icon: '🔇',
    xpReward: 40,
  },
  {
    id: 'terminal_boss',
    title: 'Ascended Deity',
    description: 'Reach Level Max: Terminal Final Boss rank (2,800+ XP).',
    icon: '👑',
    xpReward: 300,
  },
];
