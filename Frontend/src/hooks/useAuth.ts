/**
 * Hook para verificar estado de autenticación
 * Retorna true si existe token en localStorage
 */
export const useAuth = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const isAuthenticated = !!token;

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('rememberEmail');
    window.location.href = '/';
  };

  return {
    isAuthenticated,
    token,
    logout,
  };
};

/**
 * Hook para obtener el email recordado (si existe)
 */
export const useRememberedEmail = () => {
  const email = typeof window !== 'undefined' ? localStorage.getItem('rememberEmail') : null;
  return email;
};
