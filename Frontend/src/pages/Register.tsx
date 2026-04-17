import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import type { RegisterFormValues } from '../features/auth/schemas/registerSchema';
import { registerSchema } from '../features/auth/schemas/registerSchema';
import { Input } from '../components/ui/Input/Input';
import { Checkbox } from '../components/ui/Checkbox/Checkbox';
import { Button } from '../components/ui/Button/Button';
import { Card } from '../components/ui/Card/Card';
import { Badge } from '../components/ui/Badge/Badge';

export const Register = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      acceptTerms: false
    }
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      // API URL (mismo que apiClient.ts usa)
      const API_BASE_URL = (import.meta.env['VITE_API_URL'] as string) || 'http://localhost:8080/api';

      // Paso 1: Crear usuario
      const createResponse = await fetch(`${API_BASE_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: data.companyName,
          email: data.email,
          password: data.password,
        }),
      });

      const createResult = await createResponse.json() as { success: boolean; data?: { token?: string; id?: number }; error?: string };

      if (!createResponse.ok || !createResult.success) {
        setServerError(createResult.error || 'Error al registrar. Por favor intenta de nuevo.');
        return;
      }

      // Paso 2: Si el backend devolvió token directamente, usarlo
      let token = createResult.data?.token;
      let userId = createResult.data?.id;

      // Paso 3: Si no hay token, hacer login
      if (!token) {
        const loginResponse = await fetch(`${API_BASE_URL}/usuarios/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        });

        const loginResult = await loginResponse.json() as { success: boolean; data?: { token: string; userId: number; role: string }; error?: string };

        if (!loginResponse.ok || !loginResult.success) {
          setServerError(loginResult.error || 'Error al iniciar sesión. Por favor intenta manualmente.');
          return;
        }

        token = loginResult.data?.token;
        userId = loginResult.data?.userId;
      }

      // ✅ Guardar datos en localStorage
      localStorage.setItem('authToken', token || '');
      if (userId) localStorage.setItem('userId', userId.toString());
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userName', data.companyName);
      localStorage.setItem('userCompany', data.companyName);
      localStorage.setItem('userRole', 'VENDEDOR'); // Default para new registrations

      setSuccessMessage('¡Registro exitoso! Iniciando sesión...');
      
      // Redirigir al dashboard después de 1 segundo
      setTimeout(() => {
        navigate({ to: '/dashboard' });
      }, 1000);
    } catch (error) {
      console.error('Error en registro:', error);
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
                  business
                </span>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Crea tu Cuenta</h1>
            <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
              Registra tu empresa y comienza hoy
              <Badge variant="success" className="ml-auto">Gratis</Badge>
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
            {/* Company Name Input */}
            <div>
              <Input
                id="companyName"
                type="text"
                label="Nombre de la Empresa"
                placeholder="Mi Empresa S.A.S."
                icon="business"
                error={errors.companyName?.message}
                {...register('companyName')}
                disabled={isSubmitting}
              />
            </div>

            {/* Email Input */}
            <div>
              <Input
                id="email"
                type="email"
                label="Correo Corporativo"
                placeholder="contacto@empresa.com"
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

            {/* Confirm Password Input */}
            <div>
              <Input
                id="confirmPassword"
                type="password"
                label="Confirmar Contraseña"
                placeholder="••••••••"
                icon="lock_check"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
                disabled={isSubmitting}
              />
            </div>

            {/* Accept Terms Checkbox */}
            <div className="pt-2">
              <Checkbox
                id="acceptTerms"
                label="Acepto los términos y condiciones"
                {...register('acceptTerms')}
                disabled={isSubmitting}
              />
              {errors.acceptTerms && (
                <p className="text-xs text-red-500 font-medium mt-1">
                  {errors.acceptTerms.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 mt-8"
              isLoading={isSubmitting}
            >
              {isSubmitting ? 'Registrando...' : 'Crear Cuenta'}
            </Button>

            {/* Footer - Login Link */}
            <div className="mt-6 text-center">
              <p className="text-xs text-slate-600">
                ¿Ya tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => navigate({ to: '/login' })}
                  className="font-bold text-[#008f60] hover:text-[#006c49] hover:underline underline-offset-2 transition-colors"
                >
                  Inicia sesión aquí
                </button>
              </p>
            </div>
          </form>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-500 mb-3 uppercase tracking-widest font-bold">
              ¿Necesitas ayuda?
            </p>
            <p className="text-xs text-slate-600">
              Contáctanos en{' '}
              <span className="font-semibold text-[#008f60]">soporte@crmintelligent.com</span>
            </p>
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
