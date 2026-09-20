import React, { createContext, useContext, useEffect, useState } from 'react';

interface SettingsContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
  triggerScreenShake: (heavy?: boolean) => void;
  isShaking: boolean;
  brainDeletedModalOpen: boolean;
  setBrainDeletedModalOpen: (val: boolean) => void;
  konamiModalOpen: boolean;
  setKonamiModalOpen: (val: boolean) => void;
  settingsModalOpen: boolean;
  setSettingsModalOpen: (val: boolean) => void;
}

const SettingsContextInstance = createContext<SettingsContextType | null>(null);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState<string>(() => {
    return localStorage.getItem('cooked_ai_api_key') || '';
  });

  const [reducedMotion, setReducedMotionState] = useState<boolean>(() => {
    const saved = localStorage.getItem('cooked_reduced_motion');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [brainDeletedModalOpen, setBrainDeletedModalOpen] = useState<boolean>(false);
  const [konamiModalOpen, setKonamiModalOpen] = useState<boolean>(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    if (key.trim()) {
      localStorage.setItem('cooked_ai_api_key', key.trim());
    } else {
      localStorage.removeItem('cooked_ai_api_key');
    }
  };

  const setReducedMotion = (val: boolean) => {
    setReducedMotionState(val);
    localStorage.setItem('cooked_reduced_motion', String(val));
  };

  const triggerScreenShake = (heavy: boolean = false) => {
    if (reducedMotion) return;
    setIsShaking(true);
    const shakeClass = heavy ? 'screen-shake-heavy' : 'screen-shake';
    document.body.classList.add(shakeClass);

    setTimeout(() => {
      document.body.classList.remove(shakeClass);
      setIsShaking(false);
    }, heavy ? 600 : 400);
  };

  // Listen to OS prefers-reduced-motion changes if user hasn't overridden
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('cooked_reduced_motion') === null) {
        setReducedMotionState(e.matches);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <SettingsContextInstance.Provider
      value={{
        apiKey,
        setApiKey,
        reducedMotion,
        setReducedMotion,
        triggerScreenShake,
        isShaking,
        brainDeletedModalOpen,
        setBrainDeletedModalOpen,
        konamiModalOpen,
        setKonamiModalOpen,
        settingsModalOpen,
        setSettingsModalOpen,
      }}
    >
      {children}
    </SettingsContextInstance.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContextInstance);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
