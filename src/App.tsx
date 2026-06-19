import { useEffect, useState } from 'react';
import { useStore } from './store/useStore';
import { authService } from './services/firebase';
import HomePage from './components/home/HomePage';
import SchematicPage from './components/schematic/SchematicPage';
import PCBPage from './components/pcb/PCBPage';
import WokwiPage from './components/wokwi/WokwiPage';
import AuthManager from './components/auth/AuthManager';
import DashboardLayout from './components/dashboard/DashboardLayout';
import ToastContainer from './components/ui/ToastContainer';
import { Loader2 } from 'lucide-react';

type PageType = 'home' | 'schematic' | 'pcb' | 'wokwi' | 'dashboard';

function App() {
  const { user, setUser, authLoading, setAuthLoading, startRealtimeTelemetry } = useStore();
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  // Bind Firebase / Local Mock Auth Listener
  useEffect(() => {
    setAuthLoading(true);
    const unsubscribe = authService.onAuthStateChanged((session) => {
      setUser(session);
      setAuthLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [setUser, setAuthLoading]);

  // Start real-time telemetry subscription when user is authenticated
  useEffect(() => {
    if (user) {
      console.log('User authenticated, starting real-time telemetry...');
      const unsubscribe = startRealtimeTelemetry();
      
      return () => {
        console.log('Stopping real-time telemetry subscription...');
        unsubscribe();
      };
    }
  }, [user, startRealtimeTelemetry]);

  // Loading Screen for Authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-bg-space flex flex-col items-center justify-center font-sans">
        <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mb-4" />
        <span className="text-xs uppercase font-bold text-slate-500 tracking-widest animate-pulse">
          Initializing VermIQ Connection...
        </span>
      </div>
    );
  }

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
  };

  // Routing Flow - Show HomePage by default for everyone (authenticated or not)
  // Authenticated users can still access dashboard by navigating to it
  // Unauthenticated users see the public homepage with documentation links

  // Page routing for all users - Home as default landing page
  return (
    <>
      {currentPage === 'home' && (
        <HomePage
          onNavigate={(page) => {
            setCurrentPage(page);
          }}
        />
      )}
      {currentPage === 'schematic' && (
        <SchematicPage onNavigate={handleNavigate} />
      )}
      {currentPage === 'pcb' && (
        <PCBPage onNavigate={handleNavigate} />
      )}
      {currentPage === 'wokwi' && (
        <WokwiPage onNavigate={handleNavigate} />
      )}
      {currentPage === 'dashboard' && user && (
        <>
          <DashboardLayout onGoHome={() => setCurrentPage('home')} />
          <ToastContainer />
        </>
      )}
      {currentPage === 'dashboard' && !user && (
        <>
          <AuthManager />
          <ToastContainer />
        </>
      )}
      <ToastContainer />
    </>
  );
}

export default App;
