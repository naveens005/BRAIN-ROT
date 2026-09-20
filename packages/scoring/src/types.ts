export type RiskBand = 'CALIBRATING' | 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH';

export interface DailyPassiveMetrics {
  totalScreenTimeMinutes: number;
  shortFormVideoMinutes: number;
  appSwitchesPerHour: number;
  lateNightUsageMinutes: number; // Usage between 00:00 - 05:00
  notificationCount: number;
  longestSessionMinutes: number;
}

export interface DailyActiveCognitiveMetrics {
  attentionHitRate: number; // 0.0 to 1.0 (CPT)
  pvtReactionTimeCv: number; // Coefficient of variation (SD / Mean)
  pvtLapseCount: number; // RT > 500ms
  cognitiveErrorRate: number; // 0.0 to 1.0 (Stroop / 2-back)
  impulseCommissionRate: number; // 0.0 to 1.0 (Go/No-Go)
  vigilanceDecrementSlope: number; // Slope across blocks (higher = steeper fatigue)
  taskCompletionRate: number; // 0.0 to 1.0 (Share of focus sessions completed)
}

export interface DailyMetricsRecord {
  date: string; // YYYY-MM-DD
  passive: DailyPassiveMetrics;
  cognitive?: Partial<DailyActiveCognitiveMetrics>;
  weeklyCheckinScore?: number; // 1.0 to 5.0
}

export interface BaselineMetricStats {
  median: number;
  mad: number;
  count: number;
}

export type PersonalBaseline = {
  [K in keyof DailyPassiveMetrics]: BaselineMetricStats;
} & {
  [K in keyof DailyActiveCognitiveMetrics]?: BaselineMetricStats;
};

export interface MetricContributor {
  metricKey: string;
  title: string;
  rawValue: number;
  baselineValue: number;
  unit: string;
  impactPercent: number; // Relative contribution to risk score
  explanation: string;
}

export interface PillarScoreBreakdown {
  sustainedAttention: number; // 0-100 (100 = optimal)
  reactionConsistency: number; // 0-100
  cognitiveAccuracy: number; // 0-100
  impulseControl: number; // 0-100
  mentalFatigueResilience: number; // 0-100
  taskCompletion: number; // 0-100
  passiveHabitHealth: number; // 0-100
}

export interface RotRiskScoreResult {
  riskIndex: number | null; // null if calibrating
  riskBand: RiskBand;
  confidence: number; // 0.0 to 1.0 based on data completeness
  calibrationDay: number; // 1 to 14
  isCalibrating: boolean;
  topContributors: MetricContributor[];
  pillarScores: PillarScoreBreakdown;
  configVersion: string;
  calculatedAt: string;
}

export interface ScoringWeightsConfig {
  version: string;
  sustainedAttentionWeight: number; // Default 0.20
  reactionConsistencyWeight: number; // Default 0.15
  cognitiveAccuracyWeight: number; // Default 0.10
  impulseControlWeight: number; // Default 0.15
  mentalFatigueWeight: number; // Default 0.10
  taskCompletionWeight: number; // Default 0.10
  passiveUsageWeight: number; // Default 0.20
}
