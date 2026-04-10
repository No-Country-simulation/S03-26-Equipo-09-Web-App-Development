import type { Seguimiento } from '../../../types/models';

const C1 = { id: 1, nombre: 'Carlos Pérez', email: 'carlos.perez@example.com', telefono: '+57 310 123 4567', estado: 'CLIENTE' as const };
const C2 = { id: 2, nombre: 'María López', email: 'maria.lopez@example.com', telefono: '+57 315 987 6543', estado: 'EN_SEGUIMIENTO' as const };
const C3 = { id: 3, nombre: 'Juan García', email: 'juan.garcia@example.com', telefono: '+57 301 456 7890', estado: 'LEAD_ACTIVO' as const };
const C4 = { id: 4, nombre: 'Ana Rodríguez', email: 'ana.rodriguez@startup.co', telefono: '+57 320 234 5678', estado: 'LEAD_ACTIVO' as const };
const C6 = { id: 6, nombre: 'Sofía Herrera', email: 'sofia.h@comercio.com', telefono: '+57 312 567 8901', estado: 'CLIENTE' as const };
const C7 = { id: 7, nombre: 'Diego Vargas', email: 'diego.v@tech.io', telefono: '+57 300 678 9012', estado: 'EN_SEGUIMIENTO' as const };

/**
 * Mock data de seguimientos — estructura idéntica al backend.
 * Backend model: com.startupcrm.crm_backend.model.Seguimiento
 * Endpoint real: GET /api/seguimientos
 */
export const MOCK_SEGUIMIENTOS: Seguimiento[] = [
  { id: 1, tarea: 'Llamar a Carlos para confirmar renovación de contrato', fecha: '2026-04-10', completado: false, contacto: C1 },
  { id: 2, tarea: 'Enviar propuesta actualizada a María', fecha: '2026-04-10', completado: false, contacto: C2 },
  { id: 3, tarea: 'Agendar demo con Juan García', fecha: '2026-04-11', completado: false, contacto: C3 },
  { id: 4, tarea: 'Hacer seguimiento post-compra a Ana', fecha: '2026-04-08', completado: false, contacto: C4 },
  { id: 5, tarea: 'Confirmar entrega del contrato con Sofía', fecha: '2026-03-23', completado: true, contacto: C6 },
  { id: 6, tarea: 'Resolver incidencia de webhook con Diego', fecha: '2026-04-12', completado: false, contacto: C7 },
  { id: 7, tarea: 'Enviar factura mensual a Carlos', fecha: '2026-04-01', completado: true, contacto: C1 },
];
