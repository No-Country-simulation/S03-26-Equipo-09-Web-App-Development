/**
 * Mock data de plantillas de respuesta
 * NOTA: Reemplazar con API de Brevo cuando esté integrada
 */

import type { Plantilla } from '../types/index';

export const PLANTILLAS_MOCK: Plantilla[] = [
  {
    id: 1,
    nombre: 'Bienvenida a cliente nuevo',
    contenido:
      'Hola {{nombre}}, bienvenido a nuestro CRM. Tu cuenta ya está activa. ¿Necesitas ayuda con cualquier cosa?',
    canal: 'WhatsApp',
    variables: ['nombre'],
    usos: 12
  },
  {
    id: 2,
    nombre: 'Seguimiento de lead',
    contenido:
      'Hola {{nombre}}, solo quería hacer seguimiento sobre {{producto}}. ¿Tienes alguna duda? 😊',
    canal: 'WhatsApp',
    variables: ['nombre', 'producto'],
    usos: 8
  },
  {
    id: 3,
    nombre: 'Propuesta de precio',
    contenido:
      'Buenos días {{nombre}}, te envío nuestra propuesta por {{producto}} al precio de {{precio}}. ¿Qué te parece?',
    canal: 'Email',
    variables: ['nombre', 'producto', 'precio'],
    usos: 5
  },
  {
    id: 4,
    nombre: 'Cierre de venta',
    contenido: '¡Excelente {{nombre}}! Te hemos activado tu suscripción a {{plan}}. Bienvenido! 🎉',
    canal: 'Email',
    variables: ['nombre', 'plan'],
    usos: 3
  },
  {
    id: 5,
    nombre: 'Recuperación de cliente',
    contenido:
      'Hola {{nombre}}, echamos de menos tu participación. ¿Hay algo que pueda ayudarte? Tenemos nuevas características para ti.',
    canal: 'WhatsApp',
    variables: ['nombre'],
    usos: 2
  }
];

export const getPlantillasMock = (): Plantilla[] => {
  return PLANTILLAS_MOCK;
};

export const getPlantillasPorCanal = (canal: 'Email' | 'WhatsApp'): Plantilla[] => {
  return PLANTILLAS_MOCK.filter(p => p.canal === canal);
};
