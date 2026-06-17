/**
 * VermIQ-Lite ML Module — Core Types
 * All interfaces used throughout the ML prediction pipeline.
 */

/** Raw sensor input — same shape as Firebase latest_readings */
export interface SensorReading {
  dht22_temp: number;
  dht22_humidity: number;
  moisture_percent: number;
  ph: number;
  timestamp: string;
}

/** Derived feature vector produced by the preprocessing pipeline */
export interface FeatureVector {
  // Raw inputs
  temp: number;
  humidity: number;
  moisture: number;
  ph: number;

  // Stability metrics (std deviation over recent history, 0 = perfectly stable)
  tempStability: number;
  humidityStability: number;
  moistureStability: number;
  phStability: number;

  // Rolling statistics
  rollingAvgTemp: number;
  rollingAvgHumidity: number;
  rollingAvgMoisture: number;
  rollingAvgPh: number;
  rollingVarTemp: number;
  rollingVarMoisture: number;

  // Composite score
  environmentalHealthIndex: number;

  // History depth (affects confidence)
  historyLength: number;
}

/** Anomaly detection output */
export interface AnomalyResult {
  anomalyDetected: boolean;
  reasons: string[];
}

/** The full prediction result returned to the UI */
export interface PredictionResult {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  harvestReadiness: number;       // 0-100
  anomalyDetected: boolean;
  anomalyReasons: string[];
  confidence: number;             // 0-100
  environmentalScore: number;     // 0-100
  environmentClass: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
  recommendations: string[];
  timestamp: string;
}

/** A named simulation scenario preset */
export interface ScenarioPreset {
  name: string;
  description: string;
  temp: number;
  humidity: number;
  moisture: number;
  ph: number;
  expectedRisk: PredictionResult['riskLevel'];
}

/** Slider values for ML simulation mode */
export interface MLSimValues {
  temp: number;
  humidity: number;
  moisture: number;
  ph: number;
}
