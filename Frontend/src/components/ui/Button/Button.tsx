import type React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  isLoading?: boolean;
}

/**
 * Componente de botón base para el sistema de diseño "The Predictive Curator".
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  isLoading,
  className = '',
  disabled,
  type = 'button',
  ...props
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#182442] text-white shadow-lg shadow-[#182442]/20 hover:bg-[#25335a]",
    secondary: "bg-[#008f60] text-white shadow-lg shadow-[#008f60]/20 hover:bg-[#007a52]",
    outline: "border-2 border-slate-200 text-[#182442] hover:bg-slate-50 hover:border-slate-300",
    tertiary: "text-[#45464e] hover:bg-slate-100",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button 
      className={combinedClassName}
      disabled={disabled || isLoading} 
      type={type} 
      {...props}
    >
      {isLoading ? (
        <div 
          aria-label="loading"
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
          role="status" 
        />
      ) : icon ? (
        <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
          {icon}
        </span>
      ) : null}
      {children}
    </button>
  );
};