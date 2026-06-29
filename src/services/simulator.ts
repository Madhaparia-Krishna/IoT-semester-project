export interface TelemetryReading {
  timestamp: string;
  moisture: number | null;
  temperature: number | null;
  humidity: number | null;
  ph?: number | null; // Optional pH value from real hardware
  daysElapsed: number;
  harvestStatus: 'Monitoring' | 'Ready Soon' | 'Harvest Ready' | 'Offline';
  status: 'online' | 'offline';
  rssi: number;
  battery: number;
  lastOnline?: string; // Last time node was online
  // Extended Firebase fields
  reading_number?: number;
  moisture_raw?: number;
  ph_raw?: number;
  ph_voltage?: number;
  source?: string;
  timestamp_epoch_ms?: number;
}

export interface NodeConfig {
  id: string;
  name: string;
  bedName: string;
  targetMoistureMin: number;
  targetMoistureMax: number;
  targetTempMin: number;
  targetTempMax: number;
  maturityTotalDays: number;
}

export const SIMULATED_NODES: NodeConfig[] = [
  {
    id: 'ESP32-NODE-01',
    name: 'Node Alpha (Main Bed)',
    bedName: 'Vermicompost Bed #1',
    targetMoistureMin: 60,
    targetMoistureMax: 80,
    targetTempMin: 18,
    targetTempMax: 25,
    maturityTotalDays: 60,
  }
];

// Helper to generate a single telemetry data point with minor fluctuation
export function generateTelemetry(
  _node: NodeConfig,
  timeOffsetMs: number = 0,
  _overrideTime?: Date
): TelemetryReading {
  const timestamp = new Date(Date.now() - timeOffsetMs);

  // Node is offline - return offline status with last known data timestamp
  return {
    timestamp: timestamp.toISOString(),
    moisture: null,
    temperature: null,
    humidity: null,
    ph: null,
    daysElapsed: 0,
    harvestStatus: 'Offline',
    status: 'offline',
    rssi: 0,
    battery: 0,
    lastOnline: timestamp.toISOString(), // Use timestamp as last online time
  };
}

// Helper to generate historical data (when node was online)
function generateHistoricalTelemetry(
  node: NodeConfig,
  timeOffsetMs: number = 0,
  overrideTime?: Date
): TelemetryReading {
  const timestamp = new Date(Date.now() - timeOffsetMs);
  const timeSec = (overrideTime ? overrideTime.getTime() : timestamp.getTime()) / 1000;

  // Healthy cycle, near completion
  let daysElapsed = Math.min(node.maturityTotalDays - 12 + Math.floor(timeSec / 100000) % 10, node.maturityTotalDays);
  // Smooth oscillation for stable bed
  let baseMoisture = 72 + Math.sin(timeSec / 3600) * 3 + Math.cos(timeSec / 600) * 0.5;
  let baseTemp = 21.2 + Math.sin(timeSec / 7200) * 1.5 + Math.cos(timeSec / 1200) * 0.3;
  let baseHumidity = 82 + Math.sin(timeSec / 3600) * 2;

  // Harvest readiness state determination
  let harvestStatus: TelemetryReading['harvestStatus'] = 'Monitoring';
  const progressRatio = daysElapsed / node.maturityTotalDays;
  if (progressRatio >= 0.95) {
    harvestStatus = 'Harvest Ready';
  } else if (progressRatio >= 0.8) {
    harvestStatus = 'Ready Soon';
  }

  // Signal strength (RSSI) simulation (-50 to -85 is typical)
  const rssi = -55 - Math.floor(Math.random() * 5);

  // Battery depletion (simulated, lithium-ion rechargeable 3.7V - 4.2V)
  const battery = 4.12;

  return {
    timestamp: (overrideTime || timestamp).toISOString(),
    moisture: parseFloat(baseMoisture.toFixed(1)),
    temperature: parseFloat(baseTemp.toFixed(1)),
    humidity: parseFloat(baseHumidity.toFixed(1)),
    ph: 5.9, // Static pH value for screenshots
    daysElapsed,
    harvestStatus,
    status: 'online',
    rssi,
    battery: parseFloat(battery.toFixed(2)),
  };
}

// Generate historical readings for standard charts (e.g., 24 hours or 7 days)
export function generateHistory(
  node: NodeConfig,
  hours: number = 24,
  intervalMinutes: number = 30
): TelemetryReading[] {
  const history: TelemetryReading[] = [];
  const totalPoints = (hours * 60) / intervalMinutes;

  for (let i = totalPoints; i >= 0; i--) {
    const timeOffsetMs = i * intervalMinutes * 60 * 1000;
    history.push(generateHistoricalTelemetry(node, timeOffsetMs));
  }

  return history;
}
