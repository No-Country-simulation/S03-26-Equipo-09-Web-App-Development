import { useState, useEffect } from 'react';
import { contactoService, Contacto, estadoLabels } from '../common/apiClient';
import { Card } from './ui/Card/Card';
import { Badge } from './ui/Badge/Badge';

interface ContactoTableProps {
  filtroEstado?: string;
}

export const ContactoTable = ({ filtroEstado }: ContactoTableProps) => {
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarContactos();
  }, [filtroEstado]);

  const cargarContactos = async () => {
    setCargando(true);
    try {
      let datos: Contacto[];

      if (filtroEstado && filtroEstado !== 'todos') {
        // Usar endpoint de segmentación
        if (filtroEstado === 'LEAD_ACTIVO') {
          datos = await contactoService.getLeadsActivos();
        } else if (filtroEstado === 'EN_SEGUIMIENTO') {
          datos = await contactoService.getEnSeguimiento();
        } else if (filtroEstado === 'CALIFICADO') {
          datos = await contactoService.getLeadsCalificados();
        } else if (filtroEstado === 'CLIENTE') {
          datos = await contactoService.getClientes();
        } else {
          datos = await contactoService.getAll();
        }
      } else {
        datos = await contactoService.getAll();
      }

      setContactos(datos);
    } finally {
      setCargando(false);
    }
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'LEAD_ACTIVO':
        return 'primary';
      case 'EN_SEGUIMIENTO':
        return 'warning';
      case 'CALIFICADO':
        return 'success';
      case 'CLIENTE':
        return 'success';
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
            No hay leads disponibles
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
                    <td className="py-3 px-4">{contacto.nombre}</td>
                    <td className="py-3 px-4 text-on-surface-variant">{contacto.email}</td>
                    <td className="py-3 px-4 text-on-surface-variant">{contacto.telefono}</td>
                    <td className="py-3 px-4">
                      <Badge variant={getEstadoBadgeColor(contacto.estado) as any}>
                        {estadoLabels[contacto.estado]}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
};
