import type { QuizQuestion, QuizResult } from '../../types';


export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'You trip and fall in front of 30 strangers on the street. What is your immediate reaction?',
    options: [
      { label: 'A', text: 'Stand up, brush off my pants, apologize politely.', points: 1, flavor: 'NPC Energy' },
      { label: 'B', text: 'Laugh it off awkwardly and pretend to check my phone.', points: 2, flavor: 'Average Mortal' },
      { label: 'C', text: 'Calculate how many aura points were just obliterated from my account.', points: 4, flavor: 'Aura Deficit' },
      { label: 'D', text: 'Hit the silent mewing pose on the asphalt and mog everyone who saw.', points: 5, flavor: 'Terminally Cooked' },
    ],
  },
  {
    id: 2,
    question: 'How long is your average daily smartphone screen time?',
    options: [
      { label: 'A', text: '1 to 2 hours. I only use it for essential calls and texts.', points: 1, flavor: 'Grass Toucher' },
      { label: 'B', text: '3 to 5 hours. Normal social media and work.', points: 2, flavor: 'Regular Consumer' },
      { label: 'C', text: '7 to 10 hours. My eyes burn but the algorithm sustains me.', points: 4, flavor: 'Deep Fried Brain' },
      { label: 'D', text: '14+ hours. My phone is fused to my palm and I charge it 3 times a day.', points: 5, flavor: 'Cyber Zombie' },
    ],
  },
  {
    id: 3,
    question: 'Your friend reaches over and takes a French fry from your plate without asking. What happens?',
    options: [
      { label: 'A', text: '"Sure, enjoy! Take as many as you want."', points: 1, flavor: 'Pure Saint' },
      { label: 'B', text: 'Give them a playful glare and take one back.', points: 2, flavor: 'Standard Friend' },
      { label: 'C', text: 'Scream "FANUM TAX HAS BEEN COLLECTED" at top volume.', points: 4, flavor: 'TikTok Infected' },
      { label: 'D', text: 'Crash out entirely, flip the table, and demand 10,000 V-Bucks restitution.', points: 5, flavor: 'Full Psychosis' },
    ],
  },
  {
    id: 4,
    question: 'When was the last time your bare skin made contact with natural lawn grass?',
    options: [
      { label: 'A', text: 'This morning. I went for a pleasant walk in nature.', points: 1, flavor: 'Forest Guardian' },
      { label: 'B', text: 'A few days ago at a park or backyard.', points: 2, flavor: 'Healthy Baseline' },
      { label: 'C', text: 'Does watching 4K nature documentaries on YouTube count?', points: 4, flavor: 'Indoor Resident' },
      { label: 'D', text: 'Grass is government propaganda. Sunlight drains my sigma aura.', points: 5, flavor: 'Bunker Dweller' },
    ],
  },
  {
    id: 5,
    question: 'Someone cuts in front of you in line. How do you handle it?',
    options: [
      { label: 'A', text: 'Politely notify them that the line starts behind you.', points: 1, flavor: 'Conflict Solver' },
      { label: 'B', text: 'Say nothing but sigh loudly.', points: 2, flavor: 'Passive Aggressive' },
      { label: 'C', text: 'Give them the bombastic side eye and post about the opps.', points: 4, flavor: 'Online Warrior' },
      { label: 'D', text: 'Hold eye contact, press tongue to roof of mouth, and mog them out of existence.', points: 5, flavor: 'Mewing Assassin' },
    ],
  },
  {
    id: 6,
    question: 'What video plays in your brain when you try to focus on a 20-minute lecture or meeting?',
    options: [
      { label: 'A', text: 'Nothing, I take notes and pay attention.', points: 1, flavor: 'Scholarly Chad' },
      { label: 'B', text: 'Random daydreaming about lunch or hobbies.', points: 2, flavor: 'Normal Attention' },
      { label: 'C', text: 'Subway Surfers hoverboard gameplay split-screen in my left eye.', points: 4, flavor: 'Dual Screen Mind' },
      { label: 'D', text: 'Soap cutting ASMR, Minecraft parkour, and Brazilian phonk all at once.', points: 5, flavor: 'Sensory Overload' },
    ],
  },
  {
    id: 7,
    question: 'Pick your ultimate role model in life:',
    options: [
      { label: 'A', text: 'A respected historical figure or family member.', points: 1, flavor: 'Grounded Spirit' },
      { label: 'B', text: 'An athlete or tech innovator.', points: 2, flavor: 'Conventional Ambitious' },
      { label: 'C', text: 'Kai Cenat during a 24-hour subathon stream.', points: 4, flavor: 'Twitch Scholar' },
      { label: 'D', text: 'Baby Gronk rizzing up Livvy Dunne while GigaChad watches in Ohio.', points: 5, flavor: 'Mythological Pantheon' },
    ],
  },
  {
    id: 8,
    question: 'How do you greet your closest companion?',
    options: [
      { label: 'A', text: '"Good morning! How are you doing today?"', points: 1, flavor: '19th Century Gentleman' },
      { label: 'B', text: '"Yo, what’s up!"', points: 2, flavor: 'Everyday Bro' },
      { label: 'C', text: '"What is blud doing here 💀💀"', points: 4, flavor: 'Comment Section Voice' },
      { label: 'D', text: '"SKIBIDI RIZZ MY SIGMA KING 🍷🗿"', points: 5, flavor: 'Vocal Hazard' },
    ],
  },
  {
    id: 9,
    question: 'What is your bedtime routine?',
    options: [
      { label: 'A', text: 'Read a physical book, drink herbal tea, lights out by 10 PM.', points: 1, flavor: 'Zen Master' },
      { label: 'B', text: 'Watch a quick show or video, sleep by midnight.', points: 2, flavor: 'Standard Slumber' },
      { label: 'C', text: 'Infinite doomscroll until the phone slips from my grip and hits my nose.', points: 4, flavor: 'Nose Fracture Victim' },
      { label: 'D', text: 'Stare at flashing TikTok loops until 4:30 AM while chanting phonk lyrics.', points: 5, flavor: 'Nocturnal Rotter' },
    ],
  },
  {
    id: 10,
    question: 'You open a restaurant menu and see a burger priced at $28. What comes out of your mouth?',
    options: [
      { label: 'A', text: '"That seems a bit overpriced for lunch."', points: 1, flavor: 'Sensible Consumer' },
      { label: 'B', text: '"Ouch, inflation is getting rough."', points: 2, flavor: 'Realist' },
      { label: 'C', text: '"Ain’t no way... this restaurant has negative aura."', points: 4, flavor: 'Aura Calculator' },
      { label: 'D', text: '"They’re charging fanum tax on the receipt, they’re COOKED bro 💀"', points: 5, flavor: 'Finance Sigma' },
    ],
  },
  {
    id: 11,
    question: 'When you achieve something cool in real life, what is your first thought?',
    options: [
      { label: 'A', text: 'Feel humble satisfaction and thank those who helped.', points: 1, flavor: 'Pure Heart' },
      { label: 'B', text: 'Text my family or snap a photo for friends.', points: 2, flavor: 'Social Native' },
      { label: 'C', text: '"Certified W, massive aura boost, screenshot this."', points: 4, flavor: 'Status Tracker' },
      { label: 'D', text: '"Chat I just mogged the entire universe, play the phonk track."', points: 5, flavor: 'Delusional Deity' },
    ],
  },
  {
    id: 12,
    question: 'Be honest: how many brain rot slang words did you use in verbal conversation this week?',
    options: [
      { label: 'A', text: 'Zero. I speak normal human English.', points: 1, flavor: 'Immune Civilian' },
      { label: 'B', text: 'Maybe one or two ironically with friends.', points: 2, flavor: 'Ironic Dabbler' },
      { label: 'C', text: 'At least 10 to 20 times. It slips out unprompted.', points: 4, flavor: 'Infected Tongue' },
      { label: 'D', text: 'Every sentence I speak sounds like a corrupted TikTok audio file.', points: 5, flavor: 'Patient Zero' },
    ],
  },
];

export function calculateQuizResult(totalScore: number): QuizResult {
  // Min score = 12, Max score = 60
  // Normalized percentage:
  const percentage = Math.round(((totalScore - 12) / 48) * 100);

  if (totalScore <= 18) {
    return {
      title: 'UNTOUCHED NPC NORMIE',
      level: 1,
      percentage,
      badge: '🌱 PURE SOUL',
      diagnosis: 'Your brain cells are pristine and hydrated. You actually know what sunlight feels like. How did you even find this website?',
      prescription: 'Stay safe out there. Do not download TikTok under any circumstances.',
      color: 'from-emerald-400 to-green-600',
    };
  } else if (totalScore <= 28) {
    return {
      title: 'CASUAL SCROLLER',
      level: 2,
      percentage,
      badge: '📱 MILD ROT',
      diagnosis: 'You dabble in memes ironically, but you still function in polite society. You occasionally think "bro really thought" but catch yourself.',
      prescription: 'One 20-minute walk in nature will fully detox your system.',
      color: 'from-cyan-400 to-blue-600',
    };
  } else if (totalScore <= 40) {
    return {
      title: 'LOWKEY COOKED',
      level: 3,
      percentage,
      badge: '🍳 MEDIUM RARE',
      diagnosis: 'Brain rot symptoms are visible to the naked eye. You have calculated your aura at least once today and your attention span is 14 seconds.',
      prescription: 'Put down the phone and drink a glass of water before you start barking at the mailman.',
      color: 'from-amber-400 to-orange-600',
    };
  } else if (totalScore <= 52) {
    return {
      title: 'CERTIFIED SIGMA GLAZER',
      level: 4,
      percentage,
      badge: '🗿 WELL DONE',
      diagnosis: 'Severely cooked. You involuntarily mew during conversations and think Ohio is an active warzone. Your vocabulary is 40% skull emojis.',
      prescription: 'Emergency grass-touching protocol required immediately.',
      color: 'from-purple-500 to-pink-600',
    };
  } else {
    return {
      title: 'TERMINALLY ONLINE FINAL BOSS',
      level: 5,
      percentage,
      badge: '🔥 COMPLETELY CHARRED',
      diagnosis: 'CONGRATULATIONS: Your frontal lobe has been replaced with Subway Surfers footage and Kai Cenat screaming. You have achieved digital transcendence.',
      prescription: 'No medical cure known to science. Welcome to the elite squad.',
      color: 'from-rose-500 via-pink-600 to-purple-800',
    };
  }
}
