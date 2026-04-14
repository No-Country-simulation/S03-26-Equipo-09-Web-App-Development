import type React from 'react';
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
}

/**
 * Componente Input base del Design System.
 * Implementa el focus state Esmeralda (#008f60) y soporte para iconos.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  label, 
  error, 
  icon, 
  className = '', 
  ...props 
}, ref) => {
  const errorId = props.id ? `${props.id}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-slate-700" htmlFor={props.id}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px] pointer-events-none">
            {icon}
          </span>
        )}
        
        <input
          ref={ref}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? 'true' : 'false'}
          className={`
            w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm transition-all
            placeholder:text-slate-400
            focus:outline-none focus:ring-2 focus:ring-[#008f60]/20 focus:border-[#008f60]
            disabled:bg-slate-50 disabled:text-slate-500
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
