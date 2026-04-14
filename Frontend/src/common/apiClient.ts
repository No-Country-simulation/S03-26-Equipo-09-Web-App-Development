/**
 * API Service para comunicación con el backend CRM
 */

const API_BASE_URL = (import.meta.env['VITE_API_URL'] as string) || 'http://localhost:8080/api';

// ==================== TIPOS ====================

export interface Contacto {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  estado: 'LEAD_ACTIVO' | 'EN_SEGUIMIENTO' | 'CALIFICADO' | 'CLIENTE';
}

export interface Conversacion {
  id: number;
  canal: 'Email' | 'WhatsApp';
  contenido: string;
  fechaHora: string;
  contactoId: number;
  vendedorAsignadoId?: number;
  vendedorAsignadoNombre?: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  role: 'ADMIN' | 'VENDEDOR';
  activo: boolean;
}

export interface Seguimiento {
  id: number;
  tarea: string;
  fecha: string;
  completado: boolean;
  contactoId: number;
}

export interface Metricas {
  totalContactos: number;
  totalConversaciones: number;
  totalSeguimientos: number;
  seguimientosCompletados: number;
  seguimientosPendientes: number;
  tasaCompletitudSeguimientos: number;
  contactosPorEstado: Record<string, number>;
  comunicacionPorCanal: Record<string, number>;
}

export interface FunnelMetricas {
  leadsActivos: number;
  enSeguimiento: number;
  calificados: number;
  clientes: number;
  tasaConversion_LED_a_Seguimiento: number;
  tasaConversion_Seguimiento_a_Calificado: number;
  tasaConversion_Calificado_a_Cliente: number;
}

interface ApiResponse<T> {
  data?: T;
  [key: string]: unknown;
}

// ==================== CONTACTOS ====================

export const contactoService = {
  // Obtener todos los contactos
  getAll: async (): Promise<Contacto[]> => {
    const response = await fetch(`${API_BASE_URL}/contactos`);
    const data = (await response.json()) as ApiResponse<Contacto[]>;
    return data.data || [];
  },

  // Obtener contacto por ID
  getById: async (id: number): Promise<Contacto> => {
    const response = await fetch(`${API_BASE_URL}/contactos/${id}`);
    const data = (await response.json()) as ApiResponse<Contacto>;
    return data.data || { id: 0, nombre: '', email: '', telefono: '', estado: 'LEAD_ACTIVO' };
  },

  // Crear contacto
  create: async (contacto: Omit<Contacto, 'id'>): Promise<Contacto> => {
    const response = await fetch(`${API_BASE_URL}/contactos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contacto)
    });
    const data = (await response.json()) as ApiResponse<Contacto>;
    return data.data || { id: 0, nombre: '', email: '', telefono: '', estado: 'LEAD_ACTIVO' };
  },

  // Actualizar contacto
  update: async (id: number, contacto: Partial<Contacto>): Promise<Contacto> => {
    const response = await fetch(`${API_BASE_URL}/contactos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contacto)
    });
    const data = (await response.json()) as ApiResponse<Contacto>;
    return data.data || { id: 0, nombre: '', email: '', telefono: '', estado: 'LEAD_ACTIVO' };
  },

  // Eliminar contacto
  delete: async (id: number): Promise<void> => {
    await fetch(`${API_BASE_URL}/contactos/${id}`, { method: 'DELETE' });
  },

  // Segmentación: Obtener por estado
  getByEstado: async (estado: string): Promise<Contacto[]> => {
    const response = await fetch(`${API_BASE_URL}/contactos/segmentacion/por-estado?estado=${estado}`);
    const data = (await response.json()) as ApiResponse<Contacto[]>;
    return data.data || [];
  },

  // Segmentación: Leads activos
  getLeadsActivos: async (): Promise<Contacto[]> => {
    const response = await fetch(`${API_BASE_URL}/contactos/segmentacion/leads-activos`);
    const data = (await response.json()) as ApiResponse<Contacto[]>;
    return data.data || [];
  },

  // Segmentación: En seguimiento
  getEnSeguimiento: async (): Promise<Contacto[]> => {
    const response = await fetch(`${API_BASE_URL}/contactos/segmentacion/en-seguimiento`);
    const data = (await response.json()) as ApiResponse<Contacto[]>;
    return data.data || [];
  },

  // Segmentación: Clientes
  getClientes: async (): Promise<Contacto[]> => {
    const response = await fetch(`${API_BASE_URL}/contactos/segmentacion/clientes`);
    const data = (await response.json()) as ApiResponse<Contacto[]>;
    return data.data || [];
  },

  // Segmentación: Leads calificados
  getLeadsCalificados: async (): Promise<Contacto[]> => {
    const response = await fetch(`${API_BASE_URL}/contactos/segmentacion/leads-calificados`);
    const data = (await response.json()) as ApiResponse<Contacto[]>;
    return data.data || [];
  }
};

// ==================== CONVERSACIONES ====================

export const conversacionService = {
  getAll: async (): Promise<Conversacion[]> => {
    const response = await fetch(`${API_BASE_URL}/conversaciones`);
    const data = (await response.json()) as ApiResponse<Conversacion[]>;
    return data.data || [];
  },

  getById: async (id: number): Promise<Conversacion> => {
    const response = await fetch(`${API_BASE_URL}/conversaciones/${id}`);
    const data = (await response.json()) as ApiResponse<Conversacion>;
    return data.data || { id: 0, canal: 'Email', contenido: '', fechaHora: '', contactoId: 0 };
  },

  getByVendedor: async (vendedorId: number): Promise<Conversacion[]> => {
    const response = await fetch(`${API_BASE_URL}/conversaciones/por-vendedor/${vendedorId}`);
    const data = (await response.json()) as ApiResponse<Conversacion[]>;
    return data.data || [];
  },

  getByContacto: async (contactoId: number): Promise<Conversacion[]> => {
    const response = await fetch(`${API_BASE_URL}/conversaciones/por-contacto/${contactoId}`);
    const data = (await response.json()) as ApiResponse<Conversacion[]>;
    return data.data || [];
  },

  create: async (conversacion: Omit<Conversacion, 'id'>): Promise<Conversacion> => {
    const response = await fetch(`${API_BASE_URL}/conversaciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(conversacion)
    });
    const data = (await response.json()) as ApiResponse<Conversacion>;
    return data.data || { id: 0, canal: 'Email', contenido: '', fechaHora: '', contactoId: 0 };
  },

  reasignarVendedor: async (conversacionId: number, nuevoVendedorId: number): Promise<Conversacion> => {
    const response = await fetch(`${API_BASE_URL}/conversaciones/reasignar-vendedor`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversacionId, nuevoVendedorId })
    });
    const data = (await response.json()) as ApiResponse<Conversacion>;
    return data.data || { id: 0, canal: 'Email', contenido: '', fechaHora: '', contactoId: 0 };
  }
};

// ==================== SEGUIMIENTOS ====================

export const seguimientoService = {
  getAll: async (): Promise<Seguimiento[]> => {
    const response = await fetch(`${API_BASE_URL}/seguimientos`);
    const data = (await response.json()) as ApiResponse<Seguimiento[]>;
    return data.data || [];
  },

  getById: async (id: number): Promise<Seguimiento> => {
    const response = await fetch(`${API_BASE_URL}/seguimientos/${id}`);
    const data = (await response.json()) as ApiResponse<Seguimiento>;
    return data.data || { id: 0, tarea: '', fecha: '', completado: false, contactoId: 0 };
  },

  create: async (seguimiento: Omit<Seguimiento, 'id'>): Promise<Seguimiento> => {
    const response = await fetch(`${API_BASE_URL}/seguimientos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(seguimiento)
    });
    const data = (await response.json()) as ApiResponse<Seguimiento>;
    return data.data || { id: 0, tarea: '', fecha: '', completado: false, contactoId: 0 };
  },

  update: async (id: number, seguimiento: Partial<Seguimiento>): Promise<Seguimiento> => {
    const response = await fetch(`${API_BASE_URL}/seguimientos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(seguimiento)
    });
    const data = (await response.json()) as ApiResponse<Seguimiento>;
    return data.data || { id: 0, tarea: '', fecha: '', completado: false, contactoId: 0 };
  },

  delete: async (id: number): Promise<void> => {
    await fetch(`${API_BASE_URL}/seguimientos/${id}`, { method: 'DELETE' });
  }
};

// ==================== METRICAS ====================

export const metricasService = {
  getResumen: async (): Promise<Metricas> => {
    const response = await fetch(`${API_BASE_URL}/metricas/resumen`);
    const data = (await response.json()) as ApiResponse<Metricas>;
    return data.data || {
      totalContactos: 0,
      totalConversaciones: 0,
      totalSeguimientos: 0,
      seguimientosCompletados: 0,
      seguimientosPendientes: 0,
      tasaCompletitudSeguimientos: 0,
      contactosPorEstado: {},
      comunicacionPorCanal: {}
    };
  },

  getFunnel: async (): Promise<FunnelMetricas> => {
    const response = await fetch(`${API_BASE_URL}/metricas/funnel`);
    const data = (await response.json()) as ApiResponse<FunnelMetricas>;
    return data.data || {
      leadsActivos: 0,
      enSeguimiento: 0,
      calificados: 0,
      clientes: 0,
      tasaConversion_LED_a_Seguimiento: 0,
      tasaConversion_Seguimiento_a_Calificado: 0,
      tasaConversion_Calificado_a_Cliente: 0
    };
  },

  getSeguimientos: async () => {
    const response = await fetch(`${API_BASE_URL}/metricas/seguimientos`);
    const data = (await response.json()) as ApiResponse<unknown>;
    return data.data;
  },

  getConversaciones: async () => {
    const response = await fetch(`${API_BASE_URL}/metricas/conversaciones`);
    const data = (await response.json()) as ApiResponse<unknown>;
    return data.data;
  },

  getCanales: async () => {
    const response = await fetch(`${API_BASE_URL}/metricas/canales`);
    const data = (await response.json()) as ApiResponse<unknown>;
    return data.data;
  }
};

// ==================== EXPORTACION ====================

export const exportService = {
  // Descargar PDFs
  descargarResumenPDF: async () => {
    const response = await fetch(`${API_BASE_URL}/metricas/descargar/resumen-pdf`);
    const blob = await response.blob();
    descargarArchivo(blob, 'CRM_Resumen_Metricas.pdf');
  },

  descargarFunnelPDF: async () => {
    const response = await fetch(`${API_BASE_URL}/metricas/descargar/funnel-pdf`);
    const blob = await response.blob();
    descargarArchivo(blob, 'CRM_Funnel_Ventas.pdf');
  },

  descargarSeguimientosPDF: async () => {
    const response = await fetch(`${API_BASE_URL}/metricas/descargar/seguimientos-pdf`);
    const blob = await response.blob();
    descargarArchivo(blob, 'CRM_Seguimientos.pdf');
  },

  // Descargar CSVs
  descargarResumenCSV: async () => {
    const response = await fetch(`${API_BASE_URL}/metricas/descargar/resumen-csv`);
    const blob = await response.blob();
    descargarArchivo(blob, 'CRM_Resumen_Metricas.csv');
  },

  descargarFunnelCSV: async () => {
    const response = await fetch(`${API_BASE_URL}/metricas/descargar/funnel-csv`);
    const blob = await response.blob();
    descargarArchivo(blob, 'CRM_Funnel_Ventas.csv');
  },

  descargarSeguimientosCSV: async () => {
    const response = await fetch(`${API_BASE_URL}/metricas/descargar/seguimientos-csv`);
    const blob = await response.blob();
    descargarArchivo(blob, 'CRM_Seguimientos.csv');
  }
};

// ==================== WHATSAPP ====================

export const whatsappService = {
  enviarMensaje: async (phoneNumber: string, message: string) => {
    const response = await fetch(`${API_BASE_URL}/whatsapp/enviar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, message })
    });
    const data = (await response.json()) as ApiResponse<unknown>;
    return data;
  },

  enviarMensajeYRegistrar: async (contactoId: number, mensaje: string) => {
    const response = await fetch(`${API_BASE_URL}/whatsapp/enviar-registrar/${contactoId}?mensaje=${encodeURIComponent(mensaje)}`, {
      method: 'POST'
    });
    const data = (await response.json()) as ApiResponse<unknown>;
    return data;
  },

  getStatus: async () => {
    const response = await fetch(`${API_BASE_URL}/whatsapp/status`);
    const data = (await response.json()) as ApiResponse<unknown>;
    return data.data;
  }
};

// ==================== EMAIL ====================

export const emailService = {
  enviarEmail: async (destinatario: string, asunto: string, contenido: string) => {
    const response = await fetch(`${API_BASE_URL}/email/enviar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destinatario, asunto, contenido })
    });
    const data = (await response.json()) as ApiResponse<unknown>;
    return data;
  }
};

// ==================== USUARIOS ====================

export const usuarioService = {
  getAll: async (): Promise<Usuario[]> => {
    const response = await fetch(`${API_BASE_URL}/usuarios`);
    const data = (await response.json()) as ApiResponse<Usuario[]>;
    return data.data || [];
  },

  getVendedores: async (): Promise<Usuario[]> => {
    const response = await fetch(`${API_BASE_URL}/usuarios/vendedores`);
    const data = (await response.json()) as ApiResponse<Usuario[]>;
    return data.data || [];
  },

  getById: async (id: number): Promise<Usuario> => {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`);
    const data = (await response.json()) as ApiResponse<Usuario>;
    return data.data || { id: 0, nombre: '', email: '', role: 'VENDEDOR', activo: true };
  },

  create: async (usuario: Omit<Usuario, 'id'>): Promise<Usuario> => {
    const response = await fetch(`${API_BASE_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario)
    });
    const data = (await response.json()) as ApiResponse<Usuario>;
    return data.data || { id: 0, nombre: '', email: '', role: 'VENDEDOR', activo: true };
  },

  update: async (id: number, usuario: Partial<Usuario>): Promise<Usuario> => {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario)
    });
    const data = (await response.json()) as ApiResponse<Usuario>;
    return data.data || { id: 0, nombre: '', email: '', role: 'VENDEDOR', activo: true };
  },

  delete: async (id: number): Promise<void> => {
    await fetch(`${API_BASE_URL}/usuarios/${id}`, { method: 'DELETE' });
  }
};

// ==================== UTILIDADES ====================

function descargarArchivo(blob: Blob, nombreArchivo: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nombreArchivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export const estadoLead = {
  LEAD_ACTIVO: 'LEAD_ACTIVO',
  EN_SEGUIMIENTO: 'EN_SEGUIMIENTO',
  CALIFICADO: 'CALIFICADO',
  CLIENTE: 'CLIENTE'
} as const;

export const estadoLabels: Record<string, string> = {
  LEAD_ACTIVO: 'Lead Activo',
  EN_SEGUIMIENTO: 'En Seguimiento',
  CALIFICADO: 'Calificado',
  CLIENTE: 'Cliente'
};
