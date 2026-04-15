/**
 * Mock data de conversaciones para Inbox
 * Datos simulados realistas para ejemplo y testing
 * NOTA: Reemplazar con llamadas API en src/features/inbox/services/inboxService.ts
 */

import type { Conversacion } from '../types/index';

/**
 * Conversaciones mock por vendedor
 * TODO: Conectar a API real en integration
 */
export const CONVERSACIONES_MOCK_VENDEDOR: Conversacion[] = [
  {
    id: 1,
    canal: 'WhatsApp',
    contenido: '¿Cuál es el precio de vuestro producto premium?',
    fechaHora: new Date(Date.now() - 3600000).toISOString(),
    contactoId: 101,
    contactoNombre: 'Juan García',
    contactoEmail: 'juan@example.com',
    estado: 'pendiente',
    etiqueta: 'Lead Activo',
    mensajes: [
      {
        id: 1,
        contenido: '¿Cuál es el precio de vuestro producto premium?',
        fechaHora: new Date(Date.now() - 3600000).toISOString(),
        tipo: 'entrada',
        remitente: 'Juan García'
      },
      {
        id: 2,
        contenido:
          'Hola Juan, el producto premium tiene un costo de $299.99 al mes. Incluye soporte 24/7 💪',
        fechaHora: new Date(Date.now() - 3500000).toISOString(),
        tipo: 'salida',
        remitente: 'Vendedor'
      },
      {
        id: 3,
        contenido: '¿Hay descuento por pago anual?',
        fechaHora: new Date(Date.now() - 3400000).toISOString(),
        tipo: 'entrada',
        remitente: 'Juan García'
      },
      {
        id: 4,
        contenido:
          'Sí, si pagas anual te damos 20% de descuento. ¿Te interesa iniciar una prueba gratuita?',
        fechaHora: new Date(Date.now() - 3300000).toISOString(),
        tipo: 'salida',
        remitente: 'Vendedor'
      }
    ]
  },
  {
    id: 2,
    canal: 'Email',
    contenido: 'Solicitud de información sobre plan empresarial',
    fechaHora: new Date(Date.now() - 7200000).toISOString(),
    contactoId: 102,
    contactoNombre: 'María Rodríguez',
    contactoEmail: 'maria.r@company.com',
    estado: 'respondido',
    etiqueta: 'Cliente',
    mensajes: [
      {
        id: 1,
        contenido: 'Solicitud de información sobre plan empresarial',
        fechaHora: new Date(Date.now() - 7200000).toISOString(),
        tipo: 'entrada',
        remitente: 'María Rodríguez'
      }
    ]
  },
  {
    id: 3,
    canal: 'WhatsApp',
    contenido: 'Demanda de soporte técnico para integración',
    fechaHora: new Date(Date.now() - 1800000).toISOString(),
    contactoId: 103,
    contactoNombre: 'Roberto Martínez',
    contactoEmail: 'rob.martinez@startup.io',
    estado: 'cerrado',
    etiqueta: 'Cliente',
    mensajes: [
      {
        id: 1,
        contenido: 'Tengo un problema con la integración de API',
        fechaHora: new Date(Date.now() - 1800000).toISOString(),
        tipo: 'entrada',
        remitente: 'Roberto Martínez'
      },
      {
        id: 2,
        contenido:
          'Hola Roberto, te envío la documentación y un video tutorial. ¿Qué error específico recibes?',
        fechaHora: new Date(Date.now() - 1700000).toISOString(),
        tipo: 'salida',
        remitente: 'Vendedor'
      },
      {
        id: 3,
        contenido: 'Perfecto, ya funcionó! Muchas gracias',
        fechaHora: new Date(Date.now() - 1600000).toISOString(),
        tipo: 'entrada',
        remitente: 'Roberto Martínez'
      },
      {
        id: 4,
        contenido: 'De nada! Cualquier otra duda contactame. ¡Que disfrutes! 🚀',
        fechaHora: new Date(Date.now() - 1500000).toISOString(),
        tipo: 'salida',
        remitente: 'Vendedor'
      }
    ]
  },
  {
    id: 4,
    canal: 'Email',
    contenido: 'Renovación de suscripción - Facturación',
    fechaHora: new Date(Date.now() - 5400000).toISOString(),
    contactoId: 104,
    contactoNombre: 'David López',
    contactoEmail: 'david.lopez@enterprise.com',
    estado: 'cerrado',
    etiqueta: 'Cliente',
    mensajes: [
      {
        id: 1,
        contenido: 'Hola, necesito renovar mi suscripción. ¿Cómo procedo?',
        fechaHora: new Date(Date.now() - 5400000).toISOString(),
        tipo: 'entrada',
        remitente: 'David López'
      },
      {
        id: 2,
        contenido:
          'Hola David, tu suscripción se renueva automáticamente el próximo mes. Te enviaré el detalle por correo.',
        fechaHora: new Date(Date.now() - 5300000).toISOString(),
        tipo: 'salida',
        remitente: 'Vendedor'
      }
    ]
  },
  {
    id: 5,
    canal: 'WhatsApp',
    contenido: 'Ya no quiero el producto, muchas gracias',
    fechaHora: new Date(Date.now() - 2700000).toISOString(),
    contactoId: 105,
    contactoNombre: 'Laura Fernández',
    contactoEmail: 'laura.f@techstartup.co',
    estado: 'cerrado',
    etiqueta: 'Inactivo',
    mensajes: [
      {
        id: 1,
        contenido: 'Ya no quiero el producto, muchas gracias',
        fechaHora: new Date(Date.now() - 2700000).toISOString(),
        tipo: 'entrada',
        remitente: 'Laura Fernández'
      }
    ]
  }
];

/**
 * Conversaciones mock para Admin (múltiples vendedores)
 */
export const CONVERSACIONES_MOCK_ADMIN: Conversacion[] = [
  ...CONVERSACIONES_MOCK_VENDEDOR,
  {
    id: 6,
    canal: 'WhatsApp',
    contenido: 'Consulta sobre características avanzadas',
    fechaHora: new Date(Date.now() - 900000).toISOString(),
    contactoId: 106,
    contactoNombre: 'Carlos Ruiz',
    contactoEmail: 'carlos.ruiz@innovation.es',
    estado: 'pendiente',
    etiqueta: 'Lead Calificado',
    mensajes: [
      {
        id: 1,
        contenido: '¿Qué características avanzadas tiene el plan pro?',
        fechaHora: new Date(Date.now() - 900000).toISOString(),
        tipo: 'entrada',
        remitente: 'Carlos Ruiz'
      }
    ]
  }
];

export const getConversacionesPorVendedor = (_vendedorId: number) => {
  // En producción, esto llamaría a: conversacionService.getByVendedor(_vendedorId)
  return CONVERSACIONES_MOCK_VENDEDOR;
};
