/**
 * VermIQ-Lite ML Module — Harvest Readiness Predictor
 *
 * Pseudo-ML scoring model that estimates harvest readiness (0–100%)
 * based on how closely sensor conditions match ideal compost parameters.
 * Confidence is derived from history depth and environmental stability.
 */

import type { FeatureVector } from './types';
import { HARVEST_IDEAL } from './constants';

// ─── Ideal-deviation scorer (0-100) ──────────────────────────────────────────

function idealScore(value: number, min: number, max: number): number {
  if (value >= min && value <= max) return 100;
  const range = max - min;
  const deviation = Math.abs(value - (value < min ? min : max));
  // Exponential penalty for deviation from ideal band
  const penaltyRatio = Math.min(deviation / (range * 1.5), 1);
  return Math.max(0, 100 * (1 - Math.pow(penaltyRatio, 0.6)));
}

// ─── Main predictor ───────────────────────────────────────────────────────────

export interface HarvestPrediction {
  score: number;       // 0-100
  confidence: number;  // 0-100
}

/**
 * Estimate harvest readiness from a FeatureVector.
 *
 * Weights:
 *   Temperature  30%
 *   Moisture     30%
 *   Humidity     20%
 *   pH           20%
 *
 * Stability bonus: up to +8 points if all sensors are stable
 */
export function predictHarvestReadiness(features: FeatureVector): HarvestPrediction {
  const tempScore     = idealScore(features.temp,     HARVEST_IDEAL.temp.min,     HARVEST_IDEAL.temp.max);
  const humidityScore = idealScore(features.humidity, HARVEST_IDEAL.humidity.min, HARVEST_IDEAL.humidity.max);
  const moistureScore = idealScore(features.moisture, HARVEST_IDEAL.moisture.min, HARVEST_IDEAL.moisture.max);
  const phScore       = idealScore(features.ph,       HARVEST_IDEAL.ph.min,       HARVEST_IDEAL.ph.max);

  const baseScore =
    tempScore     * 0.30 +
    moistureScore * 0.30 +
    humidityScore * 0.20 +
    phScore       * 0.20;

  // Stability bonus — environments that stay consistent score higher
  const avgStability = (features.tempStability + features.humidityStability + features.moistureStability + features.phStability) / 4;
  const stabilityBonus = Math.max(0, 8 - Math.min(8, avgStability));

  const rawScore = Math.min(100, baseScore + stabilityBonus);
  const score = Math.round(rawScore);

  // Confidence: higher with more history and lower variance
  const historyFactor   = Math.min(1, features.historyLength / 20); // maxes at 20 readings
  const variancePenalty = Math.min(1, (features.rollingVarTemp + features.rollingVarMoisture) / 200);
  const confidence      = Math.round(50 + historyFactor * 35 - variancePenalty * 10);

  return { score, confidence: Math.max(30, Math.min(98, confidence)) };
}
