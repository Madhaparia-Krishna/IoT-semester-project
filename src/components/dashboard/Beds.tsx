import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { SIMULATED_NODES } from '../../services/simulator';
import { GlassCard } from '../ui/GlassCard';
import { StatusBadge } from '../ui/StatusBadge';
import {
  Database,
  Droplets,
  Wrench,
  RotateCcw
} from 'lucide-react';

export const Beds: React.FC = () => {
  const { telemetry, updateTelemetry, addNotification, settings } = useStore();
  const [selectedBedId, setSelectedBedId] = useState<string>(SIMULATED_NODES[0].id);
  const [wateringMap, setWateringMap] = useState<Record<string, boolean>>({});

  const activeNode = SIMULATED_NODES.find((n) => n.id === selectedBedId) || SIMULATED_NODES[0];

  // Trigger simulated watering
  const handleWatering = (nodeId: string, bedName: string) => {
    setWateringMap((prev) => ({ ...prev, [nodeId]: true }));
    addNotification(`Manual sprinkler system active for ${bedName}. Soil watering triggered.`, 'info');

    setTimeout(() => {
      // Get current telemetry and force moisture up to target optimum (e.g. 74%)
      const currentReading = telemetry[nodeId];
      if (currentReading) {
        const wateredReading = {
          ...currentReading,
          moisture: 74.2, // Boost moisture
          humidity: Math.min(95, (currentReading.humidity || 80) + 5),
          timestamp: new Date().toISOString()
        };
        updateTelemetry(nodeId, wateredReading);
      }

      setWateringMap((prev) => ({ ...prev, [nodeId]: false }));
      addNotification(`Sprinkler sequence finished for ${bedName}. Moisture stabilized at 74.2%.`, 'success');
    }, 3000);
  };

  // Trigger simulated harvest reset
  const handleHarvest = (nodeId: string, bedName: string) => {
    const currentReading = telemetry[nodeId];
    if (currentReading) {
      const resetReading = {
        ...currentReading,
        daysElapsed: 0,
        harvestStatus: 'Monitoring' as const,
        timestamp: new Date().toISOString()
      };
      updateTelemetry(nodeId, resetReading);
      addNotification(`Vermiculture Bed "${bedName}" successfully harvested! Maturation counter has been reset to Day 0.`, 'success');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="text-2xl font-bold font-display text-white">Bed Management</h2>
        <p className="text-slate-400 text-sm">Control environmental actuators and monitor composting bed cycles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Beds List Sidebar (Left 5 Cols on Widescreen) */}
        <div className="lg:col-span-5 space-y-4">
          {SIMULATED_NODES.map((node) => {
            const reading = telemetry[node.id] || { moisture: null, daysElapsed: 0, harvestStatus: 'Offline' as const, status: 'offline' as const };
            const isSelected = selectedBedId === node.id;
            const progressPercent = Math.round((reading.daysElapsed / node.maturityTotalDays) * 100);

            return (
              <div
                key={node.id}
                onClick={() => setSelectedBedId(node.id)}
                className={`p-4 rounded-2xl cursor-pointer border transition-all text-left flex items-center justify-between ${isSelected
                    ? 'bg-emerald-500/10 border-emerald-500/35 text-white shadow-[0_0_15px_rgba(16,185,129,0.08)]'
                    : 'bg-card-glass border-white/5 text-slate-400 hover:bg-white/5'
                  }`}
              >
                <div className="space-y-1 min-w-0 flex-1 pr-3">
                  <div className="flex items-center gap-2">
                    <Database className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <h4 className="font-display font-bold text-white truncate text-sm">{node.bedName}</h4>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>Node: {node.id.split('-')[2]}</span>
                    <span>•</span>
                    <span>Moisture: {reading.moisture !== null ? `${reading.moisture}%` : 'N/A'}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <StatusBadge
                    status={
                      reading.status === 'offline'
                        ? 'offline'
                        : reading.harvestStatus === 'Harvest Ready'
                          ? 'success'
                          : reading.moisture && reading.moisture < settings.moistureMin
                            ? 'critical'
                            : 'online'
                    }
                    label={reading.status === 'offline' ? 'Offline' : `${progressPercent}%`}
                    className="text-[10px]"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Bed Controls View (Right 7 Cols on Widescreen) */}
        <div className="lg:col-span-7">
          <GlassCard className="h-full flex flex-col justify-between" variant="emerald">
            <div>
              {/* Header */}
              <div className="flex justify-between items-start pb-4 border-b border-white/5 mb-6">
                <div>
                  <h3 className="font-display font-bold text-xl text-white">{activeNode.bedName}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Assigned to: <span className="font-semibold text-slate-300">{activeNode.name}</span></p>
                </div>
                <StatusBadge status={telemetry[activeNode.id]?.status === 'online' ? 'online' : 'offline'} />
              </div>

              {/* Status details */}
              {telemetry[activeNode.id]?.status === 'offline' ? (
                <div className="py-12 text-center space-y-3">
                  <Wrench className="w-12 h-12 text-slate-600 mx-auto animate-bounce" />
                  <h4 className="font-display font-semibold text-slate-350">Device is Offline</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    ESP32 node is currently unreachable. Make sure the sensor hardware is powered on and connected to the MQTT Broker.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Environmental Targets */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Moisture Guidelines</span>
                      <p className="text-sm font-semibold text-slate-200">
                        {settings.moistureMin}% - {settings.moistureMax}%
                      </p>
                      <span className="text-[10px] text-emerald-400/80">Worm optimum level</span>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Temp Guidelines</span>
                      <p className="text-sm font-semibold text-slate-200">
                        {settings.tempMin}°C - {settings.tempMax}°C
                      </p>
                      <span className="text-[10px] text-emerald-400/80">Biological breathing index</span>
                    </div>
                  </div>

                  {/* Biological maturity tracking details */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider">MATURITY COUNTER</span>
                      <span className="text-emerald-400 font-bold text-sm">
                        {telemetry[activeNode.id]?.daysElapsed} / {activeNode.maturityTotalDays} Days ({Math.round(((telemetry[activeNode.id]?.daysElapsed || 0) / activeNode.maturityTotalDays) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.round(((telemetry[activeNode.id]?.daysElapsed || 0) / activeNode.maturityTotalDays) * 100)}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      *Note: Compost cycles require standard decomposition stages to minimize pathogen loads before harvest.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions Panel */}
            {telemetry[activeNode.id]?.status === 'online' && (
              <div className="border-t border-white/5 pt-6 mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Sprinkler Action */}
                <button
                  onClick={() => handleWatering(activeNode.id, activeNode.bedName)}
                  disabled={wateringMap[activeNode.id]}
                  className="py-3 px-4 bg-cyan-500/10 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-400 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Droplets className={`w-4.5 h-4.5 ${wateringMap[activeNode.id] ? 'animate-bounce' : ''}`} />
                  {wateringMap[activeNode.id] ? 'Sprinkler Running...' : 'Activate Water Sprinkler'}
                </button>

                {/* Harvest / Reset Action */}
                <button
                  onClick={() => handleHarvest(activeNode.id, activeNode.bedName)}
                  disabled={telemetry[activeNode.id]?.harvestStatus !== 'Harvest Ready'}
                  className="py-3 px-4 bg-emerald-500 text-bg-space hover:bg-emerald-600 disabled:bg-white/5 disabled:border-white/5 disabled:text-slate-600 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-transparent"
                >
                  <RotateCcw className="w-4.5 h-4.5" />
                  Harvest & Reset Day 0
                </button>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
export default Beds;
