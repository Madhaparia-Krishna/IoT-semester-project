import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'emerald' | 'cyan' | 'rose' | 'default';
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const getHoverClass = () => {
    switch (variant) {
      case 'emerald':
        return 'glass-card hover:border-emerald-500/20';
      case 'cyan':
        return 'glass-card glass-card-cyan hover:border-cyan-500/20';
      case 'rose':
        return 'glass-card glass-card-rose hover:border-red-500/20';
      default:
        return 'glass-card';
    }
  };

  return (
    <div
      className={`rounded-2xl p-6 ${getHoverClass()} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
export default GlassCard;
