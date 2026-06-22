/**
 * VermIQ-Lite ML Module — Constants
 * All thresholds, ideal ranges, weights, and scenario presets.
 */

import type { ScenarioPreset } from './types';

// ─── Ideal Ranges (for scoring) ───────────────────────────────────────────────

export const IDEAL_RANGES = {
  temp: { min: 25, max: 30, absolute_min: 15, absolute_max: 40 },
  humidity: { min: 60, max: 80, absolute_min: 30, absolute_max: 95 },
  moisture: { min: 55, max: 75, absolute_min: 20, absolute_max: 95 },
  ph: { min: 6.0, max: 7.5, absolute_min: 4.0, absolute_max: 9.0 },
} as const;

// ─── Harvest Readiness Ideal Ranges ───────────────────────────────────────────

export const HARVEST_IDEAL = {
  temp: { min: 24, max: 30 },
  humidity: { min: 60, max: 80 },
  moisture: { min: 55, max: 75 },
  ph: { min: 6.2, max: 7.2 },
} as const;

// ─── Anomaly Hard Thresholds ───────────────────────────────────────────────────

export const ANOMALY_THRESHOLDS = {
  temp: { low: 15, high: 40 },
  humidity: { low: 30, high: 95 },
  moisture: { low: 20, high: 95 },
  ph: { low: 4.0, high: 9.0 },
} as const;

// ─── Rapid Change Thresholds (per reading delta) ──────────────────────────────

export const RAPID_CHANGE = {
  temp: 5,
  humidity: 15,
  moisture: 20,
  ph: 1,
} as const;

// ─── Scoring Weights ───────────────────────────────────────────────────────────

export const SCORING_WEIGHTS = {
  temp: 0.30,
  moisture: 0.30,
  humidity: 0.20,
  ph: 0.20,
} as const;

// ─── Environmental Classification Ranges ──────────────────────────────────────

export const ENV_CLASSES = [
  { min: 90, max: 100, label: 'Excellent', color: '#10b981' },
  { min: 75, max: 89, label: 'Good', color: '#06b6d4' },
  { min: 60, max: 74, label: 'Fair', color: '#f59e0b' },
  { min: 40, max: 59, label: 'Poor', color: '#f97316' },
  { min: 0, max: 39, label: 'Critical', color: '#ef4444' },
] as const;

// ─── Risk Level Mapping ────────────────────────────────────────────────────────

export const RISK_LEVELS: Array<{ min: number; max: number; label: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'; color: string; bgClass: string; textClass: string }> = [
  { min: 75, max: 100, label: 'LOW', color: '#10b981', bgClass: 'bg-emerald-500/10 border-emerald-500/20', textClass: 'text-emerald-400' },
  { min: 55, max: 74, label: 'MEDIUM', color: '#f59e0b', bgClass: 'bg-amber-500/10 border-amber-500/20', textClass: 'text-amber-400' },
  { min: 35, max: 54, label: 'HIGH', color: '#f97316', bgClass: 'bg-orange-500/10 border-orange-500/20', textClass: 'text-orange-400' },
  { min: 0, max: 34, label: 'CRITICAL', color: '#ef4444', bgClass: 'bg-rose-500/10 border-rose-500/20', textClass: 'text-rose-400' },
];

// ─── History window for rolling calculations ───────────────────────────────────

export const ROLLING_WINDOW = 10;

// ─── Scenario Presets ──────────────────────────────────────────────────────────

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    name: 'Normal Conditions',
    description: 'Ideal vermiculture environment. Worms are thriving.',
    temp: 27,
    humidity: 70,
    moisture: 65,
    ph: 6.8,
    expectedRisk: 'LOW',
  },
  {
    name: 'Dry Compost',
    description: 'Low moisture causing compost to dry out. Worm activity declining.',
    temp: 31,
    humidity: 40,
    moisture: 25,
    ph: 6.5,
    expectedRisk: 'HIGH',
  },
  {
    name: 'Acidic Compost',
    description: 'pH too low — acid buildup from overfeeding. Worms at risk.',
    temp: 28,
    humidity: 72,
    moisture: 66,
    ph: 4.5,
    expectedRisk: 'CRITICAL',
  },
  {
    name: 'Overheated Bed',
    description: 'Temperature dangerously high. Possible thermophilic phase runaway.',
    temp: 43,
    humidity: 45,
    moisture: 55,
    ph: 6.9,
    expectedRisk: 'CRITICAL',
  },
];
