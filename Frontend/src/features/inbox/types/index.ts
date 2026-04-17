/**
 * Tipos compartidos del feature Inbox
 * Centralizados para evitar duplicación y facilitar mantenimiento
 */

export type EstadoConversacion = 'NO_LEIDO' | 'LEIDO' | 'RESPONDIDO' | 'CERRADO' | 'FALLIDO';
export type CanalConversacion = 'Email' | 'WhatsApp';

export interface Mensaje {
  id: number;
  contenido: string;
  fechaHora: string;
  tipo: 'entrada' | 'salida';
  remitente: string;
}

export interface Conversacion {
  id: number;
  canal: CanalConversacion;
  contenido: string;
  fechaHora: string;
  contactoId: number;
  contactoNombre?: string;
  contactoEmail?: string;
  estado?: EstadoConversacion;
  vendedorAsignadoId?: number;
  vendedorAsignadoNombre?: string;
  etiqueta?: string;
  mensajes?: Mensaje[];
  nombreContacto?: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'vendedor';
}

export interface InboxFilter {
  canal: 'Todos' | CanalConversacion;
  estado: 'Todos' | EstadoConversacion;
  busqueda: string;
}
