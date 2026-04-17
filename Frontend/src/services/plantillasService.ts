import type { Plantilla } from '../types/models';
import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';

/** GET /api/plantillas */
export const getPlantillas = async (): Promise<Plantilla[]> => {
  return apiGet<Plantilla[]>('/api/plantillas');
};

/** POST /api/plantillas */
export const createPlantilla = async (
  data: Omit<Plantilla, 'id'>
): Promise<Plantilla> => {
  return apiPost<Plantilla, typeof data>('/api/plantillas', data);
};

/** PUT /api/plantillas/:id */
export const updatePlantilla = async (
  id: number,
  data: Partial<Omit<Plantilla, 'id'>>
): Promise<Plantilla> => {
  return apiPut<Plantilla, typeof data>(`/api/plantillas/${id}`, data);
};

/** DELETE /api/plantillas/:id */
export const deletePlantilla = async (id: number): Promise<void> => {
  return apiDelete(`/api/plantillas/${id}`);
};

/** Toggle activa/inactiva */
export const togglePlantilla = async (id: number): Promise<Plantilla> => {
  // Nota: El backend debe soportar este endpoint o hacemos un PUT a /api/plantillas/:id
  const current = await apiGet<Plantilla>(`/api/plantillas/${id}`);
  return updatePlantilla(id, { esActiva: !current.esActiva });
};
