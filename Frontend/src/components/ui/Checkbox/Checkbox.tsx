import type React from 'react';
import { forwardRef } from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/**
 * Componente Checkbox del Design System.
 * Implementa el focus state Esmeralda (#008f60).
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const errorId = props.id ? `${props.id}-error` : undefined;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <div className="flex items-center gap-3">
          <input
            ref={ref}
            type="checkbox"
            aria-describedby={error ? errorId : undefined}
            aria-invalid={error ? 'true' : 'false'}
            className={`
              w-5 h-5 rounded border border-slate-300 bg-white cursor-pointer
              accent-[#008f60]
              focus:outline-none focus:ring-2 focus:ring-[#008f60]/20
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-red-500' : ''}
              ${className}
            `}
            {...props}
          />
          {label && (
            <label
              htmlFor={props.id}
              className="text-sm font-medium text-slate-700 cursor-pointer"
            >
              {label}
            </label>
          )}
        </div>
        {error && (
          <p id={errorId} className="text-xs text-red-500 font-medium">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
