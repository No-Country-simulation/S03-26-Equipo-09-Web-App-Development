import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal/Modal';

interface Plantilla {
  id: number;
  nombre: string;
  tipo: 'email' | 'whatsapp';
  contenido: string;
  variables: string[];
  usosTotal: number;
  estado: 'activa' | 'inactiva';
}

export const Plantillas = () => {
  const [plantillas, setPlantillas] = useState<Plantilla[]>([
    {
      id: 1,
      nombre: 'Seguimiento Inicial',
      tipo: 'email',
      contenido: 'Hola {{nombre}}, queremos felicitarte por tu interés en nuestro producto. ¿Podemos agendar una llamada?',
      variables: ['nombre'],
      usosTotal: 42,
      estado: 'activa'
    },
    {
      id: 2,
      nombre: 'Recordatorio WhatsApp',
      tipo: 'whatsapp',
      contenido: 'Hola {{nombre}} 👋 Solo para recordarte que tienes una propuesta de descuento pendiente. ¿Qué preguntas tienes?',
      variables: ['nombre'],
      usosTotal: 128,
      estado: 'activa'
    },
    {
      id: 3,
      nombre: 'Cierre de Venta',
      tipo: 'email',
      contenido: 'Genial {{nombre}}, nos encanta tu decisión. Te enviaremos los detalles de tu compra en breve.',
      variables: ['nombre'],
      usosTotal: 15,
      estado: 'activa'
    },
    {
      id: 4,
      nombre: 'Feedback Post-Venta',
      tipo: 'whatsapp',
      contenido: 'Gracias {{nombre}} por tu compra 🎉 Nos gustaría saber tu opinión. ¿Qué te pareció?',
      variables: ['nombre'],
      usosTotal: 67,
      estado: 'activa'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filtroActual, setFiltroActual] = useState<'Todas' | 'Email' | 'WhatsApp'>('Todas');
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'email' as 'email' | 'whatsapp',
    contenido: '',
    variables: ''
  });

  const handleToggleState = (id: number) => {
    setPlantillas(plantillas.map(p => 
      p.id === id ? { ...p, estado: p.estado === 'activa' ? 'inactiva' : 'activa' } : p
    ));
  };

  const handleAddPlantilla = () => {
    if (!formData.nombre.trim() || !formData.contenido.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    // Extraer variables del contenido (buscar {{var}})
    const variablesExtracted = formData.contenido.match(/\{\{(\w+)\}\}/g)?.map(v => v.replace(/\{\{|\}\}/g, '')) || [];
    const variablesUnicas = Array.from(new Set(variablesExtracted));

    const nuevaPlantilla: Plantilla = {
      id: Math.max(...plantillas.map(p => p.id), 0) + 1,
      nombre: formData.nombre,
      tipo: formData.tipo,
      contenido: formData.contenido,
      variables: variablesUnicas.length > 0 ? variablesUnicas : formData.variables.split(',').filter(v => v.trim()),
      usosTotal: 0,
      estado: 'activa'
    };

    setPlantillas([...plantillas, nuevaPlantilla]);
    
    // Guardar en localStorage para que otros módulos accedan
    localStorage.setItem('plantillas_crm', JSON.stringify([...plantillas, nuevaPlantilla]));
    
    setFormData({ nombre: '', tipo: 'email', contenido: '', variables: '' });
    setIsModalOpen(false);
    alert('Plantilla creada exitosamente');
  };

  const plantillasFiltradas = plantillas.filter(p => {
    if (filtroActual === 'Todas') return true;
    if (filtroActual === 'Email') return p.tipo === 'email';
    if (filtroActual === 'WhatsApp') return p.tipo === 'whatsapp';
    return true;
  });

  return (
    <div className="space-y-6 p-4 md:p-6 animate-fade-in">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#182442]">
            Plantillas de Mensajes
          </h1>
          <p className="text-slate-600 text-base mt-1">
            Gestiona plantillas reutilizables para Email y WhatsApp
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="h-11 px-6 bg-[#182442] hover:bg-[#0d1420] text-white font-semibold whitespace-nowrap rounded-lg flex items-center gap-2 transition-all"
        >
          <span className="material-symbols-outlined">add</span>
          Nueva Plantilla
        </button>
      </header>

      {/* Modal para crear plantilla */}
      <Modal 
        isOpen={isModalOpen} 
        title="Crear Nueva Plantilla"
        onClose={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre de la Plantilla</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="ej: Seguimiento Inicial"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#182442] text-slate-700"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tipo de Mensaje</label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'email' | 'whatsapp' })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#182442] text-slate-700"
            >
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Contenido</label>
            <textarea
              value={formData.contenido}
              onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
              placeholder="Escribe tu plantilla. Usa {{variable}} para variables dinámicas. ej: Hola {{nombre}}"
              rows={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#182442] text-slate-700 font-mono text-sm"
            />
            <p className="text-xs text-slate-500 mt-1">💡 Tip: Usa {'{{nombre}}'}, {'{{empresa}}'}, {'{{fecha}}'} para variables dinámicas</p>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-all font-semibold"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddPlantilla}
              className="px-4 py-2 bg-[#182442] text-white rounded-lg hover:bg-[#0d1420] transition-all font-semibold"
            >
              Crear Plantilla
            </button>
          </div>
        </div>
      </Modal>

      {/* Filtros */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 flex gap-2 flex-wrap">
        <span className="text-sm font-medium text-slate-700">Filtrar por:</span>
        {['Todas', 'Email', 'WhatsApp'].map((filtro) => (
          <button
            key={filtro}
            onClick={() => setFiltroActual(filtro as 'Todas' | 'Email' | 'WhatsApp')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
              filtroActual === filtro
                ? 'bg-[#182442] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {filtro}
          </button>
        ))}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-xs font-medium">Total Plantillas</p>
              <p className="text-2xl font-bold text-blue-600">{plantillas.length}</p>
            </div>
            <span className="material-symbols-outlined text-blue-300 text-4xl">draft</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-xs font-medium">Plantillas Activas</p>
              <p className="text-2xl font-bold text-green-600">
                {plantillas.filter(p => p.estado === 'activa').length}
              </p>
            </div>
            <span className="material-symbols-outlined text-green-300 text-4xl">check_circle</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-xs font-medium">Total de Usos</p>
              <p className="text-2xl font-bold text-purple-600">
                {plantillas.reduce((acc, p) => acc + p.usosTotal, 0)}
              </p>
            </div>
            <span className="material-symbols-outlined text-purple-300 text-4xl">trending_up</span>
          </div>
        </div>
      </div>

      {/* Tabla de Plantillas */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
        <h3 className="font-semibold text-[#182442] flex items-center gap-2">
          <span className="material-symbols-outlined">list_alt</span>
          {filtroActual === 'Todas' ? 'Todas las Plantillas' : `Plantillas ${filtroActual}`}
        </h3>

        <div className="grid gap-4">
          {plantillasFiltradas.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p>No hay plantillas disponibles</p>
            </div>
          ) : (
            plantillasFiltradas.map((plantilla) => (
            <div key={plantilla.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-slate-800">{plantilla.nombre}</h4>
                  <div className="flex gap-2 mt-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                      plantilla.tipo === 'email'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      <span className="material-symbols-outlined text-sm">
                        {plantilla.tipo === 'email' ? 'mail' : 'phone'}
                      </span>
                      {plantilla.tipo === 'email' ? 'Email' : 'WhatsApp'}
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                      plantilla.estado === 'activa'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {plantilla.estado === 'activa' ? '✓ Activa' : 'Inactiva'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleState(plantilla.id)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition-all text-sm font-medium"
                >
                  {plantilla.estado === 'activa' ? 'Desactivar' : 'Activar'}
                </button>
              </div>

              <div className="mb-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 mb-1">CONTENIDO</p>
                <p className="text-sm text-slate-700">{plantilla.contenido}</p>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-600">Variables: </span>
                  <span className="font-semibold text-slate-800">{plantilla.variables.join(', ')}</span>
                </div>
                <div className="text-slate-600">
                  Usado <span className="font-semibold text-slate-800">{plantilla.usosTotal}</span> veces
                </div>
              </div>
            </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Plantillas;
