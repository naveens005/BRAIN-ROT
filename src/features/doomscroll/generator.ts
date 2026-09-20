import type { PostItem } from '../../types';


const FAKE_AUTHORS = [
  { name: 'Sigma Kai', handle: '@skibidi_kai_99', avatar: '🗿', badge: 'Certified Mogger' },
  { name: 'Livvy Fan Account', handle: '@dunne_glazer', avatar: '✨', badge: 'Rizz Historian' },
  { name: 'Baby Gronk Real', handle: '@gronk_season', avatar: '🏈', badge: 'Official NPC' },
  { name: 'Ohio National Guard', handle: '@ohio_border_patrol', avatar: '👽', badge: 'Anomalous Zone' },
  { name: 'Fanum Tax Inspector', handle: '@tax_your_fries', avatar: '🍔', badge: 'Food Police' },
  { name: 'Dr. Jawline MD', handle: '@mewing_specialist', avatar: '🤫', badge: 'Level 100 Jaw' },
  { name: 'Grimace Cultist', handle: '@purple_potion', avatar: '🟣', badge: 'Survivor' },
  { name: 'Discord Supreme Overlord', handle: '@mod_kitten_protect', avatar: '⚔️', badge: '100K Aura' },
  { name: 'Subway Surfer Pro', handle: '@hoverboard_demon', avatar: '🛹', badge: 'Coin Magnet' },
  { name: 'Quandale Dingle Real', handle: '@dingle_official', avatar: '👃', badge: 'Wanted Fugitive' },
  { name: 'Terminally Online AI', handle: '@cooked_neural_net', avatar: '🤖', badge: 'Zero Grass' },
  { name: 'GigaChad Daily', handle: '@pure_stoic_grind', avatar: '🦾', badge: 'Iron Jaw' },
];

const ABSURD_CAPTIONS = [
  'Bro tripped on an ant and lost 45,000 aura in broad daylight 💀💀',
  'POV: You forgot to mew during family dinner and your grandma mogged you into a coma.',
  'Chat is this real? My teacher just collected the fanum tax on my hall pass 😭',
  'Rank 1 Glazer caught in 4K reciting Baby Gronk lore at a funeral 📸',
  'Only in Ohio would the McDonald’s drive-thru demand a 15-second TikTok dance for chicken nuggets.',
  'Day 47 of edging my phone battery at 1% while listening to Brazilian phonk on 200% volume 🔊',
  'Just discovered my dog has unspoken rizz. He stared at the golden retriever and she handed over her chew toy.',
  'If you swipe past this video within 3 seconds, your jawline will recede by 4 millimeters tonight 🤫',
  'Lil bro really thought he was the main character until the Subway Surfers gameplay finished loading under him.',
  'I put Grimace shake in my humidifier and now my walls are whispering in Skibidi phonk.',
  'BREAKING: Scientists confirm touching grass restores 500 aura per square meter. Are you risking it?',
  'He hit the silent mewing nod so hard the earthquake detector in Japan registered a 4.2 magnitude.',
  'I showed my 80-year-old grandfather a Skibidi Toilet episode and he whispered "kino" with tears in his eyes.',
  'Can someone please tell blud that standing still in the hallway with sunglasses is NPC behavior 💀',
  'My screen time report just arrived: 23 hours and 54 minutes. The grind never stops 📈',
  'They asked me why I failed the driving test. I said I was paying attention to the Minecraft parkour in my peripheral vision.',
];

const MEDIA_PRESETS: { type: 'quote' | 'alert' | 'stat' | 'code' | 'reaction'; content: string }[] = [
  {
    type: 'alert',
    content: '🚨 ANOMALY ALERT: High concentration of brain rot detected in sector 7. Citizens advised to avoid looking at TikTok comments.',
  },
  {
    type: 'stat',
    content: '📊 AURA AUDIT:\n- Opening door for stranger: +50 Aura\n- Tripping on stairs: -2,500 Aura\n- Saying "chat is this real" in real life: -10,000 Aura',
  },
  {
    type: 'quote',
    content: '"He who mews in silence shall mog in public." — Ancient Sigma Proverb, 2024',
  },
  {
    type: 'reaction',
    content: '💀 🗿 🍷 😭 🚽 🗣️ 🔥 💯 (Audio: slowed + reverb phonk playing at 3:00 AM)',
  },
  {
    type: 'code',
    content: 'while (brain.isAlive()) {\n  doomscroll();\n  aura -= 100;\n  rotMeter += 5;\n}',
  },
];

const TAGS = ['#Cooked', '#OhioMoment', '#MewingGrind', '#SkibidiLore', '#AuraDebt', '#BrainMelt', '#SigmaLife'];

export function generatePost(index: number): PostItem {
  const author = FAKE_AUTHORS[Math.floor(Math.random() * FAKE_AUTHORS.length)];
  const caption = ABSURD_CAPTIONS[Math.floor(Math.random() * ABSURD_CAPTIONS.length)];
  const media = Math.random() > 0.3 ? MEDIA_PRESETS[Math.floor(Math.random() * MEDIA_PRESETS.length)] : undefined;
  const tag = TAGS[Math.floor(Math.random() * TAGS.length)];

  // Procedural counts
  const likes = Math.floor(Math.random() * 450000) + 1200;
  const comments = Math.floor(likes * (0.02 + Math.random() * 0.08));
  const shares = Math.floor(likes * (0.01 + Math.random() * 0.04));

  const timeMinutes = Math.floor(Math.random() * 59) + 1;
  const timestamp = `${timeMinutes}m ago`;

  return {
    id: `post-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
    author: author.name,
    handle: author.handle,
    avatar: author.avatar,
    badge: author.badge,
    content: caption,
    tag,
    likes,
    comments,
    shares,
    rotPoints: Math.floor(Math.random() * 5) + 3,
    timestamp,
    mediaType: media?.type,
    mediaContent: media?.content,
    isLiked: false,
  };
}

export function generateInitialPosts(count: number = 8): PostItem[] {
  return Array.from({ length: count }, (_, i) => generatePost(i));
}
