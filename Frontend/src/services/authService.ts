import { apiPost } from './apiClient';
import type { LoginRequest, LoginResponse, Usuario } from '../types/models';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SERVICIO DE AUTENTICACIÓN REAL
 * Conectado al backend Spring Boot
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** POST /api/auth/login */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  return apiPost<LoginResponse>('/api/auth/login', credentials);
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
