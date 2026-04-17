import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../ui/Input/Input';
import { Button } from '../ui/Button/Button';
import { Alert } from './Alert/Alert';


// 1. Definimos el esquema de validación con Zod
const loginSchema = z.object({
  email: z.string().email('Ingresa un correo corporativo válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setServerError(null);

    try {
      // Llamar a API real
      const API_BASE_URL = (import.meta.env['VITE_API_URL'] as string) || 'http://localhost:8080/api';
      
      const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json() as { success: boolean; data?: { token: string; userId: number; role: string; nombre: string; email: string }; error?: string };

      if (!response.ok || !result.success) {
        setServerError(result.error || 'El correo o la contraseña son incorrectos.');
        setIsLoading(false);
        return;
      }

      // ✅ Login exitoso - Guardar en localStorage
      const { token, userId, role, nombre, email } = result.data || {};
      
      localStorage.setItem('authToken', token || '');
      localStorage.setItem('userId', userId?.toString() || '');
      localStorage.setItem('userEmail', email || data.email);
      localStorage.setItem('userName', nombre || '');
      localStorage.setItem('userRole', role || 'VENDEDOR');
      localStorage.setItem('userCompany', nombre || '');

      console.log('✅ Login exitoso', { userId, role, email });
      setIsLoading(false);
      
      // Trigger navigation via window event
      window.dispatchEvent(new Event('login-success'));
    } catch (error) {
      console.error('Error en login:', error);
      setServerError('Error al conectar con el servidor.');
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6 w-full max-w-sm" onSubmit={handleSubmit(onSubmit)}>
      {/* Mensaje de Error Global (Server Error) */}
      {serverError && (
        <Alert title="Error de Acceso" variant="error" onClose={() => { setServerError(null); }}>
          {serverError}
        </Alert>
      )}

      <div className="space-y-4">
        <Input
          icon="mail"
          label="Correo Corporativo"
          placeholder="usuario@empresa.com"
          {...register('email')}
          error={errors.email?.message} // Vinculación del error de validación
        />

        <Input
          icon="lock"
          label="Contraseña"
          placeholder="••••••••"
          type="password"
          {...register('password')}
          error={errors.password?.message} // Vinculación del error de validación
        />
      </div>

      <Button 
        className="w-full" 
        isLoading={isLoading} 
        type="submit"
        variant="primary"
      >
        Iniciar Sesión
      </Button>
    </form>
  );
};