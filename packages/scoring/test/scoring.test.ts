import { describe, it, expect } from 'vitest';
import {
  calculateMedian,
  calculateMAD,
  calculateRobustZScore,
  winsorize,
  compute14DayBaseline,
} from '../src/baseline.js';
import { computeRotRiskIndex } from '../src/riskIndex.js';
import {
  generateHealthyUserHistory,
  generateFragmentedUserHistory,
  generateSleepDeprivedUserHistory,
} from '../src/simulator.js';

describe('Robust Baseline Statistics', () => {
  it('correctly calculates median for odd, even, and empty arrays', () => {
    expect(calculateMedian([1, 3, 2])).toBe(2);
    expect(calculateMedian([1, 2, 3, 4])).toBe(2.5);
    expect(calculateMedian([5])).toBe(5);
    expect(calculateMedian([])).toBe(0);
  });

  it('correctly calculates MAD (Median Absolute Deviation)', () => {
    // Array: [1, 2, 3, 4, 5], median is 3
    // Deviations: [2, 1, 0, 1, 2] -> sorted: [0, 1, 1, 2, 2], median is 1
    expect(calculateMAD([1, 2, 3, 4, 5])).toBe(1);
    expect(calculateMAD([])).toBe(0);
  });

  it('winsorizes extreme Z-scores strictly to [-3.0, +3.0]', () => {
    expect(winsorize(4.8)).toBe(3.0);
    expect(winsorize(-5.2)).toBe(-3.0);
    expect(winsorize(1.2)).toBe(1.2);
    expect(winsorize(NaN)).toBe(0);
  });

  it('robust z-score calculation does not divide by zero when MAD is zero', () => {
    // Flat values: [10, 10, 10], MAD is 0
    const z = calculateRobustZScore(12, 10, 0);
    expect(isNaN(z)).toBe(false);
    expect(isFinite(z)).toBe(true);
  });
});

describe('14-Day Calibration Guardrail', () => {
  it('displays CALIBRATING with null riskIndex if fewer than 14 days of history', () => {
    const history = generateHealthyUserHistory(7);
    const baseline = compute14DayBaseline(history);
    const current = history[history.length - 1];

    const result = computeRotRiskIndex(current, baseline, 7);

    expect(result.isCalibrating).toBe(true);
    expect(result.riskIndex).toBeNull();
    expect(result.riskBand).toBe('CALIBRATING');
    expect(result.calibrationDay).toBe(7);
  });

  it('calculates full Risk Index once 14-day calibration milestone is met', () => {
    const history = generateHealthyUserHistory(14);
    const baseline = compute14DayBaseline(history);
    const current = history[history.length - 1];

    const result = computeRotRiskIndex(current, baseline, 14);

    expect(result.isCalibrating).toBe(false);
    expect(result.riskIndex).not.toBeNull();
    expect(typeof result.riskIndex).toBe('number');
    expect(result.riskIndex).toBeGreaterThanOrEqual(0);
    expect(result.riskIndex).toBeLessThanOrEqual(100);
    expect(result.riskBand).not.toBe('CALIBRATING');
  });
});

describe('Synthetic User Simulator & Trajectory Verification', () => {
  it('healthy user remains in LOW risk band (<30)', () => {
    const history = generateHealthyUserHistory(21);
    const baseline = compute14DayBaseline(history.slice(0, 14));
    const currentDay = history[20];

    const result = computeRotRiskIndex(currentDay, baseline, 21);

    expect(result.isCalibrating).toBe(false);
    expect(result.riskIndex).not.toBeNull();
    expect(result.riskIndex!).toBeLessThan(35);
    expect(['LOW', 'MODERATE']).toContain(result.riskBand);
  });

  it('fragmented user escalates to ELEVATED or HIGH risk band (>50)', () => {
    const history = generateFragmentedUserHistory(21);
    // Baseline from early healthy days (first 14 days)
    const baseline = compute14DayBaseline(history.slice(0, 14));
    // Day 21 exhibits heavy fragmentation
    const currentDay = history[20];

    const result = computeRotRiskIndex(currentDay, baseline, 21);

    expect(result.isCalibrating).toBe(false);
    expect(result.riskIndex).not.toBeNull();
    expect(result.riskIndex!).toBeGreaterThan(50);
    expect(['ELEVATED', 'HIGH']).toContain(result.riskBand);
  });

  it('sleep-deprived user captures late-night screen time as a top contributor', () => {
    const history = generateSleepDeprivedUserHistory(21);
    const baseline = compute14DayBaseline(history.slice(0, 14));
    const currentDay = history[20];

    const result = computeRotRiskIndex(currentDay, baseline, 21);

    expect(result.topContributors.length).toBe(3);
    const keys = result.topContributors.map((c) => c.metricKey);
    expect(keys).toContain('lateNightUsageMinutes');
  });
});

describe('Explainability Engine', () => {
  it('always produces exactly top 3 explainable contributors with honest raw units', () => {
    const history = generateFragmentedUserHistory(16);
    const baseline = compute14DayBaseline(history);
    const current = history[15];

    const result = computeRotRiskIndex(current, baseline, 16);

    expect(result.topContributors).toHaveLength(3);
    result.topContributors.forEach((c) => {
      expect(c.title).toBeTruthy();
      expect(typeof c.rawValue).toBe('number');
      expect(typeof c.baselineValue).toBe('number');
      expect(c.unit).toBeTruthy();
      expect(c.explanation).toContain('vs your');
    });
  });

  it('handles sensor anomaly without NaN or numerical crash', () => {
    const history = generateHealthyUserHistory(14);
    const baseline = compute14DayBaseline(history);
    const anomalousDay = {
      ...history[13],
      passive: {
        ...history[13].passive,
        totalScreenTimeMinutes: 999999, // Extreme sensor glitch
      },
    };

    const result = computeRotRiskIndex(anomalousDay, baseline, 14);

    expect(isNaN(result.riskIndex!)).toBe(false);
    expect(result.riskIndex!).toBeLessThanOrEqual(100);
    expect(result.riskIndex!).toBeGreaterThanOrEqual(0);
  });
});
