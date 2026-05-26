import React from 'react';

interface StatusBadgeProps {
  status: 'online' | 'offline' | 'success' | 'warning' | 'critical' | 'info';
  label?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  className = '',
}) => {
  const config = {
    online: {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      dot: 'bg-emerald-400',
      text: 'Online',
    },
    success: {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      dot: 'bg-emerald-400',
      text: 'Ready',
    },
    offline: {
      bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
      dot: 'bg-slate-450',
      text: 'Offline',
    },
    warning: {
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      dot: 'bg-amber-400',
      text: 'Warning',
    },
    critical: {
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      dot: 'bg-rose-450',
      text: 'Critical',
    },
    info: {
      bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      dot: 'bg-cyan-400',
      text: 'Syncing',
    },
  }[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${status === 'online' || status === 'critical' ? 'animate-ping' : ''} absolute`} />
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} relative`} />
      {label || config.text}
    </span>
  );
};
export default StatusBadge;
