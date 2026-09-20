import React, { useState, useEffect } from 'react';
import {
  computeRotRiskIndex,
  compute14DayBaseline,
  generateFragmentedUserHistory,
  generateHealthyUserHistory,
} from '@focusguard/scoring';
import type { RotRiskScoreResult } from '@focusguard/scoring';

import {
  Shield,
  Activity,
  AlertTriangle,
  Upload,
  BookOpen,
  Info,
  CheckCircle2,
  Moon,
  Smartphone,
} from 'lucide-react';


export const WebCompanionApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'SCIENCE'>('DASHBOARD');
  const [historyDayCount, setHistoryDayCount] = useState<number>(18);
  const [profileType, setProfileType] = useState<'FRAGMENTED' | 'HEALTHY'>('FRAGMENTED');
  const [scoreResult, setScoreResult] = useState<RotRiskScoreResult | null>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  useEffect(() => {
    const history =
      profileType === 'FRAGMENTED'
        ? generateFragmentedUserHistory(historyDayCount)
        : generateHealthyUserHistory(historyDayCount);

    const baseline = compute14DayBaseline(history.slice(0, Math.min(14, history.length)));
    const currentDay = history[history.length - 1];
    const computed = computeRotRiskIndex(currentDay, baseline, historyDayCount);
    setScoreResult(computed);
  }, [historyDayCount, profileType]);

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.usage && Array.isArray(parsed.usage)) {
          setImportStatus(`Successfully loaded ${parsed.usage.length} days of data from export!`);
          setTimeout(() => setImportStatus(null), 4000);
        }
      } catch {
        setImportStatus('Failed to parse JSON export file.');
      }
    };
    reader.readAsText(file);
  };

  if (!scoreResult) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-16">
      {/* Top Navigation Bar */}
      <header className="border-b border-zinc-800 bg-zinc-900/60 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-white font-heading">
                FOCUSGUARD
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-mono bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                Web Companion v1.0
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('DASHBOARD')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${
                activeTab === 'DASHBOARD'
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('SCIENCE')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center space-x-1 ${
                activeTab === 'SCIENCE'
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Science & Ethics</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-8">
        {/* Methodological Notice */}
        <div className="bg-zinc-900/80 border-l-4 border-cyan-400 p-4 rounded-r-2xl flex items-start space-x-3 text-xs text-zinc-300">
          <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-white block font-bold mb-0.5">
              Ethical & Cognitive Science Guardrail:
            </strong>
            "Brain rot" is an informal sociological descriptor, not a formal medical diagnosis. FocusGuard is a self-awareness and habit reversal tool designed to identify transient attention fragmentation against your own personal 14-day baseline.
          </div>
        </div>

        {importStatus && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500 text-emerald-300 text-xs font-bold rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{importStatus}</span>
          </div>
        )}

        {activeTab === 'DASHBOARD' ? (
          <>
            {/* Top Row: Hero Risk Gauge & Screen Consumption Audit (Slide 9 Honest Redesign) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column: Risk Index Gauge */}
              <div className="md:col-span-5 bg-zinc-900 border-2 border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                      Rot Risk Index
                    </span>
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-950/50 px-2.5 py-0.5 rounded border border-cyan-800">
                      Confidence: {Math.round(scoreResult.confidence * 100)}%
                    </span>
                  </div>

                  {scoreResult.isCalibrating ? (
                    <div className="text-center py-8 space-y-2">
                      <span className="text-4xl">⏱️</span>
                      <h3 className="text-lg font-black text-cyan-400 font-heading uppercase">
                        Calibrating Personal Baseline
                      </h3>
                      <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                        Gathering Day {scoreResult.calibrationDay} of 14. Scores are relative to personal history rather than arbitrary population claims.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-4 space-y-3">
                      <div className="relative inline-flex items-center justify-center">
                        <div className="w-40 h-40 rounded-full border-8 border-zinc-800 flex flex-col items-center justify-center">
                          <span className="text-6xl font-black font-heading text-white">
                            {scoreResult.riskIndex}
                          </span>
                          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest mt-1">
                            Risk Score
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border bg-amber-950/60 border-amber-400 text-amber-300">
                          {scoreResult.riskBand}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Risk Factor Chips */}
                <div className="pt-4 border-t border-zinc-800/80">
                  <span className="text-[11px] font-mono uppercase font-bold text-zinc-400 block mb-2">
                    Active Risk Factor Chips:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[11px] bg-rose-950/50 text-rose-300 border border-rose-700/50 px-2.5 py-1 rounded-lg flex items-center space-x-1 font-semibold">
                      <Smartphone className="w-3 h-3" />
                      <span>Excessive Media (+42m)</span>
                    </span>
                    <span className="text-[11px] bg-amber-950/50 text-amber-300 border border-amber-700/50 px-2.5 py-1 rounded-lg flex items-center space-x-1 font-semibold">
                      <Activity className="w-3 h-3" />
                      <span>App-Switching (28/hr)</span>
                    </span>
                    <span className="text-[11px] bg-purple-950/50 text-purple-300 border border-purple-700/50 px-2.5 py-1 rounded-lg flex items-center space-x-1 font-semibold">
                      <Moon className="w-3 h-3" />
                      <span>Late-Night Usage (1h 15m)</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Today vs Baseline & Explainability Top 3 Factors */}
              <div className="md:col-span-7 space-y-6">
                {/* Explainability Breakdown */}
                <div className="bg-zinc-900 border-2 border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-black uppercase text-white font-heading tracking-wider">
                      Why This Score: Top 3 Contributors
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {scoreResult.topContributors.map((factor, i) => (
                      <div
                        key={factor.metricKey}
                        className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800/80 space-y-1"
                      >
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-zinc-200">
                            {i + 1}. {factor.title}
                          </span>
                          <span className="font-mono text-amber-400">
                            {factor.rawValue} {factor.unit} (Baseline: {factor.baselineValue} {factor.unit})
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          {factor.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Today vs Baseline Screen Time Card */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-900 border-2 border-zinc-800 rounded-3xl p-5 space-y-1">
                    <span className="text-xs font-bold uppercase text-zinc-400 block font-heading">
                      Screen Time vs Baseline
                    </span>
                    <div className="text-2xl font-black font-heading text-white">
                      6h 24m
                    </div>
                    <span className="text-xs font-mono text-rose-400 font-bold block">
                      +1h 40m vs 14-day median
                    </span>
                  </div>

                  <div className="bg-zinc-900 border-2 border-zinc-800 rounded-3xl p-5 space-y-1">
                    <span className="text-xs font-bold uppercase text-zinc-400 block font-heading">
                      Focus Stability
                    </span>
                    <div className="text-2xl font-black font-heading text-white">
                      68 / 100
                    </div>
                    <span className="text-xs font-mono text-amber-400 font-bold block">
                      -14 pts vs personal best
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Section: The Six Pillars Cognitive Stability Radar */}
            <div className="bg-zinc-900 border-2 border-zinc-800 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="text-sm font-black uppercase text-purple-400 font-heading tracking-wider">
                  Cognitive Stability Architecture (6 Empirical Metrics)
                </h3>
                <span className="text-xs text-zinc-400 font-mono">
                  Personal 14-Day Scale
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { title: 'Sustained Attention (CPT)', score: scoreResult.pillarScores.sustainedAttention, desc: 'Target detection rate under rapid visual streams' },
                  { title: 'Reaction Consistency (PVT)', score: scoreResult.pillarScores.reactionConsistency, desc: 'Psychomotor vigilance CV and lapses >500ms' },
                  { title: 'Cognitive Accuracy (Stroop)', score: scoreResult.pillarScores.cognitiveAccuracy, desc: 'Interference error rate under conflict' },
                  { title: 'Impulse Control (Go/No-Go)', score: scoreResult.pillarScores.impulseControl, desc: 'Pre-potent motor inhibition and delay discount' },
                  { title: 'Fatigue Resilience', score: scoreResult.pillarScores.mentalFatigueResilience, desc: 'Slope of vigilance decrement over time-on-task' },
                  { title: 'Task Completion Rate', score: scoreResult.pillarScores.taskCompletion, desc: 'In-app focus sessions finished with 0 exits' },
                ].map((pillar) => (
                  <div key={pillar.title} className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-zinc-200">{pillar.title}</span>
                      <span className="font-mono text-cyan-400 font-black">{pillar.score} / 100</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${pillar.score}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-zinc-500">{pillar.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Controls: Desktop Import & Profile Simulator */}
            <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-white uppercase block">
                  Import Decrypted Data from FocusGuard Mobile App
                </span>
                <p className="text-zinc-400 text-[11px]">
                  Drop your <code>focusguard-export-YYYY-MM-DD.json</code> file to render your complete private profile on desktop.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <label className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-black uppercase text-xs rounded-xl cursor-pointer flex items-center space-x-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose JSON Export</span>
                  <input type="file" accept=".json" onChange={handleJsonUpload} className="hidden" />
                </label>
              </div>
            </div>
          </>
        ) : (
          /* Science, Methodology & Literature Citations */
          <div className="bg-zinc-900 border-2 border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6 text-sm text-zinc-300 leading-relaxed">
            <h2 className="text-2xl font-black uppercase text-white font-heading">
              Scientific Methodology & Ethical Limitations
            </h2>

            <div className="space-y-4">
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                <h3 className="text-base font-bold text-cyan-400 mb-1">
                  1. The Self-Awareness Framework vs Medical Diagnosis
                </h3>
                <p className="text-xs text-zinc-400">
                  FocusGuard explicitly rejects medical pathologization of colloquial terms like "brain rot." Our system models transient behavioral fragmentation resulting from excessive digital stimulation, dopamine-reinforcement loops, and sleep deprivation.
                </p>
              </div>

              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                <h3 className="text-base font-bold text-amber-400 mb-1">
                  2. Robust Statistics: Median & MAD Over Population Averages
                </h3>
                <p className="text-xs text-zinc-400">
                  Standard Z-scores using mean and standard deviation are heavily skewed by single outliers (e.g. leaving an educational video streaming overnight). FocusGuard uses Median and Median Absolute Deviation (MAD), multiplied by the 1.4826 consistency scale factor and winsorized to [-3.0, +3.0].
                </p>
              </div>

              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                <h3 className="text-base font-bold text-purple-400 mb-1">
                  3. Key Published Literature Cited
                </h3>
                <ul className="text-xs text-zinc-400 space-y-2 list-disc list-inside mt-2">
                  <li><strong>Psychomotor Vigilance Task (PVT):</strong> Dinges & Powell (1985). <em>Microcomputer analyses of performance decrements during sleep deprivation.</em> Behavior Research Methods.</li>
                  <li><strong>Continuous Performance Test (CPT):</strong> Rosvold et al. (1956). <em>A continuous performance test of brain damage.</em> Journal of Consulting Psychology.</li>
                  <li><strong>Cognitive Failures Questionnaire (CFQ):</strong> Broadbent et al. (1982). <em>The Cognitive Failures Questionnaire and its correlates.</em> British Journal of Clinical Psychology.</li>
                  <li><strong>Attention Restoration Theory (ART):</strong> Kaplan, R., & Kaplan, S. (1989). <em>The experience of nature: A psychological perspective.</em> Cambridge University Press.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebCompanionApp;
