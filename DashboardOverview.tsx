import React from 'react';
import { useDashboardStats } from '../api/getDashboardStats';
import { Users, MessageSquare, Clock, AlertCircle } from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const { data, isLoading, isError } = useDashboardStats();

  if (isLoading) return <div className="p-8 text-center">Cargando métricas inteligentes...</div>;
  if (isError || !data) return <div className="p-8 text-red-500">Error al cargar el dashboard.</div>;

  const stats = [
    { 
      label: 'Contactos Totales', 
      value: data.totalContactos, 
      icon: Users, 
      color: 'text-indigo-600',
      bg: 'bg-indigo-50' 
    },
    { 
      label: 'Nuevos Leads (Hoy)', 
      value: data.nuevosLeadsHoy, 
      icon: Clock, 
      color: 'text-emerald-600',
      bg: 'bg-emerald-50' 
    },
    { 
      label: 'Mensajes Sin Leer', 
      value: data.mensajesSinLeer, 
      icon: MessageSquare, 
      color: 'text-amber-600',
      bg: 'bg-amber-50' 
    },
    { 
      label: 'Tareas Pendientes', 
      value: data.tareasPendientes, 
      icon: AlertCircle, 
      color: 'text-rose-600', 
      bg: 'bg-rose-50' 
    },
  ];

  return (
    <div className="p-6 space-y-8 bg-[#f8f9fa] min-h-screen">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">Resumen Operativo</h1>
        <p className="text-slate-500">Métricas en tiempo real de tu ecosistema CRM.</p>
      </header>

      {/* Grid de Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sección de Estados de Lead */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-slate-800 text-center">Distribución de Leads por Etapa</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {Object.entries(data.contactosPorEstado).map(([estado, count]) => (
            <div key={estado} className="px-4 py-2 rounded-full bg-slate-100 border border-slate-200 flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">{estado.replace('_', ' ')}</span>
              <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};