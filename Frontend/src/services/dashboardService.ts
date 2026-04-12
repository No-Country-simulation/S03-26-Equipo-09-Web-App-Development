import type { DashboardStats } from '../types/models';
import { apiGet } from './apiClient';

/** GET /api/dashboard/stats */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  return apiGet<DashboardStats>('/api/dashboard/stats');
};
