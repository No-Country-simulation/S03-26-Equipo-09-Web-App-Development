/**
 * Tipos compartidos del feature Contactos
 */

export interface Contacto {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  estado: 'LEAD_NUEVO' | 'CONTACTADO' | 'NEGOCIACION' | 'CLIENTE' | 'PERDIDO';
  empresa?: string;
  vendedorId?: number;
}

export interface ContactoFilter {
  estado: string;
  vendedor: string;
  busqueda: string;
}
