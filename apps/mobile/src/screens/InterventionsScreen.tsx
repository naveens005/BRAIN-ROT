import React, { useState } from 'react';

interface InterventionsScreenProps {
  onBack?: () => void;
}

export const InterventionsScreen: React.FC<InterventionsScreenProps> = ({ onBack }) => {
  const [activeModal, setActiveModal] = useState<'BREATHING' | 'READING' | 'WALK' | null>(null);
  const [breathingSeconds, setBreathingSeconds] = useState<number>(60);
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'IN' | 'HOLD' | 'OUT'>('IN');

  const startBreathing = () => {
    setIsBreathingActive(true);
    setBreathingSeconds(60);

    let phaseTimer = 0;
    const interval = setInterval(() => {
      phaseTimer = (phaseTimer + 1) % 12;
      if (phaseTimer < 4) setBreathPhase('IN');
      else if (phaseTimer < 8) setBreathPhase('HOLD');
      else setBreathPhase('OUT');

      setBreathingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsBreathingActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6 text-zinc-100 select-none pb-24 font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight text-white font-heading">
            Habit Reversal & Interventions
          </h2>
          <p className="text-xs text-zinc-400">Grounded in cognitive neuroplasticity</p>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="text-xs font-bold uppercase text-cyan-400 bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-lg"
          >
            Dashboard
          </button>
        )}
      </div>

      {/* 1. Scheduled Breaks Module */}
      <div className="bg-zinc-900 border-2 border-zinc-700 rounded-3xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🧘</span>
            <h3 className="text-sm font-black uppercase text-cyan-400 font-heading">
              Scheduled Mindful Break
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-700">
            Every 45 min
          </span>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Step away, stretch, and relax ocular focus to release cognitive fatigue before vigilance drops.
        </p>

        <button
          onClick={() => {
            setActiveModal('BREATHING');
            startBreathing();
          }}
          className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase text-xs tracking-wider rounded-xl cursor-pointer"
        >
          Start 60-Second Box Breathing
        </button>
      </div>

      {/* 2. Digital-Free Zones (Slide 7) */}
      <div className="bg-zinc-900 border-2 border-zinc-700 rounded-3xl p-5 space-y-3">
        <div className="flex items-center space-x-2">
          <span className="text-xl">🌙</span>
          <h3 className="text-sm font-black uppercase text-purple-400 font-heading">
            Digital-Free Zones & Sleep Wind-Down
          </h3>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Designate tech-free mental boundaries to restore natural melatonin rhythms and sleep architecture.
        </p>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
            <span className="font-bold text-white block">Bedtime Wind-Down</span>
            <span className="text-[10px] text-purple-300 font-mono">22:30 – 07:00 (Active)</span>
            <p className="text-[10px] text-zinc-500 mt-1">Gentle 10s breathing friction on social apps.</p>
          </div>
          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
            <span className="font-bold text-white block">Mealtime Sanctuary</span>
            <span className="text-[10px] text-purple-300 font-mono">13:00 – 14:00 (Custom)</span>
            <p className="text-[10px] text-zinc-500 mt-1">Preserve mindful focus while eating.</p>
          </div>
        </div>
      </div>

      {/* 3. Brain-Boosting Activity Library (Slide 8) */}
      <div className="bg-zinc-900 border-2 border-zinc-700 rounded-3xl p-5 space-y-4">
        <div className="flex items-center space-x-2">
          <span className="text-xl">📚</span>
          <h3 className="text-sm font-black uppercase text-emerald-400 font-heading">
            Brain-Boosting Activity Library
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg">📖</span>
              <span className="font-extrabold text-xs text-white uppercase font-heading">Deep Reading</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              15-45 minutes with physical books or long-form academic articles without digital switching.
            </p>
            <span className="inline-block text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">
              Targets: Sustained Attention
            </span>
          </div>

          <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🚶</span>
              <span className="font-extrabold text-xs text-white uppercase font-heading">Time in Nature</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              20 minutes outdoors. Attention Restoration Theory (ART) shows natural environments restore mental bandwidth.
            </p>
            <span className="inline-block text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">
              Targets: Mental Fatigue
            </span>
          </div>

          <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🧩</span>
              <span className="font-extrabold text-xs text-white uppercase font-heading">Problem Solving</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Tackle complex logic puzzles, chess tactics, or code challenges requiring abstract working memory.
            </p>
            <span className="inline-block text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">
              Targets: Error Invariance
            </span>
          </div>

          <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🎨</span>
              <span className="font-extrabold text-xs text-white uppercase font-heading">Creative Pursuits</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Manual sketching, acoustic instruments, or journaling to engage divergent motor and neural circuits.
            </p>
            <span className="inline-block text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">
              Targets: Dopamine Reset
            </span>
          </div>
        </div>
      </div>

      {/* Box Breathing Modal */}
      {activeModal === 'BREATHING' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none">
          <div className="bg-zinc-900 border-2 border-cyan-500 p-6 rounded-3xl max-w-sm w-full text-center space-y-5">
            <h3 className="text-sm font-black uppercase text-cyan-400 font-heading">
              Box Breathing Protocol (4-4-4)
            </h3>

            <div className="py-6 flex flex-col items-center justify-center">
              <div
                className={`w-36 h-36 rounded-full border-4 flex items-center justify-center transition-all duration-1000 ${
                  breathPhase === 'IN'
                    ? 'border-cyan-400 scale-110 bg-cyan-950/40'
                    : breathPhase === 'HOLD'
                    ? 'border-yellow-400 scale-105 bg-yellow-950/40'
                    : 'border-blue-500 scale-90 bg-blue-950/40'
                }`}
              >
                <div className="text-center">
                  <span className="text-xl font-black font-heading text-white block">
                    {breathPhase === 'IN' ? 'INHALE' : breathPhase === 'HOLD' ? 'HOLD' : 'EXHALE'}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">{breathingSeconds}s</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-zinc-400">
              Lowers sympathetic autonomic arousal and clears working memory clutter.
            </p>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold uppercase rounded-xl"
            >
              Finish Pause
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
