import { useState, useEffect } from 'react';
import { contactoService, Contacto, estadoLabels } from '../../../common/apiClient';
import { Card } from '../../../components/ui/Card/Card';
import { Badge } from '../../../components/ui/Badge/Badge';

interface ContactoTableProps {
  filtroEstado?: 'lead-activo' | 'cliente' | 'inactivo';
  filtroVendedor?: string;
}

export const ContactoTable = ({ filtroEstado = 'lead-activo', filtroVendedor }: ContactoTableProps) => {
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarContactos();
  }, [filtroEstado, filtroVendedor]);

  const cargarContactos = async () => {
    setCargando(true);
    try {
      let datos: Contacto[] = [];
      const vendedorId = filtroVendedor ? parseInt(filtroVendedor) : null;

      if (vendedorId) {
        // Filtrado por vendedor específico
        if (filtroEstado === 'lead-activo') {
          datos = await contactoService.getLeadsActivosByVendedor(vendedorId);
        } else if (filtroEstado === 'cliente') {
          datos = await contactoService.getClientesByVendedor(vendedorId);
        } else if (filtroEstado === 'inactivo') {
          datos = await contactoService.getInactivosByVendedor(vendedorId);
        }
      } else {
        // Filtrado global (sin filtro de vendedor)
        if (filtroEstado === 'lead-activo') {
          datos = await contactoService.getLeadsActivos();
        } else if (filtroEstado === 'cliente') {
          datos = await contactoService.getClientes();
        } else if (filtroEstado === 'inactivo') {
          datos = await contactoService.getInactivos();
        }
      }

      setContactos(datos);
    } catch (error) {
      console.error('Error cargando contactos:', error);
      setContactos([]);
    } finally {
      setCargando(false);
    }
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
          <div className="text-center py-8 text-on-surface-variant">Cargando...</div>
        ) : contactos.length === 0 ? (
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
                {contactos.map((contacto) => (
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
              Total: <span className="font-semibold text-primary">{contactos.length}</span> leads
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
