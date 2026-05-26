import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon' | 'monochrome';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  animated = true,
}) => {
  const getDimensions = () => {
    switch (size) {
      case 'xs':
        return { width: 'w-5', height: 'h-5', text: 'text-sm' };
      case 'sm':
        return { width: 'w-6', height: 'h-6', text: 'text-lg' };
      case 'lg':
        return { width: 'w-12', height: 'h-12', text: 'text-3xl' };
      case 'xl':
        return { width: 'w-20', height: 'h-20', text: 'text-5xl' };
      case 'md':
      default:
        return { width: 'w-8', height: 'h-8', text: 'text-2xl' };
    }
  };

  const dim = getDimensions();

  const svgIcon = (
    <svg
      viewBox="0 0 100 100"
      className={`${dim.width} ${dim.height} ${animated ? 'transition-transform duration-300 hover:scale-105' : ''}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer glow effect */}
      {animated && variant !== 'monochrome' && (
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="url(#glowGradient)"
          opacity="0.1"
          className="animate-pulse"
        />
      )}
      
      {/* Circuit Nodes / Connections - Leaf Shape */}
      <path
        d="M 50 15 C 50 15 20 40 20 65 C 20 80 35 90 50 90 C 65 90 80 80 80 65 C 80 40 50 15 50 15 Z"
        stroke={variant === 'monochrome' ? 'currentColor' : '#10B981'}
        strokeWidth="4"
        strokeLinecap="round"
        fill={variant === 'monochrome' ? 'transparent' : 'rgba(16, 185, 129, 0.05)'}
      />
      
      {/* Leaf / Circuit Vein 1 - Main stem */}
      <path
        d="M 50 90 V 25"
        stroke={variant === 'monochrome' ? 'currentColor' : '#059669'}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Leaf / Circuit Vein 2 (Left Branch) */}
      <path
        d="M 50 70 Q 32 60 25 50"
        stroke={variant === 'monochrome' ? 'currentColor' : '#06B6D4'}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Leaf / Circuit Vein 3 (Right Branch) */}
      <path
        d="M 50 55 Q 68 48 72 38"
        stroke={variant === 'monochrome' ? 'currentColor' : '#34D399'}
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Node Dots (Sensor Wave Circles) */}
      <circle
        cx="25"
        cy="50"
        r="4"
        fill={variant === 'monochrome' ? 'currentColor' : '#06B6D4'}
        className={animated ? 'animate-pulse' : ''}
      />
      <circle
        cx="72"
        cy="38"
        r="4"
        fill={variant === 'monochrome' ? 'currentColor' : '#10B981'}
        className={animated ? 'animate-pulse' : ''}
        style={{ animationDelay: '0.5s' }}
      />
      <circle
        cx="50"
        cy="25"
        r="5"
        fill={variant === 'monochrome' ? 'currentColor' : '#34D399'}
        className={animated ? 'animate-pulse' : ''}
        style={{ animationDelay: '1s' }}
      />
      <circle
        cx="50"
        cy="90"
        r="4"
        fill={variant === 'monochrome' ? 'currentColor' : '#059669'}
      />
      
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
    </svg>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{svgIcon}</div>;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {svgIcon}
      <span
        className={`font-display font-extrabold tracking-tight select-none flex items-center ${dim.text} ${
          variant === 'monochrome' ? 'text-current' : 'text-white'
        }`}
      >
        <span className={variant === 'monochrome' ? '' : 'text-emerald-500'}>Verm</span>
        <span>IQ</span>
        <span className="text-xs font-semibold px-1.5 py-0.5 ml-1.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Lite
        </span>
      </span>
    </div>
  );
};
export default Logo;
