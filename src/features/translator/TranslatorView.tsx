import React, { useState } from 'react';
import { Copy, Check, ArrowRightLeft, Volume2, Flame, Bot } from 'lucide-react';
import type { IntensityLevel } from '../../types';
import { translateToBrainRot, reverseTranslate } from './engine';
import type { ReverseTranslationResult } from './engine';
import { aiRotParagraph } from './aiRot';
import type { AIStyle } from './aiRot';

import { useUser } from '../../context/UserContext';
import { useAudio } from '../../context/AudioContext';
import { useSettings } from '../../context/SettingsContext';

export const TranslatorView: React.FC = () => {
  const { addXp, incrementStat, unlockAchievement } = useUser();
  const { playUiClick, playSound } = useAudio();
  const { apiKey, triggerScreenShake } = useSettings();

  const [mode, setMode] = useState<'normal_to_rot' | 'rot_to_normal'>('normal_to_rot');
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [reverseResult, setReverseResult] = useState<ReverseTranslationResult | null>(null);
  const [intensity, setIntensity] = useState<IntensityLevel>('cooked');
  const [copied, setCopied] = useState<boolean>(false);
  const [aiStyle, setAiStyle] = useState<AIStyle>('tiktok_commenter');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const handleTranslate = () => {
    if (!inputText.trim()) return;
    playUiClick();

    if (mode === 'normal_to_rot') {
      const translated = translateToBrainRot(inputText, intensity);
      setOutputText(translated);
      if (intensity === 'terminally_online') {
        triggerScreenShake(false);
        playSound('bruh_bass');
      }
      addXp(15, 'Slang Translation');
      incrementStat('totalTranslations');
    } else {
      const result = reverseTranslate(inputText);
      setReverseResult(result);
      setOutputText(result.plainEnglish);
      addXp(20, 'Slang Decryption');
      unlockAchievement('reverse_scholar');
    }
  };

  const handleAiRotParagraph = async () => {
    if (!inputText.trim()) return;
    playUiClick();
    setIsAiLoading(true);

    try {
      const rot = await aiRotParagraph(inputText, {
        apiKey,
        style: aiStyle,
      });
      setOutputText(rot);
      addXp(30, 'AI Rot Paragraph');
      triggerScreenShake(false);
      playSound('airhorn_synth');
    } catch {
      // Fallback
      setOutputText(translateToBrainRot(inputText, 'terminally_online'));
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    playUiClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!outputText || !window.speechSynthesis) return;
    playUiClick();
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(outputText);
    utterance.pitch = mode === 'normal_to_rot' ? 1.3 : 0.9;
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  const samplePhrases = [
    'I am very tired and I failed my test today.',
    'He is an attractive and charming person who talks a lot.',
    'My friend ate all of my food without asking me.',
    'I need to focus and study quietly in the library.',
  ];

  const handleLoadSample = (sample: string) => {
    playUiClick();
    setInputText(sample);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* View Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 bg-pink-500/10 border border-pink-500/30 text-pink-400 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase">
          <Flame className="w-3.5 h-3.5" />
          <span>OFFLINE LOCAL ENGINE & AI TRANSLATOR</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black uppercase font-heading tracking-tight text-white">
          BRAIN ROT TRANSLATOR
        </h1>
        <p className="text-zinc-400 text-sm md:text-base max-w-lg mx-auto">
          Convert standard human speech into high-velocity internet brain rot, or decrypt cursed slang into plain English.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center justify-center">
        <div className="inline-flex p-1.5 bg-zinc-900 border-2 border-zinc-700 rounded-xl space-x-1 shadow-[4px_4px_0px_0px_#000000]">
          <button
            id="mode-normal-to-rot-btn"
            onClick={() => {
              playUiClick();
              setMode('normal_to_rot');
              setOutputText('');
              setReverseResult(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs md:text-sm font-black uppercase tracking-wider transition-all cursor-pointer ${
              mode === 'normal_to_rot'
                ? 'bg-pink-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Human ➔ Brain Rot
          </button>
          <button
            id="mode-rot-to-normal-btn"
            onClick={() => {
              playUiClick();
              setMode('rot_to_normal');
              setOutputText('');
              setReverseResult(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs md:text-sm font-black uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-1.5 ${
              mode === 'rot_to_normal'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Brain Rot ➔ Human</span>
          </button>
        </div>
      </div>

      {/* Intensity Selector (for Normal -> Rot) */}
      {mode === 'normal_to_rot' && (
        <div className="bg-zinc-900/80 border-2 border-zinc-800 p-4 rounded-xl shadow-[4px_4px_0px_0px_#18181b]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-zinc-300 font-heading">
              Rot Intensity Level
            </span>
            <span className="text-xs font-mono font-bold text-pink-400 uppercase">
              {intensity.replace('_', ' ')}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'mild', label: '🌱 Mild', desc: 'Light slang sprinkle' },
              { id: 'cooked', label: '🍳 Cooked', desc: 'Heavy TikTok vocab' },
              { id: 'terminally_online', label: '💀 Terminal', desc: 'Total brain fry' },
            ].map((tier) => (
              <button
                key={tier.id}
                id={`intensity-${tier.id}-btn`}
                onClick={() => {
                  playUiClick();
                  setIntensity(tier.id as IntensityLevel);
                }}
                className={`p-2.5 rounded-lg border-2 text-left transition-all cursor-pointer ${
                  intensity === tier.id
                    ? 'border-pink-500 bg-pink-500/10 shadow-[2px_2px_0px_0px_#ec4899]'
                    : 'border-zinc-700 bg-zinc-950/50 hover:border-zinc-500'
                }`}
              >
                <div className="text-xs font-black text-white font-heading">{tier.label}</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">{tier.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Translator Text Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Box */}
        <div className="bg-zinc-900 border-3 border-zinc-700 p-4 rounded-xl shadow-[6px_6px_0px_0px_#000000] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-400 font-heading">
                {mode === 'normal_to_rot' ? 'Normal English Input' : 'Brain Rot Input'}
              </label>
              <button
                onClick={() => setInputText('')}
                className="text-[10px] text-zinc-500 hover:text-zinc-300 uppercase font-bold"
              >
                Clear
              </button>
            </div>
            <textarea
              id="translator-input"
              rows={5}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                mode === 'normal_to_rot'
                  ? 'Type or paste normal human thoughts here (e.g. "I am going to eat dinner with my friend and study for the exam")...'
                  : 'Paste chaotic brain rot (e.g. "blud really thought he had unspoken rizz before the fanum tax caught him in 4k")...'
              }
              className="w-full bg-zinc-950 border-2 border-zinc-800 p-3 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-pink-500 font-sans resize-none"
            />
          </div>

          {/* Preset Samples */}
          <div className="mt-3">
            <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1.5">
              Quick Test Prompts:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {samplePhrases.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLoadSample(s)}
                  className="text-[11px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded border border-zinc-700 truncate max-w-full"
                >
                  "{s.substring(0, 24)}..."
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              id="translate-submit-btn"
              onClick={handleTranslate}
              className="flex-1 py-3 bg-pink-500 hover:bg-pink-400 text-black font-black text-sm uppercase tracking-wider rounded-lg neo-btn"
            >
              ⚡ {mode === 'normal_to_rot' ? 'COOK THIS TEXT' : 'DECRYPT TO ENGLISH'}
            </button>

            {mode === 'normal_to_rot' && (
              <button
                id="ai-rot-btn"
                onClick={handleAiRotParagraph}
                disabled={isAiLoading}
                className="py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white font-black text-sm uppercase tracking-wider rounded-lg neo-btn flex items-center space-x-1.5 disabled:opacity-50"
                title="Use AI Mode (configured in Settings or local fallback)"
              >
                <Bot className="w-4 h-4" />
                <span>{isAiLoading ? 'ROTATING...' : 'AI ROT'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Output Box */}
        <div className="bg-zinc-900 border-3 border-zinc-700 p-4 rounded-xl shadow-[6px_6px_0px_0px_#000000] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-400 font-heading">
                {mode === 'normal_to_rot' ? 'Cooked Output' : 'Decrypted Translation'}
              </label>
              <div className="flex items-center space-x-1">
                {outputText && (
                  <>
                    <button
                      onClick={handleSpeak}
                      className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800"
                      title="Read aloud"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      id="copy-translation-btn"
                      onClick={handleCopy}
                      className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 flex items-center space-x-1"
                      title="Copy to clipboard"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      <span className="text-[10px] font-bold uppercase">{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            <div
              id="translator-output"
              className="w-full min-h-[140px] bg-zinc-950 border-2 border-zinc-800 p-3 rounded-lg text-sm font-mono text-zinc-100 whitespace-pre-wrap select-text leading-relaxed"
            >
              {outputText || (
                <span className="text-zinc-600 italic">
                  Translation will manifest here once you click the button above...
                </span>
              )}
            </div>
          </div>

          {/* AI Style selector if in normal_to_rot */}
          {mode === 'normal_to_rot' && (
            <div className="mt-3 pt-3 border-t border-zinc-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-zinc-400 uppercase">AI Persona Style:</span>
                <span className="text-[10px] text-purple-400 font-mono">
                  {apiKey ? 'API Key Active' : 'Offline Smart Mode'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'tiktok_commenter', name: 'TikTok Commenter' },
                  { id: 'podcast_alpha', name: 'Alpha Podcast' },
                  { id: 'discord_mod', name: 'Discord Mod' },
                  { id: 'roblox_kid', name: 'Roblox iPad Kid' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      playUiClick();
                      setAiStyle(s.id as AIStyle);
                    }}
                    className={`py-1 px-2 text-[11px] font-bold rounded border text-left truncate ${
                      aiStyle === s.id
                        ? 'border-purple-500 bg-purple-500/20 text-purple-200'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reverse Mode Slang Breakdown */}
          {mode === 'rot_to_normal' && reverseResult && reverseResult.detectedSlang.length > 0 && (
            <div className="mt-3 pt-3 border-t border-zinc-800 max-h-48 overflow-y-auto space-y-2 pr-1">
              <div className="flex items-center justify-between text-xs font-bold text-cyan-400 uppercase font-heading">
                <span>Detected Slang ({reverseResult.detectedSlang.length})</span>
                <span>Toxicity: {reverseResult.rotScore}%</span>
              </div>
              {reverseResult.detectedSlang.map((entry, i) => (
                <div key={i} className="bg-zinc-950 p-2 rounded border border-zinc-800 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-pink-400 font-mono uppercase">{entry.slang}</span>
                    <span className="text-zinc-400">➔ {entry.normal}</span>
                  </div>
                  <p className="text-zinc-500 text-[11px] mt-1">{entry.definition}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
