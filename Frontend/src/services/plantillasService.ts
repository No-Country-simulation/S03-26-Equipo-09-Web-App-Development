import type { Plantilla } from '../types/models';
import { MOCK_PLANTILLAS } from '../features/plantillas/mocks/plantillasMock';
// import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';

let plantillasDb: Plantilla[] = [...MOCK_PLANTILLAS];
let nextId = 100;

/** GET /api/plantillas */
export const getPlantillas = async (): Promise<Plantilla[]> => {
  // TODO_INTEGRATION: return apiGet<Plantilla[]>('/api/plantillas');
  await delay();
  return [...plantillasDb];
};

/** POST /api/plantillas */
export const createPlantilla = async (
  data: Omit<Plantilla, 'id'>
): Promise<Plantilla> => {
  // TODO_INTEGRATION: return apiPost<Plantilla, typeof data>('/api/plantillas', data);
  await delay();
  const nueva: Plantilla = { ...data, id: nextId++, esActiva: true };
  plantillasDb = [...plantillasDb, nueva];
  return nueva;
};

/** PUT /api/plantillas/:id */
export const updatePlantilla = async (
  id: number,
  data: Partial<Omit<Plantilla, 'id'>>
): Promise<Plantilla> => {
  // TODO_INTEGRATION: return apiPut<Plantilla, typeof data>(`/api/plantillas/${id}`, data);
  await delay();
  const found = plantillasDb.find(p => p.id === id);
  if (!found) throw new Error(`Plantilla ${id} no encontrada`);
  const actualizada: Plantilla = { ...found, ...data };
  plantillasDb = plantillasDb.map(p => (p.id === id ? actualizada : p));
  return actualizada;
};

/** DELETE /api/plantillas/:id */
export const deletePlantilla = async (id: number): Promise<void> => {
  // TODO_INTEGRATION: return apiDelete(`/api/plantillas/${id}`);
  await delay();
  plantillasDb = plantillasDb.filter(p => p.id !== id);
};

/** Toggle activa/inactiva */
export const togglePlantilla = async (id: number): Promise<Plantilla> => {
  const found = plantillasDb.find(p => p.id === id);
  if (!found) throw new Error(`Plantilla ${id} no encontrada`);
  return updatePlantilla(id, { esActiva: !found.esActiva });
};

const delay = (ms = 300) => new Promise<void>(r => setTimeout(r, ms));
