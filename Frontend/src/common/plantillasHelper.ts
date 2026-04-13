// Helper para gestionar plantillas compartidas entre módulos

export interface Plantilla {
  id: number;
  nombre: string;
  tipo: 'email' | 'whatsapp';
  contenido: string;
  variables: string[];
  usosTotal: number;
  estado: 'activa' | 'inactiva';
}

const STORAGE_KEY = 'plantillas_crm';

// Plantillas por defecto si no hay guardadas
const PLANTILLAS_DEFAULT: Plantilla[] = [
  {
    id: 1,
    nombre: 'Seguimiento Inicial',
    tipo: 'email',
    contenido: 'Hola {{nombre}}, queremos felicitarte por tu interés en nuestro producto. ¿Podemos agendar una llamada?',
    variables: ['nombre'],
    usosTotal: 42,
    estado: 'activa'
  },
  {
    id: 2,
    nombre: 'Recordatorio WhatsApp',
    tipo: 'whatsapp',
    contenido: 'Hola {{nombre}} 👋 Solo para recordarte que tienes una propuesta de descuento pendiente. ¿Qué preguntas tienes?',
    variables: ['nombre'],
    usosTotal: 128,
    estado: 'activa'
  },
  {
    id: 3,
    nombre: 'Cierre de Venta',
    tipo: 'email',
    contenido: 'Genial {{nombre}}, nos encanta tu decisión. Te enviaremos los detalles de tu compra en breve.',
    variables: ['nombre'],
    usosTotal: 15,
    estado: 'activa'
  },
  {
    id: 4,
    nombre: 'Feedback Post-Venta',
    tipo: 'whatsapp',
    contenido: 'Gracias {{nombre}} por tu compra 🎉 Nos gustaría saber tu opinión. ¿Qué te pareció?',
    variables: ['nombre'],
    usosTotal: 67,
    estado: 'activa'
  }
];

/**
 * Obtiene todas las plantillas almacenadas en localStorage
 */
export const obtenerPlantillas = (): Plantilla[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Plantilla[];
    }
  } catch (error) {
    console.error('Error al obtener plantillas de localStorage:', error);
  }
  return PLANTILLAS_DEFAULT;
};

/**
 * Obtiene las plantillas activas filtradas por tipo
 */
export const obtenerPlantillasActivas = (tipo?: 'email' | 'whatsapp'): Plantilla[] => {
  const plantillas = obtenerPlantillas();
  return plantillas.filter(p => 
    p.estado === 'activa' && (tipo ? p.tipo === tipo : true)
  );
};

/**
 * Obtiene una plantilla específica por ID
 */
export const obtenerPlantillaPorId = (id: number): Plantilla | undefined => {
  const plantillas = obtenerPlantillas();
  return plantillas.find(p => p.id === id);
};

/**
 * Reemplaza variables en el contenido de una plantilla
 * Ej: "Hola {{nombre}}" con { nombre: "Juan" } => "Hola Juan"
 */
export const reemplazarVariables = (contenido: string, variables: Record<string, string>): string => {
  let resultado = contenido;
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    resultado = resultado.replace(regex, value);
  });
  return resultado;
};

/**
 * Incrementa el contador de uso de una plantilla
 */
export const incrementarUsoPlantilla = (id: number): void => {
  try {
    const plantillas = obtenerPlantillas();
    const plantilla = plantillas.find(p => p.id === id);
    if (plantilla) {
      plantilla.usosTotal++;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plantillas));
    }
  } catch (error) {
    console.error('Error al incrementar uso de plantilla:', error);
  }
};

/**
 * Guarda las plantillas en localStorage
 */
export const guardarPlantillas = (plantillas: Plantilla[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plantillas));
  } catch (error) {
    console.error('Error al guardar plantillas en localStorage:', error);
  }
};
