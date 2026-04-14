/**
 * Hook reutilizable para gestionar conversaciones en Inbox
 * Separa lógica de estado de componentes UI
 * Facilita testing y reutilización
 */

import { useState, useCallback, useMemo } from 'react';
import type { Conversacion, Mensaje, InboxFilter } from '../types/index';
import { CONVERSACIONES_MOCK_VENDEDOR } from '../mocks/conversaciones.mock';

export const useConversaciones = (vendedorId: number) => {
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [filters, setFilters] = useState<InboxFilter>({
    canal: 'Todos',
    estado: 'Todos',
    busqueda: ''
  });
  const [loading, setLoading] = useState(true);
  const [selectedConversacion, setSelectedConversacion] = useState<Conversacion | null>(null);

  // Cargar conversaciones (reemplazar con API)
  const cargarConversaciones = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: const data = await conversacionService.getByVendedor(vendedorId);
      setConversaciones(CONVERSACIONES_MOCK_VENDEDOR);
    } catch (error) {
      console.error('Error cargando conversaciones:', error);
    } finally {
      setLoading(false);
    }
  }, [vendedorId]);

  // Filtrar conversaciones
  const conversacionesFiltradas = useMemo(() => {
    return conversaciones.filter(c => {
      const cumpleCanal = filters.canal === 'Todos' || c.canal === filters.canal;
      const cumpleEstado = filters.estado === 'Todos' || c.estado === filters.estado;
      const cumpleBusqueda =
        !filters.busqueda ||
        c.contenido.toLowerCase().includes(filters.busqueda.toLowerCase()) ||
        c.contactoNombre?.toLowerCase().includes(filters.busqueda.toLowerCase());

      return cumpleCanal && cumpleEstado && cumpleBusqueda;
    });
  }, [conversaciones, filters]);

  // Enviar respuesta
  const enviarRespuesta = useCallback(
    (contenido: string, vendedorNombre: string) => {
      if (!selectedConversacion || !contenido.trim()) return;

      const nuevoMensaje: Mensaje = {
        id: (selectedConversacion.mensajes?.length || 0) + 1,
        contenido,
        fechaHora: new Date().toISOString(),
        tipo: 'salida',
        remitente: vendedorNombre
      };

      const conversacionActualizada: Conversacion = {
        ...selectedConversacion,
        mensajes: [...(selectedConversacion.mensajes || []), nuevoMensaje],
        estado: 'respondido'
      };

      setSelectedConversacion(conversacionActualizada);
      setConversaciones(conversaciones.map(c => 
        c.id === selectedConversacion.id ? conversacionActualizada : c
      ));
    },
    [selectedConversacion, conversaciones]
  );

  // Actualizar filtros
  const actualizarFiltros = useCallback((nuevosFiltros: Partial<InboxFilter>) => {
    setFilters(prev => ({ ...prev, ...nuevosFiltros }));
  }, []);

  return {
    conversaciones,
    conversacionesFiltradas,
    filters,
    loading,
    selectedConversacion,
    cargarConversaciones,
    enviarRespuesta,
    actualizarFiltros,
    setSelectedConversacion,
    setConversaciones
  };
};
