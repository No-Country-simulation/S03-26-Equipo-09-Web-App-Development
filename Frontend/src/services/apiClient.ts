/**
 * Cliente base HTTP — apunta al backend Spring Boot.
 *
 * MODO MOCK: Las llamadas reales están comentadas.
 * MODO REAL:  Cambiar VITE_API_URL en .env y descomentar las llamadas en cada servicio.
 */

const BASE_URL = (import.meta.env['VITE_API_URL'] as string | undefined) ?? 'http://localhost:8080';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions<TBody = unknown> {
  method?: HttpMethod;
  body?: TBody;
}

/**
 * Obtiene el token JWT del localStorage (compatible con authStore actual).
 */
const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Wrapper de fetch tipado con manejo de errores centralizado.
 * TODO_INTEGRATION: Este cliente se activará cuando el backend esté listo.
 */
export async function apiRequest<TResponse, TBody = unknown>(
  endpoint: string,
  options: RequestOptions<TBody> = {}
): Promise<TResponse> {
  const { method = 'GET', body } = options;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  // El backend retorna ApiResponse<T> — extraemos el campo data
  const json = (await response.json()) as Record<string, unknown>;
  if (json && typeof json === 'object' && 'success' in json) {
    if (!json['success']) {
      throw new Error((json['error'] as string | undefined) ?? 'Error desconocido del servidor');
    }
    return json['data'] as TResponse;
  }

  return json as TResponse;
}

/** Shorthand para GET */
export const apiGet = <T>(endpoint: string) =>
  apiRequest<T>(endpoint, { method: 'GET' });

/** Shorthand para POST */
export const apiPost = <T, B = unknown>(endpoint: string, body: B) =>
  apiRequest<T, B>(endpoint, { method: 'POST', body });

/** Shorthand para PUT */
export const apiPut = <T, B = unknown>(endpoint: string, body: B) =>
  apiRequest<T, B>(endpoint, { method: 'PUT', body });

/** Shorthand para DELETE */
export const apiDelete = <T = void>(endpoint: string) =>
  apiRequest<T>(endpoint, { method: 'DELETE' });
