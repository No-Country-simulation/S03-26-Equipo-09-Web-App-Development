/**
 * Mock data de usuarios (vendedores) para Inbox Admin
 * NOTA: Reemplazar con API real en src/features/inbox/services/inboxService.ts
 */

import type { Usuario } from '../types/index';

export const USUARIOS_MOCK: Usuario[] = [
  {
    id: 1,
    nombre: 'Carlos Mendoza',
    email: 'carlos.mendoza@crm.com',
    rol: 'vendedor'
  },
  {
    id: 2,
    nombre: 'Ana García',
    email: 'ana.garcia@crm.com',
    rol: 'vendedor'
  },
  {
    id: 3,
    nombre: 'Marco Rodríguez',
    email: 'marco.rodriguez@crm.com',
    rol: 'vendedor'
  }
];

export const getVendedoresMock = (): Usuario[] => {
  // En producción: return await contactoService.getVendedores()
  return USUARIOS_MOCK;
};
