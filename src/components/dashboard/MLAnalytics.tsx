import React, { useEffect, useCallback } from 'react';
import { useStore } from '../../store/useStore';
import { GlassCard } from '../ui/GlassCard';
import {
  SCENARIO_PRESETS,
  getRiskLevelConfig,
  getEnvClassColor,
} from '../../ml';
import type { ScenarioPreset } from '../../ml';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  Brain,
  Zap,
  Wifi,
  FlaskConical,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Thermometer,
  Droplets,
  Wind,
  Beaker,
  TrendingUp,
  Activity,
  RefreshCw,
  ChevronRight,
} from 'lucide-react';

// ─── Animated Score Ring ──────────────────────────────────────────────────────

const ScoreRing: React.FC<{ value: number; color: string; size?: number }> = ({
  value,
  color,
  size = 120,
}) => {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, value));
  const dash = (pct / 100) * circ;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="-rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
      <circle
        cx="50" cy="50" r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)' }}
      />
    </svg>
  );
};

// ─── Slider Control ───────────────────────────────────────────────────────────

interface SliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  color: string;
  icon: React.ReactNode;
  onChange: (v: number) => void;
}

const MLSlider: React.FC<SliderProps> = ({ id, label, value, min, max, step, unit, color, icon, onChange }) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <span className="w-4 h-4" style={{ color }}>{icon}</span>
          {label}
        </label>
        <span className="text-sm font-bold font-display" style={{ color }}>
          {value % 1 === 0 ? value : value.toFixed(1)}{unit}
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-white/5">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-150"
          style={{ width: `${pct}%`, background: color }}
        />
        <input
          id={id}
          type="range"
          min={min} max={max} step={step}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <div className="flex justify-between text-[10px] text-slate-600 font-mono">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
};

// ─── Main ML Analytics Component ──────────────────────────────────────────────

export const MLAnalytics: React.FC = () => {
  const {
    mlMode,
    mlSimValues,
    mlSimScenario,
    predictionResult,
    historicalPredictions,
    realtimeDataMode,
    setMLMode,
    setMLSimValues,
    setMLSimScenario,
    runMLPrediction,
  } = useStore();

  // ── Run prediction on every relevant state change ──────────────────────────
  const triggerPrediction = useCallback(() => {
    runMLPrediction();
  }, [runMLPrediction]);

  // Initial run
  useEffect(() => {
    triggerPrediction();
  }, [triggerPrediction]);

  // Re-run whenever mode or sim values change
  useEffect(() => {
    triggerPrediction();
  }, [mlMode, mlSimValues, triggerPrediction]);

  // Auto-refresh in live mode every 5 s
  useEffect(() => {
    if (mlMode !== 'live') return;
    const id = setInterval(triggerPrediction, 5000);
    return () => clearInterval(id);
  }, [mlMode, triggerPrediction]);

  // ── Apply a preset scenario ───────────────────────────────────────────────
  const applyPreset = (preset: ScenarioPreset) => {
    setMLSimScenario(preset.name);
    setMLSimValues({ temp: preset.temp, humidity: preset.humidity, moisture: preset.moisture, ph: preset.ph });
    // Manually call with new values immediately
    setTimeout(() => runMLPrediction(), 50);
  };

  // ── Chart data from historical predictions ────────────────────────────────
  const chartData = historicalPredictions.slice(-20).map((p, i) => ({
    index: i + 1,
    envScore: p.environmentalScore,
    confidence: p.confidence,
    label: new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }));

  const result = predictionResult;
  const riskConfig = result ? getRiskLevelConfig(result.riskLevel) : null;
  const envColor = result ? getEnvClassColor(result.environmentClass) : '#10b981';

  // Risk level display label map
  const riskLabels: Record<string, string> = {
    LOW: 'Low Risk',
    MEDIUM: 'Medium Risk',
    HIGH: 'High Risk',
    CRITICAL: 'CRITICAL',
  };

  return (
    <div className="space-y-6 font-sans pb-12">

      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <Brain className="w-5 h-5 text-violet-400" />
            </div>
            <h2 className="text-2xl font-bold font-display text-white">ML Analytics</h2>
          </div>
          <p className="text-slate-400 text-sm">
            Predictive intelligence engine — environmental scoring, anomaly detection &amp; harvest forecasting
          </p>
        </div>

        {/* Live / Simulation Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/5 shrink-0">
          <button
            id="ml-mode-live"
            onClick={() => setMLMode('live')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all cursor-pointer ${mlMode === 'live'
              ? 'bg-emerald-500 text-bg-space'
              : 'text-slate-400 hover:text-white'
              }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            Live Firebase
          </button>
          <button
            id="ml-mode-sim"
            onClick={() => setMLMode('simulation')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all cursor-pointer ${mlMode === 'simulation'
              ? 'bg-violet-500 text-white'
              : 'text-slate-400 hover:text-white'
              }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            Simulation
          </button>
        </div>
      </div>

      {/* ── Live Mode Info Banner ─────────────────────────────────────────────── */}
      {mlMode === 'live' && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm ${realtimeDataMode
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
          : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
          }`}>
          {realtimeDataMode ? (
            <RefreshCw className="w-4 h-4 animate-spin shrink-0" style={{ animationDuration: '2s' }} />
          ) : (
            <Activity className="w-4 h-4 shrink-0" />
          )}
          <span>
            {realtimeDataMode
              ? 'Reading live sensor data from Firebase Realtime Database. Predictions auto-refresh every 5 seconds.'
              : 'Firebase not connected — using simulated node telemetry data. Connect Firebase for real sensor predictions.'}
          </span>
        </div>
      )}

      {/* ── SIMULATION CONTROLS (visible in simulation mode only) ─────────────── */}
      {mlMode === 'simulation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Preset Scenarios */}
          <GlassCard className="lg:col-span-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-violet-400" />
              <h3 className="font-display font-bold text-white text-base">Preset Scenarios</h3>
            </div>
            <div className="space-y-2">
              {SCENARIO_PRESETS.map((preset) => {
                const isActive = mlSimScenario === preset.name;
                const riskColors: Record<string, string> = {
                  LOW: 'text-emerald-400',
                  MEDIUM: 'text-amber-400',
                  HIGH: 'text-orange-400',
                  CRITICAL: 'text-rose-400',
                };
                const riskBorders: Record<string, string> = {
                  LOW: 'border-emerald-500/30 bg-emerald-500/5',
                  MEDIUM: 'border-amber-500/30 bg-amber-500/5',
                  HIGH: 'border-orange-500/30 bg-orange-500/5',
                  CRITICAL: 'border-rose-500/30 bg-rose-500/5',
                };
                return (
                  <button
                    key={preset.name}
                    id={`preset-${preset.name.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => applyPreset(preset)}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all cursor-pointer group ${isActive
                      ? riskBorders[preset.expectedRisk]
                      : 'border-white/5 bg-white/[0.02] hover:bg-white/5'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-200'}`}>
                            {preset.name}
                          </span>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${isActive ? riskBorders[preset.expectedRisk] : 'border-white/10 text-slate-500'
                            } ${isActive ? riskColors[preset.expectedRisk] : ''}`}>
                            {preset.expectedRisk}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-tight truncate">
                          {preset.description}
                        </p>
                      </div>
                      <ChevronRight className={`w-4 h-4 shrink-0 ml-2 transition-colors ${isActive ? riskColors[preset.expectedRisk] : 'text-slate-600 group-hover:text-slate-400'}`} />
                    </div>
                    {isActive && (
                      <div className="flex gap-3 mt-2 pt-2 border-t border-white/5 text-[10px] text-slate-400 font-mono">
                        <span>{preset.temp}°C</span>
                        <span>{preset.humidity}% RH</span>
                        <span>{preset.moisture}% MC</span>
                        <span>pH {preset.ph}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </GlassCard>

          {/* Manual Sliders */}
          <GlassCard className="lg:col-span-7">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h3 className="font-display font-bold text-white text-base">Manual Controls</h3>
              </div>
              {mlSimScenario === null && (
                <span className="text-[10px] px-2 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 font-bold">
                  Custom
                </span>
              )}
            </div>

            <div className="space-y-6">
              <MLSlider
                id="sim-temp"
                label="Temperature"
                value={mlSimValues.temp}
                min={0} max={50} step={0.5}
                unit="°C"
                color="#f59e0b"
                icon={<Thermometer className="w-4 h-4" />}
                onChange={v => setMLSimValues({ temp: v })}
              />
              <MLSlider
                id="sim-humidity"
                label="Humidity"
                value={mlSimValues.humidity}
                min={0} max={100} step={1}
                unit="%"
                color="#06b6d4"
                icon={<Wind className="w-4 h-4" />}
                onChange={v => setMLSimValues({ humidity: v })}
              />
              <MLSlider
                id="sim-moisture"
                label="Soil Moisture"
                value={mlSimValues.moisture}
                min={0} max={100} step={1}
                unit="%"
                color="#10b981"
                icon={<Droplets className="w-4 h-4" />}
                onChange={v => setMLSimValues({ moisture: v })}
              />
              <MLSlider
                id="sim-ph"
                label="pH Level"
                value={mlSimValues.ph}
                min={0} max={14} step={0.1}
                unit=""
                color="#a78bfa"
                icon={<Beaker className="w-4 h-4" />}
                onChange={v => setMLSimValues({ ph: v })}
              />
            </div>

            {/* Current values summary */}
            <div className="grid grid-cols-4 gap-2 mt-5 pt-4 border-t border-white/5">
              {[
                { label: 'Temp', val: `${mlSimValues.temp}°C`, color: '#f59e0b' },
                { label: 'Humidity', val: `${mlSimValues.humidity}%`, color: '#06b6d4' },
                { label: 'Moisture', val: `${mlSimValues.moisture}%`, color: '#10b981' },
                { label: 'pH', val: mlSimValues.ph.toFixed(1), color: '#a78bfa' },
              ].map(s => (
                <div key={s.label} className="text-center p-2 rounded-lg bg-white/[0.03] border border-white/5">
                  <span className="text-[9px] font-bold uppercase text-slate-500 block">{s.label}</span>
                  <span className="text-sm font-bold font-display mt-0.5 block" style={{ color: s.color }}>{s.val}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* ── SECTION 1: Prediction Summary Cards ──────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Prediction Summary</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Environmental Score */}
          <GlassCard className="flex flex-col items-center py-5 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 0%, ${envColor}22 0%, transparent 70%)` }}
            />
            <div className="relative">
              <ScoreRing value={result?.environmentalScore ?? 0} color={envColor} size={100} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-display font-extrabold text-white">
                  {result?.environmentalScore ?? '--'}
                </span>
                <span className="text-[9px] text-slate-500 uppercase font-bold">/ 100</span>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-3">Env. Score</span>
            <span className="text-sm font-bold mt-1 font-display" style={{ color: envColor }}>
              {result?.environmentClass ?? '—'}
            </span>
          </GlassCard>

          {/* Confidence Score */}
          <GlassCard className="flex flex-col items-center py-5 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 0%, rgba(167,139,250,0.2) 0%, transparent 70%)' }}
            />
            <div className="relative">
              <ScoreRing value={result?.confidence ?? 0} color="#a78bfa" size={100} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-display font-extrabold text-white">
                  {result?.confidence ?? '--'}
                </span>
                <span className="text-[9px] text-slate-500 uppercase font-bold">%</span>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-3">Confidence</span>
            <span className="text-sm font-bold mt-1 text-violet-400 font-display">
              {result ? (result.confidence >= 80 ? 'High' : result.confidence >= 60 ? 'Moderate' : 'Low') : '—'}
            </span>
          </GlassCard>

          {/* Risk Level */}
          <GlassCard className={`flex flex-col items-center justify-center py-5 relative overflow-hidden border ${riskConfig?.bgClass ?? 'border-white/5'}`}>
            {result && (
              <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 50%, ${riskConfig?.color}55 0%, transparent 70%)` }}
              />
            )}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 border ${riskConfig?.bgClass ?? 'bg-white/5 border-white/5'}`}>
              <AlertTriangle className="w-8 h-8" style={{ color: riskConfig?.color ?? '#94a3b8' }} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Risk Level</span>
            <span className="text-lg font-display font-extrabold mt-1" style={{ color: riskConfig?.color ?? '#94a3b8' }}>
              {result ? riskLabels[result.riskLevel] : '—'}
            </span>
            {result && (
              <span className="text-[10px] text-slate-500 mt-1">
                Score: {result.environmentalScore}/100
              </span>
            )}
          </GlassCard>
        </div>
      </div>

      {/* ── SECTION 2 & 3: Anomaly + Recommendations ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Anomaly Detection Panel */}
        <GlassCard className={`border ${result?.anomalyDetected ? 'border-rose-500/20' : 'border-emerald-500/15'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {result?.anomalyDetected ? (
                <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                </div>
              ) : (
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
              )}
              <h3 className="font-display font-bold text-white text-base">Anomaly Detection</h3>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${result?.anomalyDetected
              ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              }`}>
              {result?.anomalyDetected ? 'ANOMALY DETECTED' : 'ALL NORMAL'}
            </span>
          </div>

          {/* Status indicator */}
          <div className={`flex items-center gap-3 p-3 rounded-xl mb-4 ${result?.anomalyDetected
            ? 'bg-rose-500/5 border border-rose-500/15'
            : 'bg-emerald-500/5 border border-emerald-500/15'
            }`}>
            <div className={`w-3 h-3 rounded-full shrink-0 ${result?.anomalyDetected ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
              }`} />
            <span className="text-sm font-medium text-slate-300">
              {result?.anomalyDetected
                ? `${result.anomalyReasons.length} anomal${result.anomalyReasons.length === 1 ? 'y' : 'ies'} found in current readings`
                : 'All sensor readings are within safe operational parameters'}
            </span>
          </div>

          {/* Reasons list */}
          {result?.anomalyDetected && result.anomalyReasons.length > 0 ? (
            <div className="space-y-2">
              {result.anomalyReasons.map((reason, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-rose-500/5 border border-rose-500/10">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300 leading-relaxed">{reason}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500/40 mb-2" />
              <span className="text-xs text-slate-500">No anomalous conditions detected. System is operating normally.</span>
            </div>
          )}
        </GlassCard>

        {/* Recommendations Panel */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <Lightbulb className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="font-display font-bold text-white text-base">AI Recommendations</h3>
          </div>

          {result?.recommendations && result.recommendations.length > 0 ? (
            <div className="space-y-2.5">
              {result.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/5 transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[9px] font-bold text-amber-400">{i + 1}</span>
                  </div>
                  <span className="text-xs text-slate-300 leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Brain className="w-10 h-10 text-slate-700 mb-2" />
              <span className="text-xs text-slate-500">Run a prediction to generate recommendations.</span>
            </div>
          )}
        </GlassCard>
      </div>

      {/* ── SECTION 4: Trend Charts ───────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Prediction History Trends</h3>
        </div>

        {chartData.length < 2 ? (
          <GlassCard className="flex flex-col items-center justify-center py-16">
            <Brain className="w-12 h-12 text-slate-700 mb-3" />
            <p className="text-slate-500 text-sm font-medium">Collecting prediction data...</p>
            <p className="text-slate-600 text-xs mt-1">Adjust sliders or switch scenarios to build history</p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Environmental Score Trend */}
            <GlassCard>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-display font-bold text-white text-sm">Environmental Score</h4>
                <span className="text-[10px] text-slate-500 font-mono">0–100</span>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                    <defs>
                      <linearGradient id="envGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={envColor} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={envColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="label" stroke="rgba(255,255,255,0.15)" fontSize={9} tickLine={false} interval="preserveStartEnd" />
                    <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.15)" fontSize={9} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#090c15', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '11px' }}
                      labelStyle={{ color: '#9ca3af', fontSize: '10px' }}
                      itemStyle={{ color: envColor }}
                      formatter={(v: unknown) => [`${v ?? 0}/100`, 'Env Score']}
                    />
                    <Area type="monotone" dataKey="envScore" stroke={envColor} strokeWidth={2} fillOpacity={1} fill="url(#envGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Confidence Trend */}
            <GlassCard>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-display font-bold text-white text-sm">Prediction Confidence</h4>
                <span className="text-[10px] text-slate-500 font-mono">0–100%</span>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                    <defs>
                      <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="label" stroke="rgba(255,255,255,0.15)" fontSize={9} tickLine={false} interval="preserveStartEnd" />
                    <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.15)" fontSize={9} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#090c15', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '11px' }}
                      labelStyle={{ color: '#9ca3af', fontSize: '10px' }}
                      itemStyle={{ color: '#a78bfa' }}
                      formatter={(v: unknown) => [`${v ?? 0}%`, 'Confidence']}
                    />
                    <Area type="monotone" dataKey="confidence" stroke="#a78bfa" strokeWidth={2} fillOpacity={1} fill="url(#confGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>
        )}
      </div>

      {/* ── Debug info footer ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <span className="text-[10px] text-slate-600 font-mono">
          Mode: {mlMode.toUpperCase()} ·
          Predictions recorded: {historicalPredictions.length} ·
          Engine: VermIQ-ML v1.0 (client-side, no external APIs)
        </span>
        {result && (
          <span className="text-[10px] text-slate-600 font-mono">
            Last run: {new Date(result.timestamp).toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default MLAnalytics;
