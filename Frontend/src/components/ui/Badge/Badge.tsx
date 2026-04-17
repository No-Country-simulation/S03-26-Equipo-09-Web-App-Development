import type React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  className?: string;
}

/**
 * Badge (Predictive Chip) para visualización de estados y categorías.
 */
export const Badge = ({ children, variant = 'neutral', className = '' }: BadgeProps) => {
  const variants = {
    primary: "bg-[#182442]/10 text-[#182442] border-[#182442]/20",
    success: "bg-[#008f60]/10 text-[#008f60] border-[#008f60]/20",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    error: "bg-red-50 text-red-700 border-red-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    neutral: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold border uppercase tracking-tighter transition-colors ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};