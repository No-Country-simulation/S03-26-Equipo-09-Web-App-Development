import React, { useState, useEffect } from 'react';

/**
 * ErrorAlert - Componente de error siguiendo "The Invisible Interface" Design System
 * 
 * Características:
 * - Color subtle tertiary_container (#4a380c) en lugar de rojo estridente
 * - Desaparece automáticamente después de 5 segundos
 * - Puede cerrarse manualmente
 * - Accesible con ARIA labels
 * - Sin alertas disruptivas
 */

interface ErrorAlertProps {
  message?: string;
  error?: Error | string | unknown;
  duration?: number; // ms, 0 = no auto-dismiss
  onDismiss?: () => void;
  fieldName?: string; // nombre del campo que causó el error (para validación)
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message = 'Error desconocido',
  error,
  duration = 5000,
  onDismiss,
  fieldName
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-dismiss después de duration ms
  useEffect(() => {
    if (!duration) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  if (!isVisible) return null;

  // Extraer mensaje de error de diferentes formatos
  const getErrorMessage = (): string => {
    if (message) return message;
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;
    if (error && typeof error === 'object' && 'message' in error) {
      return (error as any).message;
    }
    return 'Error desconocido';
  };

  const errorMsg = getErrorMessage();

  return (
    <div
      className="fixed top-4 right-4 max-w-md p-4 rounded-lg shadow-md"
      style={{
        backgroundColor: '#4a380c', // tertiary_container
        borderLeft: '4px solid #5a4814',
      }}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-start gap-3">
        {/* Icono sutíl */}
        <div className="flex-shrink-0 mt-0.5">
          <svg
            className="h-5 w-5"
            style={{ color: '#d4c4a8' }} // color de texto sutíl
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 5v14a2 2 0 01-2 2H4a2 2 0 01-2-2V5a1 1 0 011-1h2a1 1 0 00-.894.553L7.382 4h5.236l1.276-1.447A1 1 0 0114 3h2a1 1 0 011 1zM16 7H4v10a2 2 0 002 2h8a2 2 0 002-2V7z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <div className="flex-1">
          {/* Mensaje de error */}
          <p
            className="text-sm font-medium"
            style={{ color: '#d4c4a8' }}
          >
            {fieldName ? `${fieldName}: ` : ''}
            {errorMsg}
          </p>
        </div>

        {/* Botón cerrar */}
        <button
          type="button"
          onClick={() => {
            setIsVisible(false);
            onDismiss?.();
          }}
          className="inline-flex hover:opacity-75 transition-opacity"
          aria-label="Cerrar aviso de error"
        >
          <svg
            className="h-5 w-5"
            style={{ color: '#d4c4a8' }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

/**
 * Hook para usar ErrorAlert fácilmente
 * 
 * Uso:
 * const { error, setError, ErrorComponent } = useErrorAlert();
 * 
 * // Mostrar error
 * setError('Algo salió mal');
 * 
 * // Renderizar
 * <ErrorComponent />
 */
export const useErrorAlert = (defaultDuration = 5000) => {
  const [error, setError] = useState<{
    message?: string;
    error?: unknown;
    fieldName?: string;
  } | null>(null);

  const ErrorComponent = error ? (
    <ErrorAlert
      message={error.message}
      error={error.error}
      fieldName={error.fieldName}
      duration={defaultDuration}
      onDismiss={() => setError(null)}
    />
  ) : null;

  return {
    error,
    setError,
    clearError: () => setError(null),
    ErrorComponent,
  };
};

/**
 * ValidationErrorList - Para mostrar múltiples errores de validación
 * Sigue el mismo diseño sutil
 */
interface ValidationErrorListProps {
  errors: Record<string, string>;
  onDismiss?: () => void;
}

export const ValidationErrorList: React.FC<ValidationErrorListProps> = ({
  errors,
  onDismiss,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || Object.keys(errors).length === 0) return null;

  return (
    <div
      className="mb-4 p-4 rounded-lg"
      style={{
        backgroundColor: '#4a380c', // tertiary_container
        borderLeft: '4px solid #5a4814',
      }}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 mt-0.5"
            style={{ color: '#d4c4a8' }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 5a1 1 0 112 0v4a1 1 0 11-2 0V5zm0 8a1 1 0 112 0v2a1 1 0 11-2 0v-2z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <div className="flex-1">
          <p
            className="text-sm font-medium mb-2"
            style={{ color: '#d4c4a8' }}
          >
            Errores de validación:
          </p>
          <ul className="space-y-1">
            {Object.entries(errors).map(([field, msg]) => (
              <li
                key={field}
                className="text-sm"
                style={{ color: '#d4c4a8' }}
              >
                • <strong>{field}:</strong> {msg}
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsVisible(false);
            onDismiss?.();
          }}
          className="inline-flex hover:opacity-75 transition-opacity flex-shrink-0"
          aria-label="Cerrar errores de validación"
        >
          <svg
            className="h-5 w-5"
            style={{ color: '#d4c4a8' }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
