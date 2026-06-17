import { create } from 'zustand';
import { dbService, isFirebaseConfigured, realtimeTelemetryService } from '../services/firebase';
import type { UserSession, FirebaseSensorReading } from '../services/firebase';
import { SIMULATED_NODES, generateHistory } from '../services/simulator';
import type { TelemetryReading } from '../services/simulator';
import { runPrediction, generateMLReading, DEFAULT_SIM_VALUES } from '../ml';
import type { PredictionResult, SensorReading, MLSimValues } from '../ml';

interface AlertItem {
  id: string;
  nodeId: string;
  bedName: string;
  type: string;
  message: string;
  severity: 'critical' | 'warning' | 'info' | 'success';
  timestamp: string;
  acknowledged: boolean;
}

interface ToastNotification {
  id: string;
  message: string;
  type: 'critical' | 'warning' | 'info' | 'success';
}

interface ThresholdSettings {
  moistureMin: number;
  moistureMax: number;
  tempMin: number;
  tempMax: number;
  humidityMin: number;
  humidityMax: number;
  thingSpeakChannelId: string;
  thingSpeakApiKey: string;
  useFirebaseMode: boolean;
}

interface VermIQState {
  user: UserSession | null;
  authLoading: boolean;
  activeNodeId: string;
  telemetry: Record<string, TelemetryReading>;
  history: Record<string, TelemetryReading[]>;
  alerts: AlertItem[];
  notifications: ToastNotification[];
  settings: ThresholdSettings;
  firebaseConnected: boolean;
  realtimeDataMode: boolean; // Track if using real Firebase data

  // ── ML State ────────────────────────────────────────────────────────────────
  mlMode: 'live' | 'simulation';
  mlSimValues: MLSimValues;
  mlSimScenario: string | null;
  predictionResult: PredictionResult | null;
  historicalPredictions: Array<PredictionResult & { timestamp: string }>;
  
  // Actions
  setUser: (user: UserSession | null) => void;
  setAuthLoading: (loading: boolean) => void;
  setActiveNodeId: (id: string) => void;
  updateTelemetry: (nodeId: string, reading: TelemetryReading) => void;
  addNotification: (message: string, type: ToastNotification['type']) => void;
  removeNotification: (id: string) => void;
  acknowledgeAlert: (alertId: string) => Promise<void>;
  clearAlerts: () => Promise<void>;
  updateSettings: (newSettings: Partial<ThresholdSettings>) => void;
  checkAlertThresholds: (nodeId: string, reading: TelemetryReading) => void;
  reconnectFirebase: () => void;
  startRealtimeTelemetry: () => () => void; // Start realtime subscription and return unsubscribe function
  updateHistoryFromFirebase: (nodeId: string, readings: TelemetryReading[]) => void; // Update history with Firebase data

  // ── ML Actions ──────────────────────────────────────────────────────────────
  setMLMode: (mode: 'live' | 'simulation') => void;
  setMLSimValues: (vals: Partial<MLSimValues>) => void;
  setMLSimScenario: (name: string | null) => void;
  runMLPrediction: () => void;
  storePrediction: (result: PredictionResult) => void;
}

const DEFAULT_SETTINGS: ThresholdSettings = {
  moistureMin: 60,
  moistureMax: 80,
  tempMin: 18,
  tempMax: 25,
  humidityMin: 70,
  humidityMax: 90,
  thingSpeakChannelId: '',
  thingSpeakApiKey: '',
  useFirebaseMode: false,
};

export const useStore = create<VermIQState>((set, get) => ({
  user: null,
  authLoading: true,
  activeNodeId: SIMULATED_NODES[0].id,
  telemetry: {},
  history: {},
  alerts: [],
  notifications: [],
  settings: (() => {
    try {
      const saved = localStorage.getItem('vermiq_threshold_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  })(),
  firebaseConnected: isFirebaseConfigured(),
  realtimeDataMode: false,

  // ── ML Initial State ──────────────────────────────────────────────────────
  mlMode: 'simulation',
  mlSimValues: DEFAULT_SIM_VALUES,
  mlSimScenario: 'Normal Conditions',
  predictionResult: null,
  historicalPredictions: [],

  setUser: (user) => set({ user }),
  setAuthLoading: (loading) => set({ authLoading: loading }),
  setActiveNodeId: (id) => set({ activeNodeId: id }),

  updateTelemetry: (nodeId, reading) => {
    set((state) => {
      const updatedTelemetry = { ...state.telemetry, [nodeId]: reading };
      
      // Update history inline by appending, keeping size capped at 200 points for Firebase data
      const currentHistory = state.history[nodeId] || [];
      const updatedHistory = [...currentHistory];
      
      // Avoid inserting duplicates based on timestamp
      const lastPoint = currentHistory[currentHistory.length - 1];
      const isDuplicate = lastPoint && (
        lastPoint.timestamp === reading.timestamp ||
        (lastPoint.timestamp_epoch_ms && reading.timestamp_epoch_ms && lastPoint.timestamp_epoch_ms === reading.timestamp_epoch_ms)
      );
      
      if (!isDuplicate) {
        updatedHistory.push(reading);
        // Keep latest 200 records for Firebase mode, 50 for simulation
        const maxSize = state.realtimeDataMode ? 200 : 50;
        if (updatedHistory.length > maxSize) {
          updatedHistory.shift();
        }
      }

      return {
        telemetry: updatedTelemetry,
        history: { ...state.history, [nodeId]: updatedHistory }
      };
    });

    // Alert checking disabled for now
    // if (reading.status === 'online') {
    //   get().checkAlertThresholds(nodeId, reading);
    // }
  },

  addNotification: (message, type) => {
    const id = 'toast-' + Math.random().toString(36).substr(2, 9);
    set((state) => ({
      notifications: [...state.notifications, { id, message, type }]
    }));
    // Auto dismiss toast in 4 seconds
    setTimeout(() => {
      get().removeNotification(id);
    }, 4000);
  },

  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id)
  })),

  acknowledgeAlert: async (alertId) => {
    await dbService.acknowledgeAlert(alertId);
    // Alert state will be updated by database subscription
  },

  clearAlerts: async () => {
    await dbService.clearAllAlerts();
    set({ alerts: [] });
  },

  updateSettings: (newSettings) => {
    set((state) => {
      const updated = { ...state.settings, ...newSettings };
      localStorage.setItem('vermiq_threshold_settings', JSON.stringify(updated));
      return { settings: updated };
    });
  },

  checkAlertThresholds: (nodeId, reading) => {
    const node = SIMULATED_NODES.find((n) => n.id === nodeId);
    if (!node || !reading.moisture || !reading.temperature || !reading.humidity) return;

    const { settings, alerts, addNotification } = get();

    // Check moisture low
    if (reading.moisture < settings.moistureMin) {
      const exists = alerts.some((a) => a.nodeId === nodeId && a.type === 'moisture_low' && !a.acknowledged);
      if (!exists) {
        const msg = `${node.bedName}: Soil moisture is critically low at ${reading.moisture}% (Threshold: ${settings.moistureMin}%)`;
        dbService.logAlert({
          nodeId,
          bedName: node.bedName,
          type: 'moisture_low',
          message: msg,
          severity: 'critical'
        });
        addNotification(msg, 'critical');
      }
    }

    // Check moisture high
    if (reading.moisture > settings.moistureMax) {
      const exists = alerts.some((a) => a.nodeId === nodeId && a.type === 'moisture_high' && !a.acknowledged);
      if (!exists) {
        const msg = `${node.bedName}: Soil moisture is high at ${reading.moisture}% (Threshold: ${settings.moistureMax}%)`;
        dbService.logAlert({
          nodeId,
          bedName: node.bedName,
          type: 'moisture_high',
          message: msg,
          severity: 'warning'
        });
        addNotification(msg, 'warning');
      }
    }

    // Check temperature high
    if (reading.temperature > settings.tempMax) {
      const exists = alerts.some((a) => a.nodeId === nodeId && a.type === 'temp_high' && !a.acknowledged);
      if (!exists) {
        const msg = `${node.bedName}: Temperature exceeded limits at ${reading.temperature}°C (Limit: ${settings.tempMax}°C)`;
        dbService.logAlert({
          nodeId,
          bedName: node.bedName,
          type: 'temp_high',
          message: msg,
          severity: 'critical'
        });
        addNotification(msg, 'critical');
      }
    }

    // Check harvest ready
    if (reading.harvestStatus === 'Harvest Ready') {
      const exists = alerts.some((a) => a.nodeId === nodeId && a.type === 'harvest_ready' && !a.acknowledged);
      if (!exists) {
        const msg = `${node.bedName}: Vermiculture bed is mature and ready for harvest! (${reading.daysElapsed} days elapsed)`;
        dbService.logAlert({
          nodeId,
          bedName: node.bedName,
          type: 'harvest_ready',
          message: msg,
          severity: 'success'
        });
        addNotification(msg, 'success');
      }
    }
  },

  reconnectFirebase: () => {
    const active = isFirebaseConfigured();
    set({ firebaseConnected: active });
  },

  updateHistoryFromFirebase: (nodeId, readings) => {
    set((state) => ({
      history: { ...state.history, [nodeId]: readings }
    }));
  },

  // ── ML Actions ─────────────────────────────────────────────────────────────

  setMLMode: (mode) => set({ mlMode: mode }),

  setMLSimValues: (vals) => set((state) => ({
    mlSimValues: { ...state.mlSimValues, ...vals },
    mlSimScenario: null, // Clear preset when manually adjusting sliders
  })),

  setMLSimScenario: (name) => set({ mlSimScenario: name }),

  runMLPrediction: () => {
    const state = get();
    let reading: SensorReading;
    let mlHistory: SensorReading[] = [];

    if (state.mlMode === 'live') {
      // Build SensorReading from the active node's live telemetry
      const activeNodeId = state.activeNodeId;
      const liveReading = state.telemetry[activeNodeId];

      if (!liveReading) {
        console.warn('ML: No live reading available for active node');
        return;
      }

      reading = {
        dht22_temp:      liveReading.temperature ?? 25,
        dht22_humidity:  liveReading.humidity ?? 70,
        moisture_percent: liveReading.moisture ?? 65,
        ph:              liveReading.ph ?? 6.8,
        timestamp:       liveReading.timestamp,
      };

      // Convert history for stability calculations
      const nodeHistory = state.history[activeNodeId] || [];
      mlHistory = nodeHistory
        .filter(h => h.temperature != null && h.moisture != null)
        .map(h => ({
          dht22_temp:      h.temperature as number,
          dht22_humidity:  h.humidity ?? 70,
          moisture_percent: h.moisture as number,
          ph:              h.ph ?? 6.8,
          timestamp:       h.timestamp,
        }));
    } else {
      // Simulation mode — use slider values
      reading = generateMLReading(state.mlSimValues);

      // Build a small synthetic history for confidence calculation
      mlHistory = state.historicalPredictions.slice(-10).map(p => ({
        dht22_temp:      p.timestamp ? state.mlSimValues.temp : state.mlSimValues.temp,
        dht22_humidity:  state.mlSimValues.humidity,
        moisture_percent: state.mlSimValues.moisture,
        ph:              state.mlSimValues.ph,
        timestamp:       p.timestamp,
      }));
    }

    const result = runPrediction(reading, mlHistory);
    get().storePrediction(result);
  },

  storePrediction: (result) => {
    set((state) => {
      const withTimestamp = { ...result, timestamp: result.timestamp || new Date().toISOString() };
      const updated = [...state.historicalPredictions, withTimestamp].slice(-50);
      return {
        predictionResult: result,
        historicalPredictions: updated,
      };
    });
  },

  startRealtimeTelemetry: () => {
    console.log('🚀 Starting realtime telemetry subscription...');
    
    if (!realtimeTelemetryService.isRealtimeDbAvailable()) {
      console.warn('⚠️ Realtime Database not available, staying in simulation mode');
      set({ realtimeDataMode: false });
      return () => {};
    }

    set({ realtimeDataMode: true });
    console.log('✅ Realtime Database connected! Listening for sensor updates...');

    const nodeId = SIMULATED_NODES[0].id;
    const node = SIMULATED_NODES[0];

    // Helper function to convert Firebase reading to TelemetryReading
    const convertFirebaseReading = (data: FirebaseSensorReading, daysElapsed: number = 45): TelemetryReading => {
      const harvestStatus = daysElapsed >= node.maturityTotalDays ? 'Harvest Ready' : 
                          daysElapsed >= node.maturityTotalDays * 0.8 ? 'Ready Soon' : 'Monitoring';
      
      return {
        timestamp: data.timestamp_iso,
        moisture: data.moisture_percent || null,
        temperature: data.dht22_temp || null,
        humidity: data.dht22_humidity || null,
        ph: data.ph || null,
        daysElapsed,
        harvestStatus,
        status: 'online',
        rssi: -65, // Default values - can be added to Firebase if needed
        battery: 3.9,
        // Extended Firebase fields
        reading_number: data.reading_number,
        moisture_raw: data.moisture_raw,
        ph_raw: data.ph_raw,
        ph_voltage: data.ph_voltage,
        source: data.source,
        timestamp_epoch_ms: data.timestamp_epoch_ms,
      };
    };

    // Subscribe to latest readings
    const unsubscribeLatest = realtimeTelemetryService.subscribeToLatestReadings((data) => {
      if (!data) {
        console.warn('⚠️ No data received from Firebase Realtime Database');
        return;
      }

      console.log(`📊 [${data.timestamp_iso}] Received realtime data update:`, {
        reading: data.reading_number,
        temp: data.dht22_temp,
        humidity: data.dht22_humidity,
        moisture: data.moisture_percent,
        ph: data.ph
      });

      // Calculate maturity days (you may want to store this in Firebase or calculate based on a start date)
      const daysElapsed = 45; // Replace with actual calculation if you have a start date in Firebase

      const reading = convertFirebaseReading(data, daysElapsed);

      console.log('✨ Updating dashboard with new data...');
      get().updateTelemetry(nodeId, reading);
    });

    // Subscribe to historical readings
    const unsubscribeHistory = realtimeTelemetryService.subscribeToReadingsHistory((historyData) => {
      if (historyData.length === 0) {
        console.warn('⚠️ No historical data received from Firebase');
        return;
      }

      console.log(`📚 Received ${historyData.length} historical readings from Firebase`);

      // Convert all history readings
      const historyReadings = historyData.map((data, index) => {
        // Calculate days elapsed based on timestamp or use a default progression
        const daysElapsed = Math.min(45 + Math.floor(index / 100), node.maturityTotalDays);
        return convertFirebaseReading(data, daysElapsed);
      });

      get().updateHistoryFromFirebase(nodeId, historyReadings);
    }, 200); // Load latest 200 records

    // Return combined unsubscribe function
    return () => {
      unsubscribeLatest();
      unsubscribeHistory();
    };
  }
}));

// Initialize initial cache histories
SIMULATED_NODES.forEach((node) => {
  if (node.id !== 'ESP32-NODE-04') {
    useStore.setState((state) => ({
      history: {
        ...state.history,
        [node.id]: generateHistory(node, 24, 30) // 24 hours of history, 30 min intervals
      }
    }));
  }
});
