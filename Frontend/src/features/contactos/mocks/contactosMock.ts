import type { Contacto } from '../../../types/models';

/**
 * Mock data de contactos — estructura idéntica al backend.
 * Backend model: com.startupcrm.crm_backend.model.Contacto
 * Endpoint real: GET /api/contactos
 */
export const MOCK_CONTACTOS: Contacto[] = [
  { id: 1, nombre: 'Carlos Pérez', email: 'carlos.perez@example.com', telefono: '+57 310 123 4567', estado: 'CLIENTE', fechaCreacion: '2026-03-20T10:00:00Z' },
  { id: 2, nombre: 'María López', email: 'maria.lopez@example.com', telefono: '+57 315 987 6543', estado: 'EN_SEGUIMIENTO', fechaCreacion: '2026-03-21T15:30:00Z' },
  { id: 3, nombre: 'Juan García', email: 'juan.garcia@example.com', telefono: '+57 301 456 7890', estado: 'LEAD_ACTIVO', fechaCreacion: '2026-03-22T09:15:00Z' },
  { id: 4, nombre: 'Ana Rodríguez', email: 'ana.rodriguez@startup.co', telefono: '+57 320 234 5678', estado: 'LEAD_ACTIVO', fechaCreacion: '2026-04-01T11:00:00Z' },
  { id: 5, nombre: 'Pedro Martínez', email: 'pedro.m@pymes.co', telefono: '+57 311 345 6789', estado: 'PERDIDO', fechaCreacion: '2026-02-15T08:00:00Z' },
  { id: 6, nombre: 'Sofía Herrera', email: 'sofia.h@comercio.com', telefono: '+57 312 567 8901', estado: 'CLIENTE', fechaCreacion: '2026-03-10T14:30:00Z' },
  { id: 7, nombre: 'Diego Vargas', email: 'diego.v@tech.io', telefono: '+57 300 678 9012', estado: 'EN_SEGUIMIENTO', fechaCreacion: '2026-03-28T10:00:00Z' },
  { id: 8, nombre: 'Valentina Cruz', email: 'v.cruz@digital.co', telefono: '+57 316 789 0123', estado: 'LEAD_ACTIVO', fechaCreacion: '2026-04-05T16:00:00Z' },
];
