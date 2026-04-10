import type { DashboardStats } from '../types/models';
import { getContactos } from './contactosService';
import { countSinLeer } from './conversacionesService';
import { countPendientes } from './seguimientosService';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SERVICIO DE DASHBOARD STATS
 * Backend endpoint: GET /api/dashboard/stats
 * Backend class: com.startupcrm.crm_backend.controller.DashboardController
 * Backend DTO: com.startupcrm.crm_backend.dto.DashboardDTO
 *
 * El DashboardDTO del backend retorna:
 *  - totalContactos
 *  - nuevosLeadsHoy
 *  - tareasPendientes
 *  - mensajesSinLeer
 *  - contactosPorEstado (Map<EstadoLead, Long>)
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** GET /api/dashboard/stats */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  // TODO_INTEGRATION: return apiGet<DashboardStats>('/api/dashboard/stats');

  // MOCK: Calculado desde los otros servicios mock (simula lo que haría el backend)
  const [contactos, sinLeer, pendientes] = await Promise.all([
    getContactos(),
    countSinLeer(),
    countPendientes(),
  ]);

  const hoy: string = new Date().toISOString().split('T')[0] ?? '';
  const nuevosHoy = contactos.filter(c =>
    c.fechaCreacion != null && c.fechaCreacion.startsWith(hoy)
  ).length;

  const porEstado = {
    LEAD_ACTIVO: contactos.filter(c => c.estado === 'LEAD_ACTIVO').length,
    EN_SEGUIMIENTO: contactos.filter(c => c.estado === 'EN_SEGUIMIENTO').length,
    CLIENTE: contactos.filter(c => c.estado === 'CLIENTE').length,
    PERDIDO: contactos.filter(c => c.estado === 'PERDIDO').length,
  };

  return {
    totalContactos: contactos.length,
    nuevosLeadsHoy: nuevosHoy,
    tareasPendientes: pendientes,
    mensajesSinLeer: sinLeer,
    interaccionesTotales: 1240, // TODO_INTEGRATION: vendrá del backend
    contactosPorEstado: porEstado,
  };
};
