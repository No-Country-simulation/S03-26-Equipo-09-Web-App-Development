import { useState, useEffect } from 'react';
import { contactoService, Contacto, estadoLabels } from '../../../common/apiClient';
import { useAuth } from '../../../hooks/useAuth';
import { Card } from '../../../components/ui/Card/Card';
import { Badge } from '../../../components/ui/Badge/Badge';

interface ContactoTableProps {
  filtroEstado?: 'todos' | 'lead-activo' | 'cliente' | 'inactivo';
  filtroVendedor?: string;
  refreshTrigger?: number;
}

export const ContactoTable = ({ filtroEstado = 'todos', filtroVendedor, refreshTrigger }: ContactoTableProps) => {
  const { isVendedor, userId } = useAuth();
  const [contactosTodos, setContactosTodos] = useState<Contacto[]>([]);
  const [contactosFiltrados, setContactosFiltrados] = useState<Contacto[]>([]);
  const [cargando, setCargando] = useState(false);

  // Cargar todos los datos al montarse
  useEffect(() => {
    cargarTodosContactos();
  }, [isVendedor, userId]);

  // Recargar cuando refreshTrigger cambia (después de crear un lead)
  useEffect(() => {
    if (refreshTrigger !== undefined) {
      cargarTodosContactos();
    }
  }, [refreshTrigger]);

  // Filtrar por estado y vendedor cuando cambian
  useEffect(() => {
    filtrarContactos();
  }, [filtroEstado, filtroVendedor, contactosTodos]);

  const cargarTodosContactos = async () => {
    setCargando(true);
    try {
      let datos: Contacto[] = [];

      // Si es vendedor: cargar solo sus leads
      if (isVendedor && userId) {
        datos = await contactoService.getByVendedor(userId);
      } else {
        // Si es admin: cargar todos los leads
        datos = await contactoService.getAll();
      }

      setContactosTodos(datos);
    } catch (error) {
      console.error('Error cargando contactos:', error);
      setContactosTodos([]);
    } finally {
      setCargando(false);
    }
  };

  const filtrarContactos = () => {
    let resultado = [...contactosTodos];

    // Filtrar por estado/etiqueta (solo si no es 'todos')
    if (filtroEstado === 'lead-activo') {
      resultado = resultado.filter(c => c.estado === 'LEAD_ACTIVO');
    } else if (filtroEstado === 'cliente') {
      resultado = resultado.filter(c => c.estado === 'CLIENTE');
    } else if (filtroEstado === 'inactivo') {
      resultado = resultado.filter(c => c.estado === 'INACTIVO');
    }
    // Si filtroEstado === 'todos', no filtrar por estado, mostrar todos

    // Filtrar por vendedor (solo aplica para admin)
    if (filtroVendedor && !isVendedor) {
      const vendedorId = parseInt(filtroVendedor);
      console.log(`🔍 Filtrando por vendedor: ${vendedorId}, leads totales: ${resultado.length}`);
      resultado = resultado.filter(c => c.vendedorAsignadoId === vendedorId);
      console.log(`✅ Leads después de filtro: ${resultado.length}`);
    }

    setContactosFiltrados(resultado);
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'LEAD_ACTIVO':
        return 'primary';
      case 'CLIENTE':
        return 'success';
      case 'EN_SEGUIMIENTO':
      case 'CALIFICADO':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <div className="space-y-4">
        {cargando ? (
          <div className="text-center py-8 text-on-surface-variant">Cargando leads...</div>
        ) : contactosFiltrados.length === 0 ? (
          <div className="text-center py-8 text-on-surface-variant">
            No hay leads disponibles en esta categoría
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline">
                  <th className="text-left py-3 px-4 font-semibold text-primary">Nombre</th>
                  <th className="text-left py-3 px-4 font-semibold text-primary">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-primary">Teléfono</th>
                  <th className="text-left py-3 px-4 font-semibold text-primary">Estado</th>
                </tr>
              </thead>
              <tbody>
                {contactosFiltrados.map((contacto) => (
                  <tr key={contacto.id} className="border-b border-outline/30 hover:bg-surface-container-low transition-colors">
                    <td className="py-3 px-4 font-medium">{contacto.nombre}</td>
                    <td className="py-3 px-4 text-on-surface-variant">{contacto.email}</td>
                    <td className="py-3 px-4 text-on-surface-variant">{contacto.telefono || '-'}</td>
                    <td className="py-3 px-4">
                      <Badge variant={getEstadoBadgeColor(contacto.estado) as any}>
                        {estadoLabels[contacto.estado] || contacto.estado}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 p-3 bg-surface-container-low rounded text-sm text-on-surface-variant">
              Total: <span className="font-semibold text-primary">{contactosFiltrados.length}</span> leads
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
