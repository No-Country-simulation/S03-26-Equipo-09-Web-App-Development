import type { Plantilla } from '../../../types/models';

/**
 * Mock data de plantillas — estructura idéntica al backend.
 * Backend model: com.startupcrm.crm_backend.model.Plantilla
 * Endpoint real: GET /api/plantillas
 */
export const MOCK_PLANTILLAS: Plantilla[] = [
  {
    id: 1,
    nombre: 'Bienvenida WhatsApp',
    contenido:
      'Hola {{nombre}}! 👋 Bienvenido a nuestro CRM. Soy tu asesor asignado. ¿En qué puedo ayudarte hoy?',
    canal: 'WhatsApp',
    esActiva: true,
  },
  {
    id: 2,
    nombre: 'Seguimiento Post-Demo',
    contenido:
      'Hola {{nombre}}, fue un placer hablar contigo hoy. Te envío el resumen de la demo y los próximos pasos. ¿Tienes alguna pregunta?',
    canal: 'WhatsApp',
    esActiva: true,
  },
  {
    id: 3,
    nombre: 'Propuesta Comercial',
    contenido:
      'Estimado/a {{nombre}},\n\nAdjunto encontrarás la propuesta comercial personalizada para {{empresa}}.\n\nQuedamos atentos a sus comentarios.\n\nSaludos,\nEl equipo de CRM Intelligent',
    canal: 'Email',
    esActiva: true,
  },
  {
    id: 4,
    nombre: 'Recordatorio de Pago',
    contenido:
      'Hola {{nombre}}, te recordamos que tienes una factura pendiente de {{monto}}. ¿Necesitas ayuda con el proceso de pago?',
    canal: 'WhatsApp',
    esActiva: true,
  },
  {
    id: 5,
    nombre: 'Reactivación de Lead',
    contenido:
      'Estimado {{nombre}},\n\nHace un tiempo tuvimos conversaciones sobre nuestros servicios. Queremos retomar el contacto y compartir novedades que podrían ser de su interés.\n\nSaludos cordiales',
    canal: 'Email',
    esActiva: false,
  },
  {
    id: 6,
    nombre: 'Confirmación de Cita',
    contenido:
      '✅ Confirmado! Tu cita está agendada para el {{fecha}} a las {{hora}}. Recibirás el link de videollamada 15 minutos antes.',
    canal: 'WhatsApp',
    esActiva: true,
  },
];
