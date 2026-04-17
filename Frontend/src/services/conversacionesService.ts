import type { Conversacion } from '../types/models';
import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';

/** GET /api/conversaciones */
export const getConversaciones = async (): Promise<Conversacion[]> => {
  const data = await apiGet<Conversacion[]>('/api/conversaciones');
  return data.sort(
    (a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()
  );
};

/** POST /api/conversaciones */
export const createConversacion = async (
  data: Omit<Conversacion, 'id'>
): Promise<Conversacion> => {
  return apiPost<Conversacion, typeof data>('/api/conversaciones', data);
};

/** PUT /api/conversaciones/:id — Marcar como leído */
export const marcarLeido = async (id: number): Promise<Conversacion> => {
  return apiPut<Conversacion, { leido: boolean }>(`/api/conversaciones/${id}`, { leido: true });
};

/** DELETE /api/conversaciones/:id */
export const deleteConversacion = async (id: number): Promise<void> => {
  return apiDelete(`/api/conversaciones/${id}`);
};

/** Cuenta mensajes sin leer */
export const countSinLeer = async (): Promise<number> => {
  const lista = await getConversaciones();
  return lista.filter(c => !c.leido).length;
};
