/**
 * Tipos compartidos del feature Metricas
 */

export interface MetricasVendedor {
  vendedorId: number;
  vendedorNombre: string;
  mensajesSuministrados: number;
  tasaRespuesta: number;
  tiempoPromedioRespuesta: number;
  leadsAsignados: number;
  leadsConvertidos: number;
  tasaConversion: number;
}

export interface MetricasAdmin {
  totalContactos: number;
  mensajePorCanal: {
    whatsapp: number;
    email: number;
  };
  leadsActivos: number;
  vendedoresActivos: number;
  tasaConversionGlobal: number;
}
