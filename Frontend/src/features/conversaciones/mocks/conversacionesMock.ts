import type { Conversacion } from '../../../types/models';

const C1 = { id: 1, nombre: 'Carlos Pérez', email: 'carlos.perez@example.com', telefono: '+57 310 123 4567', estado: 'CLIENTE' as const, fechaCreacion: '2026-03-20T10:00:00Z' };
const C2 = { id: 2, nombre: 'María López', email: 'maria.lopez@example.com', telefono: '+57 315 987 6543', estado: 'EN_SEGUIMIENTO' as const, fechaCreacion: '2026-03-21T15:30:00Z' };
const C3 = { id: 3, nombre: 'Juan García', email: 'juan.garcia@example.com', telefono: '+57 301 456 7890', estado: 'LEAD_ACTIVO' as const, fechaCreacion: '2026-03-22T09:15:00Z' };
const C4 = { id: 4, nombre: 'Ana Rodríguez', email: 'ana.rodriguez@startup.co', telefono: '+57 320 234 5678', estado: 'LEAD_ACTIVO' as const, fechaCreacion: '2026-04-01T11:00:00Z' };
const C6 = { id: 6, nombre: 'Sofía Herrera', email: 'sofia.h@comercio.com', telefono: '+57 312 567 8901', estado: 'CLIENTE' as const, fechaCreacion: '2026-03-10T14:30:00Z' };
const C7 = { id: 7, nombre: 'Diego Vargas', email: 'diego.v@tech.io', telefono: '+57 300 678 9012', estado: 'EN_SEGUIMIENTO' as const, fechaCreacion: '2026-03-28T10:00:00Z' };

/**
 * Mock data de conversaciones — estructura idéntica al backend.
 * Backend model: com.startupcrm.crm_backend.model.Conversacion
 * Endpoint real: GET /api/conversaciones
 */
export const MOCK_CONVERSACIONES: Conversacion[] = [
  { id: 1, canal: 'WhatsApp', contenido: 'Hola! Estoy interesado en su plan Teams. ¿Pueden darme más info?', fechaHora: '2026-04-09T10:23:00Z', contacto: C3, leido: false },
  { id: 2, canal: 'Email', contenido: 'Buenos días. Les envío el contrato revisado para su aprobación final.', fechaHora: '2026-04-09T09:05:00Z', contacto: C1, leido: false },
  { id: 3, canal: 'WhatsApp', contenido: '¿Cuándo pueden hacer una demo del sistema?', fechaHora: '2026-04-08T17:45:00Z', contacto: C4, leido: true },
  { id: 4, canal: 'Email', contenido: 'Recibí la propuesta. Necesito discutirlo con mi equipo antes de decidir.', fechaHora: '2026-04-08T14:30:00Z', contacto: C2, leido: true },
  { id: 5, canal: 'WhatsApp', contenido: 'Ya completé el pago. ¿Cuándo activan mi cuenta?', fechaHora: '2026-04-07T11:20:00Z', contacto: C6, leido: true },
  { id: 6, canal: 'Email', contenido: 'Necesito soporte con la integración de WhatsApp Business. El webhook no responde.', fechaHora: '2026-04-07T09:00:00Z', contacto: C7, leido: false },
  { id: 7, canal: 'WhatsApp', contenido: 'Gracias por la llamada de ayer! Confirmamos el plan Enterprise.', fechaHora: '2026-04-06T16:10:00Z', contacto: C1, leido: true },
];
