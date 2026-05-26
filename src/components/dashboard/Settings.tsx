import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { getSavedFirebaseConfig, saveFirebaseConfig } from '../../services/firebase';
import type { FirebaseConfigSchema } from '../../services/firebase';
import { GlassCard } from '../ui/GlassCard';
import { StatusBadge } from '../ui/StatusBadge';
import {
  Sliders,
  Database,
  CloudLightning,
  User,
  Save,
  AlertTriangle
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, addNotification, reconnectFirebase, firebaseConnected } = useStore();

  // Firebase forms state
  const [fbConfig, setFbConfig] = useState<FirebaseConfigSchema>(
    getSavedFirebaseConfig() || {
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
    }
  );

  // Profile preferences
  const [profileName, setProfileName] = useState('Operator Alpha');
  const [profileEmail] = useState('demo@vermiq.com');

  // Soil settings inputs
  const [moistureMin, setMoistureMin] = useState(settings.moistureMin);
  const [moistureMax, setMoistureMax] = useState(settings.moistureMax);
  const [tempMin, setTempMin] = useState(settings.tempMin);
  const [tempMax, setTempMax] = useState(settings.tempMax);

  // ThingSpeak settings inputs
  const [tsChannelId, setTsChannelId] = useState(settings.thingSpeakChannelId);
  const [tsApiKey, setTsApiKey] = useState(settings.thingSpeakApiKey);

  const handleSaveThresholds = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      moistureMin,
      moistureMax,
      tempMin,
      tempMax,
    });
    addNotification('Soil environmental thresholds updated successfully.', 'success');
  };

  const handleSaveFirebase = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate if keys have length
    if (!fbConfig.apiKey || !fbConfig.projectId || !fbConfig.appId) {
      if (fbConfig.apiKey === '') {
        // Clearing config to return to mock mode
        saveFirebaseConfig(null);
        reconnectFirebase();
        addNotification('Firebase credentials cleared. Switched back to Simulator Mode.', 'info');
        return;
      }
      addNotification('Firebase configuration requires at least an API Key, Project ID, and App ID.', 'warning');
      return;
    }

    saveFirebaseConfig(fbConfig);
    reconnectFirebase();
    addNotification('Firebase configurations saved. System attempting sync connection...', 'success');
  };

  const handleSaveThingSpeak = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      thingSpeakChannelId: tsChannelId,
      thingSpeakApiKey: tsApiKey
    });
    addNotification('ThingSpeak API synchronization preferences saved.', 'success');
  };

  return (
    <div className="space-y-6 font-sans pb-12">
      <div>
        <h2 className="text-2xl font-bold font-display text-white">System Settings</h2>
        <p className="text-slate-400 text-sm">Configure agronomic limits, database brokers, and API channels</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Environmental thresholds and Cloud configs */}
        <div className="lg:col-span-8 space-y-6">
          {/* Thresholds Form */}
          <GlassCard variant="emerald">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-2.5 items-center">
                <Sliders className="w-5 h-5 text-emerald-400" />
                <h3 className="font-display font-bold text-white text-base">Agronomic Alert Thresholds</h3>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Limits Trigger</span>
            </div>

            <form onSubmit={handleSaveThresholds} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Moisture Limits */}
                <div className="space-y-3 p-3 bg-white/5 border border-white/5 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Soil Moisture Bounds</span>
                  <div className="flex justify-between text-xs">
                    <label className="text-slate-400">Min moisture limit: <span className="font-bold text-white">{moistureMin}%</span></label>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="70"
                    value={moistureMin}
                    onChange={(e) => setMoistureMin(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-xs pt-1">
                    <label className="text-slate-400">Max moisture limit: <span className="font-bold text-white">{moistureMax}%</span></label>
                  </div>
                  <input
                    type="range"
                    min="75"
                    max="95"
                    value={moistureMax}
                    onChange={(e) => setMoistureMax(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                {/* Temperature Limits */}
                <div className="space-y-3 p-3 bg-white/5 border border-white/5 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Temperature Limits</span>
                  <div className="flex justify-between text-xs">
                    <label className="text-slate-400">Min temp limit: <span className="font-bold text-white">{tempMin}°C</span></label>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="20"
                    value={tempMin}
                    onChange={(e) => setTempMin(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-xs pt-1">
                    <label className="text-slate-400">Max temp limit: <span className="font-bold text-white">{tempMax}°C</span></label>
                  </div>
                  <input
                    type="range"
                    min="22"
                    max="40"
                    value={tempMax}
                    onChange={(e) => setTempMax(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-bg-space font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Soil Thresholds
                </button>
              </div>
            </form>
          </GlassCard>

          {/* Firebase Configuration Form */}
          <GlassCard>
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-2.5 items-center">
                <Database className="w-5 h-5 text-emerald-400" />
                <h3 className="font-display font-bold text-white text-base">Firebase Cloud Credentials</h3>
              </div>
              <StatusBadge status={firebaseConnected ? 'online' : 'offline'} label={firebaseConnected ? 'Linked' : 'Simulator Mode'} />
            </div>

            <form onSubmit={handleSaveFirebase} className="space-y-4">
              <div className="p-3 bg-amber-500/5 border border-amber-500/15 text-amber-400 rounded-xl text-xs leading-relaxed flex gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  To link a production IoT station: enter your Web App Firebase config credentials.
                  To revert back to simulated Demo Mode, clear the API Key field and click Save.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Firebase API Key</label>
                  <input
                    type="password"
                    value={fbConfig.apiKey}
                    onChange={(e) => setFbConfig({ ...fbConfig, apiKey: e.target.value })}
                    placeholder="AIzaSyA..."
                    className="w-full px-3.5 py-2.5 bg-[#0d1017] border border-white/5 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Auth Domain</label>
                  <input
                    type="text"
                    value={fbConfig.authDomain}
                    onChange={(e) => setFbConfig({ ...fbConfig, authDomain: e.target.value })}
                    placeholder="vermiq-project.firebaseapp.com"
                    className="w-full px-3.5 py-2.5 bg-[#0d1017] border border-white/5 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Project ID</label>
                  <input
                    type="text"
                    value={fbConfig.projectId}
                    onChange={(e) => setFbConfig({ ...fbConfig, projectId: e.target.value })}
                    placeholder="vermiq-project"
                    className="w-full px-3.5 py-2.5 bg-[#0d1017] border border-white/5 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">App ID</label>
                  <input
                    type="text"
                    value={fbConfig.appId}
                    onChange={(e) => setFbConfig({ ...fbConfig, appId: e.target.value })}
                    placeholder="1:123456:web:abcd"
                    className="w-full px-3.5 py-2.5 bg-[#0d1017] border border-white/5 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500/40"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-bg-space font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Cloud Configuration
                </button>
              </div>
            </form>
          </GlassCard>
        </div>

        {/* Right Column (4 cols): User Profile & ThingSpeak API */}
        <div className="lg:col-span-4 space-y-6">
          {/* User profile details */}
          <GlassCard>
            <div className="flex items-center gap-2.5 mb-6">
              <User className="w-5 h-5 text-emerald-400" />
              <h3 className="font-display font-bold text-white text-base">Operator Profile</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col items-center pb-4 border-b border-white/5">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold font-display text-2xl uppercase mb-2">
                  OP
                </div>
                <span className="text-xs text-slate-500 uppercase tracking-widest">Active Session Operator</span>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Operator Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0d1017] border border-white/5 rounded-xl text-white text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Email Address</label>
                <input
                  type="text"
                  disabled
                  value={profileEmail}
                  className="w-full px-3.5 py-2.5 bg-[#0d1017] border border-white/5 rounded-xl text-slate-500 text-xs focus:outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </GlassCard>

          {/* ThingSpeak API panel */}
          <GlassCard variant="cyan">
            <div className="flex gap-2.5 items-center mb-6">
              <CloudLightning className="w-5 h-5 text-cyan-400" />
              <h3 className="font-display font-bold text-white text-base">ThingSpeak Sync</h3>
            </div>

            <form onSubmit={handleSaveThingSpeak} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Channel ID</label>
                <input
                  type="text"
                  value={tsChannelId}
                  onChange={(e) => setTsChannelId(e.target.value)}
                  placeholder="2456789"
                  className="w-full px-3.5 py-2.5 bg-[#0d1017] border border-white/5 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Read API Key</label>
                <input
                  type="password"
                  value={tsApiKey}
                  onChange={(e) => setTsApiKey(e.target.value)}
                  placeholder="X1Y2Z3A4B5C6..."
                  className="w-full px-3.5 py-2.5 bg-[#0d1017] border border-white/5 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500/40"
                />
              </div>

              {tsChannelId && (
                <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-[10px] space-y-1">
                  <span className="text-slate-450 font-bold block">Embedded Source URL:</span>
                  <code className="text-cyan-400 break-all">
                    https://thingspeak.com/channels/{tsChannelId}/charts/1
                  </code>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-600 text-bg-space font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                Sync ThingSpeak API
              </button>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
