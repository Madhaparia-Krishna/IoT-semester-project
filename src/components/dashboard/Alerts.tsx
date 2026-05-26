import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { GlassCard } from '../ui/GlassCard';
import {
  Check,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Trash2
} from 'lucide-react';

export const Alerts: React.FC = () => {
  const { alerts, acknowledgeAlert, clearAlerts, addNotification } = useStore();
  const [filterMode, setFilterMode] = useState<'all' | 'active' | 'acknowledged'>('active');

  const filteredAlerts = alerts.filter((alert) => {
    if (filterMode === 'active') return !alert.acknowledged;
    if (filterMode === 'acknowledged') return alert.acknowledged;
    return true; // all
  });

  const getAlertConfig = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
          border: 'border-rose-500/20 bg-rose-500/5',
          text: 'text-rose-300',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
          border: 'border-amber-500/20 bg-amber-500/5',
          text: 'text-amber-300',
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
          border: 'border-emerald-500/20 bg-emerald-500/5',
          text: 'text-emerald-300',
        };
      case 'info':
      default:
        return {
          icon: <Info className="w-5 h-5 text-cyan-400 shrink-0" />,
          border: 'border-cyan-500/20 bg-cyan-500/5',
          text: 'text-cyan-300',
        };
    }
  };

  const handleAcknowledge = async (id: string) => {
    try {
      await acknowledgeAlert(id);
      addNotification('Alert acknowledged.', 'success');
    } catch (e) {
      console.error(e);
    }
  };

  const handleClear = async () => {
    if (window.confirm('Are you sure you want to clear the alert history log?')) {
      await clearAlerts();
      addNotification('All alerts cleared.', 'info');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">Alerts Center</h2>
          <p className="text-slate-400 text-sm">Review triggered threshold boundary logs and device connection events</p>
        </div>

        <div className="flex gap-4 items-center w-full sm:w-auto">
          {/* Clear button */}
          {alerts.length > 0 && (
            <button
              onClick={handleClear}
              className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Log
            </button>
          )}

          {/* Tab filter toggler */}
          <div className="flex gap-1.5 p-1 rounded-xl bg-white/5 border border-white/5 w-full sm:w-auto justify-center">
            {(['active', 'acknowledged', 'all'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  filterMode === mode ? 'bg-emerald-500 text-bg-space font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {mode === 'active' ? 'Active' : mode === 'acknowledged' ? 'Resolved' : 'All'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts log listing */}
      <GlassCard>
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
              <Check className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-white">All Systems Nominal</h4>
              <p className="text-xs text-slate-500 mt-0.5">No logged events found matching your active filter.</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredAlerts.map((alert) => {
              const config = getAlertConfig(alert.severity);
              return (
                <div
                  key={alert.id}
                  className={`py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors ${
                    alert.acknowledged ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex gap-3.5 items-start">
                    <div className="mt-0.5">{config.icon}</div>
                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-display font-bold text-white text-sm">{alert.bedName}</h4>
                        <span className="text-[10px] uppercase font-bold text-slate-500">
                          {alert.nodeId.split('-')[2]}
                        </span>
                        <span className="text-[10px] text-slate-600">
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className={`text-xs ${config.text} font-medium leading-relaxed`}>{alert.message}</p>
                    </div>
                  </div>

                  <div className="shrink-0 pl-8 sm:pl-0">
                    {alert.acknowledged ? (
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                        Acknowledged
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        className="py-1.5 px-3 bg-emerald-500 hover:bg-emerald-600 text-bg-space font-bold rounded-lg text-xs flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Acknowledge
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>
    </div>
  );
};
export default Alerts;
