import en from './en.json';
import ta from './ta.json';

export type Language = 'en' | 'ta';

const translations: Record<Language, typeof en> = {
  en,
  ta: ta as typeof en,
};

let currentLang: Language = 'en';

export function setLanguage(lang: Language): void {
  currentLang = lang;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('focusguard_lang', lang);
  }
}

export function getLanguage(): Language {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('focusguard_lang') as Language;
    if (saved && (saved === 'en' || saved === 'ta')) {
      currentLang = saved;
    }
  }
  return currentLang;
}

export function t(keyPath: string, replacements?: Record<string, string | number>): string {
  const lang = getLanguage();
  const dict = translations[lang] || translations.en;
  const parts = keyPath.split('.');

  let current: any = dict;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      // Fallback to English
      current = (en as any);
      for (const p of parts) {
        if (current && typeof current === 'object' && p in current) {
          current = current[p];
        } else {
          return keyPath;
        }
      }
      break;
    }
  }

  if (typeof current !== 'string') {
    return keyPath;
  }

  let result = current;
  if (replacements) {
    Object.entries(replacements).forEach(([k, v]) => {
      result = result.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
    });
  }

  return result;
}
