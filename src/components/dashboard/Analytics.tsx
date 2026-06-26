import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { SIMULATED_NODES } from '../../services/simulator';
import { GlassCard } from '../ui/GlassCard';
import { StatusBadge } from '../ui/StatusBadge';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  LineChart as ChartIcon,
  HeartPulse
} from 'lucide-react';

export const Analytics: React.FC = () => {
  const { activeNodeId, history, telemetry } = useStore();
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h'>('6h');

  const fullHistory = history[activeNodeId] || [];

  // Filter history data points based on selected range
  const getFilteredData = () => {
    if (timeRange === '1h') return fullHistory.slice(-12); // Last 1 hour (approx 12 points at 5 min steps)
    if (timeRange === '6h') return fullHistory.slice(-36); // Last 6 hours (approx 36 points)
    return fullHistory; // Full 24 hours
  };

  const chartData = getFilteredData().map((pt) => ({
    ...pt,
    timeLabel: new Date(pt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }));

  // Build comparative data across nodes for bar chart
  const nodeComparisonData = SIMULATED_NODES.map((node) => {
    const reading = telemetry[node.id];
    return {
      name: node.bedName.replace('Vermicompost ', ''),
      Moisture: reading?.moisture || 0,
      Temperature: reading?.temperature || 0,
      Humidity: reading?.humidity || 0,
    };
  });

  // Calculate environmental stability index (closer to target is higher)
  const calculateStability = () => {
    const reading = telemetry[activeNodeId];
    if (!reading || !reading.moisture || !reading.temperature) return 0;

    // Deviation from ideal values (70% moisture, 21C temp)
    const mDev = Math.abs(reading.moisture - 70) / 70;
    const tDev = Math.abs(reading.temperature - 21.5) / 21.5;

    const stability = Math.max(0, 100 - (mDev * 50 + tDev * 50));
    return Math.round(stability);
  };

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Tab controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">Sensor Analytics</h2>
          <p className="text-slate-400 text-sm">Deep-dive telemetry graphing and sensor heatmaps</p>
        </div>

        {/* Time filters */}
        <div className="flex gap-1.5 p-1 rounded-xl bg-white/5 border border-white/5">
          {(['1h', '6h', '24h'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${timeRange === r ? 'bg-emerald-500 text-bg-space font-bold' : 'text-slate-400 hover:text-white'
                }`}
            >
              {r === '1h' ? '1 Hour' : r === '6h' ? '6 Hours' : '24 Hours'}
            </button>
          ))}
        </div>
      </div>

      {/* Row 1: Area Trends (Moisture & Temperature) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Moisture Area Graph */}
        <GlassCard variant="cyan">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display font-bold text-white text-base">Moisture Trend Graph</h3>
            <StatusBadge status="offline" label="Historical Data" />
          </div>
          <div className="h-64">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                Loading telemetry trends...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="moistureGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="timeLabel" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} />
                  <YAxis domain={[40, 90]} stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#090c15', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}
                    labelStyle={{ color: '#9ca3af', fontWeight: 'bold', fontSize: '10px' }}
                    itemStyle={{ color: '#06b6d4', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="moisture" name="Moisture (%)" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#moistureGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </GlassCard>

        {/* Temperature Line Graph */}
        <GlassCard variant="emerald">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display font-bold text-white text-base">Core Temperature Trend</h3>
            <StatusBadge status="offline" label="Historical Data" />
          </div>
          <div className="h-64">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                Loading telemetry trends...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="timeLabel" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} />
                  <YAxis domain={[15, 38]} stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#090c15', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}
                    labelStyle={{ color: '#9ca3af', fontWeight: 'bold', fontSize: '10px' }}
                    itemStyle={{ color: '#f59e0b', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#tempGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Row 2: Multi-sensor compare & Bed compare */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Multi-sensor compare (7 cols on lg) */}
        <GlassCard className="lg:col-span-7">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display font-bold text-white text-base">Multi-Sensor Parameter Comparison</h3>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <ChartIcon className="w-3.5 h-3.5" />
              Synchronized axes
            </span>
          </div>
          <div className="h-72">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                Loading data matrices...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="timeLabel" stroke="rgba(255,255,255,0.15)" fontSize={10} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.15)" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#090c15', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}
                    labelStyle={{ color: '#9ca3af', fontWeight: 'bold', fontSize: '10px' }}
                    itemStyle={{ fontSize: '11px' }}
                  />
                  <Legend verticalAlign="top" height={36} iconSize={10} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="moisture" name="Moisture %" stroke="#06b6d4" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="temperature" name="Temp °C" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="humidity" name="Humidity %" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </GlassCard>

        {/* Node Moisture Comparison bar chart (5 cols on lg) */}
        <GlassCard className="lg:col-span-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display font-bold text-white text-base">Moisture Across Active Beds</h3>
            <span className="text-[10px] uppercase font-bold text-emerald-400">Node Comparison</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={nodeComparisonData} margin={{ top: 20, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.15)" fontSize={10} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.15)" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090c15', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}
                  itemStyle={{ color: '#10b981', fontSize: '12px' }}
                />
                <Bar dataKey="Moisture" name="Current Moisture (%)" fill="#10b981" radius={[8, 8, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Row 3: Environmental Stability Index */}
      <div className="grid grid-cols-1 gap-6">
        {/* Environmental Stability Score */}
        <GlassCard className="flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-white text-base">Environmental Stability Score</h3>
            <p className="text-xs text-slate-500 mt-0.5">Calculated deviation based on moisture and temp targets</p>
          </div>

          <div className="flex flex-col items-center py-6">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Stability Score Ring */}
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeDasharray={`${calculateStability() * 2.51} 251`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute text-center">
                <h4 className="text-3xl font-display font-extrabold text-white text-glow-emerald">
                  {calculateStability()}%
                </h4>
                <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 block mt-0.5">STABILITY</span>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-4">
            {calculateStability() > 85 ? (
              <span className="text-emerald-400 font-semibold flex items-center justify-center gap-1">
                <HeartPulse className="w-4 h-4" /> Highly Optimal: Worm respiration is at maximum efficiency.
              </span>
            ) : calculateStability() > 60 ? (
              <span className="text-amber-400 font-semibold flex items-center justify-center gap-1">
                Moderate Stress: Adjust watering parameters to reach 70% moisture.
              </span>
            ) : (
              <span className="text-rose-400 font-semibold flex items-center justify-center gap-1">
                High stress warning! Environmental limits are severely unstable.
              </span>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
export default Analytics;
