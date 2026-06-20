import React from 'react';
import { useStore } from '../../store/useStore';
import { SIMULATED_NODES } from '../../services/simulator';
import { GlassCard } from '../ui/GlassCard';
import { StatusBadge } from '../ui/StatusBadge';
import {
  Cpu,
  Wifi,
  Battery,
  Activity,
  Network
} from 'lucide-react';

export const Nodes: React.FC = () => {
  const { telemetry } = useStore();

  const getRssiLabel = (rssi: number) => {
    if (rssi > -60) return { label: 'Excellent', color: 'text-emerald-400' };
    if (rssi > -75) return { label: 'Good', color: 'text-cyan-400' };
    if (rssi > -88) return { label: 'Fair', color: 'text-amber-400' };
    return { label: 'Weak', color: 'text-rose-450' };
  };

  const getRssiWifiBars = (rssi: number) => {
    if (rssi === -100) return 0;
    if (rssi > -60) return 4;
    if (rssi > -72) return 3;
    if (rssi > -83) return 2;
    return 1;
  };

  const getBatteryPercent = (volts: number) => {
    if (volts <= 0) return 0;
    // Map lithium cell voltage: 3.4V (empty) to 4.2V (full)
    const pct = Math.round(((volts - 3.4) / (4.2 - 3.4)) * 100);
    return Math.max(0, Math.min(100, pct));
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="text-2xl font-bold font-display text-white">ESP32 Hardware Registry</h2>
        <p className="text-slate-400 text-sm">Monitor edge microcontroller battery voltages, RSSI links, and data publish frequencies</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SIMULATED_NODES.map((node) => {
          const reading = telemetry[node.id] || {
            moisture: null,
            temperature: null,
            humidity: null,
            status: 'offline' as const,
            rssi: -100,
            battery: 0
          };

          const isOnline = reading.status === 'online';
          const rssiInfo = getRssiLabel(reading.rssi);
          const wifiBars = getRssiWifiBars(reading.rssi);
          const batteryPct = getBatteryPercent(reading.battery);

          return (
            <GlassCard key={node.id} variant={isOnline ? 'default' : 'default'} className={!isOnline ? 'opacity-70' : ''}>
              <div className="flex justify-between items-start pb-4 border-b border-white/5 mb-4">
                <div className="flex gap-3 items-center">
                  <div className={`p-2.5 rounded-xl border ${isOnline ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' : 'bg-slate-500/10 border-slate-500/25 text-slate-500'}`}>
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-display font-bold text-white text-sm">{node.name}</h4>
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">{node.id}</span>
                  </div>
                </div>

                <StatusBadge status={isOnline ? 'online' : 'offline'} />
              </div>

              {/* Node Specifications Details */}
              <div className="space-y-4 text-xs">
                {/* Bed allocation */}
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Allocated Area</span>
                  <span className="font-semibold text-slate-350">{node.bedName}</span>
                </div>

                {isOnline ? (
                  <>
                    {/* Wi-Fi RSSI */}
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Wifi className="w-4 h-4 text-slate-500" />
                        Wi-Fi Connection
                      </span>
                      <div className="flex items-center gap-2">
                        {/* Custom Signal bars representation */}
                        <div className="flex gap-0.5 h-3.5 items-end">
                          {[1, 2, 3, 4].map((bar) => (
                            <span
                              key={bar}
                              className={`w-1 rounded-t-sm transition-colors ${bar <= wifiBars
                                  ? 'bg-emerald-400'
                                  : 'bg-white/5'
                                }`}
                              style={{ height: `${bar * 25}%` }}
                            />
                          ))}
                        </div>
                        <span className={`font-semibold ${rssiInfo.color}`}>
                          {reading.rssi} dBm ({rssiInfo.label})
                        </span>
                      </div>
                    </div>

                    {/* Battery Indicator */}
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Battery className="w-4 h-4 text-slate-500" />
                        Lipo Voltage (Battery)
                      </span>
                      <div className="flex items-center gap-2">
                        {/* Visual Battery Shell */}
                        <div className="w-7 h-3.5 border border-slate-500 rounded-sm p-0.5 relative flex items-center">
                          <div
                            className={`h-full rounded-2xs ${batteryPct > 50
                                ? 'bg-emerald-400'
                                : batteryPct > 20
                                  ? 'bg-amber-400'
                                  : 'bg-rose-400 animate-pulse'
                              }`}
                            style={{ width: `${batteryPct}%` }}
                          />
                          <span className="w-0.5 h-1.5 bg-slate-500 rounded-r-xs absolute -right-1" />
                        </div>
                        <span className="font-semibold text-slate-200">
                          {reading.battery} V ({batteryPct}%)
                        </span>
                      </div>
                    </div>

                    {/* Publishing rates */}
                    <div className="flex justify-between items-center py-1 border-t border-white/5 pt-3">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Activity className="w-4 h-4 text-slate-500" />
                        Publish Frequency
                      </span>
                      <span className="font-semibold text-slate-200">Every 2.5s (Simulation)</span>
                    </div>

                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Network className="w-4 h-4 text-slate-500" />
                        Protocol Queue
                      </span>
                      <span className="font-semibold text-slate-200">MQTT over WebSockets</span>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3 border-t border-white/5 pt-4 mt-2">
                    <div className="py-4 text-center text-slate-500">
                      Heartbeat signal timeout. No packet received.
                    </div>
                    {reading.lastOnline && (
                      <div className="flex justify-between items-center py-1 text-xs">
                        <span className="text-slate-500">Last Online</span>
                        <span className="font-semibold text-slate-400">
                          {new Date(reading.lastOnline).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
export default Nodes;
