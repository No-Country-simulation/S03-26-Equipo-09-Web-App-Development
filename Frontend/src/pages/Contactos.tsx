import { useState } from 'react';
import { ContactoTable } from '../components/ContactoTable';
import { CalificadoPanel } from '../components/CalificadoPanel';
import { Button } from '../components/ui/Button/Button';
import { Modal } from '../components/ui/Modal/Modal';

export const ContactosPage = () => {
  const [activeTab, setActiveTab] = useState<'lead-activo' | 'en-seguimiento' | 'cliente' | 'calificado'>('lead-activo');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Definir tabs con los 4 nuevos estados operativos
  const tabs = [
    { id: 'lead-activo' as const, label: 'Lead Activo', icon: 'new_releases', color: 'blue', description: 'Recién capturados' },
    { id: 'en-seguimiento' as const, label: 'En Seguimiento', icon: 'schedule', color: 'yellow', description: 'Con actividad reciente' },
    { id: 'cliente' as const, label: 'Cliente', icon: 'star', color: 'green', description: 'Compra finalizada' },
    { id: 'calificado' as const, label: 'Calificado', icon: 'check_circle', color: 'orange', description: '7+ días sin respuesta' }
  ];

  const getColorClasses = (color: string, isActive: boolean): string => {
    const colorMap: Record<string, { active: string; inactive: string }> = {
      blue: {
        active: 'bg-blue-500 border-blue-600',
        inactive: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200'
      },
      yellow: {
        active: 'bg-yellow-400 border-yellow-500',
        inactive: 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200'
      },
      green: {
        active: 'bg-green-500 border-green-600',
        inactive: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'
      },
      orange: {
        active: 'bg-orange-500 border-orange-600',
        inactive: 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200'
      }
    };
    const entry = colorMap[color];
    if (!entry) return '';
    return isActive ? entry.active : entry.inactive;
  };

  return (
    <div className="space-y-6 p-4 md:p-6 animate-fade-in">
      {/* Header con Título y Botón */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#182442]">
            Centro de Gestión de Leads
          </h1>
          <p className="text-slate-600 text-base mt-1">
            Administra leads en 4 estados: Activo, Seguimiento, Cliente, Calificado
          </p>
        </div>
        <Button 
          onClick={() => {
            setIsModalOpen(true);
          }}
          className="h-11 px-6 bg-[#182442] hover:bg-[#0d1420] text-white font-semibold whitespace-nowrap"
        >
          <span className="material-symbols-outlined mr-2">add</span>
          Nuevo Lead
        </Button>
      </header>

      {/* Tabs como Badges Coloreados - 4 Estados */}
      <div className="flex flex-wrap gap-3 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all transform flex items-center gap-2 border-2 ${
              activeTab === tab.id
                ? `scale-105 shadow-lg text-white ${getColorClasses(tab.color, true)}`
                : `${getColorClasses(tab.color, false)} hover:scale-105`
            }`}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido Dinámico por Estado */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        {activeTab === 'lead-activo' && (
          <ContactoTable />
        )}
        {activeTab === 'en-seguimiento' && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-base mb-2">No hay leads en seguimiento</p>
            <p className="text-slate-400 text-sm">Los leads con actividad reciente aparecerán aquí</p>
          </div>
        )}
        {activeTab === 'cliente' && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-base mb-2">No hay leads en estado cliente</p>
            <p className="text-slate-400 text-sm">Los leads que completaron una compra aparecerán aquí</p>
          </div>
        )}
        {activeTab === 'calificado' && (
          <CalificadoPanel />
        )}
      </div>

      {/* Modal para Nuevo Lead */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Crear Nuevo Lead">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#182442] mb-1">Nombre Completo *</label>
            <input 
              type="text" 
              placeholder="Ingresa el nombre del potencial cliente"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-[#006c49] focus:ring-2 focus:ring-[#006c49]/20 focus:outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#182442] mb-1">Email *</label>
            <input 
              type="email" 
              placeholder="correo@ejemplo.com"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-[#006c49] focus:ring-2 focus:ring-[#006c49]/20 focus:outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#182442] mb-1">Teléfono *</label>
            <input 
              type="tel" 
              placeholder="+591 1234 5678"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-[#006c49] focus:ring-2 focus:ring-[#006c49]/20 focus:outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#182442] mb-1">Estado Inicial</label>
            <select className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-[#006c49] focus:ring-2 focus:ring-[#006c49]/20 focus:outline-none transition-all">
              <option value="LEAD_ACTIVO">Lead Activo</option>
              <option value="EN_SEGUIMIENTO">En Seguimiento</option>
              <option value="CALIFICADO">Calificado</option>
              <option value="CLIENTE">Cliente</option>
            </select>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-slate-300 text-[#182442] hover:bg-slate-100 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#006c49] text-white font-semibold hover:bg-[#005236] transition-all"
            >
              Crear Lead
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
