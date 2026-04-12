import type { Contacto } from '../types/models';
import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';

/**
 * SERVICIO DE CONTACTOS — Integración con Backend Spring Boot
 */

/** GET /api/contactos */
export const getContactos = async (): Promise<Contacto[]> => {
  return apiGet<Contacto[]>('/api/contactos');
};

/** GET /api/contactos/:id */
export const getContactoById = async (id: number): Promise<Contacto> => {
  return apiGet<Contacto>(`/api/contactos/${id}`);
};

/** POST /api/contactos */
export const createContacto = async (
  data: Omit<Contacto, 'id' | 'fechaCreacion'>
): Promise<Contacto> => {
  return apiPost<Contacto, typeof data>('/api/contactos', data);
};

/** PUT /api/contactos/:id */
export const updateContacto = async (
  id: number,
  data: Partial<Omit<Contacto, 'id'>>
): Promise<Contacto> => {
  return apiPut<Contacto, typeof data>(`/api/contactos/${id}`, data);
};

/** DELETE /api/contactos/:id */
export const deleteContacto = async (id: number): Promise<void> => {
  return apiDelete(`/api/contactos/${id}`);
};
