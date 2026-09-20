import {
  BaselineMetricStats,
  DailyMetricsRecord,
  DailyPassiveMetrics,
  DailyActiveCognitiveMetrics,
  PersonalBaseline,
} from './types.js';

export function calculateMedian(numbers: number[]): number {
  if (!numbers || numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

export function calculateMAD(numbers: number[], median?: number): number {
  if (!numbers || numbers.length === 0) return 0;
  const med = median !== undefined ? median : calculateMedian(numbers);
  const absoluteDeviations = numbers.map((x) => Math.abs(x - med));
  return calculateMedian(absoluteDeviations);
}

export function calculateRobustZScore(
  value: number,
  median: number,
  mad: number,
  epsilon: number = 0.0001
): number {
  // Normalizing constant 1.4826 makes MAD equivalent to standard deviation for normal distributions
  const scale = 1.4826 * (mad + epsilon);
  return (value - median) / scale;
}

export function winsorize(zScore: number, minZ: number = -3.0, maxZ: number = 3.0): number {
  if (isNaN(zScore)) return 0;
  return Math.max(minZ, Math.min(maxZ, zScore));
}

export function computeMetricStats(values: number[]): BaselineMetricStats {
  const validValues = values.filter((v) => !isNaN(v) && v !== null && v !== undefined);
  if (validValues.length === 0) {
    return { median: 0, mad: 0, count: 0 };
  }
  const median = calculateMedian(validValues);
  const mad = calculateMAD(validValues, median);
  return {
    median,
    mad,
    count: validValues.length,
  };
}

export function compute14DayBaseline(history: DailyMetricsRecord[]): PersonalBaseline {
  // Take last 14 records
  const recentHistory = history.slice(-14);

  const passiveKeys: (keyof DailyPassiveMetrics)[] = [
    'totalScreenTimeMinutes',
    'shortFormVideoMinutes',
    'appSwitchesPerHour',
    'lateNightUsageMinutes',
    'notificationCount',
    'longestSessionMinutes',
  ];

  const cognitiveKeys: (keyof DailyActiveCognitiveMetrics)[] = [
    'attentionHitRate',
    'pvtReactionTimeCv',
    'pvtLapseCount',
    'cognitiveErrorRate',
    'impulseCommissionRate',
    'vigilanceDecrementSlope',
    'taskCompletionRate',
  ];

  const baseline: Partial<PersonalBaseline> = {};

  // Compute passive baselines
  passiveKeys.forEach((key) => {
    const vals = recentHistory.map((h) => h.passive[key]).filter((v) => typeof v === 'number');
    baseline[key] = computeMetricStats(vals);
  });

  // Compute cognitive baselines
  cognitiveKeys.forEach((key) => {
    const vals = recentHistory
      .map((h) => h.cognitive?.[key])
      .filter((v): v is number => typeof v === 'number');
    if (vals.length > 0) {
      baseline[key] = computeMetricStats(vals);
    }
  });

  return baseline as PersonalBaseline;
}
