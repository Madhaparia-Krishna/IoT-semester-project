/**
 * VermIQ-Lite ML Module — Recommendation Engine
 *
 * Generates context-aware, human-readable recommendations based on
 * current sensor readings, detected anomalies, and risk level.
 * Now includes intelligent crop recommendations based on environmental conditions.
 */

import type { SensorReading, PredictionResult } from './types';
import { IDEAL_RANGES, HARVEST_IDEAL } from './constants';
import { recommendCrops } from './cropRecommendation';

// ─── Recommendation Rules ─────────────────────────────────────────────────────

interface RecommendationRule {
  condition: (reading: SensorReading, riskLevel: PredictionResult['riskLevel'], anomalyReasons: string[]) => boolean;
  message: string;
  priority: number; // lower = shown first
}

const RULES: RecommendationRule[] = [
  // ── Temperature ──────────────────────────────────────────────────────────────
  {
    priority: 1,
    condition: (r) => r.dht22_temp > IDEAL_RANGES.temp.absolute_max,
    message: 'Temperature is critically high. Immediately increase airflow and shade around the vermiculture bed to prevent worm mortality.',
  },
  {
    priority: 2,
    condition: (r) => r.dht22_temp > IDEAL_RANGES.temp.max && r.dht22_temp <= IDEAL_RANGES.temp.absolute_max,
    message: 'Temperature elevated above ideal range. Increase airflow around the vermiculture bed to cool the compost mass.',
  },
  {
    priority: 3,
    condition: (r) => r.dht22_temp < IDEAL_RANGES.temp.absolute_min,
    message: 'Temperature critically low. Insulate the bed and consider relocating it to a warmer environment.',
  },
  {
    priority: 4,
    condition: (r) => r.dht22_temp < IDEAL_RANGES.temp.min && r.dht22_temp >= IDEAL_RANGES.temp.absolute_min,
    message: 'Temperature below ideal range. Cover the bed with insulating material to retain heat and maintain worm activity.',
  },

  // ── Moisture ─────────────────────────────────────────────────────────────────
  {
    priority: 5,
    condition: (r) => r.moisture_percent < IDEAL_RANGES.moisture.absolute_min,
    message: 'Moisture is critically low. Add water gradually in small quantities — dry conditions are lethal to worms.',
  },
  {
    priority: 6,
    condition: (r) => r.moisture_percent < IDEAL_RANGES.moisture.min && r.moisture_percent >= IDEAL_RANGES.moisture.absolute_min,
    message: 'Moisture below optimal range. Add water gradually to maintain worm activity and microbial decomposition.',
  },
  {
    priority: 7,
    condition: (r) => r.moisture_percent > IDEAL_RANGES.moisture.absolute_max,
    message: 'Moisture is critically high — risk of anaerobic conditions. Aerate the bed and add dry bedding material immediately.',
  },
  {
    priority: 8,
    condition: (r) => r.moisture_percent > IDEAL_RANGES.moisture.max && r.moisture_percent <= IDEAL_RANGES.moisture.absolute_max,
    message: 'Moisture above optimal. Reduce watering frequency and add dry carbon-rich material (shredded paper or cardboard).',
  },

  // ── Humidity ─────────────────────────────────────────────────────────────────
  {
    priority: 9,
    condition: (r) => r.dht22_humidity > IDEAL_RANGES.humidity.absolute_max,
    message: 'Humidity dangerously high. Improve ventilation immediately to reduce excess moisture and prevent fungal growth.',
  },
  {
    priority: 10,
    condition: (r) => r.dht22_humidity > IDEAL_RANGES.humidity.max && r.dht22_humidity <= IDEAL_RANGES.humidity.absolute_max,
    message: 'Humidity elevated. Improve ventilation to reduce excess moisture and prevent surface mold.',
  },
  {
    priority: 11,
    condition: (r) => r.dht22_humidity < IDEAL_RANGES.humidity.absolute_min,
    message: 'Humidity critically low. Mist the surrounding area and cover the bed loosely to retain atmospheric moisture.',
  },
  {
    priority: 12,
    condition: (r) => r.dht22_humidity < IDEAL_RANGES.humidity.min && r.dht22_humidity >= IDEAL_RANGES.humidity.absolute_min,
    message: 'Humidity below optimal. Lightly mist the bed surface and consider covering with burlap to maintain moisture.',
  },

  // ── pH ──────────────────────────────────────────────────────────────────────
  {
    priority: 13,
    condition: (r) => r.ph < IDEAL_RANGES.ph.absolute_min,
    message: 'pH critically acidic. Add crushed eggshells or agricultural lime in small amounts to raise pH. Avoid acidic food waste.',
  },
  {
    priority: 14,
    condition: (r) => r.ph < HARVEST_IDEAL.ph.min && r.ph >= IDEAL_RANGES.ph.absolute_min,
    message: 'pH slightly low. Add crushed eggshells gradually to raise pH toward the optimal 6.5–7.0 range.',
  },
  {
    priority: 15,
    condition: (r) => r.ph > IDEAL_RANGES.ph.absolute_max,
    message: 'pH critically alkaline. Introduce acidic organic matter (coffee grounds, fruit peels) carefully and in small amounts.',
  },
  {
    priority: 16,
    condition: (r) => r.ph > HARVEST_IDEAL.ph.max && r.ph <= IDEAL_RANGES.ph.absolute_max,
    message: 'pH slightly elevated. Introduce small amounts of acidic organic material such as coffee grounds to lower pH.',
  },

  // ── Anomaly (Sensor Fault) ───────────────────────────────────────────────────
  {
    priority: 0,
    condition: (_r, _risk, reasons) =>
      reasons.some(r => r.toLowerCase().includes('calibration') || r.toLowerCase().includes('physical') || r.toLowerCase().includes('hardware')),
    message: 'Sensor readings appear physically implausible. Inspect all sensors for calibration drift, loose connections, or hardware failure.',
  },

  // ── Positive Reinforcement ──────────────────────────────────────────────────
  {
    priority: 99,
    condition: (_r, riskLevel) => riskLevel === 'LOW',
    message: 'All conditions are within optimal range. Continue current management practices to maintain worm health and accelerate castings production.',
  },
];

// ─── Main Generator ───────────────────────────────────────────────────────────

/**
 * Generate a sorted list of actionable recommendations.
 * Now includes crop recommendations based on environmental suitability.
 * Always returns at least one message.
 */
export function generateRecommendations(
  reading: SensorReading,
  anomalyReasons: string[],
  riskLevel: PredictionResult['riskLevel']
): string[] {
  const matched = RULES
    .filter(rule => rule.condition(reading, riskLevel, anomalyReasons))
    .sort((a, b) => a.priority - b.priority)
    .map(rule => rule.message);

  // Get top 3 crop recommendations
  const cropRecs = recommendCrops(reading, 3);

  // Add crop recommendations if conditions are reasonable (not critical)
  if (riskLevel !== 'CRITICAL' && cropRecs.length > 0) {
    const topCrops = cropRecs
      .filter(rec => rec.matchScore >= 50) // Only show decent matches
      .slice(0, 3);

    if (topCrops.length > 0) {
      const cropNames = topCrops.map(rec => rec.crop.name).join(', ');
      matched.push(`🌱 Recommended crops for current conditions: ${cropNames}. These vegetables are well-suited to your environmental parameters.`);
    }
  }

  // Deduplicate (in case multiple conditions produce the same message)
  return [...new Set(matched)].slice(0, 8); // Increased cap to 8 to accommodate crop recommendations
}
