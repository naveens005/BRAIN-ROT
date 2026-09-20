import React, { useState, useRef, useEffect } from 'react';
import { db } from '../storage/db';

export interface GoNoGoResult {
  commissionErrorRate: number; // Tapping on No-Go (impulsivity)
  omissionErrorRate: number; // Failing to tap on Go
  delayDiscountingRate: number; // 0 (patient) to 1 (hyper-impulsive)
  meanGoRtMs: number;
}

interface GoNoGoTaskProps {
  onComplete: (result: GoNoGoResult) => void;
  totalTrials?: number;
}

export const GoNoGoDelayTask: React.FC<GoNoGoTaskProps> = ({
  onComplete,
  totalTrials = 15,
}) => {
  const [phase, setPhase] = useState<'INTRO' | 'GONOGO' | 'DELAY' | 'DONE'>('INTRO');
  const [currentStimulus, setCurrentStimulus] = useState<'GO' | 'NOGO' | null>(null);
  const [trialIndex, setTrialIndex] = useState<number>(0);
  const [delayQuestionIndex, setDelayQuestionIndex] = useState<number>(0);
  const [discountChoices, setDiscountChoices] = useState<boolean[]>([]); // true = chose immediate, false = chose delayed

  const commissionErrorsRef = useRef<number>(0);
  const omissionErrorsRef = useRef<number>(0);
  const goReactionTimesRef = useRef<number[]>([]);
  const hasTappedRef = useRef<boolean>(false);
  const stimulusStartRef = useRef<number>(0);
  const timeoutRef = useRef<number | null>(null);

  const startGoNoGo = () => {
    setPhase('GONOGO');
    commissionErrorsRef.current = 0;
    omissionErrorsRef.current = 0;
    goReactionTimesRef.current = [];
    setTrialIndex(0);
    runNextTrial(0);
  };

  const runNextTrial = (idx: number) => {
    if (idx >= totalTrials) {
      setPhase('DELAY');
      setDelayQuestionIndex(0);
      return;
    }

    hasTappedRef.current = false;
    setTrialIndex(idx);

    // 80% Go (Green), 20% No-Go (Red)
    const isNoGo = Math.random() < 0.22;
    const stim = isNoGo ? 'NOGO' : 'GO';
    setCurrentStimulus(stim);
    stimulusStartRef.current = performance.now();

    // Stimulus duration 550ms
    timeoutRef.current = window.setTimeout(() => {
      // If was GO and no tap, omission error
      if (stim === 'GO' && !hasTappedRef.current) {
        omissionErrorsRef.current++;
      }
      setCurrentStimulus(null);

      // ISI jitter 300-600ms
      timeoutRef.current = window.setTimeout(() => {
        runNextTrial(idx + 1);
      }, 300 + Math.random() * 300);
    }, 550);
  };

  const handleScreenTap = () => {
    if (phase !== 'GONOGO' || !currentStimulus || hasTappedRef.current) return;
    hasTappedRef.current = true;
    const rt = performance.now() - stimulusStartRef.current;

    if (currentStimulus === 'NOGO') {
      // Commission error! (Failed to inhibit)
      commissionErrorsRef.current++;
    } else {
      goReactionTimesRef.current.push(rt);
    }
  };

  // Delay Discounting scenarios
  const delayScenarios = [
    { immediate: '10 min of social media now', delayed: '60 min of free time tomorrow' },
    { immediate: '$10 bonus immediately', delayed: '$30 bonus in 7 days' },
    { immediate: 'Check phone notifications right now', delayed: 'Deep uninterrupted focus for 45 min' },
  ];

  const handleDelayChoice = (choseImmediate: boolean) => {
    const updated = [...discountChoices, choseImmediate];
    setDiscountChoices(updated);

    if (delayQuestionIndex + 1 < delayScenarios.length) {
      setDelayQuestionIndex((prev) => prev + 1);
    } else {
      finishAll(updated);
    }
  };

  const finishAll = async (choices: boolean[]) => {
    setPhase('DONE');
    const noGoCount = Math.max(1, Math.round(totalTrials * 0.22));
    const goCount = Math.max(1, totalTrials - noGoCount);

    const commissionRate = commissionErrorsRef.current / noGoCount;
    const omissionRate = omissionErrorsRef.current / goCount;
    const meanRt =
      goReactionTimesRef.current.length > 0
        ? goReactionTimesRef.current.reduce((a, b) => a + b, 0) / goReactionTimesRef.current.length
        : 380;

    // Delay discount rate: proportion of immediate choices chosen
    const discountRate = choices.filter(Boolean).length / Math.max(1, choices.length);

    const result: GoNoGoResult = {
      commissionErrorRate: Math.min(1.0, Math.round(commissionRate * 100) / 100),
      omissionErrorRate: Math.min(1.0, Math.round(omissionRate * 100) / 100),
      delayDiscountingRate: Math.round(discountRate * 100) / 100,
      meanGoRtMs: Math.round(meanRt),
    };

    await db.saveCognitiveSession({
      id: `gonogo-${Date.now()}`,
      testType: 'GONOGO_DISCOUNT',
      startedAt: Date.now() - 120000,
      endedAt: Date.now(),
      rawMetric1: result.commissionErrorRate,
      rawMetric2: result.delayDiscountingRate,
      jankDiscardedTrials: 0,
      totalTrials,
      deviceFps: 60,
    });

    onComplete(result);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="max-w-md mx-auto p-6 bg-zinc-900 border-2 border-zinc-700 rounded-2xl text-white select-none">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-black uppercase text-emerald-400">Impulse Control (Go / No-Go)</h3>
        {phase === 'GONOGO' && (
          <span className="font-mono text-xs font-bold text-zinc-400">
            {trialIndex + 1} / {totalTrials}
          </span>
        )}
      </div>

      {phase === 'INTRO' && (
        <div className="space-y-4 text-center py-6">
          <p className="text-sm text-zinc-300 leading-relaxed">
            Measures pre-potent impulse inhibition and reward delay discounting.
            <br />
            <strong className="text-emerald-400">GREEN CIRCLE:</strong> Tap screen immediately!
            <br />
            <strong className="text-rose-400">RED CIRCLE:</strong> DO NOT TAP! Inhibit your thumb.
          </p>
          <button
            onClick={startGoNoGo}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-wider rounded-xl cursor-pointer"
          >
            Start Impulse Assessment
          </button>
        </div>
      )}

      {phase === 'GONOGO' && (
        <div
          onClick={handleScreenTap}
          className="h-64 bg-zinc-950 border-2 border-zinc-800 rounded-xl flex items-center justify-center cursor-pointer active:scale-98 transition-transform"
        >
          {currentStimulus === 'GO' && (
            <div className="w-32 h-32 rounded-full bg-emerald-500 shadow-[0_0_40px_#22c55e] flex items-center justify-center font-black text-black text-lg font-heading">
              TAP!
            </div>
          )}
          {currentStimulus === 'NOGO' && (
            <div className="w-32 h-32 rounded-full bg-rose-600 shadow-[0_0_40px_#ef4444] flex items-center justify-center font-black text-white text-lg font-heading">
              HOLD!
            </div>
          )}
        </div>
      )}

      {phase === 'DELAY' && (
        <div className="space-y-4 py-4">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
            Part 2: Delay Preference ({delayQuestionIndex + 1} / {delayScenarios.length})
          </span>
          <p className="text-sm font-semibold text-zinc-200">
            Which would you genuinely choose right now?
          </p>
          <div className="space-y-3">
            <button
              onClick={() => handleDelayChoice(true)}
              className="w-full p-4 rounded-xl border-2 border-zinc-700 bg-zinc-950 text-left text-sm font-bold hover:border-amber-400"
            >
              Option A (Immediate): {delayScenarios[delayQuestionIndex].immediate}
            </button>
            <button
              onClick={() => handleDelayChoice(false)}
              className="w-full p-4 rounded-xl border-2 border-zinc-700 bg-zinc-950 text-left text-sm font-bold hover:border-emerald-400"
            >
              Option B (Delayed): {delayScenarios[delayQuestionIndex].delayed}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
