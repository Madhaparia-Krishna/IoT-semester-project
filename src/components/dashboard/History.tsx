import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { SIMULATED_NODES } from '../../services/simulator';
import { GlassCard } from '../ui/GlassCard';
import { Download, FileJson, Filter } from 'lucide-react';

export const HistoryData: React.FC = () => {
  const { history } = useStore();
  const [selectedNodeId, setSelectedNodeId] = useState<string>(SIMULATED_NODES[0].id);

  const logs = history[selectedNodeId] || [];

  // Helper to convert array of telemetry reading to CSV and trigger download
  const handleExportCSV = () => {
    if (logs.length === 0) return;

    const headers = ['Timestamp', 'Moisture (%)', 'Temperature (°C)', 'Humidity (%)', 'Status', 'RSSI (dBm)', 'Battery (V)'];
    const rows = logs.map((log) => [
      log.timestamp,
      log.moisture ?? 'N/A',
      log.temperature ?? 'N/A',
      log.humidity ?? 'N/A',
      log.status,
      log.rssi,
      log.battery
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vermiq_telemetry_${selectedNodeId}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to convert array of telemetry reading to JSON and trigger download
  const handleExportJSON = () => {
    if (logs.length === 0) return;

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `vermiq_telemetry_${selectedNodeId}_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">Historical Logs</h2>
          <p className="text-slate-400 text-sm">Download offline datasets and search historical telemetry points</p>
        </div>

        {/* Exporters */}
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            disabled={logs.length === 0}
            className="flex-1 sm:flex-initial py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-bg-space font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          
          <button
            onClick={handleExportJSON}
            disabled={logs.length === 0}
            className="flex-1 sm:flex-initial py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-350 hover:text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <FileJson className="w-3.5 h-3.5" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Selector Filters */}
      <GlassCard className="py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter Bed:
          </span>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {SIMULATED_NODES.map((node) => (
              <button
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedNodeId === node.id
                    ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400 font-bold'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {node.bedName}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Logs Table Grid */}
      <GlassCard className="overflow-x-auto p-0 border-white/5">
        {logs.length === 0 ? (
          <div className="text-center py-16 text-xs text-slate-500">
            No historical logs compiled yet.
          </div>
        ) : (
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead>
              <tr className="border-b border-white/5 text-slate-500 font-bold uppercase tracking-wider bg-white/[0.01]">
                <th className="py-4 px-6">Timestamp</th>
                <th className="py-4 px-6 text-center">Moisture (%)</th>
                <th className="py-4 px-6 text-center">Temperature (°C)</th>
                <th className="py-4 px-6 text-center">Humidity (%)</th>
                <th className="py-4 px-6 text-center">Uptime status</th>
                <th className="py-4 px-6 text-center">Link Signal (RSSI)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-slate-350">
              {logs.map((log, index) => (
                <tr key={index} className="hover:bg-white/[0.01] transition-colors">
                  <td className="py-3.5 px-6 font-sans text-slate-200">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className={`py-3.5 px-6 text-center font-bold ${log.moisture ? 'text-cyan-400' : 'text-slate-600'}`}>
                    {log.moisture !== null ? `${log.moisture}%` : 'N/A'}
                  </td>
                  <td className={`py-3.5 px-6 text-center font-bold ${log.temperature ? 'text-amber-500' : 'text-slate-600'}`}>
                    {log.temperature !== null ? `${log.temperature}°C` : 'N/A'}
                  </td>
                  <td className={`py-3.5 px-6 text-center ${log.humidity ? 'text-emerald-400' : 'text-slate-600'}`}>
                    {log.humidity !== null ? `${log.humidity}%` : 'N/A'}
                  </td>
                  <td className="py-3.5 px-6 text-center font-sans">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                      log.status === 'online'
                        ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400'
                        : 'bg-slate-500/5 border-slate-500/10 text-slate-400'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-center">
                    {log.rssi} dBm
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </GlassCard>
    </div>
  );
};
export default HistoryData;
