import React, { useState, useRef } from 'react';
import { db } from '../storage/db';

export interface VigilanceDecrementResult {
  decrementSlope: number; // Linear slope of RT decline across time blocks
  block1MeanRtMs: number;
  blockFinalMeanRtMs: number;
  totalBlocks: number;
}

interface VigilanceDecrementTaskProps {
  onComplete: (result: VigilanceDecrementResult) => void;
  blocksCount?: number;
}

export const VigilanceDecrementTask: React.FC<VigilanceDecrementTaskProps> = ({
  onComplete,
  blocksCount = 4,
}) => {
  const [currentBlock, setCurrentBlock] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [lineAngle, setLineAngle] = useState<number | null>(null); // -15 deg or +15 deg

  const blockRtsRef = useRef<number[][]>(Array.from({ length: blocksCount }, () => []));
  const stimulusStartRef = useRef<number>(0);
  const trialInBlockRef = useRef<number>(0);

  const startTask = () => {
    setIsActive(true);
    setCurrentBlock(0);
    trialInBlockRef.current = 0;
    runTrial(0);
  };

  const runTrial = (blockIdx: number) => {
    if (blockIdx >= blocksCount) {
      finishTask();
      return;
    }

    const angle = Math.random() < 0.5 ? -15 : 15;
    setLineAngle(angle);
    stimulusStartRef.current = performance.now();
  };

  const handleResponse = (tappedRight: boolean) => {
    if (!isActive || lineAngle === null) return;
    const rt = performance.now() - stimulusStartRef.current;
    setLineAngle(null);

    blockRtsRef.current[currentBlock].push(rt);
    trialInBlockRef.current++;

    if (trialInBlockRef.current >= 4) {
      // Advance to next time block
      trialInBlockRef.current = 0;
      const nextBlock = currentBlock + 1;
      setCurrentBlock(nextBlock);
      setTimeout(() => runTrial(nextBlock), 400);
    } else {
      setTimeout(() => runTrial(currentBlock), 300);
    }
  };

  const finishTask = async () => {
    setIsActive(false);
    const blockMeans = blockRtsRef.current.map((rts) =>
      rts.length > 0 ? rts.reduce((a, b) => a + b, 0) / rts.length : 400
    );

    // Simple linear regression slope across blocks (y = blockMeans, x = 0..n-1)
    const n = blockMeans.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += blockMeans[i];
      sumXY += i * blockMeans[i];
      sumXX += i * i;
    }
    const slope = n > 1 ? (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX) : 0;
    // Normalize slope per 1000ms
    const normalizedSlope = Math.max(0, Math.round(slope * 10) / 1000);

    const result: VigilanceDecrementResult = {
      decrementSlope: normalizedSlope,
      block1MeanRtMs: Math.round(blockMeans[0]),
      blockFinalMeanRtMs: Math.round(blockMeans[n - 1]),
      totalBlocks: n,
    };

    await db.saveCognitiveSession({
      id: `vigilance-${Date.now()}`,
      testType: 'VIGILANCE_DECREMENT',
      startedAt: Date.now() - 90000,
      endedAt: Date.now(),
      rawMetric1: result.decrementSlope,
      rawMetric2: result.blockFinalMeanRtMs - result.block1MeanRtMs,
      jankDiscardedTrials: 0,
      totalTrials: n * 4,
      deviceFps: 60,
    });

    onComplete(result);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-zinc-900 border-2 border-zinc-700 rounded-2xl text-white select-none">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-black uppercase text-teal-400">Cognitive Fatigue Slope</h3>
        {isActive && (
          <span className="font-mono text-xs font-bold text-zinc-400">
            Block {currentBlock + 1} of {blocksCount}
          </span>
        )}
      </div>

      {!isActive ? (
        <div className="space-y-4 text-center py-6">
          <p className="text-sm text-zinc-300 leading-relaxed">
            Measures mental stamina and the vigilance decrement slope across continuous focus blocks.
            <br />
            <strong className="text-teal-400">INSTRUCTIONS:</strong> Identify whether the line tilts Left or Right as fast as possible.
          </p>
          <button
            onClick={startTask}
            className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-black font-black uppercase tracking-wider rounded-xl cursor-pointer"
          >
            Start Fatigue Test
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="h-56 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center">
            {lineAngle !== null && (
              <div
                className="w-1.5 h-32 bg-teal-400 rounded-full transition-transform"
                style={{ transform: `rotate(${lineAngle}deg)` }}
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleResponse(false)}
              className="py-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-bold uppercase tracking-wider text-sm border-2 border-zinc-600 active:scale-95"
            >
              ◀ Tilts Left
            </button>
            <button
              onClick={() => handleResponse(true)}
              className="py-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-bold uppercase tracking-wider text-sm border-2 border-zinc-600 active:scale-95"
            >
              Tilts Right ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
