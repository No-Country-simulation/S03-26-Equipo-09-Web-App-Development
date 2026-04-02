export type EstadoLead = 'LEAD_NUEVO' | 'CONTACTADO' | 'NEGOCIACION' | 'CLIENTE' | 'PERDIDO';

export interface DashboardStats {
  totalContactos: number;
  interaccionesTotales: number;
  mensajesSinLeer: number;
  nuevosLeadsHoy: number;
  tareasPendientes: number;
  contactosPorEstado: Record<EstadoLead, number>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}