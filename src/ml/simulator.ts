/**
 * VermIQ-Lite ML Module — ML Simulator
 *
 * Converts slider values or preset scenarios into a SensorReading
 * that can be fed directly into the prediction pipeline.
 */

import type { SensorReading, MLSimValues } from './types';
export { SCENARIO_PRESETS } from './constants';

/**
 * Create a SensorReading from slider/preset values.
 * Clamps each value to its physical range to keep the pipeline safe.
 */
export function generateMLReading(values: MLSimValues): SensorReading {
  return {
    dht22_temp:      values.temp,
    dht22_humidity:  values.humidity,
    moisture_percent: values.moisture,
    ph:              values.ph,
    timestamp:       new Date().toISOString(),
  };
}

/**
 * Default slider values used when the ML page first loads in simulation mode.
 */
export const DEFAULT_SIM_VALUES: MLSimValues = {
  temp:     27,
  humidity: 70,
  moisture: 65,
  ph:       6.8,
};
