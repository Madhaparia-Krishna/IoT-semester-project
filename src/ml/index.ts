/**
 * VermIQ-Lite ML Module — Public API (Barrel Export + Unified Entry Point)
 *
 * Usage:
 *   import { runPrediction, SCENARIO_PRESETS } from '../ml';
 */

// ── Type exports ──────────────────────────────────────────────────────────────
export type {
  SensorReading,
  PredictionResult,
  FeatureVector,
  AnomalyResult,
  ScenarioPreset,
  MLSimValues,
} from './types';

// ── Constants ─────────────────────────────────────────────────────────────────
export { SCENARIO_PRESETS, IDEAL_RANGES, ROLLING_WINDOW } from './constants';

// ── Sub-modules ───────────────────────────────────────────────────────────────
export { buildFeatureVector } from './preprocessing';
export { detectAnomalies } from './anomalyDetection';
export { predictHarvestReadiness } from './harvestPredictor';
export { classifyEnvironment, scoreToRiskLevel, getEnvClassColor, getRiskLevelConfig } from './environmentScorer';
export { generateRecommendations } from './recommendationEngine';
export { generateMLReading, DEFAULT_SIM_VALUES } from './simulator';

// ── Re-exports for scoring constants ─────────────────────────────────────────
export { RISK_LEVELS, ENV_CLASSES } from './constants';

// ─────────────────────────────────────────────────────────────────────────────
// UNIFIED PREDICTION PIPELINE
// Both Live Firebase and Simulation modes call this single function.
// ─────────────────────────────────────────────────────────────────────────────

import type { SensorReading, PredictionResult } from './types';
import { buildFeatureVector } from './preprocessing';
import { detectAnomalies } from './anomalyDetection';
import { predictHarvestReadiness } from './harvestPredictor';
import { classifyEnvironment, scoreToRiskLevel } from './environmentScorer';
import { generateRecommendations } from './recommendationEngine';

/**
 * Run the full ML prediction pipeline.
 *
 * @param reading  Current sensor reading (from Firebase or simulation sliders)
 * @param history  Historical readings for stability/confidence calculations
 * @returns        Complete PredictionResult for the UI
 */
export function runPrediction(
  reading: SensorReading,
  history: SensorReading[] = []
): PredictionResult {
  // 1. Feature engineering
  const features = buildFeatureVector(reading, history);

  // 2. Anomaly detection
  const { anomalyDetected, reasons: anomalyReasons } = detectAnomalies(reading, history);

  // 3. Environmental scoring
  const environmentalScore = features.environmentalHealthIndex;
  const environmentClass   = classifyEnvironment(environmentalScore);
  const riskLevel          = scoreToRiskLevel(environmentalScore);

  // 4. Harvest readiness prediction
  const { score: harvestReadiness, confidence } = predictHarvestReadiness(features);

  // 5. Recommendations
  const recommendations = generateRecommendations(reading, anomalyReasons, riskLevel);

  return {
    riskLevel,
    harvestReadiness,
    anomalyDetected,
    anomalyReasons,
    confidence,
    environmentalScore,
    environmentClass,
    recommendations,
    timestamp: reading.timestamp,
  };
}
