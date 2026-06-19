import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { SIMULATED_NODES, generateTelemetry } from '../../services/simulator';
import { Logo } from '../logo/Logo';
import {
  LayoutDashboard,
  Database,
  LineChart,
  Bell,
  Cpu,
  History,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Search,
  RefreshCw,
  AlertCircle,
  Brain
} from 'lucide-react';

// Subcomponents to be loaded
import { Overview } from './Overview';
import { Beds } from './Beds';
import { Analytics } from './Analytics';
import { Alerts } from './Alerts';
import { Nodes } from './Nodes';
import { HistoryData } from './History';
import { SettingsPage } from './Settings';
import { MLAnalytics } from './MLAnalytics';

export const DashboardLayout: React.FC<{ onGoHome?: () => void }> = ({ onGoHome }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'beds' | 'analytics' | 'alerts' | 'nodes' | 'history' | 'settings' | 'ml-analytics'>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    user,
    setUser,
    updateTelemetry,
    alerts,
    firebaseConnected,
    realtimeDataMode,
    addNotification
  } = useStore();

  // 1. TELEMETRY SIMULATOR EVENT LOOP (Ticking every 2.5s)
  // Only run simulator if NOT using real-time data from Firebase
  useEffect(() => {
    if (realtimeDataMode) {
      console.log('Using real-time Firebase data, simulator disabled');
      return;
    }

    console.log('Using simulated data mode');
    
    // Immediate initial tick
    SIMULATED_NODES.forEach((node) => {
      const data = generateTelemetry(node);
      updateTelemetry(node.id, data);
    });

    const interval = setInterval(() => {
      SIMULATED_NODES.forEach((node) => {
        const data = generateTelemetry(node);
        updateTelemetry(node.id, data);
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [updateTelemetry, realtimeDataMode]);

  // 2. DB FIRESTORE ALERTS SYNC (Disabled for now)
  // useEffect(() => {
  //   const unsubscribe = dbService.subscribeToAlerts((dbAlerts) => {
  //     useStore.setState({ alerts: dbAlerts });
  //   });
  //   return () => unsubscribe();
  // }, []);

  const handleLogout = () => {
    setUser(null);
    addNotification('Successfully logged out.', 'info');
  };

  const activeAlertsCount = alerts.filter(a => !a.acknowledged).length;

  const renderContent = () => {
    switch (activeTab) {
      case 'beds':
        return <Beds />;
      case 'analytics':
        return <Analytics />;
      case 'alerts':
        return <Alerts />;
      case 'nodes':
        return <Nodes />;
      case 'history':
        return <HistoryData />;
      case 'settings':
        return <SettingsPage />;
      case 'ml-analytics':
        return <MLAnalytics />;
      case 'overview':
      default:
        return <Overview setActiveTab={setActiveTab} />;
    }
  };

  const menuItems = [
    { id: 'overview', name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'beds', name: 'Beds', icon: <Database className="w-5 h-5" /> },
    { id: 'analytics', name: 'Analytics', icon: <LineChart className="w-5 h-5" /> },
    { id: 'ml-analytics', name: 'Machine Learning', icon: <Brain className="w-5 h-5" /> },
    { id: 'alerts', name: 'Alerts', icon: (
      <div className="relative">
        <Bell className="w-5 h-5" />
        {activeAlertsCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 rounded-full text-[9px] flex items-center justify-center text-white font-bold animate-pulse">
            {activeAlertsCount}
          </span>
        )}
      </div>
    ) },
    { id: 'nodes', name: 'Nodes', icon: <Cpu className="w-5 h-5" /> },
    { id: 'history', name: 'Historical Data', icon: <History className="w-5 h-5" /> },
    { id: 'settings', name: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-bg-space font-sans text-slate-100 flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 glass-panel border-r border-white/5 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="h-20 px-6 border-b border-white/5 flex items-center justify-between">
            <Logo size="md" />
            <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar Profile / Logout */}
        <div className="p-4 border-t border-white/5 space-y-2 bg-black/10">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold font-display uppercase">
              {user?.displayName ? user.displayName.substring(0, 2) : 'OP'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-white">{user?.displayName || 'Operator'}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{user?.role || 'operator'} {user?.isMock && '(Demo)'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 rounded-xl text-sm font-medium transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative h-screen">
        {/* Decorative Grid Mesh */}
        <div className="absolute inset-0 bg-mesh-green opacity-40 pointer-events-none" />

        {/* TOPBAR */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 sticky top-0 bg-bg-space/80 backdrop-blur-md z-30 pt-4">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-slate-400 hover:text-white cursor-pointer" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Home Button */}
            {onGoHome && (
              <button
                onClick={onGoHome}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white rounded-xl text-sm font-semibold transition-all cursor-pointer"
                title="Go back to home page"
              >
                ← Home
              </button>
            )}
            
            {/* Search Input Mock */}
            <div className="relative hidden md:block w-64">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bed telemetry..."
                className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/5 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/40 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
            {/* Connection Sync Indicator */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
              realtimeDataMode 
                ? 'bg-emerald-500/10 border-emerald-500/20' 
                : firebaseConnected 
                ? 'bg-cyan-500/10 border-cyan-500/20' 
                : 'bg-slate-500/10 border-slate-500/20'
            }`}>
              {realtimeDataMode ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '2s' }} />
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                    Real-Time Data
                  </span>
                </>
              ) : firebaseConnected ? (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wide">
                    Firebase Connected
                  </span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-slate-400 animate-spin" style={{ animationDuration: '4s' }} />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Demo Mode Sim
                  </span>
                </>
              )}
            </div>

            {/* Notifications Dropdown Toggle */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  notificationsOpen
                    ? 'bg-white/10 border-white/10 text-white'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                }`}
                aria-label="Toggle notifications"
              >
                <Bell className="w-5 h-5" />
                {activeAlertsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full" />
                )}
              </button>

              {/* Notification Drawer */}
              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-3 w-80 rounded-2xl glass-panel border border-white/10 shadow-2xl z-50 p-4 animate-float">
                    <div className="flex justify-between items-center pb-3 border-b border-white/5 mb-3">
                      <h4 className="font-display font-semibold text-sm text-white">Active Alerts</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold">
                        {activeAlertsCount} Unread
                      </span>
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {alerts.filter(a => !a.acknowledged).length === 0 ? (
                        <div className="text-center py-6 text-xs text-slate-500">
                          All systems normal. No active alerts.
                        </div>
                      ) : (
                        alerts.filter(a => !a.acknowledged).map((alert) => (
                          <div key={alert.id} className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex gap-2.5 items-start text-xs">
                            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-200">{alert.bedName}</p>
                              <p className="text-slate-400 leading-tight mt-0.5">{alert.message}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('alerts');
                        setNotificationsOpen(false);
                      }}
                      className="w-full mt-3 py-2 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer text-center block"
                    >
                      View All in Alerts Center
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Operator Quick Stats */}
            <div className="flex items-center gap-2 border-l border-white/5 pl-4">
              <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm font-semibold">
                <User className="w-4 h-4" />
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <div className="flex-1 p-6 relative z-10">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
export default DashboardLayout;
