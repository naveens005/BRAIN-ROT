import { DailyMetricsRecord } from './types.js';

export function generateHealthyUserHistory(days: number = 21): DailyMetricsRecord[] {
  return Array.from({ length: days }, (_, i) => {
    const dayDate = new Date(Date.now() - (days - 1 - i) * 86400000).toISOString().split('T')[0];
    return {
      date: dayDate,
      passive: {
        totalScreenTimeMinutes: 140 + Math.floor(Math.sin(i) * 20),
        shortFormVideoMinutes: 15 + Math.floor(Math.random() * 10),
        appSwitchesPerHour: 8 + Math.floor(Math.random() * 3),
        lateNightUsageMinutes: 0,
        notificationCount: 35 + Math.floor(Math.random() * 10),
        longestSessionMinutes: 35 + Math.floor(Math.random() * 10),
      },
      cognitive: {
        attentionHitRate: 0.94 + Math.random() * 0.04,
        pvtReactionTimeCv: 0.14 + Math.random() * 0.02,
        pvtLapseCount: Math.floor(Math.random() * 2),
        cognitiveErrorRate: 0.04 + Math.random() * 0.02,
        impulseCommissionRate: 0.06 + Math.random() * 0.02,
        vigilanceDecrementSlope: 0.02 + Math.random() * 0.01,
        taskCompletionRate: 0.90 + Math.random() * 0.08,
      },
      weeklyCheckinScore: 1.5,
    };
  });
}

export function generateFragmentedUserHistory(days: number = 21): DailyMetricsRecord[] {
  return Array.from({ length: days }, (_, i) => {
    const dayDate = new Date(Date.now() - (days - 1 - i) * 86400000).toISOString().split('T')[0];
    const progress = i / days; // Increases over time

    return {
      date: dayDate,
      passive: {
        totalScreenTimeMinutes: Math.round(180 + progress * 240 + Math.random() * 20),
        shortFormVideoMinutes: Math.round(20 + progress * 150 + Math.random() * 20),
        appSwitchesPerHour: Math.round(10 + progress * 25 + Math.random() * 4),
        lateNightUsageMinutes: Math.round(progress * 60 + Math.random() * 15),
        notificationCount: Math.round(40 + progress * 80),
        longestSessionMinutes: Math.round(40 + progress * 60),
      },
      cognitive: {
        attentionHitRate: Math.max(0.65, 0.92 - progress * 0.22 + Math.random() * 0.03),
        pvtReactionTimeCv: 0.15 + progress * 0.18 + Math.random() * 0.03,
        pvtLapseCount: Math.round(1 + progress * 12),
        cognitiveErrorRate: 0.05 + progress * 0.14,
        impulseCommissionRate: 0.08 + progress * 0.18,
        vigilanceDecrementSlope: 0.03 + progress * 0.12,
        taskCompletionRate: Math.max(0.3, 0.88 - progress * 0.45),
      },
      weeklyCheckinScore: 2.0 + progress * 2.5,
    };
  });
}

export function generateSleepDeprivedUserHistory(days: number = 21): DailyMetricsRecord[] {
  return Array.from({ length: days }, (_, i) => {
    const dayDate = new Date(Date.now() - (days - 1 - i) * 86400000).toISOString().split('T')[0];
    const isLateNightSpike = i >= 14;

    return {
      date: dayDate,
      passive: {
        totalScreenTimeMinutes: isLateNightSpike ? 360 : 200,
        shortFormVideoMinutes: isLateNightSpike ? 140 : 45,
        appSwitchesPerHour: isLateNightSpike ? 24 : 12,
        lateNightUsageMinutes: isLateNightSpike ? 110 : 10,
        notificationCount: 65,
        longestSessionMinutes: 60,
      },
      cognitive: {
        attentionHitRate: isLateNightSpike ? 0.76 : 0.91,
        pvtReactionTimeCv: isLateNightSpike ? 0.32 : 0.16,
        pvtLapseCount: isLateNightSpike ? 11 : 2,
        cognitiveErrorRate: isLateNightSpike ? 0.14 : 0.05,
        impulseCommissionRate: isLateNightSpike ? 0.18 : 0.07,
        vigilanceDecrementSlope: isLateNightSpike ? 0.11 : 0.03,
        taskCompletionRate: isLateNightSpike ? 0.45 : 0.85,
      },
    };
  });
}
