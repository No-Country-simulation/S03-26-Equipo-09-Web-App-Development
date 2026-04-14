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

// Credenciales de usuarios para prueba
const USERS = {
  admin: { id: 1, email: 'admin@crm.com', password: '123456', role: 'ADMIN', name: 'Harold Admin' },
  vendedor: { id: 2, email: 'vendedor@crm.com', password: '123456', role: 'VENDEDOR', name: 'Carlos Vendedor' }
};

export const Login = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Obtener email recordado o usar admin por defecto
  const rememberedEmail = typeof window !== 'undefined' ? localStorage.getItem('rememberEmail') : null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: rememberedEmail || 'admin@crm.com', // Default: Admin
      password: '',
      rememberMe: !!rememberedEmail
    }
  });

  // Botones rápidos para cargar credenciales
  const quickLogin = (userType: keyof typeof USERS) => {
    const user = USERS[userType];
    setValue('email', user.email);
    setValue('password', user.password);
  };

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      // Verificar credenciales contra los usuarios definidos
      const authenticatedUser = Object.values(USERS).find(
        user => user.email === data.email && user.password === data.password
      );

      if (authenticatedUser) {
        // ✅ Login exitoso - Guardar token y rol en localStorage
        const mockToken = `mock-jwt-${Date.now()}`;
        localStorage.setItem('authToken', mockToken);
        localStorage.setItem('userId', String(authenticatedUser.id));
        localStorage.setItem('userRole', authenticatedUser.role);
        localStorage.setItem('userEmail', authenticatedUser.email);
        localStorage.setItem('userName', authenticatedUser.name);
        
        if (data.rememberMe) {
          localStorage.setItem('rememberEmail', data.email);
        } else {
          localStorage.removeItem('rememberEmail');
        }

        setSuccessMessage(`¡Bienvenido ${authenticatedUser.name}! Redirigiendo...`);
        
        // Redirigir al dashboard después de 1 segundo
        setTimeout(() => {
          navigate({ to: '/dashboard' });
        }, 1000);
      } else {
        // ❌ Credenciales inválidas
        setServerError(
          'El correo o la contraseña son incorrectos. Usa las credenciales mostradas abajo.'
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

          {/* Footer Info - Credenciales de Prueba */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-4 text-center font-semibold">Credenciales de Prueba</p>
            
            {/* Perfil Admin */}
            <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-blue-900">👨‍💼 Admin</span>
                  <Badge variant="primary" className="text-xs">Todas las funciones</Badge>
                </div>
                <button
                  type="button"
                  onClick={() => quickLogin('admin')}
                  className="text-xs px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded font-semibold transition-colors"
                >
                  Cargar
                </button>
              </div>
              <p className="text-xs text-blue-700 font-mono">📧 admin@crm.com</p>
              <p className="text-xs text-blue-700 font-mono">🔐 123456</p>
            </div>

            {/* Perfil Vendedor */}
            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-green-900">👔 Vendedor</span>
                  <Badge variant="success" className="text-xs">Mi Inbox</Badge>
                </div>
                <button
                  type="button"
                  onClick={() => quickLogin('vendedor')}
                  className="text-xs px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded font-semibold transition-colors"
                >
                  Cargar
                </button>
              </div>
              <p className="text-xs text-green-700 font-mono">📧 vendedor@crm.com</p>
              <p className="text-xs text-green-700 font-mono">🔐 123456</p>
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
