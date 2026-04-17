/**
 * Servicio de Inbox
 * Centraliza toda la lógica de comunicación con la API de conversaciones
 * Facilita transición de mock a API real
 */

import type { Conversacion, Usuario } from '../types/index';
import { CONVERSACIONES_MOCK_VENDEDOR, CONVERSACIONES_MOCK_ADMIN } from '../mocks/conversaciones.mock';
import { USUARIOS_MOCK } from '../mocks/usuarios.mock';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'ASC' | 'DESC';
}

interface ApiPageResponse<T> {
  success: boolean;
  data: {
    content: T[];
    totalPages: number;
    totalElements: number;
    currentPage: number;
    pageSize: number;
  };
  message: string;
}

export class InboxService {

  /**
   * Obtener conversaciones del vendedor con paginación
   * GET /api/conversaciones/por-vendedor/:vendedorId?page=0&size=20&canal=WhatsApp
   */
  async getConversacionesPorVendedor(
    vendedorId: number,
    params: PaginationParams = { page: 0, size: 20 },
    canal?: string
  ): Promise<{ conversaciones: Conversacion[]; total: number; hasMore: boolean }> {
    try {
      const queryParams = new URLSearchParams({
        page: params.page?.toString() || '0',
        size: params.size?.toString() || '20',
        sort: params.sort || 'fechaHora',
        direction: params.direction || 'DESC'
      });

      if (canal) {
        queryParams.append('canal', canal);
      }

      const url = `${API_BASE_URL}/conversaciones/por-vendedor/${vendedorId}?${queryParams}`;
      console.log('📨 Fetching conversaciones:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const result = (await response.json()) as ApiPageResponse<Conversacion>;
      return {
        conversaciones: result.data?.content || [],
        total: result.data?.totalElements || 0,
        hasMore: result.data && (result.data?.currentPage < (result.data?.totalPages - 1))
      };
    } catch (error) {
      console.warn('⚠️ API error, retornando mock:', error);
      // Fallback a mock si falla la API
      return new Promise(resolve => {
        setTimeout(() => resolve({
          conversaciones: CONVERSACIONES_MOCK_VENDEDOR,
          total: CONVERSACIONES_MOCK_VENDEDOR.length,
          hasMore: false
        }), 500);
      });
    }
  }

  /**
   * Obtener todas las conversaciones (Admin) con paginación
   * GET /api/conversaciones?page=0&size=20&sort=fechaHora,desc
   */
  async getTodasConversaciones(
    params: PaginationParams = { page: 0, size: 20 }
  ): Promise<{ conversaciones: Conversacion[]; total: number; hasMore: boolean }> {
    try {
      const queryParams = new URLSearchParams({
        page: params.page?.toString() || '0',
        size: params.size?.toString() || '20',
        sort: params.sort || 'fechaHora',
        direction: params.direction || 'DESC'
      });

      const url = `${API_BASE_URL}/conversaciones?${queryParams}`;
      console.log('📨 Fetching all conversaciones:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const result = (await response.json()) as ApiPageResponse<Conversacion>;
      return {
        conversaciones: result.data?.content || [],
        total: result.data?.totalElements || 0,
        hasMore: result.data && (result.data?.currentPage < (result.data?.totalPages - 1))
      };
    } catch (error) {
      console.warn('⚠️ API error, retornando mock:', error);
      return new Promise(resolve => {
        setTimeout(() => resolve({
          conversaciones: CONVERSACIONES_MOCK_ADMIN,
          total: CONVERSACIONES_MOCK_ADMIN.length,
          hasMore: false
        }), 500);
      });
    }
  }

  /**
   * Buscar conversaciones
   * GET /api/conversaciones/search?busqueda=texto&page=0&size=20
   */
  async searchConversaciones(
    busqueda: string,
    params: PaginationParams = { page: 0, size: 20 }
  ): Promise<{ conversaciones: Conversacion[]; total: number }> {
    try {
      const queryParams = new URLSearchParams({
        busqueda,
        page: params.page?.toString() || '0',
        size: params.size?.toString() || '20'
      });

      const url = `${API_BASE_URL}/conversaciones/search?${queryParams}`;
      console.log('🔍 Searching conversaciones:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) throw new Error(`API error: ${response.statusText}`);

      const result = (await response.json()) as ApiPageResponse<Conversacion>;
      return {
        conversaciones: result.data?.content || [],
        total: result.data?.totalElements || 0
      };
    } catch (error) {
      console.error('❌ Error searching:', error);
      throw error;
    }
  }

  /**
   * Filtrar por canal
   * GET /api/conversaciones/canal/{canal}?page=0&size=20
   */
  async getConversacionesPorCanal(
    canal: string,
    params: PaginationParams = { page: 0, size: 20 }
  ): Promise<{ conversaciones: Conversacion[]; total: number }> {
    try {
      const queryParams = new URLSearchParams({
        page: params.page?.toString() || '0',
        size: params.size?.toString() || '20'
      });

      const url = `${API_BASE_URL}/conversaciones/canal/${canal}?${queryParams}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) throw new Error(`API error: ${response.statusText}`);

      const result = (await response.json()) as ApiPageResponse<Conversacion>;
      return {
        conversaciones: result.data?.content || [],
        total: result.data?.totalElements || 0
      };
    } catch (error) {
      console.error('❌ Error filtering by canal:', error);
      throw error;
    }
  }

  /**
   * Marcar conversación como leída
   * PUT /api/conversaciones/{id}/marcar-leido
   */
  async marcarComoLeido(conversacionId: number): Promise<Conversacion> {
    try {
      const url = `${API_BASE_URL}/conversaciones/${conversacionId}/marcar-leido`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) throw new Error(`API error: ${response.statusText}`);

      const result = (await response.json()) as { data: Conversacion };
      return result.data;
    } catch (error) {
      console.error('❌ Error marking as read:', error);
      throw error;
    }
  }

  /**
   * Cambiar estado de conversación
   * PUT /api/conversaciones/{id}/estado/{nuevoEstado}
   */
  async cambiarEstado(conversacionId: number, nuevoEstado: string): Promise<Conversacion> {
    try {
      const url = `${API_BASE_URL}/conversaciones/${conversacionId}/estado/${nuevoEstado}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) throw new Error(`API error: ${response.statusText}`);

      const result = (await response.json()) as { data: Conversacion };
      return result.data;
    } catch (error) {
      console.error('❌ Error changing status:', error);
      throw error;
    }
  }

  /**
   * Contar conversaciones no leídas por vendedor
   * GET /api/conversaciones/por-vendedor/{vendedorId}/no-leidos
   */
  async countNoLeidosPorVendedor(vendedorId: number): Promise<number> {
    try {
      const url = `${API_BASE_URL}/conversaciones/por-vendedor/${vendedorId}/no-leidos`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) throw new Error(`API error: ${response.statusText}`);

      const result = (await response.json()) as { data: number };
      return result.data || 0;
    } catch (error) {
      console.error('❌ Error counting unread:', error);
      return 0;
    }
  }

  /**
   * Enviar mensaje en una conversación
   * TODO: Implement POST /api/conversaciones/:conversacionId/mensajes
   */
  async enviarMensaje(_conversacionId: number, _contenido: string): Promise<void> {
    try {
      // const url = `${API_BASE_URL}/conversaciones/${conversacionId}/mensajes`;
      // const response = await fetch(url, {
      //   method: 'POST',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      //   },
      //   body: JSON.stringify({ contenido })
      // });

      return new Promise(resolve => {
        setTimeout(() => resolve(), 300);
      });
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      throw error;
    }
  }

  /**
   * Obtener usuarios/vendedores
   * GET /api/usuarios/vendedores
   */
  async getVendedores(): Promise<Usuario[]> {
    try {
      const url = `${API_BASE_URL}/usuarios/vendedores`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) throw new Error(`API error: ${response.statusText}`);

      const result = (await response.json()) as { data: Usuario[] };
      return result.data || [];
    } catch (error) {
      console.warn('⚠️ API error, retornando mock:', error);
      return new Promise(resolve => {
        setTimeout(() => resolve(USUARIOS_MOCK), 500);
      });
    }
  }

  /**
   * Obtener estadísticas de inbox
   * TODO: GET /api/conversaciones/stats
   */
  async getEstadisticas(_vendedorId?: number) {
    try {
      // const endpoint = vendedorId
      //   ? `${API_BASE_URL}/conversaciones/stats?vendedorId=${vendedorId}`
      //   : `${API_BASE_URL}/conversaciones/stats`;
      // const response = await fetch(endpoint, {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      //   }
      // });

      return new Promise(resolve => {
        resolve({
          pendientes: 5,
          respondidas: 12,
          cerradas: 28
        });
      });
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }
}

// Instancia singleton
export const inboxService = new InboxService();
