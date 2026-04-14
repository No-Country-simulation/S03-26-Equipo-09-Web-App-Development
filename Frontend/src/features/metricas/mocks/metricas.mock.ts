/**
 * Mock data de metricas para el dashboard de admin
 * NOTA: Reemplazar con API real
 */

import type { MetricasAdmin, MetricasVendedor } from '../types/index';

export const METRICAS_ADMIN_MOCK: MetricasAdmin = {
  totalContactos: 150,
  mensajePorCanal: {
    whatsapp: 450,
    email: 320
  },
  leadsActivos: 45,
  vendedoresActivos: 3,
  tasaConversionGlobal: 28.5
};

export const METRICAS_VENDEDORES_MOCK: MetricasVendedor[] = [
  {
    vendedorId: 1,
    vendedorNombre: 'Carlos Mendoza',
    mensajesSuministrados: 245,
    tasaRespuesta: 92,
    tiempoPromedioRespuesta: 15,
    leadsAsignados: 50,
    leadsConvertidos: 14,
    tasaConversion: 28
  },
  {
    vendedorId: 2,
    vendedorNombre: 'Ana García',
    mensajesSuministrados: 198,
    tasaRespuesta: 88,
    tiempoPromedioRespuesta: 22,
    leadsAsignados: 45,
    leadsConvertidos: 12,
    tasaConversion: 27
  },
  {
    vendedorId: 3,
    vendedorNombre: 'Marco Rodríguez',
    mensajesSuministrados: 212,
    tasaRespuesta: 85,
    tiempoPromedioRespuesta: 18,
    leadsAsignados: 55,
    leadsConvertidos: 16,
    tasaConversion: 29
  }
];

export const getMetricasAdminMock = (): MetricasAdmin => {
  return METRICAS_ADMIN_MOCK;
};

export const getMetricasVendedoresMock = (): MetricasVendedor[] => {
  return METRICAS_VENDEDORES_MOCK;
};
