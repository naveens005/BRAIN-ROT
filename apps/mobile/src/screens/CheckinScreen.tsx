import React, { useState } from 'react';
import { db } from '../storage/db';

interface CheckinScreenProps {
  onDone?: () => void;
}

export const CheckinScreen: React.FC<CheckinScreenProps> = ({ onDone }) => {
  const [step, setStep] = useState<'QUESTIONNAIRE' | 'READING_TEST' | 'SUMMARY'>('QUESTIONNAIRE');

  // Questionnaire States
  const [emotionalState, setEmotionalState] = useState<number>(3); // 1 (calm) to 5 (restless/anxious)
  const [urgeToCheck, setUrgeToCheck] = useState<number>(3); // 1 (rare) to 5 (constant automatic reaching)
  const [memorySlips, setMemorySlips] = useState<number>(2); // 0 to 5+

  // Reading Test States
  const [readingStarted, setReadingStarted] = useState<boolean>(false);
  const [distractionLatencySecs, setDistractionLatencySecs] = useState<number | null>(null);
  const [readingTimer, setReadingTimer] = useState<number>(0);

  const startReadingTest = () => {
    setReadingStarted(true);
    setReadingTimer(0);
    const interval = window.setInterval(() => {
      setReadingTimer((prev) => prev + 1);
    }, 1000);

    // Save interval ID on window for clean-up
    (window as any).__readingInterval = interval;
  };

  const recordDistractionOrFinish = (wasDistracted: boolean) => {
    if ((window as any).__readingInterval) {
      clearInterval((window as any).__readingInterval);
    }
    setDistractionLatencySecs(wasDistracted ? readingTimer : 120);
    setStep('SUMMARY');
    saveCheckin(wasDistracted ? readingTimer : 120);
  };

  const saveCheckin = async (readingLatency: number) => {
    const cfqScore = (emotionalState + urgeToCheck + memorySlips) / 3;
    await db.saveWeeklyCheckin({
      id: `checkin-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      emotionalStateScore: emotionalState,
      urgeToCheckScore: urgeToCheck,
      memorySlipCount: memorySlips,
      readingPassageId: 'passage_neuroplasticity_1',
      readingInterruptedTimeMs: readingLatency * 1000,
      cfqScore: Math.round(cfqScore * 10) / 10,
      createdAt: Date.now(),
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-zinc-900 border-2 border-zinc-700 rounded-3xl text-white select-none space-y-5">
      <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
        <h2 className="text-sm font-black uppercase text-yellow-400 font-heading">
          Weekly Self-Assessment & Check-In
        </h2>
        <span className="text-xs font-mono font-bold text-zinc-400">
          {step === 'QUESTIONNAIRE' ? 'Part 1 of 2' : step === 'READING_TEST' ? 'Part 2 of 2' : 'Complete'}
        </span>
      </div>

      {step === 'QUESTIONNAIRE' && (
        <div className="space-y-5 py-2">
          {/* Item 1: Emotional Check-in */}
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1">
              1. Emotional state after prolonged phone use:
            </label>
            <p className="text-[11px] text-zinc-500 mb-2">
              Do you feel anxious, irritable, or restless when separated from your phone?
            </p>
            <div className="grid grid-cols-5 gap-1.5 text-center">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => setEmotionalState(val)}
                  className={`py-2 rounded-lg border text-xs font-bold ${
                    emotionalState === val ? 'bg-yellow-400 text-black border-yellow-300' : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                  }`}
                >
                  {val === 1 ? 'Calm' : val === 5 ? 'Restless' : val}
                </button>
              ))}
            </div>
          </div>

          {/* Item 2: Urge-to-check frequency */}
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1">
              2. Urge to check your phone without notifications:
            </label>
            <p className="text-[11px] text-zinc-500 mb-2">
              Automatic reaching for device during empty moments or elevator rides:
            </p>
            <div className="grid grid-cols-5 gap-1.5 text-center">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => setUrgeToCheck(val)}
                  className={`py-2 rounded-lg border text-xs font-bold ${
                    urgeToCheck === val ? 'bg-yellow-400 text-black border-yellow-300' : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                  }`}
                >
                  {val === 1 ? 'Rare' : val === 5 ? 'Constant' : val}
                </button>
              ))}
            </div>
          </div>

          {/* Item 3: Memory Slips */}
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1">
              3. Cognitive reflection (CFQ sample):
            </label>
            <p className="text-[11px] text-zinc-500 mb-2">
              Number of times this week you forgot why you opened an app or lost your train of thought:
            </p>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { val: 0, label: '0-1' },
                { val: 2, label: '2-3' },
                { val: 4, label: '4-6' },
                { val: 7, label: '7+' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setMemorySlips(opt.val)}
                  className={`py-2 rounded-lg border text-xs font-bold ${
                    memorySlips === opt.val ? 'bg-yellow-400 text-black border-yellow-300' : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep('READING_TEST')}
            className="w-full mt-4 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-black uppercase text-xs tracking-wider rounded-xl cursor-pointer"
          >
            Continue to Reading Focus Test
          </button>
        </div>
      )}

      {step === 'READING_TEST' && (
        <div className="space-y-4 py-2">
          <div className="text-xs text-zinc-400 leading-relaxed">
            <strong className="text-white block mb-1">Reading-Focus Latency Test (2 min):</strong>
            Read this excerpt on neuroplasticity at your normal pace. As soon as you experience an urge to check another tab or lose focus, tap the button below.
          </div>

          {!readingStarted ? (
            <button
              onClick={startReadingTest}
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase text-xs rounded-xl"
            >
              Begin Reading
            </button>
          ) : (
            <div className="space-y-4">
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-xs leading-relaxed text-zinc-200 max-h-56 overflow-y-auto">
                <p className="mb-3">
                  <em>"The brain possesses remarkable neuroplasticity, meaning that its functional pathways reorganize in response to environmental demands. When we subject our attention networks to fragmented, high-velocity digital stimuli, the brain optimizes for rapid surface-level scanning rather than sustained, reflective synthesis..."</em>
                </p>
                <p>
                  <em>"Deep contemplation requires maintaining working memory representations without external interruption. By cultivating dedicated periods of single-task immersion, synaptic connections governing top-down executive control are progressively reinforced."</em>
                </p>
              </div>

              <div className="text-center font-mono text-xs text-zinc-400">
                Focus Time Elapsed: <strong className="text-cyan-400">{readingTimer}s</strong>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => recordDistractionOrFinish(true)}
                  className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-bold text-xs uppercase rounded-xl border border-zinc-600"
                >
                  Felt Urge to Check / Distracted
                </button>
                <button
                  onClick={() => recordDistractionOrFinish(false)}
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase rounded-xl"
                >
                  Finished Without Distraction
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {step === 'SUMMARY' && (
        <div className="space-y-4 text-center py-4">
          <div className="text-4xl">📋✨</div>
          <h3 className="text-lg font-black uppercase text-white font-heading">
            Weekly Reflection Recorded
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
            Your subjective check-in and reading focus latency ({distractionLatencySecs}s) have been securely saved to your local encrypted database.
          </p>
          {onDone && (
            <button
              onClick={onDone}
              className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-black uppercase text-xs rounded-xl cursor-pointer"
            >
              Return to Dashboard
            </button>
          )}
        </div>
      )}
    </div>
  );
};
