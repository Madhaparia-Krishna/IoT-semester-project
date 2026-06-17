/**
 * VermIQ-Lite ML Module — Preprocessing / Feature Engineering
 *
 * Transforms raw sensor readings into a FeatureVector used by all
 * downstream ML components (anomaly detector, harvest predictor, scorer).
 */

import type { SensorReading, FeatureVector } from './types';
import { IDEAL_RANGES, SCORING_WEIGHTS, ROLLING_WINDOW } from './constants';

// ─── Utility Helpers ──────────────────────────────────────────────────────────

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function variance(values: number[]): number {
  if (values.length < 2) return 0;
  const avg = mean(values);
  return values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;
}

function stdDev(values: number[]): number {
  return Math.sqrt(variance(values));
}

/**
 * Score a single parameter against its ideal range.
 * Returns 0–100 where 100 = exactly inside ideal band.
 */
function scoreParameter(value: number, min: number, max: number, absMin: number, absMax: number): number {
  // Clamp to absolute bounds first
  const clamped = Math.max(absMin, Math.min(absMax, value));

  if (clamped >= min && clamped <= max) {
    // Perfectly inside ideal range → 100
    return 100;
  }

  // Distance from the nearest ideal edge
  const distFromIdeal = clamped < min ? min - clamped : clamped - max;
  const rangeSize = clamped < min ? (min - absMin) : (absMax - max);

  // Linear decay from 100 → 0
  if (rangeSize <= 0) return 0;
  const score = 100 * (1 - distFromIdeal / rangeSize);
  return Math.max(0, Math.min(100, score));
}

// ─── Main Feature Builder ─────────────────────────────────────────────────────

/**
 * Build a full FeatureVector from the current reading and recent history.
 * @param current  Latest sensor reading
 * @param history  Array of previous readings (oldest → newest)
 */
export function buildFeatureVector(
  current: SensorReading,
  history: SensorReading[] = []
): FeatureVector {
  const window = history.slice(-ROLLING_WINDOW);

  const temps     = window.map(r => r.dht22_temp);
  const humids    = window.map(r => r.dht22_humidity);
  const moistures = window.map(r => r.moisture_percent);
  const phs       = window.map(r => r.ph);

  // Rolling averages (fall back to current reading if no history)
  const rollingAvgTemp     = window.length > 0 ? mean(temps)     : current.dht22_temp;
  const rollingAvgHumidity = window.length > 0 ? mean(humids)    : current.dht22_humidity;
  const rollingAvgMoisture = window.length > 0 ? mean(moistures) : current.moisture_percent;
  const rollingAvgPh       = window.length > 0 ? mean(phs)       : current.ph;

  // Stability = inverse of std deviation (high variance = low stability)
  const tempStability     = window.length > 1 ? stdDev(temps)     : 0;
  const humidityStability = window.length > 1 ? stdDev(humids)    : 0;
  const moistureStability = window.length > 1 ? stdDev(moistures) : 0;
  const phStability       = window.length > 1 ? stdDev(phs)       : 0;

  // Rolling variance
  const rollingVarTemp     = window.length > 1 ? variance(temps)     : 0;
  const rollingVarMoisture = window.length > 1 ? variance(moistures) : 0;

  // Environmental Health Index (weighted composite, 0-100)
  const tempScore     = scoreParameter(
    current.dht22_temp,
    IDEAL_RANGES.temp.min,     IDEAL_RANGES.temp.max,
    IDEAL_RANGES.temp.absolute_min, IDEAL_RANGES.temp.absolute_max
  );
  const humidityScore = scoreParameter(
    current.dht22_humidity,
    IDEAL_RANGES.humidity.min,     IDEAL_RANGES.humidity.max,
    IDEAL_RANGES.humidity.absolute_min, IDEAL_RANGES.humidity.absolute_max
  );
  const moistureScore = scoreParameter(
    current.moisture_percent,
    IDEAL_RANGES.moisture.min,     IDEAL_RANGES.moisture.max,
    IDEAL_RANGES.moisture.absolute_min, IDEAL_RANGES.moisture.absolute_max
  );
  const phScore = scoreParameter(
    current.ph,
    IDEAL_RANGES.ph.min,     IDEAL_RANGES.ph.max,
    IDEAL_RANGES.ph.absolute_min, IDEAL_RANGES.ph.absolute_max
  );

  const environmentalHealthIndex =
    tempScore     * SCORING_WEIGHTS.temp     +
    humidityScore * SCORING_WEIGHTS.humidity +
    moistureScore * SCORING_WEIGHTS.moisture +
    phScore       * SCORING_WEIGHTS.ph;

  return {
    temp:     current.dht22_temp,
    humidity: current.dht22_humidity,
    moisture: current.moisture_percent,
    ph:       current.ph,

    tempStability,
    humidityStability,
    moistureStability,
    phStability,

    rollingAvgTemp,
    rollingAvgHumidity,
    rollingAvgMoisture,
    rollingAvgPh,
    rollingVarTemp,
    rollingVarMoisture,

    environmentalHealthIndex: Math.round(environmentalHealthIndex),
    historyLength: history.length,
  };
}
