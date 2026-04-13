import { useState, useEffect } from 'react';
import { conversacionService } from '../../../common/apiClient';

interface Conversacion {
  id: number;
  canal: 'Email' | 'WhatsApp';
  contenido: string;
  fechaHora: string;
  contactoId: number;
  estado?: 'ACTIVO' | 'EN_SEGUIMIENTO' | 'CLIENTE' | 'INACTIVO';
  vendedorAsignadoNombre?: string;
}

interface UnifiedInboxProps {
  vendedorId: number;
  vendedorNombre: string;
}

export const UnifiedInbox = ({ vendedorId, vendedorNombre }: UnifiedInboxProps) => {
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filtroCanal, setFiltroCanal] = useState<'todos' | 'email' | 'whatsapp'>('todos');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'activo' | 'seguimiento' | 'cliente' | 'inactivo'>('todos');

  useEffect(() => {
    cargarConversaciones();
  }, [vendedorId]);

  const cargarConversaciones = async () => {
    setLoading(true);
    try {
      const data = await conversacionService.getByVendedor(vendedorId);
      setConversaciones(data);
    } catch (error) {
      console.error('Error cargando conversaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConversacionesFiltradas = () => {
    return conversaciones.filter((conv) => {
      // Filtro por canal
      if (filtroCanal !== 'todos') {
        const canalNormalizado = conv.canal.toLowerCase();
        if (canalNormalizado !== filtroCanal) return false;
      }

      // Filtro por estado
      if (filtroEstado !== 'todos' && conv.estado) {
        const estadoMap: Record<string, string> = {
          'activo': 'ACTIVO',
          'seguimiento': 'EN_SEGUIMIENTO',
          'cliente': 'CLIENTE',
          'inactivo': 'INACTIVO'
        };
        if (conv.estado !== estadoMap[filtroEstado]) return false;
      }

      return true;
    });
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-ES');
  };

  const getBadgeCanal = (canal: string) => {
    if (canal === 'WhatsApp') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          <span className="material-symbols-outlined text-sm">phone</span>
          WhatsApp
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
        <span className="material-symbols-outlined text-sm">mail</span>
        Email
      </span>
    );
  };

  const getBadgeEstado = (estado?: string) => {
    const colorMap: Record<string, { bg: string; text: string; label: string }> = {
      'ACTIVO': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Activo' },
      'EN_SEGUIMIENTO': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Seguimiento' },
      'CLIENTE': { bg: 'bg-green-100', text: 'text-green-700', label: 'Cliente' },
      'INACTIVO': { bg: 'bg-red-100', text: 'text-red-700', label: 'Inactivo' }
    };
    
    if (!estado || !colorMap[estado]) return null;
    
    const config = colorMap[estado];
    return (
      <span className={`inline-flex items-center gap-1 rounded-full ${config.bg} px-3 py-1 text-xs font-semibold ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const conversacionesFiltradas = getConversacionesFiltradas();

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block">
          <div className="animate-spin h-8 w-8 border-4 border-[#006c49] border-t-transparent rounded-full"></div>
          <p className="text-slate-600 mt-3">Cargando conversaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-3xl">mail_outline</span>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#182442]">Mi Inbox Unificado</h1>
            <p className="text-slate-600 text-sm">
              👤 {vendedorNombre} • Conversaciones de Email y WhatsApp
            </p>
          </div>
        </div>
      </header>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-xs font-medium">Total</p>
              <p className="text-2xl font-bold text-blue-600">{conversaciones.length}</p>
            </div>
            <span className="material-symbols-outlined text-blue-300 text-4xl">mail_outline</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-xs font-medium">WhatsApp</p>
              <p className="text-2xl font-bold text-green-600">
                {conversaciones.filter(c => c.canal === 'WhatsApp').length}
              </p>
            </div>
            <span className="material-symbols-outlined text-green-300 text-4xl">phone</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-xs font-medium">Email</p>
              <p className="text-2xl font-bold text-purple-600">
                {conversaciones.filter(c => c.canal === 'Email').length}
              </p>
            </div>
            <span className="material-symbols-outlined text-purple-300 text-4xl">draft</span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 md:p-6 space-y-4">
        <h3 className="font-semibold text-[#182442] flex items-center gap-2">
          <span className="material-symbols-outlined">tune</span>
          Filtros
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Filtro por Canal */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Canal</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'todos', label: 'Todos', icon: 'mail_outline' },
                { id: 'email', label: 'Email', icon: 'draft' },
                { id: 'whatsapp', label: 'WhatsApp', icon: 'phone' }
              ].map((opcion) => (
                <button
                  key={opcion.id}
                  onClick={() => setFiltroCanal(opcion.id as any)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 border-2 ${
                    filtroCanal === opcion.id
                      ? 'bg-[#006c49] text-white border-[#006c49]'
                      : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">{opcion.icon}</span>
                  {opcion.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filtro por Estado */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Estado</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'todos', label: 'Todos', color: 'slate' },
                { id: 'activo', label: 'Activo', color: 'blue' },
                { id: 'seguimiento', label: 'Seguimiento', color: 'yellow' },
                { id: 'cliente', label: 'Cliente', color: 'green' },
                { id: 'inactivo', label: 'Inactivo', color: 'red' }
              ].map((opcion) => {
                const colorClasses: Record<string, string> = {
                  'slate': 'bg-slate-100 text-slate-700 border-slate-300',
                  'blue': 'bg-blue-100 text-blue-700 border-blue-300',
                  'yellow': 'bg-yellow-100 text-yellow-700 border-yellow-300',
                  'green': 'bg-green-100 text-green-700 border-green-300',
                  'red': 'bg-red-100 text-red-700 border-red-300'
                };

                return (
                  <button
                    key={opcion.id}
                    onClick={() => setFiltroEstado(opcion.id as any)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all border-2 ${
                      filtroEstado === opcion.id
                        ? `${colorClasses[opcion.color]} border-current ring-2 ring-offset-1`
                        : `${colorClasses[opcion.color]} hover:brightness-95`
                    }`}
                  >
                    {opcion.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Conversaciones */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 md:p-6">
        <h3 className="font-semibold text-[#182442] mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined">chat_bubble_outline</span>
          Conversaciones ({conversacionesFiltradas.length})
        </h3>

        {conversacionesFiltradas.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-slate-300 block mb-3">mail_outline</span>
            <p className="text-slate-500 text-lg font-medium">No hay conversaciones</p>
            <p className="text-slate-400 text-sm">Ajusta los filtros para ver conversaciones</p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversacionesFiltradas.map((conv) => (
              <div
                key={conv.id}
                className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-all"
              >
                {/* Header */}
                <div
                  onClick={() => setExpandedId(expandedId === conv.id ? null : conv.id)}
                  className="p-4 bg-gradient-to-r from-slate-50 to-white hover:from-slate-100 cursor-pointer flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-bold text-slate-400 text-sm">#{conv.id}</span>
                      {getBadgeCanal(conv.canal)}
                      {getBadgeEstado(conv.estado)}
                    </div>
                    <p className="text-sm text-slate-700 line-clamp-2">{conv.contenido}</p>
                    <p className="text-xs text-slate-500 mt-1">{formatearFecha(conv.fechaHora)}</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 ml-2">
                    {expandedId === conv.id ? 'expand_less' : 'expand_more'}
                  </span>
                </div>

                {/* Detalles Expandidos */}
                {expandedId === conv.id && (
                  <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                        Mensaje Completo
                      </label>
                      <div className="bg-white p-3 rounded-lg border border-slate-200 text-sm text-slate-700 whitespace-pre-wrap break-words">
                        {conv.contenido}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                          Canal
                        </label>
                        {getBadgeCanal(conv.canal)}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                          Estado
                        </label>
                        {getBadgeEstado(conv.estado) || <span className="text-xs text-slate-500">Sin estado</span>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                          Contacto ID
                        </label>
                        <p className="text-sm text-slate-700 bg-slate-100 px-2 py-1 rounded w-fit">
                          #{conv.contactoId}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                          Vendedor
                        </label>
                        <p className="text-sm text-slate-700">{conv.vendedorAsignadoNombre || 'Sin asignar'}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex gap-2">
                      <button className="flex-1 px-4 py-2 rounded-lg bg-[#006c49] text-white font-semibold hover:bg-[#005236] transition-all text-sm flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-base">reply</span>
                        Responder
                      </button>
                      <button className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-all text-sm flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-base">archive</span>
                        Archivar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
