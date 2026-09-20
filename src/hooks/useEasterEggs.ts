import { useEffect, useRef } from 'react';
import { useAudio } from '../context/AudioContext';
import { useSettings } from '../context/SettingsContext';
import { useUser } from '../context/UserContext';

const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export function useEasterEggs() {
  const { playSound } = useAudio();
  const { setKonamiModalOpen, triggerScreenShake } = useSettings();
  const { unlockAchievement, addXp } = useUser();
  const keySequenceRef = useRef<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid triggering when user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      keySequenceRef.current.push(key);

      // Keep only last 10
      if (keySequenceRef.current.length > KONAMI_SEQUENCE.length) {
        keySequenceRef.current.shift();
      }

      // Check match
      const isMatch = KONAMI_SEQUENCE.every(
        (targetKey, index) => keySequenceRef.current[index]?.toLowerCase() === targetKey.toLowerCase()
      );

      if (isMatch) {
        keySequenceRef.current = [];
        triggerScreenShake(true);
        playSound('critical_win');
        unlockAchievement('konami_master');
        addXp(200);
        setKonamiModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playSound, setKonamiModalOpen, triggerScreenShake, unlockAchievement, addXp]);
}
