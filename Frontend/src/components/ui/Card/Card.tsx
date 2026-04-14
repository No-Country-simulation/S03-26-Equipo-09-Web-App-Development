import type React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'dark' | 'glass';
  /**
   * Permite cambiar el elemento HTML raíz para mejorar la semántica.
   */
  as?: 'div' | 'article' | 'section';
}

export const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  as: Component = 'div' 
}: CardProps) => {
  const variants = {
    default: "bg-white border border-slate-100 shadow-sm",
    dark: "bg-[#182442] text-white shadow-xl shadow-[#182442]/10",
    glass: "bg-white/70 backdrop-blur-xl border border-white/20 shadow-md",
  };

  return (
    <Component 
      className={`rounded-[2rem] p-6 transition-all duration-300 ${variants[variant]} ${className}`}
      data-testid="card-container"
    >
      {children}
    </Component>
  );
};