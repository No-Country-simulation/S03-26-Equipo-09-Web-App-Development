import type React from 'react';

export interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  icon?: string;
  className?: string;
}

export const Alert = ({
  variant = 'info',
  title,
  children,
  onClose,
  icon,
  className = '',
}: AlertProps) => {
  const variants = {
    success: 'bg-green-50 border-green-200 text-[#008f60]',
    error: 'bg-red-50 border-red-200 text-red-700',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-slate-50 border-slate-200 text-[#182442]',
  };

  const defaultIcons = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info',
  };

  return (
    <div
      className={`relative flex w-full gap-4 p-4 border rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300 ${variants[variant]} ${className}`}
      role="alert"
    >
      <span className="material-symbols-outlined shrink-0" style={{ fontSize: '24px' }}>
        {icon || defaultIcons[variant]}
      </span>
      
      <div className="flex-1 space-y-1">
        {title && <h4 className="font-bold text-sm leading-none">{title}</h4>}
        <div className="text-sm opacity-90">{children}</div>
      </div>

      {onClose && (
        <button
          aria-label="Cerrar alerta"
          className="p-1 rounded-lg hover:bg-black/5 transition-colors shrink-0"
          onClick={onClose}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
        </button>
      )}
    </div>
  );
};