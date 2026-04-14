/**
 * Servicio de Inbox
 * Centraliza toda la lógica de comunicación con la API de conversaciones
 * Facilita transición de mock a API real
 */

import type { Conversacion, Usuario } from '../types/index';
import { CONVERSACIONES_MOCK_VENDEDOR, CONVERSACIONES_MOCK_ADMIN } from '../mocks/conversaciones.mock';
import { USUARIOS_MOCK } from '../mocks/usuarios.mock';

export class InboxService {
  private apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

  /**
   * Obtener conversaciones del vendedor
   * TODO: Reemplazar con: GET /api/conversaciones/vendedor/:vendedorId
   */
  async getConversacionesPorVendedor(vendedorId: number): Promise<Conversacion[]> {
    try {
      // En producción:
      // const response = await fetch(`${this.apiBaseUrl}/conversaciones/vendedor/${vendedorId}`);
      // return response.json();

      // Por ahora: retornar mock
      return new Promise(resolve => {
        setTimeout(() => resolve(CONVERSACIONES_MOCK_VENDEDOR), 500);
      });
    } catch (error) {
      console.error('Error obteniendo conversaciones:', error);
      throw error;
    }
  }

  /**
   * Obtener todas las conversaciones (Admin)
   * TODO: Reemplazar con: GET /api/conversaciones
   */
  async getTodasConversaciones(): Promise<Conversacion[]> {
    try {
      // En producción:
      // const response = await fetch(`${this.apiBaseUrl}/conversaciones`);
      // return response.json();

      return new Promise(resolve => {
        setTimeout(() => resolve(CONVERSACIONES_MOCK_ADMIN), 500);
      });
    } catch (error) {
      console.error('Error obteniendo conversaciones:', error);
      throw error;
    }
  }

  /**
   * Enviar mensaje en una conversación
   * TODO: Reemplazar con: POST /api/conversaciones/:conversacionId/mensajes
   */
  async enviarMensaje(conversacionId: number, contenido: string): Promise<void> {
    try {
      // En producción:
      // const response = await fetch(`${this.apiBaseUrl}/conversaciones/${conversacionId}/mensajes`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
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
   * TODO: Reemplazar con: GET /api/usuarios/vendedores
   */
  async getVendedores(): Promise<Usuario[]> {
    try {
      // En producción:
      // const response = await fetch(`${this.apiBaseUrl}/usuarios/vendedores`);
      // return response.json();

      return new Promise(resolve => {
        setTimeout(() => resolve(USUARIOS_MOCK), 500);
      });
    } catch (error) {
      console.error('Error obteniendo vendedores:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de inbox
   * TODO: Reemplazar con: GET /api/inbox/stats
   */
  async getEstadisticas(vendedorId?: number) {
    try {
      // En producción:
      // const endpoint = vendedorId
      //   ? `${this.apiBaseUrl}/inbox/stats?vendedorId=${vendedorId}`
      //   : `${this.apiBaseUrl}/inbox/stats`;
      // const response = await fetch(endpoint);
      // return response.json();

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
