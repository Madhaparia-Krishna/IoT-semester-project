import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { authService } from '../../services/firebase';
import { Logo } from '../logo/Logo';
import { Mail, Lock, User, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export const AuthManager: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { setUser, addNotification } = useStore();

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const session = await authService.login(email, password);
        setUser(session);
        addNotification(`Welcome back, ${session.displayName}!`, 'success');
      } else if (mode === 'signup') {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        const session = await authService.signup(email, password, name);
        setUser(session);
        addNotification(`Account created successfully. Welcome, ${name}!`, 'success');
      } else if (mode === 'forgot') {
        await authService.resetPassword(email);
        addNotification('Reset email sent! Check your inbox (or demo simulation message).', 'info');
        setMode('login');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: 'login' | 'signup' | 'forgot') => {
    setMode(newMode);
    setError(null);
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-bg-space font-sans overflow-hidden">
      {/* Brand illustration column - Left 5 cols on lg */}
      <div className="hidden lg:flex lg:col-span-5 relative items-center justify-center bg-[#090b11] border-r border-white/5 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-emerald-500/10 blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-500/10 blur-[100px] animate-pulse-slow" />
        
        {/* Pattern lines grid */}
        <div className="absolute inset-0 bg-mesh-green opacity-70" />

        <div className="relative z-10 p-12 max-w-md text-center flex flex-col items-center">
          <Logo size="xl" variant="full" className="mb-8" />
          
          <div className="w-64 h-64 relative mb-8 flex items-center justify-center">
            {/* Animated SVG Ecosystem */}
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Outer orbit */}
              <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(16, 185, 129, 0.08)" strokeWidth="1.5" strokeDasharray="6,6" className="animate-spin" style={{ animationDuration: '60s' }} />
              {/* Inner orbit */}
              <circle cx="100" cy="100" r="65" fill="none" stroke="rgba(6, 182, 212, 0.1)" strokeWidth="1" strokeDasharray="12,4" className="animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }} />
              
              {/* IoT node links */}
              <line x1="100" y1="50" x2="60" y2="120" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="2" />
              <line x1="100" y1="50" x2="140" y2="120" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="2" />
              <line x1="60" y1="120" x2="140" y2="120" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="2" />
              
              {/* Nodes */}
              <g className="animate-float">
                <circle cx="100" cy="50" r="16" fill="rgba(11, 15, 25, 0.9)" stroke="#10B981" strokeWidth="2" />
                <path d="M96 46 H104 M100 42 V50" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="100" cy="50" r="2" fill="#10B981" />
              </g>

              <g className="animate-float" style={{ animationDelay: '2s' }}>
                <circle cx="60" cy="120" r="16" fill="rgba(11, 15, 25, 0.9)" stroke="#06B6D4" strokeWidth="2" />
                {/* Water drop icon */}
                <path d="M60 112 Q65 120 60 125 Q55 120 60 112 Z" fill="none" stroke="#06B6D4" strokeWidth="1.5" />
              </g>

              <g className="animate-float" style={{ animationDelay: '4s' }}>
                <circle cx="140" cy="120" r="16" fill="rgba(11, 15, 25, 0.9)" stroke="#F59E0B" strokeWidth="2" />
                {/* Temp icon */}
                <path d="M140 112 V124 M137 122 H143" stroke="#F59E0B" strokeWidth="1.5" />
              </g>
            </svg>
          </div>

          <h3 className="font-display text-xl font-semibold mb-3 text-white">Smart Vermiculture IoT</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Monitor soil moisture, temperature anomalies, and compost maturity levels in real time via ESP32 telemetry nodes.
          </p>
        </div>
        
        {/* Footer info */}
        <div className="absolute bottom-6 left-6 right-6 text-center text-xs text-slate-600">
          VermIQ-Lite Enterprise Cloud v1.0.0
        </div>
      </div>

      {/* Form column - Right 7 cols on lg */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-between p-8 sm:p-12 md:p-16 lg:p-20 relative">
        {/* Header mobile logo */}
        <div className="flex lg:hidden justify-center mb-8">
          <Logo size="md" />
        </div>

        {/* Outer Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

        <div className="my-auto max-w-md w-full mx-auto relative z-10">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="font-display text-3xl font-bold tracking-tight text-white mb-2">
              {mode === 'login' && 'Sign in to dashboard'}
              {mode === 'signup' && 'Register your node account'}
              {mode === 'forgot' && 'Reset your password'}
            </h2>
            <p className="text-slate-400 text-sm">
              {mode === 'login' && 'Enter your operator credentials below.'}
              {mode === 'signup' && 'Create credentials to start managing beds.'}
              {mode === 'forgot' && 'We will send a reset link to your email address.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 flex items-start gap-3 text-sm animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleAction} className="space-y-5">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Mercer"
                    className="w-full pl-11 pr-4 py-3 bg-[#0d1017] border border-white/5 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@vermiq.com"
                  className="w-full pl-11 pr-4 py-3 bg-[#0d1017] border border-white/5 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-sm"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 bg-[#0d1017] border border-white/5 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-sm"
                  />
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 bg-[#0d1017] border border-white/5 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-sm"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-bg-space font-semibold rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {mode === 'login' && 'Sign In'}
                  {mode === 'signup' && 'Create Operator Account'}
                  {mode === 'forgot' && 'Send Password Reset Email'}
                </>
              )}
            </button>
          </form>

          {/* Toggle login/signup mode */}
          <div className="mt-8 text-center text-sm text-slate-400">
            {mode === 'login' && (
              <>
                Need to create an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                >
                  Register now
                </button>
              </>
            )}

            {mode === 'signup' && (
              <>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                >
                  Sign in
                </button>
              </>
            )}

            {mode === 'forgot' && (
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </button>
            )}
          </div>
          
          {mode === 'login' && (
            <div className="mt-6 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-center text-xs text-emerald-400/80">
              Demo Credentials: <span className="font-semibold text-emerald-300">demo@vermiq.com</span> / <span className="font-semibold text-emerald-300">password</span>
            </div>
          )}
        </div>

        {/* Mobile footer */}
        <div className="block lg:hidden text-center text-xs text-slate-600 mt-12">
          VermIQ-Lite Enterprise Cloud v1.0.0
        </div>
      </div>
    </div>
  );
};
export default AuthManager;
