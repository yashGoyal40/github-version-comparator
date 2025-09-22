import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        <rect width="32" height="32" rx="6" fill="url(#gradient)" />
        <path d="M8 12h16v2H8v-2z" fill="#10b981" />
        <path d="M8 16h12v2H8v-2z" fill="#3b82f6" />
        <path d="M8 20h8v2H8v-2z" fill="#f59e0b" />
        <circle cx="24" cy="8" r="3" fill="#ef4444" />
        <path d="M22 8h4M24 6v4" stroke="#fff" strokeWidth="1" strokeLinecap="round" />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#2d2d2d" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
