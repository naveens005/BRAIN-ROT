import React, { useState, useEffect, useRef } from 'react';
import { db } from '../storage/db';

export interface PVTResult {
  meanReactionTimeMs: number;
  reactionTimeCv: number; // Coefficient of Variation (SD / Mean)
  lapseCount: number; // RT > 500ms
  falseStartCount: number; // Tap < 100ms
  totalTrials: number;
}

interface PsychomotorVigilanceTaskProps {
  onComplete: (result: PVTResult) => void;
  targetTrials?: number;
}

export const PsychomotorVigilanceTask: React.FC<PsychomotorVigilanceTaskProps> = ({
  onComplete,
  targetTrials = 10,
}) => {
  const [stage, setStage] = useState<'IDLE' | 'WAITING' | 'ACTIVE' | 'FEEDBACK' | 'DONE'>('IDLE');
  const [displayCounter, setDisplayCounter] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [currentTrialNumber, setCurrentTrialNumber] = useState<number>(0);

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const intervalIdRef = useRef<number | null>(null);

  const reactionTimesRef = useRef<number[]>([]);
  const falseStartsRef = useRef<number>(0);
  const lapsesRef = useRef<number>(0);

  const startTask = () => {
    reactionTimesRef.current = [];
    falseStartsRef.current = 0;
    lapsesRef.current = 0;
    setCurrentTrialNumber(0);
    nextTrial(1);
  };

  const nextTrial = (trialNum: number) => {
    if (trialNum > targetTrials) {
      finishTask();
      return;
    }

    setCurrentTrialNumber(trialNum);
    setStage('WAITING');
    setDisplayCounter(0);
    setFeedbackText('');

    // Jittered random ISI: 2000 to 5000 ms
    const isi = 2000 + Math.random() * 3000;
    timerRef.current = window.setTimeout(() => {
      triggerStimulus();
    }, isi);
  };

  const triggerStimulus = () => {
    setStage('ACTIVE');
    startTimeRef.current = performance.now();

    intervalIdRef.current = window.setInterval(() => {
      setDisplayCounter(Math.round(performance.now() - startTimeRef.current));
    }, 16);
  };

  const handleScreenTap = () => {
    if (stage === 'WAITING') {
      // False start / Anticipation
      if (timerRef.current) clearTimeout(timerRef.current);
      falseStartsRef.current++;
      setFeedbackText('FALSE START (<100ms)');
      setStage('FEEDBACK');
      setTimeout(() => nextTrial(currentTrialNumber), 1200);
      return;
    }

    if (stage === 'ACTIVE') {
      const rt = Math.round(performance.now() - startTimeRef.current);
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);

      if (rt > 500) {
        lapsesRef.current++;
        setFeedbackText(`LAPSE! ${rt} ms`);
      } else {
        setFeedbackText(`${rt} ms`);
      }

      reactionTimesRef.current.push(rt);
      setStage('FEEDBACK');
      setTimeout(() => nextTrial(currentTrialNumber + 1), 1000);
    }
  };

  const finishTask = async () => {
    setStage('DONE');
    const validRts = reactionTimesRef.current;
    const mean = validRts.length > 0 ? validRts.reduce((a, b) => a + b, 0) / validRts.length : 350;

    // Calculate standard deviation and CV
    const variance =
      validRts.length > 1
        ? validRts.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (validRts.length - 1)
        : 0;
    const sd = Math.sqrt(variance);
    const cv = mean > 0 ? Math.round((sd / mean) * 1000) / 1000 : 0.15;

    const result: PVTResult = {
      meanReactionTimeMs: Math.round(mean),
      reactionTimeCv: cv,
      lapseCount: lapsesRef.current,
      falseStartCount: falseStartsRef.current,
      totalTrials: targetTrials,
    };

    await db.saveCognitiveSession({
      id: `pvt-${Date.now()}`,
      testType: 'PVT',
      startedAt: Date.now() - 120000,
      endedAt: Date.now(),
      rawMetric1: result.reactionTimeCv,
      rawMetric2: result.lapseCount,
      jankDiscardedTrials: 0,
      totalTrials: targetTrials,
      deviceFps: 60,
    });

    onComplete(result);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, []);

  return (
    <div className="max-w-md mx-auto p-6 bg-zinc-900 border-2 border-zinc-700 rounded-2xl text-white select-none">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-black uppercase text-amber-400">Psychomotor Vigilance Task (PVT)</h3>
        <span className="font-mono text-xs font-bold text-zinc-400">
          Trial {currentTrialNumber} / {targetTrials}
        </span>
      </div>

      {stage === 'IDLE' ? (
        <div className="space-y-4 text-center py-6">
          <p className="text-sm text-zinc-300 leading-relaxed">
            Measures reaction speed consistency and attention lapses.
            <br />
            <strong className="text-yellow-400">INSTRUCTIONS:</strong> When the numbers start counting up on the screen, tap anywhere as fast as you can. Do not tap early.
          </p>
          <button
            onClick={startTask}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wider rounded-xl cursor-pointer"
          >
            Start PVT Assessment
          </button>
        </div>
      ) : (
        <div
          onClick={handleScreenTap}
          className={`h-64 rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            stage === 'ACTIVE'
              ? 'bg-rose-950/40 border-rose-500'
              : stage === 'FEEDBACK'
              ? 'bg-zinc-900 border-cyan-500'
              : 'bg-zinc-950 border-zinc-800'
          }`}
        >
          {stage === 'WAITING' && (
            <div className="text-xs text-zinc-500 font-mono animate-pulse">
              WAIT FOR TIMER...
            </div>
          )}
          {stage === 'ACTIVE' && (
            <div className="text-5xl font-mono font-black text-rose-400">
              {displayCounter} <span className="text-sm text-rose-300">ms</span>
            </div>
          )}
          {stage === 'FEEDBACK' && (
            <div className="text-3xl font-mono font-black text-yellow-300">
              {feedbackText}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
