import { useEffect, useState } from 'react';
import { useStore } from './store/useStore';
import { authService } from './services/firebase';
import LandingPage from './components/landing/LandingPage';
import AuthManager from './components/auth/AuthManager';
import DashboardLayout from './components/dashboard/DashboardLayout';
import ToastContainer from './components/ui/ToastContainer';
import { Loader2 } from 'lucide-react';

function App() {
  const { user, setUser, authLoading, setAuthLoading } = useStore();
  const [showAuth, setShowAuth] = useState(false);

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

  // Routing Flow
  if (user) {
    return (
      <>
        <DashboardLayout />
        <ToastContainer />
      </>
    );
  }

  if (showAuth) {
    return (
      <>
        <AuthManager />
        <ToastContainer />
      </>
    );
  }

  return (
    <>
      <LandingPage onStart={() => setShowAuth(true)} />
      <ToastContainer />
    </>
  );
}

export default App;
