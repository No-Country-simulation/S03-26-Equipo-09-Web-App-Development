import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { conversacionService, usuarioService } from '../common/apiClient';

interface Conversacion {
  id: number;
  canal: 'Email' | 'WhatsApp';
  contenido: string;
  fechaHora: string;
  contactoId: number;
  contactoNombre?: string;
  vendedorAsignadoId?: number;
  vendedorAsignadoNombre?: string;
}

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  role: string;
}

interface Plantilla {
  id: number;
  nombre: string;
  contenido: string;
  canal: 'Email' | 'WhatsApp' | 'Ambos';
  variables?: string[];
}

// Mock de Plantillas
const PLANTILLAS_MOCK: Plantilla[] = [
  {
    id: 1,
    nombre: 'Saludo Inicial',
    contenido: 'Hola {nombre}, ¡gracias por tu interés! ¿Cómo podemos ayudarte hoy?',
    canal: 'Ambos',
    variables: ['nombre']
  },
  {
    id: 2,
    nombre: 'Seguimiento de Venta',
    contenido: '¿Tienes alguna pregunta sobre nuestro producto {producto}? Estoy aquí para ayudarte.',
    canal: 'Email',
    variables: ['producto']
  },
  {
    id: 3,
    nombre: 'Disponibilidad',
    contenido: 'Estoy disponible en {horario}. ¿Te viene bien para una llamada?',
    canal: 'WhatsApp',
    variables: ['horario']
  },
  {
    id: 4,
    nombre: 'Cierre de Venta',
    contenido: 'Perfecto, procederemos con tu pedido. Recibirás los detalles en tu correo dentro de {tiempo} horas.',
    canal: 'Ambos',
    variables: ['tiempo']
  }
];

export const InboxAdmin: React.FC = () => {
  const { isAdmin } = useAuth();
  
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [vendedores, setVendedores] = useState<Usuario[]>([]);
  const [filtroVendedor, setFiltroVendedor] = useState<number | null>(null);
  const [filtroCanal, setFiltroCanal] = useState<'Todos' | 'Email' | 'WhatsApp'>('Todos');
  const [loading, setLoading] = useState(true);
  const [selectedConversacion, setSelectedConversacion] = useState<Conversacion | null>(null);
  const [reasignarModal, setReasignarModal] = useState(false);
  const [nuevoVendedorId, setNuevoVendedorId] = useState<number | null>(null);
  const [plantillaModal, setPlantillaModal] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [conversacionesRes, vendedoresRes] = await Promise.all([
        conversacionService.getAll(),
        usuarioService.getVendedores()
      ]);
      setConversaciones(conversacionesRes);
      setVendedores(vendedoresRes);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar conversaciones por vendedor y canal
  const conversacionesFiltradas = conversaciones.filter(c => {
    const cumpleVendedor = !filtroVendedor || c.vendedorAsignadoId === filtroVendedor;
    const cumpleCanal = filtroCanal === 'Todos' || c.canal === filtroCanal;
    return cumpleVendedor && cumpleCanal;
  });

  const handleReasignar = async () => {
    if (!selectedConversacion || !nuevoVendedorId) return;

    try {
      await conversacionService.reasignarVendedor(
        selectedConversacion.id,
        nuevoVendedorId
      );
      setReasignarModal(false);
      setSelectedConversacion(null);
      setNuevoVendedorId(null);
      await cargarDatos();
    } catch (error) {
      console.error('Error reasignando vendedor:', error);
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-ES');
  };

  const descargarPDF = (conversacion: Conversacion) => {
    const contenidoPDF = `
CONVERSACIÓN #${conversacion.id}
====================================
Canal: ${conversacion.canal}
Vendedor: ${conversacion.vendedorAsignadoNombre || 'Sin asignar'}
Fecha: ${formatearFecha(conversacion.fechaHora)}
Contacto: ${conversacion.contactoNombre || 'Desconocido'}

CONTENIDO:
${conversacion.contenido}
====================================
Descargado: ${new Date().toLocaleString('es-ES')}
    `;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(contenidoPDF));
    element.setAttribute('download', `conversacion_${conversacion.id}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getBadgeCanal = (canal: string) => {
    if (canal === 'WhatsApp') {
      return <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">📱 WhatsApp</span>;
    }
    return <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">✉️ Email</span>;
  };

  if (loading) return <div className="text-center py-8 text-slate-600">Cargando conversaciones...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-[#182442]">📬 Inbox Unificado</h1>
        <p className="text-slate-600 mt-1">Gestiona todas tus conversaciones por email y WhatsApp</p>
      </div>

      {/* Filtros Mejorados */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex flex-col gap-6">
          {/* Filtro por Canal */}
          <div>
            <label className="block text-sm font-semibold text-[#182442] mb-3">
              📱 Filtrar por Canal
            </label>
            <div className="flex flex-wrap gap-2">
              {['Todos', 'Email', 'WhatsApp'].map((canal) => (
                <button
                  key={canal}
                  onClick={() => setFiltroCanal(canal as 'Todos' | 'Email' | 'WhatsApp')}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all transform ${
                    filtroCanal === canal
                      ? 'bg-[#006c49] text-white shadow-lg scale-105'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {canal === 'Email' && '✉️'} {canal === 'WhatsApp' && '📱'} {canal}
                </button>
              ))}
            </div>
          </div>

          {/* Filtro por Vendedor (Solo Admin) */}
          {isAdmin && vendedores.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-[#182442] mb-3">
                👤 Filtrar por Vendedor
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFiltroVendedor(null)}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all transform ${
                    filtroVendedor === null
                      ? 'bg-indigo-500 text-white shadow-lg scale-105'
                      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  }`}
                >
                  👥 Todos
                </button>
                {vendedores.map((vendedor) => (
                  <button
                    key={vendedor.id}
                    onClick={() => setFiltroVendedor(vendedor.id)}
                    className={`px-4 py-2 rounded-full font-semibold text-sm transition-all transform whitespace-nowrap ${
                      filtroVendedor === vendedor.id
                        ? 'bg-cyan-500 text-white shadow-lg scale-105'
                        : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
                    }`}
                  >
                    👤 {vendedor.nombre}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Indicador de Resultados */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <p className="text-sm font-medium text-slate-600">
            <span className="font-bold text-[#006c49]">{conversacionesFiltradas.length}</span> conversaciones encontradas
          </p>
          <p className="text-xs text-slate-500">
            Canal: {filtroCanal} {filtroVendedor && `• Vendedor seleccionado`}
          </p>
        </div>
      </div>

      {/* Tabla de Conversaciones Mejorada */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Canal</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Contacto</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Mensaje</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Vendedor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Fecha</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {conversacionesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    <p className="text-lg font-medium">No hay conversaciones</p>
                    <p className="text-sm">Ajusta los filtros para ver resultados</p>
                  </td>
                </tr>
              ) : (
                conversacionesFiltradas.map((conv) => (
                  <tr key={conv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">#{conv.id}</td>
                    <td className="px-6 py-4 text-sm">{getBadgeCanal(conv.canal)}</td>
                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">{conv.contactoNombre || 'Desconocido'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">{conv.contenido}</td>
                    <td className="px-6 py-4 text-sm">
                      {conv.vendedorAsignadoNombre ? (
                        <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
                          {conv.vendedorAsignadoNombre}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Sin asignar</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{formatearFecha(conv.fechaHora)}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-1 justify-center">
                        <button
                          onClick={() => {
                            setSelectedConversacion(conv);
                            setPlantillaModal(true);
                          }}
                          className="p-2 hover:bg-yellow-100 rounded text-yellow-600 transition-colors"
                          title="Ver plantillas"
                        >
                          📧
                        </button>
                        <button
                          onClick={() => descargarPDF(conv)}
                          className="p-2 hover:bg-red-100 rounded text-red-600 transition-colors"
                          title="Descargar PDF"
                        >
                          📥
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => {
                              setSelectedConversacion(conv);
                              setReasignarModal(true);
                            }}
                            className="p-2 hover:bg-blue-100 rounded text-blue-600 transition-colors"
                            title="Reasignar"
                          >
                            👤
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Plantillas */}
      {plantillaModal && selectedConversacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#182442]">📧 Plantillas por Usar</h3>
              <button
                onClick={() => {
                  setPlantillaModal(false);
                  setSelectedConversacion(null);
                }}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Contenido */}
            <div className="p-6 space-y-3">
              {PLANTILLAS_MOCK.map((plantilla) => (
                <div
                  key={plantilla.id}
                  className="border border-slate-200 rounded-lg p-4 hover:border-[#006c49] hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800">{plantilla.nombre}</h4>
                      <p className="text-sm text-slate-600 mt-1">{plantilla.contenido}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          {plantilla.canal}
                        </span>
                        {plantilla.variables && plantilla.variables.length > 0 && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            Variables: {plantilla.variables.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(plantilla.contenido);
                        alert(`✅ Plantilla "${plantilla.nombre}" copiada al portapapeles\n\nVariables: ${plantilla.variables?.join(', ') || 'ninguna'}`);
                      }}
                      className="ml-2 px-3 py-1 bg-[#006c49] text-white rounded text-sm hover:bg-[#005236] whitespace-nowrap"
                    >
                      Usar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Reasignación */}
      {reasignarModal && selectedConversacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-[#182442] mb-4">Reasignar Conversación #{selectedConversacion.id}</h3>
            <p className="text-sm text-slate-600 mb-4">Vendedor actual: <span className="font-semibold">{selectedConversacion.vendedorAsignadoNombre || 'Sin asignar'}</span></p>
            
            <label className="block text-sm font-semibold text-[#182442] mb-2">Nuevo Vendedor:</label>
            <select
              value={nuevoVendedorId || ''}
              onChange={(e) => setNuevoVendedorId(Number(e.target.value))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-[#006c49] focus:ring-2 focus:ring-[#006c49]/20 mb-6"
            >
              <option value="">Seleccionar vendedor</option>
              {vendedores.map(v => (
                <option key={v.id} value={v.id}>{v.nombre}</option>
              ))}
            </select>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setReasignarModal(false);
                  setSelectedConversacion(null);
                  setNuevoVendedorId(null);
                }}
                className="flex-1 px-4 py-2 border border-slate-300 text-[#182442] rounded-lg hover:bg-slate-100 font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleReasignar}
                disabled={!nuevoVendedorId}
                className="flex-1 px-4 py-2 bg-[#006c49] text-white rounded-lg hover:bg-[#005236] font-medium disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                Reasignar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
