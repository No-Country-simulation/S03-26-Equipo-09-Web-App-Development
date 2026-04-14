/**
 * Mock data de contactos para tabla de Contactos
 * NOTA: Reemplazar con API real cuando esté disponible
 */

import type { Contacto } from '../types/index';

export const CONTACTOS_MOCK: Contacto[] = [
  {
    id: 101,
    nombre: 'Juan García',
    email: 'juan@example.com',
    telefono: '+34 600 123 456',
    estado: 'NEGOCIACION',
    empresa: 'Tech Innovations',
    vendedorId: 1
  },
  {
    id: 102,
    nombre: 'María Rodríguez',
    email: 'maria.r@company.com',
    telefono: '+34 601 234 567',
    estado: 'CLIENTE',
    empresa: 'Global Solutions',
    vendedorId: 1
  },
  {
    id: 103,
    nombre: 'Roberto Martínez',
    email: 'rob.martinez@startup.io',
    telefono: '+34 602 345 678',
    estado: 'CLIENTE',
    empresa: 'Startup Ventures',
    vendedorId: 2
  },
  {
    id: 104,
    nombre: 'David López',
    email: 'david.lopez@enterprise.com',
    telefono: '+34 603 456 789',
    estado: 'CLIENTE',
    empresa: 'Enterprise Corp',
    vendedorId: 1
  },
  {
    id: 105,
    nombre: 'Laura Fernández',
    email: 'laura.f@techstartup.co',
    telefono: '+34 604 567 890',
    estado: 'PERDIDO',
    empresa: 'Tech Startup',
    vendedorId: 2
  },
  {
    id: 106,
    nombre: 'Carlos Ruiz',
    email: 'carlos.ruiz@innovation.es',
    telefono: '+34 605 678 901',
    estado: 'CONTACTADO',
    empresa: 'Innovation Hub',
    vendedorId: 3
  }
];

/**
 * Vendedores mock para filtros en Contactos page
 * (Centralizado para reutilización)
 */
export const VENDEDORES_CONTACTOS_MOCK = [
  { id: 1, nombre: 'Juan García', email: 'juan@crm.com' },
  { id: 2, nombre: 'María López', email: 'maria@crm.com' },
  { id: 3, nombre: 'Carlos Ruiz', email: 'carlos@crm.com' },
  { id: 4, nombre: 'Ana Chen', email: 'ana@crm.com' }
];

export const getContactosMock = (): Contacto[] => {
  return CONTACTOS_MOCK;
};

export const getContactosPorEstado = (estado: string): Contacto[] => {
  if (estado === 'Todos') return CONTACTOS_MOCK;
  return CONTACTOS_MOCK.filter(c => c.estado === estado);
};

export const getVendedoresContactosMock = () => {
  return VENDEDORES_CONTACTOS_MOCK;
};

export const getContactosPorVendedor = (vendedorId: string, estado?: string): Contacto[] => {
  let filtered = CONTACTOS_MOCK.filter(c => c.vendedorId === parseInt(vendedorId));
  if (estado && estado !== 'Todos') {
    filtered = filtered.filter(c => c.estado === estado);
  }
  return filtered;
};
