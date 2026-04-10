import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import type { LoginFormValues } from '../features/auth/schemas/loginSchema';
import { loginSchema } from '../features/auth/schemas/loginSchema';
import { Input } from '../components/ui/Input/Input';
import { Checkbox } from '../components/ui/Checkbox/Checkbox';
import { Button } from '../components/ui/Button/Button';
import { Card } from '../components/ui/Card/Card';
import { Badge } from '../components/ui/Badge/Badge';

export const Login = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur', // Mostrar errores al salir del campo
    defaultValues: {
      rememberMe: false
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    setSuccessMessage(null);

    // Simulación de validación de login
    try {
      // Esperar 500ms para simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));

      if (
        data.email === 'admin@crm.com' &&
        data.password === '123456'
      ) {
        // ✅ Login exitoso - Guardar token en localStorage
        const mockToken = `mock-jwt-${Date.now()}`;
        localStorage.setItem('authToken', mockToken);
        
        if (data.rememberMe) {
          localStorage.setItem('rememberEmail', data.email);
        } else {
          localStorage.removeItem('rememberEmail');
        }

        setSuccessMessage('¡Login exitoso! Redirigiendo...');
        
        // Redirigir al dashboard después de 1 segundo
        setTimeout(() => {
          navigate({ to: '/dashboard' });
        }, 1000);
      } else {
        // ❌ Credenciales inválidas
        setServerError(
          'El correo o la contraseña son incorrectos. Intenta con admin@crm.com / 123456'
        );
      }
    } catch (error) {
      setServerError('Error al conectar con el servidor. Por favor intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Principal */}
        <Card className="shadow-2xl border-0">
          {/* Header */}
          <div className="mb-8 text-center border-b border-slate-100 pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#008f60] to-[#006c49] flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xl">
                  lock_outline
                </span>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Inicia Sesión</h1>
            <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
              Accede a tu panel CRM
              <Badge variant="success" className="ml-auto">Online</Badge>
            </p>
          </div>

          {/* Mensajes de Error */}
          {serverError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <span className="material-symbols-outlined text-red-600 text-xl flex-shrink-0">
                error
              </span>
              <div>
                <p className="text-sm font-semibold text-red-900">Error</p>
                <p className="text-sm text-red-700">{serverError}</p>
              </div>
            </div>
          )}

          {/* Mensaje de Éxito */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
              <span className="material-symbols-outlined text-green-600 text-xl flex-shrink-0">
                check_circle
              </span>
              <div>
                <p className="text-sm font-semibold text-green-900">Éxito</p>
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Input */}
            <div>
              <Input
                id="email"
                type="email"
                label="Correo Corporativo"
                placeholder="admin@crm.com"
                icon="mail"
                error={errors.email?.message}
                {...register('email')}
                disabled={isSubmitting}
              />
            </div>

            {/* Password Input */}
            <div>
              <Input
                id="password"
                type="password"
                label="Contraseña"
                placeholder="••••••••"
                icon="lock"
                error={errors.password?.message}
                {...register('password')}
                disabled={isSubmitting}
              />
            </div>

            {/* Recordarme Checkbox */}
            <div className="flex items-center justify-between pt-2">
              <Checkbox
                id="rememberMe"
                label="Recordarme"
                {...register('rememberMe')}
                disabled={isSubmitting}
              />
              
              {/* Link Olvidé contraseña */}
              <button
                type="button"
                className="text-xs font-semibold text-[#008f60] hover:text-[#006c49] hover:underline underline-offset-2 transition-colors"
              >
                ¿Olvidé contraseña?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 mt-8"
              isLoading={isSubmitting}
            >
              {isSubmitting ? 'Validando...' : 'Entrar al Panel'}
            </Button>

            {/* Footer - Signup Link */}
            <div className="mt-6 text-center">
              <p className="text-xs text-slate-600">
                ¿No tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => navigate({ to: '/register' })}
                  className="font-bold text-[#008f60] hover:text-[#006c49] hover:underline underline-offset-2 transition-colors"
                >
                  Regístrate aquí
                </button>
              </p>
            </div>
          </form>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 mb-3">Credenciales de prueba:</p>
            <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-lg font-mono text-slate-700">
              <p>📧 admin@crm.com</p>
              <p>🔐 123456</p>
            </div>
          </div>
        </Card>

        {/* Bottom Text */}
        <p className="text-center text-xs text-slate-500 mt-6">
          © 2026 CRM Intelligent. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};
