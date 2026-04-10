/**
 * Tipos TypeScript que reflejan EXACTAMENTE los modelos del backend (Java/Spring Boot).
 * Cualquier cambio en el backend debe replicarse aquí.
 *
 * Backend models: com.startupcrm.crm_backend.model.*
 */

// ─────────────────────────────────────────────
// Enums del Backend
// ─────────────────────────────────────────────

/** Corresponde a com.startupcrm.crm_backend.model.EstadoLead */
export type EstadoLead =
  | 'LEAD_ACTIVO'
  | 'EN_SEGUIMIENTO'
  | 'CLIENTE'
  | 'PERDIDO';

/** Canal de comunicación */
export type Canal = 'WhatsApp' | 'Email';

// ─────────────────────────────────────────────
// Entidades Principales
// ─────────────────────────────────────────────

/**
 * Corresponde a com.startupcrm.crm_backend.model.Contacto
 * Endpoint: /api/contactos
 */
export interface Contacto {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  estado: EstadoLead;
  fechaCreacion?: string; // ISO 8601
}

/**
 * Corresponde a com.startupcrm.crm_backend.model.Conversacion
 * Endpoint: /api/conversaciones
 */
export interface Conversacion {
  id: number;
  canal: Canal;
  contenido: string;
  fechaHora: string; // ISO 8601
  contacto: Contacto;
  leido?: boolean; // Añadido frontend-side para UI
}

/**
 * Corresponde a com.startupcrm.crm_backend.model.Seguimiento
 * Endpoint: /api/seguimientos
 */
export interface Seguimiento {
  id: number;
  tarea: string;
  fecha: string; // ISO 8601 (LocalDate)
  completado: boolean;
  contacto: Contacto;
}

/**
 * Corresponde a com.startupcrm.crm_backend.model.Plantilla
 * Endpoint: /api/plantillas (pendiente de confirmar ruta con backend)
 */
export interface Plantilla {
  id: number;
  nombre: string;
  contenido: string;
  canal: Canal;
  esActiva?: boolean;
}

/**
 * Corresponde a com.startupcrm.crm_backend.model.Usuario
 * Usado para auth y perfil de usuario
 */
export interface Usuario {
  id: number;
  username: string;
  email: string;
  empresa?: string;
  rol?: string;
}

// ─────────────────────────────────────────────
// DTOs del Dashboard
// Corresponde a com.startupcrm.crm_backend.dto.DashboardDTO
// Endpoint: GET /api/dashboard/stats
// ─────────────────────────────────────────────
export interface DashboardStats {
  totalContactos: number;
  nuevosLeadsHoy: number;
  tareasPendientes: number;
  mensajesSinLeer: number;
  interaccionesTotales?: number;
  contactosPorEstado: Record<EstadoLead, number>;
}

// ─────────────────────────────────────────────
// DTO de Respuesta Genérica del Backend
// Corresponde a com.startupcrm.crm_backend.dto.ApiResponse<T>
// ─────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

// ─────────────────────────────────────────────
// Auth (pendiente de endpoint en backend)
// ─────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: Usuario;
  expiresIn: number;
}
