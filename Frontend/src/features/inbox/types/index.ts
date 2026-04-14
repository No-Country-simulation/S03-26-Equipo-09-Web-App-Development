/**
 * Tipos compartidos del feature Inbox
 * Centralizados para evitar duplicación y facilitar mantenimiento
 */

export interface Mensaje {
  id: number;
  contenido: string;
  fechaHora: string;
  tipo: 'entrada' | 'salida';
  remitente: string;
}

export interface Conversacion {
  id: number;
  canal: 'Email' | 'WhatsApp';
  contenido: string;
  fechaHora: string;
  contactoId: number;
  contactoNombre?: string;
  contactoEmail?: string;
  estado?: 'pendiente' | 'respondido' | 'cerrado';
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
  canal: 'Todos' | 'Email' | 'WhatsApp';
  estado: 'Todos' | 'pendiente' | 'respondido' | 'cerrado';
  busqueda: string;
}
