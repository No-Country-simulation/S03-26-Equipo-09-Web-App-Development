/**
 * Tipos compartidos del feature Plantillas
 */

export interface Plantilla {
  id: number;
  nombre: string;
  contenido: string;
  canal: 'Email' | 'WhatsApp';
  variables: string[];
  usos: number;
}
