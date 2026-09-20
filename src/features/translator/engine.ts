import type { IntensityLevel, SlangEntry } from '../../types';

import { SLANG_DICTIONARY, WORD_REPLACEMENTS } from './dictionary';

const MILD_SUFFIXES = [
  ' fr fr',
  ' no cap',
  ' lowkey',
  ' ngl',
  ' on god',
];

const COOKED_PREFIXES = [
  'Bro really thought: ',
  'Chat listen up: ',
  'Lil bro said: ',
  'Ain\'t no way blud: ',
  'Hear me out chat: ',
];

const COOKED_SUFFIXES = [
  ' 💀💀💀',
  ' and that\'s on skibidi toilet fr 💯',
  ' (bro lost 5,000 aura for this)',
  ' caught in 4K no cap 📸',
  ' L + ratio + touch grass',
  ' bro is cooking with zero ingredients 🗣️🔥',
];

const TERMINAL_INTERJECTIONS = [
  ' [SKIBIDI ALERT]',
  ' *starts mewing aggressively*',
  ' (LEVEL 10 GYATT DETECTED)',
  ' [FANUM TAX INCOMING]',
  ' *mogged the entire vicinity*',
  ' 🔥🗣️ WHAT IS BLUD YAPPING ABOUT 🗣️🔥',
  ' 🗿🍷 (SIGMA PHONK INTENSIFIES)',
];

export interface ReverseTranslationResult {
  plainEnglish: string;
  detectedSlang: SlangEntry[];
  rotScore: number; // 0 to 100%
  breakdown: string;
}

export function translateToBrainRot(text: string, intensity: IntensityLevel): string {
  if (!text.trim()) return '';

  const words = text.split(/(\s+|[.,!?]+)/);
  let translatedWords = words.map((token) => {
    const clean = token.toLowerCase().trim();
    if (!clean) return token;

    if (WORD_REPLACEMENTS[clean]) {
      const options = WORD_REPLACEMENTS[clean];
      if (intensity === 'mild') {
        // 35% chance to substitute
        return Math.random() < 0.4 ? options[0] : token;
      } else if (intensity === 'cooked') {
        // 75% chance to substitute
        return Math.random() < 0.8 ? options[Math.floor(Math.random() * options.length)] : token;
      } else {
        // 100% terminally online
        return options[Math.floor(Math.random() * options.length)].toUpperCase();
      }
    }
    return token;
  });

  let result = translatedWords.join('');

  if (intensity === 'mild') {
    const suffix = MILD_SUFFIXES[Math.floor(Math.random() * MILD_SUFFIXES.length)];
    result = `${result}${suffix}`;
  } else if (intensity === 'cooked') {
    const prefix = COOKED_PREFIXES[Math.floor(Math.random() * COOKED_PREFIXES.length)];
    const suffix = COOKED_SUFFIXES[Math.floor(Math.random() * COOKED_SUFFIXES.length)];
    result = `${prefix}${result}${suffix}`;
  } else if (intensity === 'terminally_online') {
    const prefix = '🚨 CHAT IS THIS REAL?! ';
    const interjection = TERMINAL_INTERJECTIONS[Math.floor(Math.random() * TERMINAL_INTERJECTIONS.length)];
    const suffix = ' 💀😭 LIL BRO THINKS HE IS THE FINAL BOSS OF OHIO 🚽🔥💯';
    
    // Inject interjection mid-sentence
    const parts = result.split(' ');
    if (parts.length > 4) {
      const mid = Math.floor(parts.length / 2);
      parts.splice(mid, 0, interjection);
      result = parts.join(' ');
    } else {
      result += interjection;
    }
    result = `${prefix}${result}${suffix}`;
  }

  return result;
}

export function reverseTranslate(brainRotText: string): ReverseTranslationResult {
  if (!brainRotText.trim()) {
    return {
      plainEnglish: '',
      detectedSlang: [],
      rotScore: 0,
      breakdown: 'No text provided.',
    };
  }

  const lower = brainRotText.toLowerCase();
  const detected: SlangEntry[] = [];
  let simplified = brainRotText;

  // Find all slang matches
  SLANG_DICTIONARY.forEach((entry) => {
    const regex = new RegExp(`\\b${entry.slang.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    if (regex.test(lower)) {
      if (!detected.some((d) => d.slang === entry.slang)) {
        detected.push(entry);
      }
      // Replace with normal definition or first normal meaning
      simplified = simplified.replace(regex, `[${entry.normal.split('/')[0].trim()}]`);
    }
  });

  // Strip excessive emojis and punctuation for the plain translation
  simplified = simplified
    .replace(/[💀😭🗣️🔥💯🗿🍷🚽🚨📸🔫]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\[SKIBIDI ALERT\]|chat is this real\?!|bro really thought:?/gi, '')
    .trim();

  // Calculate rot density
  const wordCount = Math.max(1, brainRotText.split(/\s+/).length);
  const rotScore = Math.min(100, Math.round((detected.length / Math.max(2, wordCount * 0.4)) * 100));

  let breakdown = '';
  if (detected.length === 0) {
    breakdown = 'No slang detected. This appears to be wholesome standard human English.';
  } else {
    breakdown = `Detected ${detected.length} brain rot terms. Brain Rot Toxicity: ${rotScore}%.`;
  }

  return {
    plainEnglish: simplified || 'A standard human sentence communicating basic thoughts.',
    detectedSlang: detected,
    rotScore,
    breakdown,
  };
}
