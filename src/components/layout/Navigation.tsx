import React from 'react';
import { motion } from 'framer-motion';
import { Languages, Flame, HelpCircle, Volume2, Image, UserCheck } from 'lucide-react';
import type { TabType } from '../../types';

import { useAudio } from '../../context/AudioContext';

interface NavigationProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

interface TabItem {
  id: TabType;
  label: string;
  icon: React.FC<{ className?: string }>;
  color: string;
}

const TABS: TabItem[] = [
  { id: 'translator', label: 'Translator', icon: Languages, color: 'text-cyan-400' },
  { id: 'doomscroll', label: 'Doomscroll', icon: Flame, color: 'text-pink-500' },
  { id: 'quiz', label: 'Cooked Quiz', icon: HelpCircle, color: 'text-yellow-400' },
  { id: 'soundboard', label: 'Soundboard', icon: Volume2, color: 'text-green-400' },
  { id: 'mememaker', label: 'Meme Maker', icon: Image, color: 'text-purple-400' },
  { id: 'profile', label: 'Profile', icon: UserCheck, color: 'text-amber-400' },
];

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onSelectTab }) => {
  const { playUiClick } = useAudio();

  const handleTabClick = (tab: TabType) => {
    playUiClick();
    onSelectTab(tab);
  };

  return (
    <>
      {/* Desktop Navigation Tabs */}
      <nav className="hidden md:block w-full bg-zinc-950/60 border-b border-zinc-800 py-2.5">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-center space-x-2">
          {TABS.map((tab) => {
            const isActive = currentTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                id={`nav-desktop-${tab.id}`}
                onClick={() => handleTabClick(tab.id)}
                className={`relative px-4 py-2 rounded-lg font-heading text-sm font-extrabold tracking-wide uppercase transition-all flex items-center space-x-2 cursor-pointer ${
                  isActive
                    ? 'text-white bg-zinc-900 border-2 border-zinc-600 shadow-[3px_3px_0px_0px_#ec4899]'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border-2 border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? tab.color : 'text-zinc-400'}`} />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute -bottom-1 left-2 right-2 h-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Sticky Bottom Navigation Dock */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-lg border-t-2 border-zinc-800 px-2 py-1.5 pb-safe">
        <div className="flex items-center justify-around">
          {TABS.map((tab) => {
            const isActive = currentTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                id={`nav-mobile-${tab.id}`}
                onClick={() => handleTabClick(tab.id)}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-all relative ${
                  isActive ? 'text-white' : 'text-zinc-500'
                }`}
              >
                <div
                  className={`p-1.5 rounded-md transition-all ${
                    isActive
                      ? 'bg-zinc-800 border border-zinc-600 shadow-[2px_2px_0px_0px_#ec4899]'
                      : 'bg-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? tab.color : 'text-zinc-400'}`} />
                </div>
                <span className="text-[10px] font-bold font-heading mt-0.5 tracking-tight">
                  {tab.label.split(' ')[0]}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="mobile-active-dot"
                    className="w-1.5 h-1.5 rounded-full bg-pink-500 absolute -top-0.5"
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
