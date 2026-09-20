import React, { useState, useEffect, useRef } from 'react';
import { db } from '../storage/db';

export interface CPTResult {
  hitRate: number; // 0 to 1
  falseAlarmRate: number; // 0 to 1
  meanReactionTimeMs: number;
  lapseCount: number; // >1000ms
  totalTrials: number;
}

interface ContinuousPerformanceTaskProps {
  onComplete: (result: CPTResult) => void;
  durationSeconds?: number;
}

type ShapeType = 'CIRCLE' | 'SQUARE' | 'TRIANGLE' | 'STAR';

export const ContinuousPerformanceTask: React.FC<ContinuousPerformanceTaskProps> = ({
  onComplete,
  durationSeconds = 60,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentShape, setCurrentShape] = useState<ShapeType | null>(null);
  const [previousShape, setPreviousShape] = useState<ShapeType | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(durationSeconds);

  const trialCountRef = useRef<number>(0);
  const hitsRef = useRef<number>(0);
  const targetsShownRef = useRef<number>(0);
  const falseAlarmsRef = useRef<number>(0);
  const lapsesRef = useRef<number>(0);
  const reactionTimesRef = useRef<number[]>([]);
  const stimulusStartTimeRef = useRef<number>(0);
  const hasRespondedThisTrialRef = useRef<boolean>(false);

  // Target Rule: Tap ONLY when STAR appears immediately after CIRCLE
  const isTargetTrial = previousShape === 'CIRCLE' && currentShape === 'STAR';

  const startTask = () => {
    setIsActive(true);
    trialCountRef.current = 0;
    hitsRef.current = 0;
    targetsShownRef.current = 0;
    falseAlarmsRef.current = 0;
    lapsesRef.current = 0;
    reactionTimesRef.current = [];
    nextTrial();
  };

  const nextTrial = () => {
    if (timeLeft <= 0) return;

    hasRespondedThisTrialRef.current = false;
    const shapes: ShapeType[] = ['CIRCLE', 'SQUARE', 'TRIANGLE', 'STAR'];

    // 30% probability of setting up a target sequence
    let nextS: ShapeType;
    if (currentShape === 'CIRCLE' && Math.random() < 0.4) {
      nextS = 'STAR';
      targetsShownRef.current++;
    } else {
      nextS = shapes[Math.floor(Math.random() * shapes.length)];
    }

    setPreviousShape(currentShape);
    setCurrentShape(nextS);
    stimulusStartTimeRef.current = performance.now();
    trialCountRef.current++;

    // Show stimulus for 700ms, then ISI (inter-stimulus interval)
    setTimeout(() => {
      // Check for lapse if it was a target and user didn't tap
      if (nextS === 'STAR' && previousShape === 'CIRCLE' && !hasRespondedThisTrialRef.current) {
        lapsesRef.current++;
      }
      setCurrentShape(null);
      // ISI jitter 400 - 800ms
      const isi = 400 + Math.random() * 400;
      setTimeout(nextTrial, isi);
    }, 700);
  };

  const handleTap = () => {
    if (!isActive || hasRespondedThisTrialRef.current) return;
    const tapTime = performance.now();
    const rt = tapTime - stimulusStartTimeRef.current;
    hasRespondedThisTrialRef.current = true;

    if (isTargetTrial) {
      hitsRef.current++;
      reactionTimesRef.current.push(rt);
      setFeedback('HIT');
    } else {
      falseAlarmsRef.current++;
      setFeedback('FALSE ALARM');
    }

    setTimeout(() => setFeedback(null), 300);
  };

  // Countdown timer
  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishTask();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const finishTask = async () => {
    setIsActive(false);
    const hitRate = targetsShownRef.current > 0 ? hitsRef.current / targetsShownRef.current : 1.0;
    const nonTargets = Math.max(1, trialCountRef.current - targetsShownRef.current);
    const falseAlarmRate = falseAlarmsRef.current / nonTargets;
    const meanRt =
      reactionTimesRef.current.length > 0
        ? reactionTimesRef.current.reduce((a, b) => a + b, 0) / reactionTimesRef.current.length
        : 450;

    const result: CPTResult = {
      hitRate: Math.min(1.0, Math.round(hitRate * 100) / 100),
      falseAlarmRate: Math.round(falseAlarmRate * 100) / 100,
      meanReactionTimeMs: Math.round(meanRt),
      lapseCount: lapsesRef.current,
      totalTrials: trialCountRef.current,
    };

    // Save to local database
    await db.saveCognitiveSession({
      id: `cpt-${Date.now()}`,
      testType: 'CPT',
      startedAt: Date.now() - durationSeconds * 1000,
      endedAt: Date.now(),
      rawMetric1: result.hitRate,
      rawMetric2: result.lapseCount,
      jankDiscardedTrials: 0,
      totalTrials: result.totalTrials,
      deviceFps: 60,
    });

    onComplete(result);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-zinc-900 border-2 border-zinc-700 rounded-2xl text-white select-none">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-black uppercase text-cyan-400">Sustained Attention Test (CPT)</h3>
        <span className="font-mono text-xs font-bold text-zinc-400">{timeLeft}s remaining</span>
      </div>

      {!isActive ? (
        <div className="space-y-4 text-center py-6">
          <p className="text-sm text-zinc-300 leading-relaxed">
            A stream of geometric shapes will flash on the screen.
            <br />
            <strong className="text-yellow-400">RULE:</strong> Tap ONLY when a <span className="font-bold text-white">⭐ STAR</span> appears immediately after a <span className="font-bold text-white">⭕ CIRCLE</span>.
          </p>
          <button
            onClick={startTask}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-wider rounded-xl cursor-pointer"
          >
            Start Assessment
          </button>
        </div>
      ) : (
        <div
          onClick={handleTap}
          className="h-64 bg-zinc-950 border-2 border-zinc-800 rounded-xl flex flex-col items-center justify-center cursor-pointer relative active:scale-98 transition-transform"
        >
          {currentShape && (
            <div className="text-7xl animate-scaleIn">
              {currentShape === 'CIRCLE' && '⭕'}
              {currentShape === 'STAR' && '⭐'}
              {currentShape === 'SQUARE' && '⬛'}
              {currentShape === 'TRIANGLE' && '🔺'}
            </div>
          )}
          {feedback && (
            <div
              className={`absolute bottom-4 text-xs font-black uppercase font-mono px-2 py-0.5 rounded ${
                feedback === 'HIT' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}
            >
              {feedback}
            </div>
          )}
          <div className="absolute top-2 text-[10px] text-zinc-600 font-mono">
            TAP SCREEN FOR TARGET (CIRCLE ➔ STAR)
          </div>
        </div>
      )}
    </div>
  );
};
