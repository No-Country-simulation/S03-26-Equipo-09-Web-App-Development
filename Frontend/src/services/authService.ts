import type { LoginRequest, LoginResponse, Usuario } from '../types/models';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SERVICIO DE AUTENTICACIÓN
 * Backend endpoint esperado: POST /api/auth/login
 * Nota: El endpoint aún NO existe en el backend — usando mock.
 *
 * Cuando el backend lo implemente, solo descomentar las llamadas a apiPost.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const MOCK_USER: Usuario = {
  id: 1,
  username: 'harold.agudelo',
  email: 'admin@crm.com',
  empresa: 'CRM Intelligent',
  rol: 'ADMIN',
};

/** POST /api/auth/login */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  // TODO_INTEGRATION: return apiPost<LoginResponse>('/api/auth/login', credentials);

  await new Promise(resolve => setTimeout(resolve, 500));

  // MOCK: Validación simple de credenciales
  if (credentials.email === 'admin@crm.com' && credentials.password === '123456') {
    const mockToken = `mock-jwt-${Date.now()}`;
    return {
      token: mockToken,
      user: MOCK_USER,
      expiresIn: 3600,
    };
  }

  throw new Error('Credenciales incorrectas. Usa admin@crm.com / 123456');
};

/** POST /api/auth/logout (si el backend lo implementa) */
export const logout = async (): Promise<void> => {
  // TODO_INTEGRATION: await apiPost('/api/auth/logout', {});
  await Promise.resolve();
};

/** GET /api/auth/me — Obtener usuario actual desde token */
export const getMe = async (): Promise<Usuario> => {
  // TODO_INTEGRATION: return apiGet<Usuario>('/api/auth/me');
  await new Promise(resolve => setTimeout(resolve, 200));
  return MOCK_USER;
};
