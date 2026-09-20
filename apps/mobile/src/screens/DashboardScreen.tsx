import React, { useState, useEffect } from 'react';
import {
  computeRotRiskIndex,
  compute14DayBaseline,
  generateFragmentedUserHistory,
} from '../../../packages/scoring/src/index.js';
import type { RotRiskScoreResult } from '../../../packages/scoring/src/index.js';
import { db } from '../storage/db';
import { t, setLanguage, getLanguage } from '../i18n/i18n';
import type { Language } from '../i18n/i18n';

interface DashboardScreenProps {
  onStartAssessment?: () => void;
  onOpenCheckin?: () => void;
  onOpenInterventions?: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onStartAssessment,
  onOpenCheckin,
  onOpenInterventions,
}) => {
  const [currentLang, setCurrentLang] = useState<Language>(getLanguage());
  const [dayCount, setDayCount] = useState<number>(14); // Default to full calibration or toggle to test
  const [scoreResult, setScoreResult] = useState<RotRiskScoreResult | null>(null);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  // Load metrics and compute score
  useEffect(() => {
    // Generate realistic simulated history up to dayCount
    const history = generateFragmentedUserHistory(dayCount);
    const baseline = compute14DayBaseline(history.slice(0, Math.min(14, history.length)));
    const currentDay = history[history.length - 1];

    const computed = computeRotRiskIndex(currentDay, baseline, dayCount);
    setScoreResult(computed);
  }, [dayCount]);

  const handleLanguageToggle = (lang: Language) => {
    setLanguage(lang);
    setCurrentLang(lang);
  };

  const handleExportData = async () => {
    const jsonStr = await db.exportAllDataAsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focusguard-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    setExportMessage('Data exported successfully (JSON)!');
    setTimeout(() => setExportMessage(null), 3000);
  };

  const handleWipeData = async () => {
    if (window.confirm('Are you sure you want to erase all FocusGuard data? This complies with GDPR / DPDP right to erasure.')) {
      await db.wipeAllData();
      setExportMessage('All local data wiped cleanly.');
      setTimeout(() => setExportMessage(null), 3000);
    }
  };

  if (!scoreResult) return null;

  const bandColors = {
    CALIBRATING: 'text-cyan-400 border-cyan-400 bg-cyan-950/40',
    LOW: 'text-emerald-400 border-emerald-400 bg-emerald-950/40',
    MODERATE: 'text-yellow-400 border-yellow-400 bg-yellow-950/40',
    ELEVATED: 'text-amber-500 border-amber-500 bg-amber-950/40',
    HIGH: 'text-rose-500 border-rose-500 bg-rose-950/40',
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6 text-zinc-100 select-none pb-24 font-sans">
      {/* Top Header & Language Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight font-heading text-white flex items-center space-x-2">
            <span>🛡️</span>
            <span>{t('app_name')}</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">Attention Fragmentation & Digital Wellbeing</p>
        </div>

        <div className="flex items-center space-x-1 bg-zinc-900 border border-zinc-700 p-1 rounded-lg text-xs font-bold">
          <button
            onClick={() => handleLanguageToggle('en')}
            className={`px-2 py-1 rounded ${currentLang === 'en' ? 'bg-zinc-700 text-white' : 'text-zinc-400'}`}
          >
            EN
          </button>
          <button
            onClick={() => handleLanguageToggle('ta')}
            className={`px-2 py-1 rounded ${currentLang === 'ta' ? 'bg-zinc-700 text-white' : 'text-zinc-400'}`}
          >
            தமிழ்
          </button>
        </div>
      </div>

      {/* Mandatory Cognitive Science Disclaimer Banner */}
      <div className="bg-zinc-900/90 border-l-4 border-cyan-400 p-3 rounded-r-xl text-xs text-zinc-300 leading-relaxed">
        <strong className="text-cyan-300 uppercase block font-mono text-[10px] mb-0.5">
          Methodological Notice
        </strong>
        {t('disclaimer_banner')}
      </div>

      {/* Primary Risk Gauge Card */}
      <div className="bg-zinc-900 border-2 border-zinc-700 rounded-3xl p-6 shadow-xl space-y-5 text-center">
        <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
          <span className="uppercase font-bold tracking-wider">{t('rot_risk_index')}</span>
          <span>
            {t('confidence_label')}: <strong className="text-white">{Math.round(scoreResult.confidence * 100)}%</strong>
          </span>
        </div>

        {scoreResult.isCalibrating ? (
          /* Calibrating State */
          <div className="py-6 space-y-3">
            <div className="inline-block p-4 rounded-full bg-cyan-950/40 border-2 border-cyan-400 text-4xl animate-pulse">
              ⏱️
            </div>
            <h2 className="text-xl font-black uppercase text-cyan-400 font-heading">
              {t('calibrating_title')}
            </h2>
            <p className="text-xs text-zinc-300 max-w-sm mx-auto leading-relaxed">
              {t('calibrating_desc', { day: scoreResult.calibrationDay })}
            </p>
            <div className="w-48 mx-auto bg-zinc-800 h-2 rounded-full overflow-hidden border border-zinc-700 mt-2">
              <div
                className="h-full bg-cyan-400 transition-all duration-500"
                style={{ width: `${(scoreResult.calibrationDay / 14) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          /* Calibrated Risk Result */
          <div className="py-4 space-y-3">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-36 h-36 rounded-full border-8 border-zinc-800 flex flex-col items-center justify-center">
                <span className="text-5xl font-black font-heading text-white">
                  {scoreResult.riskIndex}
                </span>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                  / 100
                </span>
              </div>
            </div>

            <div>
              <span
                className={`inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${
                  bandColors[scoreResult.riskBand]
                }`}
              >
                {t(`risk_bands.${scoreResult.riskBand.toLowerCase()}`)}
              </span>
            </div>

            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Calculated relative to your own 14-day rolling baseline (Median/MAD Z-scores).
            </p>
          </div>
        )}

        {/* Demo Calibration Toggle */}
        <div className="pt-2 border-t border-zinc-800 flex justify-center items-center space-x-2 text-[11px] text-zinc-500 font-mono">
          <span>Simulation Day:</span>
          <button
            onClick={() => setDayCount(7)}
            className={`px-2 py-0.5 rounded ${dayCount === 7 ? 'bg-cyan-600 text-white font-bold' : 'bg-zinc-800'}`}
          >
            Day 7 (Calibrating)
          </button>
          <button
            onClick={() => setDayCount(14)}
            className={`px-2 py-0.5 rounded ${dayCount === 14 ? 'bg-cyan-600 text-white font-bold' : 'bg-zinc-800'}`}
          >
            Day 14 (Calibrated)
          </button>
          <button
            onClick={() => setDayCount(21)}
            className={`px-2 py-0.5 rounded ${dayCount === 21 ? 'bg-rose-600 text-white font-bold' : 'bg-zinc-800'}`}
          >
            Day 21 (Elevated)
          </button>
        </div>
      </div>

      {/* Why This Score - Top 3 Contributing Factors */}
      <div className="bg-zinc-900 border-2 border-zinc-700 rounded-3xl p-5 space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 font-heading">
          {t('why_this_score')}
        </h3>

        <div className="space-y-2.5">
          {scoreResult.topContributors.map((factor, idx) => (
            <div
              key={factor.metricKey}
              className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800 space-y-1"
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-white">
                  {idx + 1}. {factor.title}
                </span>
                <span className="text-amber-400 font-mono">
                  {factor.rawValue} {factor.unit}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{factor.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Six Cognitive Pillars Radar Breakdown */}
      <div className="bg-zinc-900 border-2 border-zinc-700 rounded-3xl p-5 space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-purple-400 font-heading">
          {t('six_pillars_radar')}
        </h3>

        <div className="space-y-2.5 text-xs">
          {[
            { key: 'sustainedAttention', label: t('pillars.sustained_attention'), val: scoreResult.pillarScores.sustainedAttention, color: 'bg-cyan-400' },
            { key: 'reactionConsistency', label: t('pillars.reaction_consistency'), val: scoreResult.pillarScores.reactionConsistency, color: 'bg-amber-400' },
            { key: 'cognitiveAccuracy', label: t('pillars.cognitive_accuracy'), val: scoreResult.pillarScores.cognitiveAccuracy, color: 'bg-purple-400' },
            { key: 'impulseControl', label: t('pillars.impulse_control'), val: scoreResult.pillarScores.impulseControl, color: 'bg-emerald-400' },
            { key: 'mentalFatigueResilience', label: t('pillars.fatigue_resilience'), val: scoreResult.pillarScores.mentalFatigueResilience, color: 'bg-teal-400' },
            { key: 'taskCompletion', label: t('pillars.task_completion'), val: scoreResult.pillarScores.taskCompletion, color: 'bg-blue-400' },
          ].map((item) => (
            <div key={item.key} className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-zinc-300">{item.label}</span>
                <span className="font-mono text-white">{item.val} / 100</span>
              </div>
              <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className={`h-full ${item.color} transition-all duration-500`}
                  style={{ width: `${item.val}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {onStartAssessment && (
          <button
            onClick={onStartAssessment}
            className="w-full mt-2 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-wider text-xs rounded-xl cursor-pointer"
          >
            {t('buttons.start_assessment')}
          </button>
        )}
      </div>

      {/* Safety Net & Support */}
      <div className="bg-blue-950/30 border border-blue-600/40 p-4 rounded-2xl text-xs text-blue-200 space-y-1.5">
        <strong className="text-blue-300 font-bold block">{t('safety_support_title')}</strong>
        <p className="leading-relaxed">{t('safety_support_body')}</p>
      </div>

      {/* Privacy & Data Sovereignty Section (DPDP 2023 & GDPR) */}
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-3">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
          Data Sovereignty & Local-First Privacy
        </h4>
        <p className="text-[11px] text-zinc-400 leading-relaxed">
          All sensor logs and cognitive assessments are encrypted locally on your device. You can export or erase your history at any moment.
        </p>

        {exportMessage && (
          <div className="p-2 bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs rounded font-bold">
            {exportMessage}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleExportData}
            className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-zinc-600"
          >
            {t('buttons.export_data')}
          </button>
          <button
            onClick={handleWipeData}
            className="py-2.5 px-4 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-bold text-xs uppercase tracking-wider rounded-xl border border-rose-800"
          >
            {t('buttons.delete_all_data')}
          </button>
        </div>
      </div>
    </div>
  );
};
