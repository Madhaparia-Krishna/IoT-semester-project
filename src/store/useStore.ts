import { create } from 'zustand';
import { dbService, isFirebaseConfigured } from '../services/firebase';
import type { UserSession } from '../services/firebase';
import { SIMULATED_NODES, generateHistory } from '../services/simulator';
import type { TelemetryReading } from '../services/simulator';

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

  setUser: (user) => set({ user }),
  setAuthLoading: (loading) => set({ authLoading: loading }),
  setActiveNodeId: (id) => set({ activeNodeId: id }),

  updateTelemetry: (nodeId, reading) => {
    set((state) => {
      const updatedTelemetry = { ...state.telemetry, [nodeId]: reading };
      
      // Update history inline by appending, keeping size capped (e.g. 50 points)
      const currentHistory = state.history[nodeId] || [];
      const updatedHistory = [...currentHistory];
      
      // Avoid inserting duplicates
      const lastPoint = currentHistory[currentHistory.length - 1];
      if (!lastPoint || lastPoint.timestamp !== reading.timestamp) {
        updatedHistory.push(reading);
        if (updatedHistory.length > 50) {
          updatedHistory.shift();
        }
      }

      return {
        telemetry: updatedTelemetry,
        history: { ...state.history, [nodeId]: updatedHistory }
      };
    });

    // Check thresholds to trigger alerts
    if (reading.status === 'online') {
      get().checkAlertThresholds(nodeId, reading);
    }
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
