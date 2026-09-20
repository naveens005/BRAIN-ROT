import React, { useState } from 'react';
import { db } from '../storage/db';

export interface StroopResult {
  errorRate: number; // 0 to 1
  congruentMeanRt: number;
  incongruentMeanRt: number;
  interferenceCostMs: number;
  totalTrials: number;
}

interface StroopTaskProps {
  onComplete: (result: StroopResult) => void;
}

interface StroopTrial {
  word: string;
  colorName: string;
  cssColor: string;
  isCongruent: boolean;
}

const STROOP_TRIALS: StroopTrial[] = [
  { word: 'RED', colorName: 'RED', cssColor: '#ef4444', isCongruent: true },
  { word: 'BLUE', colorName: 'GREEN', cssColor: '#22c55e', isCongruent: false },
  { word: 'GREEN', colorName: 'YELLOW', cssColor: '#eab308', isCongruent: false },
  { word: 'YELLOW', colorName: 'YELLOW', cssColor: '#eab308', isCongruent: true },
  { word: 'RED', colorName: 'BLUE', cssColor: '#3b82f6', isCongruent: false },
  { word: 'GREEN', colorName: 'GREEN', cssColor: '#22c55e', isCongruent: true },
  { word: 'BLUE', colorName: 'RED', cssColor: '#ef4444', isCongruent: false },
  { word: 'YELLOW', colorName: 'BLUE', cssColor: '#3b82f6', isCongruent: false },
];

export const StroopTwoBackTask: React.FC<StroopTaskProps> = ({ onComplete }) => {
  const [trialIndex, setTrialIndex] = useState<number>(-1);
  const [congruentRts, setCongruentRts] = useState<number[]>([]);
  const [incongruentRts, setIncongruentRts] = useState<number[]>([]);
  const [errors, setErrors] = useState<number>(0);
  const [stimulusStartTime, setStimulusStartTime] = useState<number>(0);

  const startTask = () => {
    setTrialIndex(0);
    setCongruentRts([]);
    setIncongruentRts([]);
    setErrors(0);
    setStimulusStartTime(performance.now());
  };

  const handleChoice = (chosenColorName: string) => {
    const rt = performance.now() - stimulusStartTime;
    const current = STROOP_TRIALS[trialIndex];
    const isCorrect = chosenColorName === current.colorName;

    if (!isCorrect) {
      setErrors((prev) => prev + 1);
    } else {
      if (current.isCongruent) {
        setCongruentRts((prev) => [...prev, rt]);
      } else {
        setIncongruentRts((prev) => [...prev, rt]);
      }
    }

    if (trialIndex + 1 < STROOP_TRIALS.length) {
      setTrialIndex((prev) => prev + 1);
      setStimulusStartTime(performance.now());
    } else {
      finishTask();
    }
  };

  const finishTask = async () => {
    const total = STROOP_TRIALS.length;
    const errorRate = errors / total;
    const congMean = congruentRts.length > 0 ? congruentRts.reduce((a, b) => a + b, 0) / congruentRts.length : 400;
    const incongMean =
      incongruentRts.length > 0 ? incongruentRts.reduce((a, b) => a + b, 0) / incongruentRts.length : 520;
    const cost = Math.max(0, Math.round(incongMean - congMean));

    const result: StroopResult = {
      errorRate: Math.round(errorRate * 100) / 100,
      congruentMeanRt: Math.round(congMean),
      incongruentMeanRt: Math.round(incongMean),
      interferenceCostMs: cost,
      totalTrials: total,
    };

    await db.saveCognitiveSession({
      id: `stroop-${Date.now()}`,
      testType: 'STROOP_2BACK',
      startedAt: Date.now() - 60000,
      endedAt: Date.now(),
      rawMetric1: result.errorRate,
      rawMetric2: result.interferenceCostMs,
      jankDiscardedTrials: 0,
      totalTrials: total,
      deviceFps: 60,
    });

    onComplete(result);
  };

  const current = trialIndex >= 0 && trialIndex < STROOP_TRIALS.length ? STROOP_TRIALS[trialIndex] : null;

  return (
    <div className="max-w-md mx-auto p-6 bg-zinc-900 border-2 border-zinc-700 rounded-2xl text-white select-none">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-black uppercase text-purple-400">Cognitive Interference (Stroop)</h3>
        {trialIndex >= 0 && (
          <span className="font-mono text-xs font-bold text-zinc-400">
            {trialIndex + 1} / {STROOP_TRIALS.length}
          </span>
        )}
      </div>

      {trialIndex === -1 ? (
        <div className="space-y-4 text-center py-6">
          <p className="text-sm text-zinc-300 leading-relaxed">
            Measures cognitive inhibition and error rate under perceptual conflict.
            <br />
            <strong className="text-yellow-400">RULE:</strong> Tap the button matching the <span className="underline font-bold">INK COLOR</span> of the word, NOT what the word spells.
          </p>
          <button
            onClick={startTask}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-wider rounded-xl cursor-pointer"
          >
            Start Interference Test
          </button>
        </div>
      ) : (
        current && (
          <div className="space-y-8 py-6">
            <div className="h-32 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center">
              <span
                className="text-4xl md:text-5xl font-black font-heading tracking-widest"
                style={{ color: current.cssColor }}
              >
                {current.word}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'RED', bg: 'bg-red-600' },
                { name: 'BLUE', bg: 'bg-blue-600' },
                { name: 'GREEN', bg: 'bg-green-600' },
                { name: 'YELLOW', bg: 'bg-yellow-500 text-black' },
              ].map((btn) => (
                <button
                  key={btn.name}
                  onClick={() => handleChoice(btn.name)}
                  className={`py-3.5 rounded-xl font-black text-sm uppercase tracking-wider ${btn.bg} active:scale-95 transition-transform`}
                >
                  {btn.name}
                </button>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};
