import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = 'md' 
}: ModalProps) => {
  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return createPortal(
    <div 
      aria-labelledby="modal-title"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
    >
      {/* Backdrop con Glassmorphism corporativo */}
      <div 
        aria-hidden="true"
        className="absolute inset-0 bg-[#182442]/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        data-testid="modal-backdrop"
        onClick={onClose}
      />
      
      {/* Modal Content container */}
      <div className={`relative bg-white w-full ${maxWidthClasses[maxWidth]} rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100`}>
        {/* Acento verde secundario superior */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#008f60]"></div>
        
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#182442] tracking-tight" id="modal-title">
              {title}
            </h3>
            <button 
              aria-label="Cerrar modal" 
              className="p-2 hover:bg-slate-50 rounded-full transition-colors group"
              onClick={onClose}
            >
              <span className="material-symbols-outlined text-slate-400 group-hover:text-[#182442] transition-colors">
                close
              </span>
            </button>
          </div>
          
          <div className="text-slate-600 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

Modal.displayName = 'Modal';