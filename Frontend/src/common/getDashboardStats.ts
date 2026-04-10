import { useQuery } from '@tanstack/react-query';
import type { DashboardStats } from '../types';
import type { ApiResponse } from '../../../common/types';

// Nota: Asumiendo que existe una instancia de API configurada (ej. axios o fetch wrapper)
const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await fetch('/api/dashboard/stats');
  const result: ApiResponse<DashboardStats> = await response.json();
  return result.data;
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: fetchDashboardStats,
  });
};