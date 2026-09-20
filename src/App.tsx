import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TabType } from './types';

import { AudioProvider } from './context/AudioContext';
import { UserProvider } from './context/UserContext';
import { SettingsProvider } from './context/SettingsContext';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { EmojiParticles } from './components/ui/EmojiParticles';
import { AchievementToast } from './components/ui/AchievementToast';
import { BrainDeletedModal } from './components/eastereggs/BrainDeletedModal';
import { KonamiModal } from './components/eastereggs/KonamiModal';
import { SettingsModal } from './features/settings/SettingsModal';
import { useEasterEggs } from './hooks/useEasterEggs';

// Feature Views
import { TranslatorView } from './features/translator/TranslatorView';
import { DoomscrollView } from './features/doomscroll/DoomscrollView';
import { QuizView } from './features/quiz/QuizView';
import { SoundboardView } from './features/soundboard/SoundboardView';
import { MemeMakerView } from './features/mememaker/MemeMakerView';
import { ProfileView } from './features/profile/ProfileView';

const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('translator');

  // Activate Konami code listener
  useEasterEggs();

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-pink-500 selection:text-white pb-16 md:pb-6">
      {/* Ambient background particles */}
      <EmojiParticles />

      {/* Main App Header */}
      <Header onNavigateProfile={() => setCurrentTab('profile')} />

      {/* Navigation tabs */}
      <Navigation currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Dynamic Tab Content with Framer Motion transitions */}
      <main className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {currentTab === 'translator' && <TranslatorView />}
            {currentTab === 'doomscroll' && <DoomscrollView />}
            {currentTab === 'quiz' && <QuizView />}
            {currentTab === 'soundboard' && <SoundboardView />}
            {currentTab === 'mememaker' && <MemeMakerView />}
            {currentTab === 'profile' && <ProfileView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modals & Overlays */}
      <BrainDeletedModal />
      <KonamiModal />
      <SettingsModal />
      <AchievementToast />
    </div>
  );
};

export default function App() {
  return (
    <SettingsProvider>
      <AudioProvider>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </AudioProvider>
    </SettingsProvider>
  );
}
