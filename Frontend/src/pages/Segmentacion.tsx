import { useState } from 'react';
import { ContactoTable } from '../features/contactos/components/ContactoTable';

export const SegmentacionPage = () => {
  const [selectedSegmento, setSelectedSegmento] = useState<'todos' | 'LEAD_ACTIVO' | 'EN_SEGUIMIENTO' | 'CALIFICADO' | 'CLIENTE'>('LEAD_ACTIVO');

  const segmentos = [
    {
      id: 'LEAD_ACTIVO',
      nombre: 'Leads Activos',
      descripcion: 'Contactos nuevos que han mostrado interés',
      color: 'primary',
      icon: 'star'
    },
    {
      id: 'EN_SEGUIMIENTO',
      nombre: 'En Seguimiento',
      descripcion: 'Leads que están siendo cultivados',
      color: 'warning',
      icon: 'trending_up'
    },
    {
      id: 'CALIFICADO',
      nombre: 'Calificados',
      descripcion: 'Leads listos para convertirse en clientes',
      color: 'secondary',
      icon: 'done'
    },
    {
      id: 'CLIENTE',
      nombre: 'Clientes',
      descripcion: 'Contactos que ya son clientes',
      color: 'success',
      icon: 'verified'
    }
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Segmentación de Contactos
        </h1>
        <p className="text-on-surface-variant text-base mt-1">
          Visualiza contactos organizados por estado en el funnel de ventas
        </p>
      </header>

      {/* Segmentos disponibles - Badges Style */}
      <div className="flex flex-wrap gap-3">
        {segmentos.map((seg) => (
          <button
            key={seg.id}
            onClick={() => setSelectedSegmento(seg.id as any)}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all transform ${
              selectedSegmento === seg.id
                ? 'scale-105 shadow-lg'
                : 'hover:scale-105'
            } ${
              seg.id === 'LEAD_ACTIVO' 
                ? selectedSegmento === seg.id
                  ? 'bg-blue-500 text-white border-2 border-blue-600'
                  : 'bg-blue-100 text-blue-700 border-2 border-blue-200 hover:bg-blue-200'
                : seg.id === 'EN_SEGUIMIENTO'
                ? selectedSegmento === seg.id
                  ? 'bg-amber-500 text-white border-2 border-amber-600'
                  : 'bg-amber-100 text-amber-700 border-2 border-amber-200 hover:bg-amber-200'
                : seg.id === 'CALIFICADO'
                ? selectedSegmento === seg.id
                  ? 'bg-purple-500 text-white border-2 border-purple-600'
                  : 'bg-purple-100 text-purple-700 border-2 border-purple-200 hover:bg-purple-200'
                : selectedSegmento === seg.id
                ? 'bg-green-500 text-white border-2 border-green-600'
                : 'bg-green-100 text-green-700 border-2 border-green-200 hover:bg-green-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">
                {seg.icon}
              </span>
              <span>{seg.nombre}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Tabla de contactos filtrada */}
      <ContactoTable filtroEstado={selectedSegmento} />
    </div>
  );
};
