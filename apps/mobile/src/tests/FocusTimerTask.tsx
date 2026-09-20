import React, { useState, useEffect, useRef } from 'react';
import { db } from '../storage/db';

export interface FocusSessionResult {
  completedWithoutExit: boolean;
  actualDurationSeconds: number;
  plannedMinutes: number;
  interruptionCount: number;
}

interface FocusTimerProps {
  onComplete: (result: FocusSessionResult) => void;
}

export const FocusTimerTask: React.FC<FocusTimerProps> = ({ onComplete }) => {
  const [taskName, setTaskName] = useState<string>('Deep Reading / Study');
  const [plannedMinutes, setPlannedMinutes] = useState<number>(25);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [interruptions, setInterruptions] = useState<number>(0);

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Monitor visibility / app backgrounding as an interruption event
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isRunning) {
        setInterruptions((prev) => prev + 1);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isRunning]);

  const startSession = () => {
    setIsRunning(true);
    setInterruptions(0);
    setSecondsRemaining(plannedMinutes * 60);
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = window.setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          finishSession(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const finishSession = async (completedNormally: boolean) => {
    setIsRunning(false);
    const elapsedSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    const completedWithoutExit = completedNormally && interruptions === 0;

    const result: FocusSessionResult = {
      completedWithoutExit,
      actualDurationSeconds: elapsedSeconds,
      plannedMinutes,
      interruptionCount: interruptions,
    };

    await db.saveFocusSession({
      id: `focus-${Date.now()}`,
      targetTask: taskName,
      plannedMinutes,
      actualSeconds: elapsedSeconds,
      completedWithoutExit,
      interruptionCount: interruptions,
      createdAt: Date.now(),
    });

    onComplete(result);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-zinc-900 border-2 border-zinc-700 rounded-2xl text-white select-none">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-black uppercase text-blue-400">In-App Focus Session</h3>
        <span className="font-mono text-xs font-bold text-zinc-400">
          {isRunning ? 'LOCKED IN' : 'SETUP'}
        </span>
      </div>

      {!isRunning ? (
        <div className="space-y-4 py-2">
          <div>
            <label className="text-xs font-bold uppercase text-zinc-400 block mb-1">
              Target Task Name
            </label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full bg-zinc-950 border-2 border-zinc-800 p-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-zinc-400 block mb-1">
              Focus Duration
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[15, 25, 45].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setPlannedMinutes(mins)}
                  className={`py-2 rounded-xl text-xs font-black uppercase border-2 ${
                    plannedMinutes === mins
                      ? 'border-blue-500 bg-blue-500/20 text-white'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startSession}
            className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-wider rounded-xl cursor-pointer"
          >
            Start Focus Session
          </button>
        </div>
      ) : (
        <div className="space-y-6 text-center py-6">
          <div className="text-6xl font-mono font-black text-blue-400 tracking-wider">
            {formatTime(secondsRemaining)}
          </div>

          <div className="text-xs text-zinc-400 font-medium">
            Working on: <strong className="text-white">{taskName}</strong>
            <br />
            App Switches / Interruptions: <span className={interruptions > 0 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>{interruptions}</span>
          </div>

          <button
            onClick={() => finishSession(false)}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg text-xs font-bold uppercase"
          >
            End Session Early
          </button>
        </div>
      )}
    </div>
  );
};
