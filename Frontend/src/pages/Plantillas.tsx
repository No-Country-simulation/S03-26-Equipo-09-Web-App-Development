import { useState } from 'react';

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

  const handleToggleState = (id: number) => {
    setPlantillas(plantillas.map(p => 
      p.id === id ? { ...p, estado: p.estado === 'activa' ? 'inactiva' : 'activa' } : p
    ));
  };

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
        <button className="h-11 px-6 bg-[#182442] hover:bg-[#0d1420] text-white font-semibold whitespace-nowrap rounded-lg flex items-center gap-2">
          <span className="material-symbols-outlined">add</span>
          Nueva Plantilla
        </button>
      </header>

      {/* Filtros */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 flex gap-2 flex-wrap">
        <span className="text-sm font-medium text-slate-700">Filtrar por:</span>
        {['Todas', 'Email', 'WhatsApp'].map((filtro) => (
          <button
            key={filtro}
            className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-all text-sm"
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
          Todas las Plantillas
        </h3>

        <div className="grid gap-4">
          {plantillas.map((plantilla) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default Plantillas;
