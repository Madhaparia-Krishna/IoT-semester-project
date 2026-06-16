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
  Cpu
} from 'lucide-react';

interface OverviewProps {
  setActiveTab: (tab: any) => void;
}

export const Overview: React.FC<OverviewProps> = ({ setActiveTab }) => {
  const { activeNodeId, setActiveNodeId, telemetry, settings, realtimeDataMode } = useStore();

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

  const getMoistureStatus = (val: number | null) => {
    if (val === null) return 'offline';
    if (val < settings.moistureMin) return 'critical';
    if (val > settings.moistureMax) return 'warning';
    return 'success';
  };

  const getTempStatus = (val: number | null) => {
    if (val === null) return 'offline';
    if (val < settings.tempMin || val > settings.tempMax) return 'critical';
    return 'success';
  };

  const isHarvestReady = nodeReading.harvestStatus === 'Harvest Ready';

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
                {activeNode.bedName} has elapsed {nodeReading.daysElapsed} days of vermiculture maturation. Environmental stats are highly stable.
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
          variant={getMoistureStatus(nodeReading.moisture) === 'critical' ? 'rose' : getMoistureStatus(nodeReading.moisture) === 'warning' ? 'cyan' : 'emerald'}
          className="relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/10 transition-colors" />
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400">
              <Droplets className="w-6 h-6" />
            </div>
            <StatusBadge
              status={
                getMoistureStatus(nodeReading.moisture) === 'critical'
                  ? 'critical'
                  : getMoistureStatus(nodeReading.moisture) === 'warning'
                  ? 'warning'
                  : 'online'
              }
              label={nodeReading.moisture === null ? 'Offline' : getMoistureStatus(nodeReading.moisture) === 'critical' ? 'Critically Dry' : 'Moisture Safe'}
            />
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block">Soil Moisture</span>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-4xl font-display font-extrabold text-white text-glow-cyan">
              {nodeReading.moisture !== null ? `${nodeReading.moisture}%` : 'N/A'}
            </h3>
            {nodeReading.moisture !== null && (
              <span className="text-xs text-slate-400 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3 text-cyan-400" />
                Target: {settings.moistureMin}-{settings.moistureMax}%
              </span>
            )}
          </div>
        </GlassCard>

        {/* Temperature */}
        <GlassCard
          variant={getTempStatus(nodeReading.temperature) === 'critical' ? 'rose' : 'emerald'}
          className="relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-colors" />
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-500">
              <Thermometer className="w-6 h-6" />
            </div>
            <StatusBadge
              status={getTempStatus(nodeReading.temperature) === 'critical' ? 'critical' : 'online'}
              label={nodeReading.temperature === null ? 'Offline' : getTempStatus(nodeReading.temperature) === 'critical' ? 'Temp Alarm' : 'Stable Temp'}
            />
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block">Core Temperature</span>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-4xl font-display font-extrabold text-white">
              {nodeReading.temperature !== null ? `${nodeReading.temperature}°C` : 'N/A'}
            </h3>
            {nodeReading.temperature !== null && (
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
            <StatusBadge status={nodeReading.status === 'online' ? 'online' : 'offline'} />
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block">Air Humidity</span>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-4xl font-display font-extrabold text-white text-glow-emerald">
              {nodeReading.humidity !== null ? `${nodeReading.humidity}%` : 'N/A'}
            </h3>
            {nodeReading.humidity !== null && (
              <span className="text-xs text-slate-400">
                Range: {settings.humidityMin}-{settings.humidityMax}%
              </span>
            )}
          </div>
        </GlassCard>

        {/* pH Level */}
        {nodeReading.ph !== undefined && (
          <GlassCard className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/10 transition-colors" />
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-400">
                <Activity className="w-6 h-6" />
              </div>
              <StatusBadge status={nodeReading.status === 'online' ? 'online' : 'offline'} />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block">Soil pH Level</span>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className="text-4xl font-display font-extrabold text-white text-glow-purple">
                {nodeReading.ph !== null ? nodeReading.ph.toFixed(2) : 'N/A'}
              </h3>
              {nodeReading.ph !== null && (
                <span className="text-xs text-slate-400">
                  {nodeReading.ph >= 6.0 && nodeReading.ph <= 7.5 ? 'Optimal' : 'Monitor'}
                </span>
              )}
            </div>
          </GlassCard>
        )}
      </div>

      {/* Progress & Stats Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Compost maturity duration bar */}
        <GlassCard className="lg:col-span-8 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-display font-bold text-white text-lg">Maturation Cycle Progress</h3>
              <p className="text-xs text-slate-400">Biological decomposition and casting accumulation counter</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/5 font-semibold text-slate-300">
              {activeNode.maturityTotalDays} Days Cycle
            </span>
          </div>

          <div className="my-6 space-y-4">
            <div className="flex justify-between items-baseline text-sm font-semibold">
              <span className="text-slate-400">MATURITY DAYS COMPLETED</span>
              <span className="text-emerald-400 text-lg font-display">
                {nodeReading.daysElapsed} <span className="text-slate-500 text-xs">/ {activeNode.maturityTotalDays} days</span>
              </span>
            </div>

            <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, (nodeReading.daysElapsed / activeNode.maturityTotalDays) * 100)}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-2">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Status</span>
                <p className="text-sm font-bold text-slate-200 mt-0.5 capitalize">{nodeReading.harvestStatus}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Phase</span>
                <p className="text-sm font-bold text-slate-200 mt-0.5">
                  {nodeReading.daysElapsed < 15 ? 'Initial Feed' : nodeReading.daysElapsed < 45 ? 'Decomp' : 'Finishing'}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Progress</span>
                <p className="text-sm font-bold text-slate-200 mt-0.5">
                  {Math.round((nodeReading.daysElapsed / activeNode.maturityTotalDays) * 100)}%
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-white/5 pt-4">
            <span className="text-xs text-slate-500">Worm species: Eisenia fetida (Red Wigglers)</span>
            <button
              onClick={() => setActiveTab('beds')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              Configure Bed Cycle
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </GlassCard>

        {/* Dynamic Nodes status summary */}
        <GlassCard className="lg:col-span-4 flex flex-col justify-between">
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
                {nodeReading.timestamp ? new Date(nodeReading.timestamp).toLocaleTimeString() : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Node Wi-Fi RSSI</span>
              <span className={`font-bold ${nodeReading.rssi > -65 ? 'text-emerald-400' : nodeReading.rssi > -80 ? 'text-amber-400' : 'text-slate-500'}`}>
                {nodeReading.rssi} dBm
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Battery Voltage</span>
              <span className={`font-bold ${nodeReading.battery > 3.7 ? 'text-emerald-400' : nodeReading.battery > 3.4 ? 'text-amber-400' : 'text-slate-500'}`}>
                {nodeReading.battery} V
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
