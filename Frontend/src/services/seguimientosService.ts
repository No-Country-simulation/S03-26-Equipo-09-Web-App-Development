import type { Seguimiento } from '../types/models';
import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';

/** GET /api/seguimientos */
export const getSeguimientos = async (): Promise<Seguimiento[]> => {
  return apiGet<Seguimiento[]>('/api/seguimientos');
};

/** POST /api/seguimientos */
export const createSeguimiento = async (
  data: Omit<Seguimiento, 'id'>
): Promise<Seguimiento> => {
  return apiPost<Seguimiento, typeof data>('/api/seguimientos', data);
};

/** PUT /api/seguimientos/:id */
export const updateSeguimiento = async (
  id: number,
  data: Partial<Omit<Seguimiento, 'id'>>
): Promise<Seguimiento> => {
  return apiPut<Seguimiento, typeof data>(`/api/seguimientos/${id}`, data);
};

/** Completar tarea */
export const completarSeguimiento = async (id: number): Promise<Seguimiento> =>
  updateSeguimiento(id, { completado: true });

/** DELETE /api/seguimientos/:id */
export const deleteSeguimiento = async (id: number): Promise<void> => {
  return apiDelete(`/api/seguimientos/${id}`);
};

/** Cuenta tareas pendientes */
export const countPendientes = async (): Promise<number> => {
  const lista = await getSeguimientos();
  return lista.filter(s => !s.completado).length;
};
