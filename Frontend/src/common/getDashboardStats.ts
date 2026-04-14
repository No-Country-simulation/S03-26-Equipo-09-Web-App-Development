import { useQuery } from '@tanstack/react-query';
import type { ApiResponse } from './types/types';

export interface DashboardStats {
  totalLeads: number;
  leadsMes: number;
  leadsSemana: number;
  conversionRate: number;
  leadsNuevos?: number;
  leadsTotalMes?: number;
  conversionRateMes?: number;
}

// Nota: Asumiendo que existe una instancia de API configurada (ej. axios o fetch wrapper)
const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await fetch('/api/dashboard/stats');
  const result = (await response.json()) as ApiResponse<DashboardStats>;
  return result.data;
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: fetchDashboardStats,
  });
};