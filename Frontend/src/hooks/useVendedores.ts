import { useState, useEffect, useCallback } from 'react';
import { usuarioService, metricasService, Usuario } from '../common/apiClient';

export interface VendedorMetricas {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  activo: boolean;
  leadsAsignados: number;
  leadsConvertidos: number;
  leadsInactivos: number;
  totalLeads: number;
  tasaConversion: number;
}

interface UseVendedoresState {
  vendedores: VendedorMetricas[];
  loading: boolean;
  error: string | null;
}

export const useVendedores = () => {
  const [state, setState] = useState<UseVendedoresState>({
    vendedores: [],
    loading: true,
    error: null
  });

  /**
   * Cargar vendedores y sus métricas desde el backend
   * Nota: Obtiene TODOS los vendedores (activos e inactivos) para poder gestionar ambos
   */
  const fetchVendedores = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Obtener todos los usuarios y filtrar solo VENDEDORES (incluyendo inactivos)
      const todosLosUsuarios = await usuarioService.getAll();
      const usuarios = todosLosUsuarios.filter(u => u.role === 'VENDEDOR');

      console.log(`📊 Total vendedores (activos e inactivos): ${usuarios.length}`);

      // Para cada vendedor, obtener sus métricas
      const vendedoresConMetricas = await Promise.all(
        usuarios.map(async (usuario) => {
          try {
            const metricas = await metricasService.getMetricasVendedor(usuario.id);
            return {
              id: usuario.id,
              nombre: usuario.nombre,
              email: usuario.email,
              telefono: usuario.telefono,
              activo: usuario.activo,
              leadsAsignados: metricas?.leadsAsignados || 0,
              leadsConvertidos: metricas?.clientesConvertidos || 0,
              leadsInactivos: metricas?.leadsInactivos || 0,
              totalLeads: metricas?.totalLeads || 0,
              tasaConversion: metricas?.tasaConversion || 0
            };
          } catch (error) {
            console.error(`❌ Error obteniendo métricas para vendedor ${usuario.id}:`, error);
            // Retornar vendedor sin métricas si falla
            return {
              id: usuario.id,
              nombre: usuario.nombre,
              email: usuario.email,
              telefono: usuario.telefono,
              activo: usuario.activo,
              leadsAsignados: 0,
              leadsConvertidos: 0,
              leadsInactivos: 0,
              totalLeads: 0,
              tasaConversion: 0
            };
          }
        })
      );

      setState(prev => ({ ...prev, vendedores: vendedoresConMetricas, loading: false }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar vendedores';
      console.error('❌ Error en fetchVendedores:', error);
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, []);

  /**
   * Crear nuevo vendedor
   */
  const createVendedor = useCallback(
    async (nombre: string, email: string, telefono?: string): Promise<VendedorMetricas | null> => {
      try {
        const nuevoUsuario = await usuarioService.create({
          nombre,
          email,
          telefono: telefono || '',
          password: 'Temporal@123', // Contraseña temporal - debe cambiarla al primer login
          role: 'VENDEDOR',
          activo: true
        });

        console.log('✅ Usuario creado en BD:', nuevoUsuario);

        // Obtener métricas del nuevo vendedor
        const metricas = await metricasService.getMetricasVendedor(nuevoUsuario.id);
        console.log('📊 Métricas obtenidas:', metricas);

        const vendedor: VendedorMetricas = {
          id: nuevoUsuario.id,
          nombre: nuevoUsuario.nombre,
          email: nuevoUsuario.email,
          telefono: nuevoUsuario.telefono,
          activo: nuevoUsuario.activo,
          leadsAsignados: metricas?.leadsAsignados || 0,
          leadsConvertidos: metricas?.clientesConvertidos || 0,
          leadsInactivos: metricas?.leadsInactivos || 0,
          totalLeads: metricas?.totalLeads || 0,
          tasaConversion: metricas?.tasaConversion || 0
        };

        // Agregar a la lista
        setState(prev => ({
          ...prev,
          vendedores: [...prev.vendedores, vendedor]
        }));

        console.log('✅ Vendedor creado y agregado a la lista:', vendedor);
        return vendedor;
      } catch (error) {
        console.error('❌ Error al crear vendedor:', error);
        throw error;
      }
    },
    []
  );

  /**
   * Actualizar vendedor
   */
  const updateVendedor = useCallback(
    async (id: number, nombre: string, email: string, telefono?: string): Promise<VendedorMetricas | null> => {
      try {
        const usuarioActualizado = await usuarioService.update(id, {
          nombre,
          email,
          telefono: telefono || ''
        });

        // Obtener métricas actualizadas
        const metricas = await metricasService.getMetricasVendedor(id);
        const vendedorActualizado: VendedorMetricas = {
          id: usuarioActualizado.id,
          nombre: usuarioActualizado.nombre,
          email: usuarioActualizado.email,
          telefono: usuarioActualizado.telefono,
          activo: usuarioActualizado.activo,
          leadsAsignados: metricas?.leadsAsignados || 0,
          leadsConvertidos: metricas?.clientesConvertidos || 0,
          leadsInactivos: metricas?.leadsInactivos || 0,
          totalLeads: metricas?.totalLeads || 0,
          tasaConversion: metricas?.tasaConversion || 0,
          tiempoRespuestaPromedio: 0
        };

        // Actualizar en la lista
        setState(prev => ({
          ...prev,
          vendedores: prev.vendedores.map(v => v.id === id ? vendedorActualizado : v)
        }));

        console.log('✅ Vendedor actualizado:', vendedorActualizado);
        return vendedorActualizado;
      } catch (error) {
        console.error('❌ Error al actualizar vendedor:', error);
        return null;
      }
    },
    []
  );

  /**
   * Toggle estado del vendedor (activo/inactivo)
   */
  const toggleVendedorEstado = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        const vendedor = state.vendedores.find(v => v.id === id);
        if (!vendedor) {
          console.error(`❌ Vendedor ${id} no encontrado en el estado`);
          return false;
        }

        console.log(`🔄 Actualizando vendedor ${id}...`);
        
        const usuarioActualizado = await usuarioService.update(id, {
          activo: !vendedor.activo
        });

        console.log(`✅ Respuesta del servidor:`, usuarioActualizado);

        // Actualizar en la lista
        setState(prev => ({
          ...prev,
          vendedores: prev.vendedores.map(v =>
            v.id === id ? { ...v, activo: usuarioActualizado.activo } : v
          )
        }));

        console.log(`✅ Vendedor ${id} ${usuarioActualizado.activo ? 'activado' : 'desactivado'}`);
        return true;
      } catch (error) {
        console.error(`❌ Error al cambiar estado del vendedor ${id}:`, error);
        throw error;
      }
    },
    [state.vendedores]
  );

  /**
   * Eliminar vendedor (soft delete - desactivar)
   */
  const deleteVendedor = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        await usuarioService.delete(id);

        // Remover de la lista
        setState(prev => ({
          ...prev,
          vendedores: prev.vendedores.filter(v => v.id !== id)
        }));

        console.log('✅ Vendedor eliminado:', id);
        return true;
      } catch (error) {
        console.error('❌ Error al eliminar vendedor:', error);
        return false;
      }
    },
    []
  );

  // Cargar vendedores al montar el componente
  useEffect(() => {
    fetchVendedores();
  }, [fetchVendedores]);

  return {
    vendedores: state.vendedores,
    loading: state.loading,
    error: state.error,
    fetchVendedores,
    createVendedor,
    updateVendedor,
    toggleVendedorEstado,
    deleteVendedor
  };
};
