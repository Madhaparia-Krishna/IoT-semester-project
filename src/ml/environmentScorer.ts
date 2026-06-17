/**
 * VermIQ-Lite ML Module — Environmental Scorer & Classifier
 *
 * Produces a 0-100 environmental score and a qualitative class label
 * based on sensor readings vs ideal ranges.
 */

import type { PredictionResult } from './types';
import { ENV_CLASSES, RISK_LEVELS } from './constants';

// ─── Score → Class Label ──────────────────────────────────────────────────────

export type EnvClass = PredictionResult['environmentClass'];

export function classifyEnvironment(score: number): EnvClass {
  for (const cls of ENV_CLASSES) {
    if (score >= cls.min && score <= cls.max) {
      return cls.label as EnvClass;
    }
  }
  return 'Critical';
}

// ─── Score → Risk Level ───────────────────────────────────────────────────────

export function scoreToRiskLevel(score: number): PredictionResult['riskLevel'] {
  for (const lvl of RISK_LEVELS) {
    if (score >= lvl.min && score <= lvl.max) {
      return lvl.label;
    }
  }
  return 'CRITICAL';
}

// ─── Color utilities (for UI) ─────────────────────────────────────────────────

export function getEnvClassColor(envClass: EnvClass): string {
  const found = ENV_CLASSES.find(c => c.label === envClass);
  return found ? found.color : '#ef4444';
}

export function getRiskLevelConfig(riskLevel: PredictionResult['riskLevel']) {
  return RISK_LEVELS.find(l => l.label === riskLevel) ?? RISK_LEVELS[RISK_LEVELS.length - 1];
}
