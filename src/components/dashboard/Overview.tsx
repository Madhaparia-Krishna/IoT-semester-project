import React from 'react';
import { useStore } from '../../store/useStore';
import { SIMULATED_NODES } from '../../services/simulator';
import { GlassCard } from '../ui/GlassCard';
import { StatusBadge } from '../ui/StatusBadge';
import {
  Droplets,
  Thermometer,
  Wind,
  Calendar,
  Activity,
  ArrowRight,
  TrendingUp,
  Cpu,
  Clock
} from 'lucide-react';

// Helper function to calculate relative time
const getRelativeTime = (dateString: string | number | undefined): string => {
  if (!dateString) return 'unknown';

  const now = new Date();
  let past: Date;

  // Handle different timestamp formats
  if (typeof dateString === 'number') {
    // Unix timestamp in milliseconds
    past = new Date(dateString);
  } else if (typeof dateString === 'string') {
    // ISO string or other date string
    past = new Date(dateString);
  } else {
    return 'unknown';
  }

  // Validate the date
  if (isNaN(past.getTime())) {
    return 'unknown';
  }

  const diffMs = now.getTime() - past.getTime();

  // Handle negative differences (future dates)
  if (diffMs < 0) {
    return 'just now';
  }

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'just now';
};

interface OverviewProps {
  setActiveTab: (tab: any) => void;
}

export const Overview: React.FC<OverviewProps> = ({ setActiveTab }) => {
  const { activeNodeId, setActiveNodeId, telemetry, settings, realtimeDataMode, history } = useStore();

  const activeNode = SIMULATED_NODES.find((n) => n.id === activeNodeId) || SIMULATED_NODES[0];
  const nodeReading = telemetry[activeNodeId] || {
    moisture: 0,
    temperature: 0,
    humidity: 0,
    daysElapsed: 0,
    harvestStatus: 'Offline',
    status: 'offline',
    battery: 0,
    rssi: -100
  };

  // Get the last reading from history for display when offline
  const nodeHistory = history[activeNodeId] || [];
  const lastHistoricalReading = nodeHistory.length > 0 ? nodeHistory[nodeHistory.length - 1] : null;

  // Use last historical reading if node is offline and has no current data
  const displayReading = nodeReading.status === 'offline' &&
    (nodeReading.moisture === null || nodeReading.moisture === 0) &&
    lastHistoricalReading
    ? {
      ...nodeReading,
      ...lastHistoricalReading, // Copy all fields from historical reading including pH
      status: 'offline' as const, // Force offline status
      lastOnline: lastHistoricalReading.timestamp_epoch_ms || lastHistoricalReading.timestamp
    }
    : nodeReading;

  const getMoistureStatus = (val: number | null) => {
    if (val === null || val === 0) return 'offline';
    if (val < settings.moistureMin) return 'critical';
    if (val > settings.moistureMax) return 'warning';
    return 'success';
  };

  const getTempStatus = (val: number | null) => {
    if (val === null || val === 0) return 'offline';
    if (val < settings.tempMin || val > settings.tempMax) return 'critical';
    return 'success';
  };

  const isHarvestReady = displayReading.harvestStatus === 'Harvest Ready';

  return (
    <div className="space-y-6 font-sans">
      {/* Node Selector Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">System Overview</h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Real-time telemetry and biological compost maturity tracking
            {realtimeDataMode && (
              <span className="ml-2 inline-flex items-center gap-1 text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Firebase Data
              </span>
            )}
          </p>
        </div>

        {/* Dropdown Node Switcher */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide shrink-0">Monitored Bed:</span>
          <select
            value={activeNodeId}
            onChange={(e) => setActiveNodeId(e.target.value)}
            className="bg-[#0e121a] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/40 w-full sm:w-64"
          >
            {SIMULATED_NODES.map((node) => (
              <option key={node.id} value={node.id}>
                {node.bedName} ({node.name.split(' ')[1]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Last Updated Banner - Show when offline */}
      {displayReading.status === 'offline' && displayReading.lastOnline && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-400" />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-amber-400">Node Offline</span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-300 font-medium">
                Last Updated: {getRelativeTime(displayReading.lastOnline)}
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-500 font-mono">
                {typeof displayReading.lastOnline === 'number'
                  ? new Date(displayReading.lastOnline).toLocaleString()
                  : new Date(displayReading.lastOnline).toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Showing last recorded sensor data from Firebase</p>
          </div>
        </div>
      )}

      {/* Harvest Ready Banner */}
      {isHarvestReady && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 border border-emerald-500/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-glow">
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-500/30">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-base">Compost Harvest Cycle Complete!</h4>
              <p className="text-xs text-emerald-300/80 leading-relaxed mt-0.5">
                {activeNode.bedName} has elapsed {displayReading.daysElapsed} days of vermiculture maturation. Environmental stats are highly stable.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('beds')}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-bg-space font-bold rounded-lg text-xs transition-all flex items-center gap-1 shrink-0 cursor-pointer"
          >
            Manage Bed
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Real-time Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Moisture */}
        <GlassCard
          variant={getMoistureStatus(displayReading.moisture) === 'critical' ? 'rose' : getMoistureStatus(displayReading.moisture) === 'warning' ? 'cyan' : 'emerald'}
          className="relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/10 transition-colors" />
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400">
              <Droplets className="w-6 h-6" />
            </div>
            <StatusBadge
              status={
                getMoistureStatus(displayReading.moisture) === 'critical'
                  ? 'critical'
                  : getMoistureStatus(displayReading.moisture) === 'warning'
                    ? 'warning'
                    : displayReading.status === 'offline'
                      ? 'offline'
                      : 'online'
              }
              label={displayReading.moisture === null || displayReading.moisture === 0 ? 'Offline' : getMoistureStatus(displayReading.moisture) === 'critical' ? 'Critically Dry' : 'Moisture Safe'}
            />
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block">Soil Moisture</span>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-4xl font-display font-extrabold text-white text-glow-cyan">
              {displayReading.moisture !== null && displayReading.moisture !== 0 ? `${displayReading.moisture}%` : 'N/A'}
            </h3>
            {displayReading.moisture !== null && displayReading.moisture !== 0 && (
              <span className="text-xs text-slate-400 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3 text-cyan-400" />
                Target: {settings.moistureMin}-{settings.moistureMax}%
              </span>
            )}
          </div>
        </GlassCard>

        {/* Temperature */}
        <GlassCard
          variant={getTempStatus(displayReading.temperature) === 'critical' ? 'rose' : 'emerald'}
          className="relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-colors" />
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-500">
              <Thermometer className="w-6 h-6" />
            </div>
            <StatusBadge
              status={getTempStatus(displayReading.temperature) === 'critical' ? 'critical' : displayReading.status === 'offline' ? 'offline' : 'online'}
              label={displayReading.temperature === null || displayReading.temperature === 0 ? 'Offline' : getTempStatus(displayReading.temperature) === 'critical' ? 'Temp Alarm' : 'Stable Temp'}
            />
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block">Core Temperature</span>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-4xl font-display font-extrabold text-white">
              {displayReading.temperature !== null && displayReading.temperature !== 0 ? `${displayReading.temperature}°C` : 'N/A'}
            </h3>
            {displayReading.temperature !== null && displayReading.temperature !== 0 && (
              <span className="text-xs text-slate-400 flex items-center gap-0.5">
                <Activity className="w-3 h-3 text-amber-500" />
                Target: {settings.tempMin}-{settings.tempMax}°C
              </span>
            )}
          </div>
        </GlassCard>

        {/* Ambient Humidity */}
        <GlassCard className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
              <Wind className="w-6 h-6" />
            </div>
            <StatusBadge status={displayReading.status === 'online' ? 'online' : 'offline'} />
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block">Air Humidity</span>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-4xl font-display font-extrabold text-white text-glow-emerald">
              {displayReading.humidity !== null && displayReading.humidity !== 0 ? `${displayReading.humidity}%` : 'N/A'}
            </h3>
            {displayReading.humidity !== null && displayReading.humidity !== 0 && (
              <span className="text-xs text-slate-400">
                Range: {settings.humidityMin}-{settings.humidityMax}%
              </span>
            )}
          </div>
        </GlassCard>

        {/* pH Level */}
        {displayReading.ph !== undefined && (
          <GlassCard className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/10 transition-colors" />
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-400">
                <Activity className="w-6 h-6" />
              </div>
              <StatusBadge status={displayReading.status === 'online' ? 'online' : 'offline'} />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block">Soil pH Level</span>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className="text-4xl font-display font-extrabold text-white text-glow-purple">
                {displayReading.ph !== null && displayReading.ph !== 0 ? displayReading.ph.toFixed(2) : 'N/A'}
              </h3>
              {displayReading.ph !== null && displayReading.ph !== 0 && (
                <span className="text-xs text-slate-400">
                  {displayReading.ph >= 6.0 && displayReading.ph <= 7.5 ? 'Optimal' : 'Monitor'}
                </span>
              )}
            </div>
          </GlassCard>
        )}
      </div>

      {/* Progress & Stats Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dynamic Nodes status summary */}
        <GlassCard className="lg:col-span-12 flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-white text-lg">ESP32 Hardware Node Registry</h3>
            <p className="text-xs text-slate-400 mb-6">Device connections and link parameters</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Data Source</span>
              <span className={`font-bold flex items-center gap-1 ${realtimeDataMode ? 'text-emerald-400' : 'text-cyan-400'}`}>
                {realtimeDataMode ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    FIREBASE LIVE
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    DEMO MODE
                  </>
                )}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Last Updated</span>
              <span className="text-slate-200 font-mono text-[10px]">
                {displayReading.timestamp ? new Date(displayReading.timestamp).toLocaleTimeString() : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Node Wi-Fi RSSI</span>
              <span className={`font-bold ${displayReading.rssi > -65 ? 'text-emerald-400' : displayReading.rssi > -80 ? 'text-amber-400' : 'text-slate-500'}`}>
                {displayReading.rssi} dBm
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Battery Voltage</span>
              <span className={`font-bold ${displayReading.battery > 3.7 ? 'text-emerald-400' : displayReading.battery > 3.4 ? 'text-amber-400' : 'text-slate-500'}`}>
                {displayReading.battery} V
              </span>
            </div>
            <div className="flex justify-between items-center text-xs border-t border-white/5 pt-3">
              <span className="text-slate-400 font-medium">Total Registered Nodes</span>
              <span className="text-white font-bold">{SIMULATED_NODES.length} Devices</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('nodes')}
            className="w-full mt-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs text-center font-semibold text-slate-300 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Cpu className="w-4 h-4" />
            Manage ESP32 Nodes
          </button>
        </GlassCard>
      </div>

      {/* Quick Navigation Footer Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
          <div>
            <h5 className="font-display font-semibold text-white text-sm">Need deep visualization?</h5>
            <p className="text-xs text-slate-500">Analyze sensor variance, heat maps, and comparison charts.</p>
          </div>
          <button
            onClick={() => setActiveTab('analytics')}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all border border-white/5 flex items-center gap-1 cursor-pointer"
          >
            Open Analytics
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
          <div>
            <h5 className="font-display font-semibold text-white text-sm">Review triggered events?</h5>
            <p className="text-xs text-slate-500">Track and acknowledge moisture bounds and temp alerts.</p>
          </div>
          <button
            onClick={() => setActiveTab('alerts')}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all border border-white/5 flex items-center gap-1 cursor-pointer"
          >
            Open Alerts
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default Overview;
