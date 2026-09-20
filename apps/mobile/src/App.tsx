import React, { useState } from 'react';
import { DashboardScreen } from './screens/DashboardScreen';
import { CheckinScreen } from './screens/CheckinScreen';
import { InterventionsScreen } from './screens/InterventionsScreen';
import { ContinuousPerformanceTask } from './tests/ContinuousPerformanceTask';
import { PsychomotorVigilanceTask } from './tests/PsychomotorVigilanceTask';
import { StroopTwoBackTask } from './tests/StroopTwoBackTask';
import { GoNoGoDelayTask } from './tests/GoNoGoDelayTask';
import { VigilanceDecrementTask } from './tests/VigilanceDecrementTask';
import { FocusTimerTask } from './tests/FocusTimerTask';

type MobileTab = 'DASHBOARD' | 'ASSESSMENTS' | 'CHECKIN' | 'INTERVENTIONS';
type ActiveTest = 'CPT' | 'PVT' | 'STROOP' | 'GONOGO' | 'FATIGUE' | 'FOCUS' | null;

export const MobileApp: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<MobileTab>('DASHBOARD');
  const [activeTest, setActiveTest] = useState<ActiveTest>(null);
  const [testCompletedMessage, setTestCompletedMessage] = useState<string | null>(null);

  const handleTestDone = (testName: string) => {
    setActiveTest(null);
    setTestCompletedMessage(`${testName} completed and saved to encrypted baseline!`);
    setCurrentTab('DASHBOARD');
    setTimeout(() => setTestCompletedMessage(null), 4000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Toast Notification */}
      {testCompletedMessage && (
        <div className="fixed top-4 left-4 right-4 z-50 p-3 bg-emerald-950 border-2 border-emerald-500 text-emerald-300 text-xs font-bold rounded-2xl text-center shadow-lg">
          {testCompletedMessage}
        </div>
      )}

      {/* Main Screen Content */}
      <main className="flex-1 pb-16">
        {activeTest === 'CPT' && (
          <div className="p-4">
            <ContinuousPerformanceTask onComplete={() => handleTestDone('Sustained Attention Task (CPT)')} />
          </div>
        )}
        {activeTest === 'PVT' && (
          <div className="p-4">
            <PsychomotorVigilanceTask onComplete={() => handleTestDone('Psychomotor Vigilance Task (PVT)')} />
          </div>
        )}
        {activeTest === 'STROOP' && (
          <div className="p-4">
            <StroopTwoBackTask onComplete={() => handleTestDone('Cognitive Interference Task (Stroop)')} />
          </div>
        )}
        {activeTest === 'GONOGO' && (
          <div className="p-4">
            <GoNoGoDelayTask onComplete={() => handleTestDone('Impulse Control Task (Go/No-Go)')} />
          </div>
        )}
        {activeTest === 'FATIGUE' && (
          <div className="p-4">
            <VigilanceDecrementTask onComplete={() => handleTestDone('Cognitive Fatigue Task')} />
          </div>
        )}
        {activeTest === 'FOCUS' && (
          <div className="p-4">
            <FocusTimerTask onComplete={() => handleTestDone('Focus Session')} />
          </div>
        )}

        {/* If no test is active, show the selected tab screen */}
        {!activeTest && (
          <>
            {currentTab === 'DASHBOARD' && (
              <DashboardScreen
                onStartAssessment={() => setCurrentTab('ASSESSMENTS')}
                onOpenCheckin={() => setCurrentTab('CHECKIN')}
                onOpenInterventions={() => setCurrentTab('INTERVENTIONS')}
              />
            )}

            {currentTab === 'ASSESSMENTS' && (
              <div className="max-w-xl mx-auto px-4 py-6 space-y-4">
                <div className="pb-3 border-b border-zinc-800">
                  <h2 className="text-xl font-black uppercase text-white font-heading">
                    Active Cognitive Assessments
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Validated mobile micro-tasks (2-4 minutes each)
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 text-left">
                  {[
                    { id: 'CPT', title: '1. Attention Span (CPT)', time: '3 min', color: 'border-cyan-500', desc: 'Target detection in a high-speed shape stream; tracks lapses.' },
                    { id: 'PVT', title: '2. Reaction Consistency (PVT)', time: '2 min', color: 'border-amber-500', desc: 'Psychomotor vigilance task; calculates reaction time CV and lapses >500ms.' },
                    { id: 'STROOP', title: '3. Error Rate (Stroop)', time: '2 min', color: 'border-purple-500', desc: 'Color-word interference test evaluating executive response inhibition.' },
                    { id: 'GONOGO', title: '4. Impulse Control (Go / No-Go)', time: '2 min', color: 'border-emerald-500', desc: 'Pre-potent motor inhibition and hyperbolic delay discounting rate.' },
                    { id: 'FATIGUE', title: '5. Cognitive Fatigue Slope', time: '2 min', color: 'border-teal-500', desc: 'Slope of reaction time deterioration across time-on-task blocks.' },
                    { id: 'FOCUS', title: '6. Focus Session Completion', time: '15-45 min', color: 'border-blue-500', desc: 'Dedicated focus block tracking app-switches and completion rate.' },
                  ].map((task) => (
                    <button
                      key={task.id}
                      onClick={() => setActiveTest(task.id as ActiveTest)}
                      className={`p-4 bg-zinc-900 border-2 ${task.color} rounded-2xl hover:bg-zinc-850 transition-all text-left space-y-1 cursor-pointer`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-sm text-white font-heading">{task.title}</span>
                        <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">{task.time}</span>
                      </div>
                      <p className="text-xs text-zinc-400">{task.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentTab === 'CHECKIN' && (
              <div className="py-6 px-4">
                <CheckinScreen onDone={() => setCurrentTab('DASHBOARD')} />
              </div>
            )}

            {currentTab === 'INTERVENTIONS' && (
              <InterventionsScreen onBack={() => setCurrentTab('DASHBOARD')} />
            )}
          </>
        )}
      </main>

      {/* Sticky Bottom Navigation Bar */}
      {!activeTest && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 px-4 py-2">
          <div className="max-w-xl mx-auto flex justify-around text-center">
            {[
              { id: 'DASHBOARD', label: 'Dashboard', icon: '📊' },
              { id: 'ASSESSMENTS', label: 'Assessments', icon: '🧠' },
              { id: 'CHECKIN', label: 'Check-In', icon: '📝' },
              { id: 'INTERVENTIONS', label: 'Habits', icon: '🌿' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as MobileTab)}
                className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
                  currentTab === tab.id ? 'text-cyan-400 font-black' : 'text-zinc-500 font-bold'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="text-[10px] uppercase font-mono tracking-tight">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
};

export default MobileApp;
