import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Download, RotateCcw } from 'lucide-react';
import { QUIZ_QUESTIONS, calculateQuizResult } from './questions';
import { renderQuizResultCard, downloadCanvasAsPng } from './CardCanvas';
import type { QuizResult } from '../../types';

import { useAudio } from '../../context/AudioContext';
import { useUser } from '../../context/UserContext';
import { useSettings } from '../../context/SettingsContext';

export const QuizView: React.FC = () => {
  const { playSound, playUiClick } = useAudio();
  const { addXp, recordQuizResult, unlockAchievement } = useUser();
  const { triggerScreenShake } = useSettings();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentQuestion = QUIZ_QUESTIONS[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100);

  const handleSelectOption = (points: number, optionIdx: number) => {
    playUiClick();
    setSelectedOption(optionIdx);

    setTimeout(() => {
      const nextScore = totalScore + points;
      setTotalScore(nextScore);
      setSelectedOption(null);

      if (currentIndex + 1 < QUIZ_QUESTIONS.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        // Complete Quiz
        const outcome = calculateQuizResult(nextScore);
        setResult(outcome);
        setIsFinished(true);
        playSound('critical_win');
        triggerScreenShake(false);
        addXp(120, 'Quiz Finished');
        recordQuizResult(nextScore, outcome.title);
      }
    }, 250);
  };

  // Render Canvas when finished
  useEffect(() => {
    if (isFinished && result && canvasRef.current) {
      renderQuizResultCard(canvasRef.current, result, totalScore);
    }
  }, [isFinished, result, totalScore]);

  const handleDownloadCard = () => {
    if (!canvasRef.current) return;
    playUiClick();
    downloadCanvasAsPng(canvasRef.current, `cooked-rank-${result?.level || 1}.png`);
    playSound('lazer_pew');
    unlockAchievement('card_download');
    addXp(80, 'Card Downloaded');
  };

  const handleRestart = () => {
    playUiClick();
    setCurrentIndex(0);
    setTotalScore(0);
    setSelectedOption(null);
    setIsFinished(false);
    setResult(null);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>OFFICIAL GEN-Z EVALUATION</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black uppercase font-heading tracking-tight text-white">
          HOW COOKED ARE YOU?
        </h1>
        <p className="text-zinc-400 text-sm md:text-base">
          12 scientific brain rot questions leading to an official diagnosis card.
        </p>
      </div>

      {!isFinished ? (
        <div className="bg-zinc-900 border-3 border-zinc-700 p-5 md:p-6 rounded-2xl shadow-[6px_6px_0px_0px_#000000] space-y-5">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs font-mono font-bold text-zinc-400 mb-1.5 uppercase">
              <span>Question {currentIndex + 1} of {QUIZ_QUESTIONS.length}</span>
              <span>{progressPercent}% COMPLETE</span>
            </div>
            <div className="w-full bg-zinc-950 h-2.5 rounded-full overflow-hidden border border-zinc-800">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500"
                style={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Question Text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <h2 className="text-lg md:text-xl font-black text-white font-heading leading-snug">
                {currentQuestion.question}
              </h2>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  return (
                    <button
                      key={idx}
                      id={`quiz-opt-${opt.label.toLowerCase()}`}
                      onClick={() => handleSelectOption(opt.points, idx)}
                      className={`w-full p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer flex items-start space-x-3 ${
                        isSelected
                          ? 'bg-pink-600 border-pink-400 text-white shadow-[3px_3px_0px_0px_#ffffff]'
                          : 'bg-zinc-950/70 border-zinc-700 text-zinc-200 hover:border-yellow-400 hover:bg-zinc-950'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-600 flex items-center justify-center font-mono font-black text-xs shrink-0 text-yellow-400">
                        {opt.label}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold leading-relaxed">{opt.text}</div>
                        <span className="inline-block mt-1 text-[10px] font-mono font-bold bg-zinc-800/80 text-zinc-400 px-1.5 py-0.5 rounded uppercase">
                          {opt.flavor}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        /* Result Screen */
        result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="bg-zinc-900 border-3 border-zinc-700 p-6 rounded-2xl shadow-[8px_8px_0px_0px_#000000] text-center space-y-4">
              <div className="inline-block px-3 py-1 bg-yellow-400 text-black font-mono font-black text-xs uppercase tracking-widest rounded">
                DIAGNOSIS COMPLETE
              </div>

              <h2 className="text-2xl md:text-3xl font-black uppercase font-heading text-white">
                {result.title}
              </h2>

              <div className="inline-block px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-wider bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg">
                {result.badge} • {result.percentage}% COOKED
              </div>

              <p className="text-zinc-300 text-sm md:text-base leading-relaxed max-w-lg mx-auto bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                {result.diagnosis}
              </p>

              <div className="bg-rose-950/40 border border-rose-600/50 p-3.5 rounded-xl text-left">
                <span className="text-xs font-black uppercase text-rose-400 tracking-wider font-heading block mb-1">
                  Emergency Prescription:
                </span>
                <p className="text-xs text-rose-200 font-medium">{result.prescription}</p>
              </div>

              {/* Canvas Card Preview (Scaled down for UI display) */}
              <div className="pt-4 border-t border-zinc-800">
                <p className="text-xs font-mono text-zinc-400 uppercase font-bold mb-3">
                  Shareable High-Res Evaluation Card (800x960 PNG):
                </p>
                <div className="flex justify-center">
                  <canvas
                    ref={canvasRef}
                    className="w-full max-w-xs md:max-w-sm rounded-lg border-2 border-zinc-700 shadow-xl"
                  />
                </div>
              </div>

              {/* Download & Restart Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  id="download-quiz-card-btn"
                  onClick={handleDownloadCard}
                  className="flex-1 py-3 bg-pink-500 hover:bg-pink-400 text-black font-black text-sm uppercase tracking-wider rounded-lg neo-btn flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Card (PNG)</span>
                </button>
                <button
                  id="restart-quiz-btn"
                  onClick={handleRestart}
                  className="py-3 px-6 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-sm uppercase tracking-wider rounded-lg border-2 border-zinc-600 flex items-center justify-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Quiz</span>
                </button>
              </div>
            </div>
          </motion.div>
        )
      )}
    </div>
  );
};
