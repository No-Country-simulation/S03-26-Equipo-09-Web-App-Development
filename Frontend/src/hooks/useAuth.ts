/**
 * Hook para verificar estado de autenticación y rol
 * Retorna true si existe token + información de rol
 */
export const useAuth = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;
  const userName = typeof window !== 'undefined' ? localStorage.getItem('userName') : null;
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  
  const isAuthenticated = !!token;
  const isAdmin = userRole === 'ADMIN';
  const isVendedor = userRole === 'VENDEDOR';

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('rememberEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    window.location.href = '/';
  };

  return {
    isAuthenticated,
    token,
    logout,
    isAdmin,
    isVendedor,
    userRole,
    userEmail,
    userName,
    userId: userId ? parseInt(userId) : null
  };
};

/**
 * Hook para obtener el email recordado (si existe)
 */
export const useRememberedEmail = () => {
  const email = typeof window !== 'undefined' ? localStorage.getItem('rememberEmail') : null;
  return email;
};
