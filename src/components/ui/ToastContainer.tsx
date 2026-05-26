import React from 'react';
import { useStore } from '../../store/useStore';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 w-full max-w-md pointer-events-none">
      {notifications.map((notif) => {
        const config = {
          critical: {
            bg: 'bg-red-950/80 border-red-500/35 text-red-200 shadow-red-950/20',
            glow: 'shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)]',
            icon: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
          },
          warning: {
            bg: 'bg-amber-950/80 border-amber-500/35 text-amber-200 shadow-amber-950/20',
            glow: 'shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)]',
            icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
          },
          success: {
            bg: 'bg-emerald-950/80 border-emerald-500/35 text-emerald-200 shadow-emerald-950/20',
            glow: 'shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]',
            icon: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
          },
          info: {
            bg: 'bg-cyan-950/80 border-cyan-500/35 text-cyan-200 shadow-cyan-950/20',
            glow: 'shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)]',
            icon: <Info className="w-5 h-5 text-cyan-400 shrink-0" />,
          },
        }[notif.type] || {
          bg: 'bg-slate-900/80 border-slate-700/50 text-slate-200',
          glow: '',
          icon: <Info className="w-5 h-5 text-slate-400 shrink-0" />,
        };

        return (
          <div
            key={notif.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md transition-all duration-300 transform translate-x-0 ${config.bg} ${config.glow}`}
            role="alert"
          >
            {config.icon}
            <div className="flex-1 text-sm font-medium pr-2 leading-relaxed">
              {notif.message}
            </div>
            <button
              onClick={() => removeNotification(notif.id)}
              className="text-slate-400 hover:text-white transition-colors p-0.5 rounded-lg hover:bg-white/5 shrink-0"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
export default ToastContainer;
