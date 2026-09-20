import {
  DailyMetricsRecord,
  MetricContributor,
  PersonalBaseline,
  PillarScoreBreakdown,
  RiskBand,
  RotRiskScoreResult,
  ScoringWeightsConfig,
} from './types.js';
import { calculateRobustZScore, winsorize } from './baseline.js';

export const DEFAULT_SCORING_CONFIG: ScoringWeightsConfig = {
  version: '1.0.0',
  sustainedAttentionWeight: 0.20,
  reactionConsistencyWeight: 0.15,
  cognitiveAccuracyWeight: 0.10,
  impulseControlWeight: 0.15,
  mentalFatigueWeight: 0.10,
  taskCompletionWeight: 0.10,
  passiveUsageWeight: 0.20,
};

// Maps a winsorized Z-score to a pillar risk score (0 = lowest risk, 100 = extreme risk)
// Baseline at Z = 0 is a healthy anchor of 15 (Low Risk band)
function zToRiskScore(zScore: number, isHigherWorse: boolean): number {
  const badZ = isHigherWorse ? zScore : -zScore;
  // If at baseline (badZ = 0), baseline risk is 15
  // Each unit of MAD deviation worsens risk by 20 points
  const rawRisk = 15 + badZ * 20;
  return Math.max(0, Math.min(100, Math.round(rawRisk)));
}

// Converts risk (0-100) to health score (100 = optimal, 0 = critical)
function riskToHealth(risk: number): number {
  return Math.max(0, Math.min(100, 100 - risk));
}

export function computeRotRiskIndex(
  currentDay: DailyMetricsRecord,
  baseline: PersonalBaseline,
  historyDayCount: number,
  config: ScoringWeightsConfig = DEFAULT_SCORING_CONFIG
): RotRiskScoreResult {
  const isCalibrating = historyDayCount < 14;
  const calibrationDay = Math.min(14, Math.max(1, historyDayCount));

  // 1. Sustained Attention (Lower hit rate is worse)
  const attZ = baseline.attentionHitRate
    ? winsorize(
        calculateRobustZScore(
          currentDay.cognitive?.attentionHitRate ?? baseline.attentionHitRate.median,
          baseline.attentionHitRate.median,
          baseline.attentionHitRate.mad
        )
      )
    : 0;
  const attRisk = zToRiskScore(attZ, false);
  const sustainedAttention = riskToHealth(attRisk);

  // 2. Reaction Consistency (Higher CV and higher lapses are worse)
  const cvZ = baseline.pvtReactionTimeCv
    ? winsorize(
        calculateRobustZScore(
          currentDay.cognitive?.pvtReactionTimeCv ?? baseline.pvtReactionTimeCv.median,
          baseline.pvtReactionTimeCv.median,
          baseline.pvtReactionTimeCv.mad
        )
      )
    : 0;
  const lapseZ = baseline.pvtLapseCount
    ? winsorize(
        calculateRobustZScore(
          currentDay.cognitive?.pvtLapseCount ?? baseline.pvtLapseCount.median,
          baseline.pvtLapseCount.median,
          baseline.pvtLapseCount.mad
        )
      )
    : 0;
  const reactionRisk = Math.round((zToRiskScore(cvZ, true) + zToRiskScore(lapseZ, true)) / 2);
  const reactionConsistency = riskToHealth(reactionRisk);

  // 3. Cognitive Accuracy (Higher error rate is worse)
  const errZ = baseline.cognitiveErrorRate
    ? winsorize(
        calculateRobustZScore(
          currentDay.cognitive?.cognitiveErrorRate ?? baseline.cognitiveErrorRate.median,
          baseline.cognitiveErrorRate.median,
          baseline.cognitiveErrorRate.mad
        )
      )
    : 0;
  const accuracyRisk = zToRiskScore(errZ, true);
  const cognitiveAccuracy = riskToHealth(accuracyRisk);

  // 4. Impulse Control (Higher commission rate is worse)
  const impZ = baseline.impulseCommissionRate
    ? winsorize(
        calculateRobustZScore(
          currentDay.cognitive?.impulseCommissionRate ?? baseline.impulseCommissionRate.median,
          baseline.impulseCommissionRate.median,
          baseline.impulseCommissionRate.mad
        )
      )
    : 0;
  const impulseRisk = zToRiskScore(impZ, true);
  const impulseControl = riskToHealth(impulseRisk);

  // 5. Mental Fatigue Resilience (Higher slope is worse)
  const fatZ = baseline.vigilanceDecrementSlope
    ? winsorize(
        calculateRobustZScore(
          currentDay.cognitive?.vigilanceDecrementSlope ?? baseline.vigilanceDecrementSlope.median,
          baseline.vigilanceDecrementSlope.median,
          baseline.vigilanceDecrementSlope.mad
        )
      )
    : 0;
  const fatigueRisk = zToRiskScore(fatZ, true);
  const mentalFatigueResilience = riskToHealth(fatigueRisk);

  // 6. Task Completion Rate (Lower completion is worse)
  const taskZ = baseline.taskCompletionRate
    ? winsorize(
        calculateRobustZScore(
          currentDay.cognitive?.taskCompletionRate ?? baseline.taskCompletionRate.median,
          baseline.taskCompletionRate.median,
          baseline.taskCompletionRate.mad
        )
      )
    : 0;
  const taskRisk = zToRiskScore(taskZ, false);
  const taskCompletion = riskToHealth(taskRisk);

  // 7. Passive Digital Habits (Higher usage/switches/night is worse)
  const screenZ = baseline.totalScreenTimeMinutes
    ? winsorize(
        calculateRobustZScore(
          currentDay.passive.totalScreenTimeMinutes,
          baseline.totalScreenTimeMinutes.median,
          baseline.totalScreenTimeMinutes.mad
        )
      )
    : 0;
  const shortFormZ = baseline.shortFormVideoMinutes
    ? winsorize(
        calculateRobustZScore(
          currentDay.passive.shortFormVideoMinutes,
          baseline.shortFormVideoMinutes.median,
          baseline.shortFormVideoMinutes.mad
        )
      )
    : 0;
  const switchZ = baseline.appSwitchesPerHour
    ? winsorize(
        calculateRobustZScore(
          currentDay.passive.appSwitchesPerHour,
          baseline.appSwitchesPerHour.median,
          baseline.appSwitchesPerHour.mad
        )
      )
    : 0;
  const nightZ = baseline.lateNightUsageMinutes
    ? winsorize(
        calculateRobustZScore(
          currentDay.passive.lateNightUsageMinutes,
          baseline.lateNightUsageMinutes.median,
          baseline.lateNightUsageMinutes.mad
        )
      )
    : 0;

  const passiveHabitRisk = Math.round(
    zToRiskScore(screenZ, true) * 0.25 +
    zToRiskScore(shortFormZ, true) * 0.35 +
    zToRiskScore(switchZ, true) * 0.25 +
    zToRiskScore(nightZ, true) * 0.15
  );
  const passiveHabitHealth = riskToHealth(passiveHabitRisk);

  const pillarScores: PillarScoreBreakdown = {
    sustainedAttention,
    reactionConsistency,
    cognitiveAccuracy,
    impulseControl,
    mentalFatigueResilience,
    taskCompletion,
    passiveHabitHealth,
  };

  // Calculate Weighted Risk Index (0-100)
  const weightedRisk = Math.round(
    attRisk * config.sustainedAttentionWeight +
    reactionRisk * config.reactionConsistencyWeight +
    accuracyRisk * config.cognitiveAccuracyWeight +
    impulseRisk * config.impulseControlWeight +
    fatigueRisk * config.mentalFatigueWeight +
    taskRisk * config.taskCompletionWeight +
    passiveHabitRisk * config.passiveUsageWeight
  );

  const riskIndex = isCalibrating ? null : Math.max(0, Math.min(100, weightedRisk));

  // Risk Band
  let riskBand: RiskBand = 'CALIBRATING';
  if (!isCalibrating && riskIndex !== null) {
    if (riskIndex < 30) riskBand = 'LOW';
    else if (riskIndex < 55) riskBand = 'MODERATE';
    else if (riskIndex < 75) riskBand = 'ELEVATED';
    else riskBand = 'HIGH';
  }

  // Confidence Calculation
  let confidenceNumerator = 0;
  let confidenceDenominator = 0;

  confidenceDenominator += 40;
  if (currentDay.passive.totalScreenTimeMinutes > 0) confidenceNumerator += 40;

  confidenceDenominator += 50;
  let cognitivePresentCount = 0;
  if (currentDay.cognitive) {
    if (currentDay.cognitive.attentionHitRate !== undefined) cognitivePresentCount++;
    if (currentDay.cognitive.pvtReactionTimeCv !== undefined) cognitivePresentCount++;
    if (currentDay.cognitive.cognitiveErrorRate !== undefined) cognitivePresentCount++;
    if (currentDay.cognitive.impulseCommissionRate !== undefined) cognitivePresentCount++;
  }
  confidenceNumerator += Math.min(50, cognitivePresentCount * 12.5);

  confidenceDenominator += 10;
  if (currentDay.weeklyCheckinScore !== undefined) confidenceNumerator += 10;

  const confidence = Math.round((confidenceNumerator / confidenceDenominator) * 100) / 100;

  // Identify Top 3 Explainable Contributors by absolute deviation magnitude
  const candidateContributors: (MetricContributor & { scoreImpact: number })[] = [
    {
      metricKey: 'lateNightUsageMinutes',
      title: 'Late-Night Screen Time (00:00 - 05:00)',
      rawValue: currentDay.passive.lateNightUsageMinutes,
      baselineValue: Math.round(baseline.lateNightUsageMinutes?.median ?? 0),
      unit: 'min',
      scoreImpact: Math.abs(nightZ) * 25,
      impactPercent: Math.min(100, Math.max(0, Math.round(Math.abs(nightZ) * 25))),
      explanation: `Late-night usage was ${currentDay.passive.lateNightUsageMinutes} min (${
        currentDay.passive.lateNightUsageMinutes >= (baseline.lateNightUsageMinutes?.median ?? 0) ? '+' : ''
      }${currentDay.passive.lateNightUsageMinutes - Math.round(baseline.lateNightUsageMinutes?.median ?? 0)} min vs your 14-day median), correlating with disrupted sleep architecture.`,
    },
    {
      metricKey: 'shortFormVideoMinutes',
      title: 'Short-Form Video Consumption',
      rawValue: currentDay.passive.shortFormVideoMinutes,
      baselineValue: Math.round(baseline.shortFormVideoMinutes?.median ?? 0),
      unit: 'min',
      scoreImpact: Math.abs(shortFormZ) * 22,
      impactPercent: Math.min(100, Math.max(0, Math.round(Math.abs(shortFormZ) * 22))),
      explanation: `Short-form video totaled ${currentDay.passive.shortFormVideoMinutes} min vs your personal median of ${Math.round(
        baseline.shortFormVideoMinutes?.median ?? 0
      )} min.`,
    },
    {
      metricKey: 'appSwitchesPerHour',
      title: 'App-Switches Per Hour',
      rawValue: Math.round(currentDay.passive.appSwitchesPerHour * 10) / 10,
      baselineValue: Math.round((baseline.appSwitchesPerHour?.median ?? 0) * 10) / 10,
      unit: 'switches/hr',
      scoreImpact: Math.abs(switchZ) * 20,
      impactPercent: Math.min(100, Math.max(0, Math.round(Math.abs(switchZ) * 20))),
      explanation: `Task switching frequency was ${Math.round(currentDay.passive.appSwitchesPerHour)} switches/hr vs your baseline of ${Math.round(
        baseline.appSwitchesPerHour?.median ?? 0
      )} switches/hr.`,
    },
    {
      metricKey: 'pvtLapseCount',
      title: 'Attention Lapses on PVT (>500ms)',
      rawValue: currentDay.cognitive?.pvtLapseCount ?? 0,
      baselineValue: Math.round(baseline.pvtLapseCount?.median ?? 0),
      unit: 'lapses',
      scoreImpact: Math.abs(lapseZ) * 24,
      impactPercent: Math.min(100, Math.max(0, Math.round(Math.abs(lapseZ) * 24))),
      explanation: `Recorded ${currentDay.cognitive?.pvtLapseCount ?? 0} reaction time lapses on the Psychomotor Vigilance Task vs your personal baseline median of ${Math.round(
        baseline.pvtLapseCount?.median ?? 0
      )}.`,
    },
    {
      metricKey: 'attentionHitRate',
      title: 'Sustained Target Detection (CPT)',
      rawValue: Math.round((currentDay.cognitive?.attentionHitRate ?? 1) * 100),
      baselineValue: Math.round((baseline.attentionHitRate?.median ?? 1) * 100),
      unit: '% accuracy',
      scoreImpact: Math.abs(attZ) * 20,
      impactPercent: Math.min(100, Math.max(0, Math.round(Math.abs(attZ) * 20))),
      explanation: `Continuous performance target detection accuracy was ${Math.round(
        (currentDay.cognitive?.attentionHitRate ?? 1) * 100
      )}% vs your baseline median of ${Math.round((baseline.attentionHitRate?.median ?? 1) * 100)}%.`,
    },
  ];

  // Sort by scoreImpact descending and take top 3
  const topContributors: MetricContributor[] = candidateContributors
    .sort((a, b) => b.scoreImpact - a.scoreImpact)
    .slice(0, 3)
    .map(({ scoreImpact: _, ...rest }) => rest);

  return {
    riskIndex,
    riskBand,
    confidence,
    calibrationDay,
    isCalibrating,
    topContributors,
    pillarScores,
    configVersion: config.version,
    calculatedAt: new Date().toISOString(),
  };
}
