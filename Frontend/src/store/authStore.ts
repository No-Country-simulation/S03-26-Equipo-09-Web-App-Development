import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Usuario } from '../types/models';
import { login as loginService, logout as logoutService } from '../services/authService';

interface AuthState {
  token: string | null;
  user: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

/**
 * Store global de autenticación con Zustand.
 * Persiste token y user en localStorage automáticamente.
 *
 * TODO_INTEGRATION: La acción login ya llama a authService.login()
 * que tiene el comentario TODO_INTEGRATION apuntando al endpoint real.
 */
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await loginService({ email, password });
          set({
            token: response.token,
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          // Compatibilidad con hooks legacy que leen localStorage directamente
          localStorage.setItem('authToken', response.token);
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Error de autenticación';
          set({ isLoading: false, error: message, isAuthenticated: false });
          throw err; // Re-throw para que el formulario pueda manejarlo
        }
      },

      logout: async () => {
        try {
          await logoutService();
        } finally {
          set({ token: null, user: null, isAuthenticated: false, error: null });
          localStorage.removeItem('authToken');
          localStorage.removeItem('rememberEmail');
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'crm-auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
