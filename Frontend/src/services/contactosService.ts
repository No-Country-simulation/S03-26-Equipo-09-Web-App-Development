import type { Contacto } from '../types/models';
import { MOCK_CONTACTOS } from '../features/contactos/mocks/contactosMock';
// import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';

// Estado en memoria para simular CRUD (persiste durante la sesión del browser)
let contactosDb: Contacto[] = [...MOCK_CONTACTOS];
let nextId = 100; // Evita colisión con IDs del mock

/**
 * SERVICIO DE CONTACTOS — Falsa Conexión
 * Backend endpoint base: GET|POST|PUT|DELETE /api/contactos
 *
 * Para conectar con el backend real:
 *  1. Descomenta el import de apiClient arriba
 *  2. Reemplaza cada función mock con la llamada equivalente comentada
 */

/** GET /api/contactos */
export const getContactos = async (): Promise<Contacto[]> => {
  // TODO_INTEGRATION: return apiGet<Contacto[]>('/api/contactos');
  await delay();
  return [...contactosDb];
};

/** GET /api/contactos/:id */
export const getContactoById = async (id: number): Promise<Contacto> => {
  // TODO_INTEGRATION: return apiGet<Contacto>(`/api/contactos/${id}`);
  await delay();
  const found = contactosDb.find(c => c.id === id);
  if (!found) throw new Error(`Contacto con id ${id} no encontrado`);
  return { ...found };
};

/** POST /api/contactos */
export const createContacto = async (
  data: Omit<Contacto, 'id' | 'fechaCreacion'>
): Promise<Contacto> => {
  // TODO_INTEGRATION: return apiPost<Contacto, typeof data>('/api/contactos', data);
  await delay();
  const nuevo: Contacto = {
    id: nextId++,
    nombre: data.nombre,
    email: data.email,
    telefono: data.telefono,
    estado: data.estado,
    fechaCreacion: new Date().toISOString(),
  };
  contactosDb = [...contactosDb, nuevo];
  return nuevo;
};

/** PUT /api/contactos/:id */
export const updateContacto = async (
  id: number,
  data: Partial<Omit<Contacto, 'id'>>
): Promise<Contacto> => {
  // TODO_INTEGRATION: return apiPut<Contacto, typeof data>(`/api/contactos/${id}`, data);
  await delay();
  const index = contactosDb.findIndex(c => c.id === id);
  if (index === -1) throw new Error(`Contacto con id ${id} no encontrado`);
  const actualizado: Contacto = { ...contactosDb[index]!, ...data };
  contactosDb = contactosDb.map(c => (c.id === id ? actualizado : c));
  return actualizado;
};

/** DELETE /api/contactos/:id */
export const deleteContacto = async (id: number): Promise<void> => {
  // TODO_INTEGRATION: return apiDelete(`/api/contactos/${id}`);
  await delay();
  if (!contactosDb.some(c => c.id === id)) {
    throw new Error(`Contacto con id ${id} no encontrado`);
  }
  contactosDb = contactosDb.filter(c => c.id !== id);
};

const delay = (ms = 300) => new Promise<void>(resolve => setTimeout(resolve, ms));
