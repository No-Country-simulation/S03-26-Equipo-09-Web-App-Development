import type { Conversacion } from '../types/models';
import { MOCK_CONVERSACIONES } from '../features/conversaciones/mocks/conversacionesMock';
// import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';

let conversacionesDb: Conversacion[] = [...MOCK_CONVERSACIONES];
let nextId = 100;

/** GET /api/conversaciones */
export const getConversaciones = async (): Promise<Conversacion[]> => {
  // TODO_INTEGRATION: return apiGet<Conversacion[]>('/api/conversaciones');
  await delay();
  return [...conversacionesDb].sort(
    (a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()
  );
};

/** POST /api/conversaciones */
export const createConversacion = async (
  data: Omit<Conversacion, 'id'>
): Promise<Conversacion> => {
  // TODO_INTEGRATION: return apiPost<Conversacion, typeof data>('/api/conversaciones', data);
  await delay();
  const nueva: Conversacion = { ...data, id: nextId++, leido: false };
  conversacionesDb = [nueva, ...conversacionesDb];
  return nueva;
};

/** PUT /api/conversaciones/:id — Marcar como leído */
export const marcarLeido = async (id: number): Promise<Conversacion> => {
  // TODO_INTEGRATION: return apiPut<Conversacion>(`/api/conversaciones/${id}`, { leido: true });
  await delay(100);
  const found = conversacionesDb.find(c => c.id === id);
  if (!found) throw new Error(`Conversación ${id} no encontrada`);
  const actualizada: Conversacion = { ...found, leido: true };
  conversacionesDb = conversacionesDb.map(c => (c.id === id ? actualizada : c));
  return actualizada;
};

/** DELETE /api/conversaciones/:id */
export const deleteConversacion = async (id: number): Promise<void> => {
  // TODO_INTEGRATION: return apiDelete(`/api/conversaciones/${id}`);
  await delay();
  conversacionesDb = conversacionesDb.filter(c => c.id !== id);
};

/** Cuenta mensajes sin leer */
export const countSinLeer = async (): Promise<number> => {
  const lista = await getConversaciones();
  return lista.filter(c => !c.leido).length;
};

const delay = (ms = 300) => new Promise<void>(r => setTimeout(r, ms));
