import type { Seguimiento } from '../types/models';
import { MOCK_SEGUIMIENTOS } from '../features/seguimientos/mocks/seguimientosMock';
// import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';

let seguimientosDb: Seguimiento[] = [...MOCK_SEGUIMIENTOS];
let nextId = 100;

/** GET /api/seguimientos */
export const getSeguimientos = async (): Promise<Seguimiento[]> => {
  // TODO_INTEGRATION: return apiGet<Seguimiento[]>('/api/seguimientos');
  await delay();
  return [...seguimientosDb];
};

/** POST /api/seguimientos */
export const createSeguimiento = async (
  data: Omit<Seguimiento, 'id'>
): Promise<Seguimiento> => {
  // TODO_INTEGRATION: return apiPost<Seguimiento, typeof data>('/api/seguimientos', data);
  await delay();
  const nuevo: Seguimiento = { ...data, id: nextId++ };
  seguimientosDb = [...seguimientosDb, nuevo];
  return nuevo;
};

/** PUT /api/seguimientos/:id */
export const updateSeguimiento = async (
  id: number,
  data: Partial<Omit<Seguimiento, 'id'>>
): Promise<Seguimiento> => {
  // TODO_INTEGRATION: return apiPut<Seguimiento, typeof data>(`/api/seguimientos/${id}`, data);
  await delay();
  const found = seguimientosDb.find(s => s.id === id);
  if (!found) throw new Error(`Seguimiento ${id} no encontrado`);
  const actualizado: Seguimiento = { ...found, ...data };
  seguimientosDb = seguimientosDb.map(s => (s.id === id ? actualizado : s));
  return actualizado;
};

/** Completar tarea */
export const completarSeguimiento = async (id: number): Promise<Seguimiento> =>
  updateSeguimiento(id, { completado: true });

/** DELETE /api/seguimientos/:id */
export const deleteSeguimiento = async (id: number): Promise<void> => {
  // TODO_INTEGRATION: return apiDelete(`/api/seguimientos/${id}`);
  await delay();
  seguimientosDb = seguimientosDb.filter(s => s.id !== id);
};

/** Cuenta tareas pendientes */
export const countPendientes = async (): Promise<number> => {
  const lista = await getSeguimientos();
  return lista.filter(s => !s.completado).length;
};

const delay = (ms = 300) => new Promise<void>(r => setTimeout(r, ms));
