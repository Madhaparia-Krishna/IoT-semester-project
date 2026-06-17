/**
 * VermIQ-Lite ML Module — Anomaly Detection Engine
 *
 * Explainable rule-based anomaly detection.
 * Returns a boolean flag plus human-readable reasons for every anomaly found.
 */

import type { SensorReading, AnomalyResult } from './types';
import { ANOMALY_THRESHOLDS, RAPID_CHANGE } from './constants';

// ─── Hard Threshold Checks ────────────────────────────────────────────────────

function checkHardThresholds(reading: SensorReading): string[] {
  const reasons: string[] = [];
  const { temp, humidity, moisture, ph } = ANOMALY_THRESHOLDS;

  if (reading.dht22_temp < temp.low) {
    reasons.push(`Temperature critically low (${reading.dht22_temp.toFixed(1)}°C < ${temp.low}°C threshold)`);
  }
  if (reading.dht22_temp > temp.high) {
    reasons.push(`Temperature exceeded safe threshold (${reading.dht22_temp.toFixed(1)}°C > ${temp.high}°C)`);
  }

  if (reading.dht22_humidity < humidity.low) {
    reasons.push(`Humidity critically low (${reading.dht22_humidity.toFixed(1)}% < ${humidity.low}%)`);
  }
  if (reading.dht22_humidity > humidity.high) {
    reasons.push(`Humidity dangerously high (${reading.dht22_humidity.toFixed(1)}% > ${humidity.high}%)`);
  }

  if (reading.moisture_percent < moisture.low) {
    reasons.push(`Soil moisture critically low (${reading.moisture_percent.toFixed(1)}% < ${moisture.low}%)`);
  }
  if (reading.moisture_percent > moisture.high) {
    reasons.push(`Soil moisture saturated (${reading.moisture_percent.toFixed(1)}% > ${moisture.high}%)`);
  }

  if (reading.ph < ph.low) {
    reasons.push(`pH dangerously acidic (${reading.ph.toFixed(2)} < ${ph.low})`);
  }
  if (reading.ph > ph.high) {
    reasons.push(`pH dangerously alkaline (${reading.ph.toFixed(2)} > ${ph.high})`);
  }

  return reasons;
}

// ─── Out-of-Physical-Range (Sensor Failure) ────────────────────────────────

function checkPhysicalLimits(reading: SensorReading): string[] {
  const reasons: string[] = [];

  if (reading.dht22_temp < -40 || reading.dht22_temp > 80) {
    reasons.push('Temperature reading is physically impossible — sensor hardware fault suspected');
  }
  if (reading.dht22_humidity < 0 || reading.dht22_humidity > 100) {
    reasons.push('Humidity reading is out of physical range (0–100%) — sensor calibration drift detected');
  }
  if (reading.moisture_percent < 0 || reading.moisture_percent > 100) {
    reasons.push('Moisture reading is out of physical range (0–100%) — inspect sensor probe');
  }
  if (reading.ph < 0 || reading.ph > 14) {
    reasons.push('pH reading is out of valid scale (0–14) — sensor calibration required');
  }

  return reasons;
}

// ─── Rapid Change Detection ────────────────────────────────────────────────────

function checkRapidChanges(reading: SensorReading, previous: SensorReading | null): string[] {
  if (!previous) return [];

  const reasons: string[] = [];

  const tempDelta     = Math.abs(reading.dht22_temp - previous.dht22_temp);
  const humidDelta    = Math.abs(reading.dht22_humidity - previous.dht22_humidity);
  const moistDelta    = Math.abs(reading.moisture_percent - previous.moisture_percent);
  const phDelta       = Math.abs(reading.ph - previous.ph);

  if (tempDelta > RAPID_CHANGE.temp) {
    reasons.push(`Rapid temperature fluctuation detected (Δ${tempDelta.toFixed(1)}°C)`);
  }
  if (humidDelta > RAPID_CHANGE.humidity) {
    reasons.push(`Rapid humidity fluctuation detected (Δ${humidDelta.toFixed(1)}%)`);
  }
  if (moistDelta > RAPID_CHANGE.moisture) {
    reasons.push(`Rapid moisture fluctuation detected (Δ${moistDelta.toFixed(1)}%)`);
  }
  if (phDelta > RAPID_CHANGE.ph) {
    reasons.push(`Rapid pH shift detected (Δ${phDelta.toFixed(2)}) — inspect for sudden chemical change`);
  }

  return reasons;
}

// ─── Main Export ──────────────────────────────────────────────────────────────

/**
 * Detect anomalies in the current reading.
 * @param reading  Latest sensor data
 * @param history  Previous readings (oldest → newest). Last item = previous reading.
 */
export function detectAnomalies(
  reading: SensorReading,
  history: SensorReading[] = []
): AnomalyResult {
  const previous = history.length > 0 ? history[history.length - 1] : null;

  // Collect all reasons from each check type
  const physicalReasons = checkPhysicalLimits(reading);
  const thresholdReasons = physicalReasons.length === 0 ? checkHardThresholds(reading) : [];
  const changeReasons = physicalReasons.length === 0 ? checkRapidChanges(reading, previous) : [];

  // If any physical-limit breach, also recommend sensor inspection
  const sensorNote =
    physicalReasons.length > 0
      ? ['Inspect sensors for calibration drift or hardware damage']
      : [];

  const reasons = [
    ...physicalReasons,
    ...thresholdReasons,
    ...changeReasons,
    ...sensorNote,
  ];

  return {
    anomalyDetected: reasons.length > 0,
    reasons,
  };
}
