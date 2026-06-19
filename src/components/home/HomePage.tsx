import React from 'react';
import { Logo } from '../logo/Logo';
import { GlassCard } from '../ui/GlassCard';
import {
  Activity,
  Cpu,
  Database,
  CloudLightning,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Layers,
  Thermometer,
  Droplets,
  Wind,
  CalendarDays,
  Zap
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: 'schematic' | 'auth') => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [moisture, setMoisture] = React.useState(72.4);
  const [temp, setTemp] = React.useState(21.8);
  const [humidity, setHumidity] = React.useState(81.2);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMoisture((m) => parseFloat((m + (Math.random() - 0.5) * 0.4).toFixed(1)));
      setTemp((t) => parseFloat((t + (Math.random() - 0.5) * 0.2).toFixed(1)));
      setHumidity((h) => parseFloat((h + (Math.random() - 0.5) * 0.3).toFixed(1)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-bg-space font-sans relative overflow-hidden bg-mesh-green select-none">
      {/* Background visual glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 blur-[160px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <header className="border-b border-white/5 relative z-10 backdrop-blur-md bg-bg-space/40 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('schematic')}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all duration-300 border border-white/10 flex items-center gap-1.5 cursor-pointer text-sm"
            >
              View Schematic
              <Zap className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('auth')}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-bg-space font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-1.5 cursor-pointer text-sm"
            >
              Launch Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-xs tracking-wider uppercase">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            Next-Gen Vermiculture IoT
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1] text-glow-emerald">
            Intelligent Vermiculture Monitoring for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Smarter Harvesting</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Monitor compost health conditions in real time using ESP32 edge telemetry, MQTT queue streams, and beautiful responsive analytics. Drive worm productivity and compost yield with high-fidelity analytics.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <button
              onClick={() => onNavigate('auth')}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-bg-space font-extrabold rounded-xl transition-all duration-300 hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 cursor-pointer text-base"
            >
              Sign In to System
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('schematic')}
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/5 transition-all text-center flex items-center justify-center gap-2"
            >
              View Circuit Design
              <Zap className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hero Preview Card Stack */}
        <div className="lg:col-span-5 relative">
          <div className="absolute inset-0 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
          <GlassCard className="relative z-10 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-center mb-6">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Active Node</span>
                <h4 className="font-display font-bold text-white text-lg">ESP32-NODE-01</h4>
              </div>
              <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-emerald-400 text-xs font-bold">
                Telemetry Live
              </div>
            </div>

            {/* Live Telemetry Display */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center">
                <Droplets className="w-5 h-5 text-cyan-400 mx-auto mb-1.5" />
                <span className="text-[10px] uppercase font-bold text-slate-500">Moisture</span>
                <p className="text-lg font-display font-bold text-white text-glow-cyan">{moisture}%</p>
              </div>
              <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center">
                <Thermometer className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
                <span className="text-[10px] uppercase font-bold text-slate-500">Temp</span>
                <p className="text-lg font-display font-bold text-white">{temp}°C</p>
              </div>
              <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center">
                <Wind className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
                <span className="text-[10px] uppercase font-bold text-slate-500">Humidity</span>
                <p className="text-lg font-display font-bold text-white">{humidity}%</p>
              </div>
            </div>

            {/* Harvest Progress */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-400 flex items-center gap-1">
                  <CalendarDays className="w-3.5 h-3.5" />
                  Maturity Progress
                </span>
                <span className="text-emerald-400">48 / 60 Days (80%)</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full" style={{ width: '80%' }} />
              </div>
            </div>

            <div className="text-[11px] text-slate-500 border-t border-white/5 pt-4 flex justify-between">
              <span>MQTT Client: Connected</span>
              <span>Syncing to Firebase: 2.5s ago</span>
            </div>
          </GlassCard>
          
          {/* Decorative Float elements */}
          <div className="absolute -top-6 -right-6 p-3 bg-[#0d121f] border border-white/5 rounded-xl shadow-xl flex items-center gap-2 animate-float">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold text-slate-200">Alerts Subsystem Ready</span>
          </div>
        </div>
      </section>

      {/* System Architecture Section */}
      <section id="architecture" className="border-t border-white/5 py-24 bg-[#090b11]/60 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-glow-emerald text-white">
              End-to-End Cloud IoT Architecture
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Designed for industrial reliability. Sensors feed parameters directly from the soil into our state-of-the-art telemetry queue.
            </p>
          </div>

          {/* Interactive SVG Flow Chart */}
          <div className="max-w-4xl mx-auto p-8 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 pointer-events-none" />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 items-center text-center relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center p-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mb-4 text-emerald-400">
                  <Cpu className="w-8 h-8" />
                </div>
                <h4 className="font-display font-semibold text-white mb-1.5">ESP32 Nodes</h4>
                <p className="text-xs text-slate-400">
                  Durable environmental sensors measuring moisture & temperature.
                </p>
              </div>

              {/* Arrow 1 */}
              <div className="hidden md:flex flex-col items-center justify-center text-slate-600">
                <ChevronRight className="w-8 h-8 animate-pulse text-emerald-500" />
                <span className="text-[10px] font-bold text-slate-500">MQTT Queue</span>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center p-4">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center mb-4 text-cyan-400">
                  <Database className="w-8 h-8" />
                </div>
                <h4 className="font-display font-semibold text-white mb-1.5">Firebase Database</h4>
                <p className="text-xs text-slate-400">
                  Secure Firestore data storage with dynamic sync and authentication.
                </p>
              </div>

              {/* Arrow 2 */}
              <div className="hidden md:flex flex-col items-center justify-center text-slate-600">
                <ChevronRight className="w-8 h-8 animate-pulse text-cyan-500" />
                <span className="text-[10px] font-bold text-slate-500">Websockets</span>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center p-4 col-span-1">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center mb-4 text-purple-400">
                  <Layers className="w-8 h-8" />
                </div>
                <h4 className="font-display font-semibold text-white mb-1.5">VermIQ Dashboard</h4>
                <p className="text-xs text-slate-400">
                  Premium frontend console rendering charts & threshold warnings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Designed for Agronomic Operations
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            VermIQ-Lite ensures optimal environmental conditions for compost worm species (Eisenia fetida) to maximize casting production.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <GlassCard>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 text-cyan-400">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-3">Real-time Moisture Gauges</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Worms require 60%–80% moisture to breathe. VermIQ triggers instant alerts if soil conditions become dangerously dry or waterlogged.
            </p>
          </GlassCard>

          <GlassCard>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 text-amber-400">
              <Thermometer className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-3">Microclimate Stability</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Maintains vermiculture heat mapping. Detects aerobic compost flares that raise temperatures beyond safe limits (15°C - 28°C range).
            </p>
          </GlassCard>

          <GlassCard>
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-3">Instant Incident Alerts</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              A built-in event notification registry flags telemetry limits, offline ESP32 nodes, or MQTT connectivity drops.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* ThingSpeak & Integration CTA */}
      <section className="bg-[#090b11]/80 py-20 border-t border-b border-white/5 relative z-10 text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          <CloudLightning className="w-12 h-12 text-cyan-400 mx-auto animate-pulse" />
          <h2 className="font-display text-3xl font-extrabold text-white">ThingSpeak & Cloud Sync Integration</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Expose read feeds, load secondary data charts, or export raw telemetry tables in CSV/JSON formats for offline analysis.
          </p>
          <div className="pt-4">
            <button
              onClick={() => onNavigate('auth')}
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-bg-space font-extrabold rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] inline-flex items-center gap-2 cursor-pointer text-sm"
            >
              Sign In to Your Station
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 relative z-10 bg-bg-space text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="sm" />
          <div>© {new Date().getFullYear()} VermIQ-Lite. Smart Agritech Environmental Systems.</div>
          <div className="flex gap-4">
            <span className="hover:text-white transition-colors cursor-pointer">Security</span>
            <span className="hover:text-white transition-colors cursor-pointer">API Specs</span>
            <span className="hover:text-white transition-colors cursor-pointer">Documentation</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
