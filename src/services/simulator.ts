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
  },
  {
    id: 'ESP32-NODE-02',
    name: 'Node Beta (Seedbed)',
    bedName: 'Vermicompost Bed #2',
    targetMoistureMin: 60,
    targetMoistureMax: 80,
    targetTempMin: 18,
    targetTempMax: 25,
    maturityTotalDays: 90,
  },
  {
    id: 'ESP32-NODE-03',
    name: 'Node Gamma (Experimental)',
    bedName: 'Vermicompost Bed #3',
    targetMoistureMin: 60,
    targetMoistureMax: 80,
    targetTempMin: 18,
    targetTempMax: 25,
    maturityTotalDays: 45,
  },
  {
    id: 'ESP32-NODE-04',
    name: 'Node Delta (Offline Test)',
    bedName: 'Vermicompost Bed #4',
    targetMoistureMin: 60,
    targetMoistureMax: 80,
    targetTempMin: 18,
    targetTempMax: 25,
    maturityTotalDays: 60,
  }
];

// Helper to generate a single telemetry data point with minor fluctuation
export function generateTelemetry(
  node: NodeConfig,
  timeOffsetMs: number = 0,
  overrideTime?: Date
): TelemetryReading {
  const timestamp = new Date(Date.now() - timeOffsetMs);
  const timeSec = (overrideTime ? overrideTime.getTime() : timestamp.getTime()) / 1000;

  // Let's create different behavior for different nodes
  if (node.id === 'ESP32-NODE-04') {
    // Offline node
    return {
      timestamp: timestamp.toISOString(),
      moisture: null,
      temperature: null,
      humidity: null,
      daysElapsed: 60,
      harvestStatus: 'Offline',
      status: 'offline',
      rssi: -98,
      battery: 0.0,
    };
  }

  let baseMoisture = 70; // Stable
  let baseTemp = 21.5;   // Stable
  let baseHumidity = 80; // Stable
  let daysElapsed = Math.floor((timeSec / 86400) % node.maturityTotalDays);
  
  if (node.id === 'ESP32-NODE-01') {
    // Healthy cycle, near completion
    daysElapsed = Math.min(node.maturityTotalDays - 12 + Math.floor(timeSec / 100000) % 10, node.maturityTotalDays);
    // Smooth oscillation for stable bed
    baseMoisture = 72 + Math.sin(timeSec / 3600) * 3 + Math.cos(timeSec / 600) * 0.5;
    baseTemp = 21.2 + Math.sin(timeSec / 7200) * 1.5 + Math.cos(timeSec / 1200) * 0.3;
    baseHumidity = 82 + Math.sin(timeSec / 3600) * 2;
  } else if (node.id === 'ESP32-NODE-02') {
    // Dry warning state: moisture dropping below threshold (60)
    daysElapsed = Math.min(85 + Math.floor(timeSec / 200000) % 5, node.maturityTotalDays);
    baseMoisture = 52 + Math.sin(timeSec / 3600) * 2 + Math.cos(timeSec / 900) * 0.4;
    baseTemp = 25.8 + Math.sin(timeSec / 7200) * 1.2;
    baseHumidity = 65 + Math.sin(timeSec / 3600) * 3;
  } else if (node.id === 'ESP32-NODE-03') {
    // Critical state: moisture extremely low, temperature climbing (hot compost)
    daysElapsed = 15;
    baseMoisture = 34 + Math.sin(timeSec / 5000) * 1.5;
    baseTemp = 32.4 + Math.sin(timeSec / 3600) * 2.0;
    baseHumidity = 52 + Math.sin(timeSec / 4000) * 4;
  }

  // Harvest readiness state determination
  let harvestStatus: TelemetryReading['harvestStatus'] = 'Monitoring';
  const progressRatio = daysElapsed / node.maturityTotalDays;
  if (progressRatio >= 0.95) {
    harvestStatus = 'Harvest Ready';
  } else if (progressRatio >= 0.8) {
    harvestStatus = 'Ready Soon';
  }

  // Signal strength (RSSI) simulation (-50 to -85 is typical)
  const rssi = node.id === 'ESP32-NODE-01'
    ? -55 - Math.floor(Math.random() * 5)
    : node.id === 'ESP32-NODE-02'
    ? -68 - Math.floor(Math.random() * 6)
    : -75 - Math.floor(Math.random() * 8);

  // Battery depletion (simulated, lithium-ion rechargeable 3.7V - 4.2V)
  const battery = node.id === 'ESP32-NODE-01'
    ? 4.12
    : node.id === 'ESP32-NODE-02'
    ? 3.82
    : 3.65;

  return {
    timestamp: (overrideTime || timestamp).toISOString(),
    moisture: parseFloat(baseMoisture.toFixed(1)),
    temperature: parseFloat(baseTemp.toFixed(1)),
    humidity: parseFloat(baseHumidity.toFixed(1)),
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
    history.push(generateTelemetry(node, timeOffsetMs));
  }
  
  return history;
}
