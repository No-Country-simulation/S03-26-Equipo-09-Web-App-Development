import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { obtenerPlantillasActivas, reemplazarVariables, incrementarUsoPlantilla } from '../../../common/plantillasHelper';

interface Mensaje {
  id: number;
  contenido: string;
  fechaHora: string;
  tipo: 'entrada' | 'salida';
  remitente: string;
}

interface Conversacion {
  id: number;
  canal: 'Email' | 'WhatsApp';
  contenido: string;
  fechaHora: string;
  contactoId: number;
  contactoNombre?: string;
  contactoEmail?: string;
  estado?: 'pendiente' | 'respondido' | 'cerrado';
  etiqueta?: string;
  mensajes?: Mensaje[];
  nombreContacto?: string;
}

interface InboxVendedorProps {
  vendedorId: number;
  vendedorNombre: string;
}

export const InboxVendedor: React.FC<InboxVendedorProps> = ({ vendedorId, vendedorNombre }) => {
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [filtroCanal, setFiltroCanal] = useState<'Todos' | 'Email' | 'WhatsApp'>('Todos');
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | 'pendiente' | 'respondido' | 'cerrado'>('Todos');
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [plantillas, setPlantillas] = useState<any[]>([]);
  
  const [selectedConversacion, setSelectedConversacion] = useState<Conversacion | null>(null);
  const [plantillaModal, setPlantillaModal] = useState(false);
  const [respuesta, setRespuesta] = useState('');
  const [variablesModal, setVariablesModal] = useState(false);
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<any | null>(null);
  const [variables, setVariables] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    cargarDatos();
  }, [vendedorId]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Mock data realista con múltiples conversaciones y mensajes
      const conversacionesMock: Conversacion[] = [
        {
          id: 1,
          canal: 'WhatsApp',
          contenido: '¿Cuál es el precio de vuestro producto premium?',
          fechaHora: new Date(Date.now() - 3600000).toISOString(),
          contactoId: 101,
          contactoNombre: 'Juan García',
          contactoEmail: 'juan@example.com',
          estado: 'pendiente',
          etiqueta: 'Lead Activo',
          mensajes: [
            {
              id: 1,
              contenido: '¿Cuál es el precio de vuestro producto premium?',
              fechaHora: new Date(Date.now() - 3600000).toISOString(),
              tipo: 'entrada',
              remitente: 'Juan García'
            },
            {
              id: 2,
              contenido: 'Hola Juan, el producto premium tiene un costo de $299.99 al mes. Incluye soporte 24/7 💪',
              fechaHora: new Date(Date.now() - 3500000).toISOString(),
              tipo: 'salida',
              remitente: vendedorNombre
            },
            {
              id: 3,
              contenido: '¿Hay descuento por pago anual?',
              fechaHora: new Date(Date.now() - 3400000).toISOString(),
              tipo: 'entrada',
              remitente: 'Juan García'
            },
            {
              id: 4,
              contenido: 'Sí, si pagas anual te damos 20% de descuento. ¿Te interesa iniciar una prueba gratuita?',
              fechaHora: new Date(Date.now() - 3300000).toISOString(),
              tipo: 'salida',
              remitente: vendedorNombre
            }
          ]
        },
        {
          id: 2,
          canal: 'Email',
          contenido: 'Solicitud de información sobre plan empresarial',
          fechaHora: new Date(Date.now() - 7200000).toISOString(),
          contactoId: 102,
          contactoNombre: 'María Rodríguez',
          contactoEmail: 'maria.r@company.com',
          estado: 'respondido',
          etiqueta: 'Cliente',
          mensajes: [
            {
              id: 1,
              contenido: 'Solicitud de información sobre plan empresarial',
              fechaHora: new Date(Date.now() - 7200000).toISOString(),
              tipo: 'entrada',
              remitente: 'María Rodríguez'
            }
          ]
        },
        {
          id: 3,
          canal: 'WhatsApp',
          contenido: 'Demanda de soporte técnico para integración',
          fechaHora: new Date(Date.now() - 1800000).toISOString(),
          contactoId: 103,
          contactoNombre: 'Roberto Martínez',
          contactoEmail: 'rob.martinez@startup.io',
          estado: 'cerrado',
          etiqueta: 'Cliente',
          mensajes: [
            {
              id: 1,
              contenido: 'Tengo un problema con la integración de API',
              fechaHora: new Date(Date.now() - 1800000).toISOString(),
              tipo: 'entrada',
              remitente: 'Roberto Martínez'
            },
            {
              id: 2,
              contenido: 'Hola Roberto, te envío la documentación y un video tutorial. ¿Qué error específico recibes?',
              fechaHora: new Date(Date.now() - 1700000).toISOString(),
              tipo: 'salida',
              remitente: vendedorNombre
            },
            {
              id: 3,
              contenido: 'Perfecto, ya funcionó! Muchas gracias',
              fechaHora: new Date(Date.now() - 1600000).toISOString(),
              tipo: 'entrada',
              remitente: 'Roberto Martínez'
            },
            {
              id: 4,
              contenido: 'De nada! Cualquier otra duda contactame. ¡Que disfrutes! 🚀',
              fechaHora: new Date(Date.now() - 1500000).toISOString(),
              tipo: 'salida',
              remitente: vendedorNombre
            }
          ]
        },
        {
          id: 4,
          canal: 'Email',
          contenido: 'Renovación de suscripción - Facturación',
          fechaHora: new Date(Date.now() - 5400000).toISOString(),
          contactoId: 104,
          contactoNombre: 'David López',
          contactoEmail: 'david.lopez@enterprise.com',
          estado: 'cerrado',
          etiqueta: 'Cliente',
          mensajes: [
            {
              id: 1,
              contenido: 'Hola, necesito renovar mi suscripción. ¿Cómo procedo?',
              fechaHora: new Date(Date.now() - 5400000).toISOString(),
              tipo: 'entrada',
              remitente: 'David López'
            },
            {
              id: 2,
              contenido: 'Hola David, tu suscripción se renueva automáticamente el próximo mes. Te enviaré el detalle por correo.',
              fechaHora: new Date(Date.now() - 5300000).toISOString(),
              tipo: 'salida',
              remitente: vendedorNombre
            }
          ]
        },
        {
          id: 5,
          canal: 'WhatsApp',
          contenido: 'Ya no quiero el producto, muchas gracias',
          fechaHora: new Date(Date.now() - 2700000).toISOString(),
          contactoId: 105,
          contactoNombre: 'Laura Fernández',
          contactoEmail: 'laura.f@techstartup.co',
          estado: 'cerrado',
          etiqueta: 'Inactivo',
          mensajes: [
            {
              id: 1,
              contenido: 'Ya no quiero el producto, muchas gracias',
              fechaHora: new Date(Date.now() - 2700000).toISOString(),
              tipo: 'entrada',
              remitente: 'Laura Fernández'
            }
          ]
        }
      ];

      setConversaciones(conversacionesMock);
      // Cargar plantillas desde el helper
      const plantillasActivas = obtenerPlantillasActivas();
      setPlantillas(plantillasActivas);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const conversacionesFiltradas = conversaciones.filter(c => {
    const cumpleCanal = filtroCanal === 'Todos' || c.canal === filtroCanal;
    const cumpleEstado = filtroEstado === 'Todos' || c.estado === filtroEstado;
    const cumpleBusqueda = !filtroBusqueda || 
      c.contenido.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
      c.contactoNombre?.toLowerCase().includes(filtroBusqueda.toLowerCase());
    
    return cumpleCanal && cumpleEstado && cumpleBusqueda;
  });

  const handleAplicarPlantilla = () => {
    if (!plantillaSeleccionada) return;
    
    const contenido = reemplazarVariables(plantillaSeleccionada.contenido, variables);
    
    setRespuesta(contenido);
    incrementarUsoPlantilla(plantillaSeleccionada.id);
    setVariablesModal(false);
    setPlantillaSeleccionada(null);
    setVariables({});
  };

  const handleEnviarRespuesta = async () => {
    if (!selectedConversacion || !respuesta.trim()) return;

    // Agregar mensaje a la conversación
    const nuevoMensaje: Mensaje = {
      id: (selectedConversacion.mensajes?.length || 0) + 1,
      contenido: respuesta,
      fechaHora: new Date().toISOString(),
      tipo: 'salida',
      remitente: vendedorNombre
    };

    const conversacionActualizada: Conversacion = {
      ...selectedConversacion,
      mensajes: [...(selectedConversacion.mensajes || []), nuevoMensaje],
      estado: selectedConversacion.estado || 'pendiente'
    };

    setSelectedConversacion(conversacionActualizada);
    setRespuesta('');

    // Actualizar en lista
    setConversaciones(conversaciones.map(c => 
      c.id === selectedConversacion.id ? conversacionActualizada : c
    ));
  };

  const descargarPDF = (conversacion: Conversacion) => {
    try {
      const doc = new jsPDF();
      const pageHeight = doc.internal.pageSize.getHeight();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPosition = 20;

      // Header
      doc.setFillColor(24, 36, 66);
      doc.rect(0, 0, pageWidth, 30, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.text('Reporte de Conversación', 15, 22);

      yPosition = 45;
      
      // Información general
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Información General:', 15, yPosition);
      yPosition += 8;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`ID: ${conversacion.id}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Canal: ${conversacion.canal}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Contacto: ${conversacion.contactoNombre || 'Desconocido'}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Estado: ${conversacion.estado || 'activo'}`, 20, yPosition);
      yPosition += 6;
      const fechaConv = new Date(conversacion.fechaHora).toLocaleDateString('es-ES');
      doc.text(`Fecha: ${fechaConv}`, 20, yPosition);
      yPosition += 10;

      // Historial de mensajes
      doc.setFont('helvetica', 'bold');
      doc.text('Historial de Conversación:', 15, yPosition);
      yPosition += 8;

      doc.setFont('helvetica', 'normal');
      
      if (conversacion.mensajes && conversacion.mensajes.length > 0) {
        conversacion.mensajes.forEach((msg) => {
          const texto = `${msg.remitente}: ${msg.contenido}`;
          const lineas = doc.splitTextToSize(texto, pageWidth - 30) as string[];
          
          if (yPosition + (lineas.length * 6) > pageHeight - 20) {
            doc.addPage();
            yPosition = 20;
          }

          const colors = msg.tipo === 'entrada' ? [240, 240, 240] : [220, 240, 220];
          doc.setFillColor(colors[0] || 0, colors[1] || 0, colors[2] || 0);
          doc.rect(15, yPosition - 2, pageWidth - 30, (lineas.length * 6) + 2, 'F');
          
          doc.text(lineas as any, 20, yPosition);
          yPosition += (lineas.length * 6) + 3;
          
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          const fechaFormato = new Date(msg.fechaHora).toLocaleDateString('es-ES');
          doc.text(fechaFormato, 20, yPosition);
          yPosition += 4;
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
        });
      } else {
        doc.text(conversacion.contenido || 'Sin contenido', 20, yPosition);
        yPosition += 6;
      }

      // Footer
      yPosition = pageHeight - 15;
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      const footerDate = new Date().toLocaleDateString('es-ES');
      doc.text(`Descargado: ${footerDate}`, 15, yPosition);

      doc.save(`conversacion_${conversacion.id}_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error('Error descargando PDF:', error);
      alert('Error al descargar el PDF');
    }
  };

  const getBadgeCanal = (canal: string) => {
    if (canal === 'WhatsApp') {
      return <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">📱 WhatsApp</span>;
    }
    return <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">✉️ Email</span>;
  };

  const getBadgeEstado = (estado?: string) => {
    const estados = {
      pendiente: 'bg-blue-100 text-blue-800',
      respondido: 'bg-yellow-100 text-yellow-800',
      cerrado: 'bg-green-100 text-green-800'
    };
    const estado_final = (estado || 'pendiente') as keyof typeof estados;
    return (
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${estados[estado_final]}`}>
        {estado_final === 'pendiente' && '⚠️'} 
        {estado_final === 'respondido' && '📧'} 
        {estado_final === 'cerrado' && '✅'} 
        {estado_final}
      </span>
    );
  };

  const getBadgeEtiqueta = (etiqueta?: string) => {
    if (!etiqueta) return null;
    
    const etiquetas: Record<string, { bg: string; text: string }> = {
      'Lead Activo': { bg: 'bg-blue-100', text: 'text-blue-700' },
      'Cliente': { bg: 'bg-green-100', text: 'text-green-700' },
      'Inactivo': { bg: 'bg-red-100', text: 'text-red-700' }
    };
    
    const config = etiquetas[etiqueta];
    if (!config) return <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700">{etiqueta}</span>;
    
    return (
      <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold ${config.bg} ${config.text}`}>
        {etiqueta}
      </span>
    );
  };

  if (loading) return <div className="text-center py-8 text-slate-600">Cargando conversaciones...</div>;

  return (
    <div className="space-y-6 min-h-[calc(100vh-120px)] max-h-screen flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#182442]">💬 Mi Inbox</h1>
        <p className="text-slate-600 text-xs sm:text-sm mt-1">Vendedor: {vendedorNombre}</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-2 sm:p-4 border border-blue-200 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-xs font-medium">
                <span className="hidden sm:inline">Total</span>
              </p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{conversaciones.length}</p>
            </div>
            <span className="text-blue-300 text-2xl sm:text-4xl">📬</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-2 sm:p-4 border border-green-200 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-xs font-medium">
                <span className="hidden sm:inline">WhatsApp</span>
              </p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">
                {conversaciones.filter(c => c.canal === 'WhatsApp').length}
              </p>
            </div>
            <span className="text-green-300 text-2xl sm:text-4xl">📱</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-2 sm:p-4 border border-purple-200 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-xs font-medium">
                <span className="hidden sm:inline">Email</span>
              </p>
              <p className="text-xl sm:text-2xl font-bold text-purple-600">
                {conversaciones.filter(c => c.canal === 'Email').length}
              </p>
            </div>
            <span className="text-purple-300 text-2xl sm:text-4xl">✉️</span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg border border-slate-200 shadow p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
        <h3 className="font-semibold text-sm sm:text-base text-[#182442] flex items-center gap-2">
          ⚙️ <span className="hidden sm:inline">Filtros</span>
        </h3>

        {/* Búsqueda */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2">Buscar</label>
          <input
            type="text"
            placeholder="Buscar por mensaje o contacto..."
            value={filtroBusqueda}
            onChange={(e) => setFiltroBusqueda(e.target.value)}
            className="w-full px-2 py-1 sm:px-4 sm:py-2 border border-slate-300 rounded text-xs sm:text-sm lg:rounded-lg focus:border-[#006c49] focus:ring-2 focus:ring-[#006c49]/20"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          {/* Filtro Canal */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">Canal</label>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {['Todos', 'Email', 'WhatsApp'].map((canal) => (
                <button
                  key={canal}
                  onClick={() => setFiltroCanal(canal as 'Todos' | 'Email' | 'WhatsApp')}
                  className={`px-2 sm:px-4 py-1 sm:py-2 rounded text-xs sm:text-sm lg:rounded-lg font-semibold transition-all border-2 flex items-center gap-1 sm:gap-2 ${
                    filtroCanal === canal
                      ? 'bg-[#006c49] text-white border-[#006c49]'
                      : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {canal === 'Email' && '✉️'} 
                  {canal === 'WhatsApp' && '📱'} 
                  {canal === 'Todos' && (
                    <>
                      <span className="hidden sm:inline">📬</span>
                      <span className="sm:hidden">T</span>
                    </>
                  )}
                  <span className="hidden sm:inline">{canal}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filtro Estado */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">Estado</label>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {[
                { id: 'Todos', label: 'Todos', color: 'slate' },
                { id: 'pendiente', label: 'Pendiente', color: 'blue' },
                { id: 'respondido', label: 'Respondido', color: 'yellow' },
                { id: 'cerrado', label: 'Cerrado', color: 'green' }
              ].map((opcion) => {
                const colorClasses: Record<string, string> = {
                  'slate': 'bg-slate-100 text-slate-700 border-slate-300',
                  'blue': 'bg-blue-100 text-blue-700 border-blue-300',
                  'yellow': 'bg-yellow-100 text-yellow-700 border-yellow-300',
                  'green': 'bg-green-100 text-green-700 border-green-300'
                };

                return (
                  <button
                    key={opcion.id}
                    onClick={() => setFiltroEstado(opcion.id as any)}
                    className={`px-2 sm:px-4 py-1 sm:py-2 rounded text-xs sm:text-sm lg:rounded-lg font-semibold transition-all border-2 ${
                      filtroEstado === opcion.id
                        ? `${colorClasses[opcion.color]} border-current ring-2 ring-offset-1`
                        : `${colorClasses[opcion.color]} hover:brightness-95`
                    }`}
                  >
                    {opcion.id === 'pendiente' && '⚠️'} 
                    {opcion.id === 'respondido' && '📧'} 
                    {opcion.id === 'cerrado' && '✅'} 
                    <span className="hidden sm:inline">{opcion.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal - Split View Responsive */}
      <div className="flex flex-1 gap-4 lg:gap-6 overflow-auto lg:overflow-hidden lg:flex-row flex-col">
        
        {/* Lista de Conversaciones */}
        <div className={`${selectedConversacion && window.innerWidth < 1024 ? 'hidden lg:flex' : 'flex'} lg:flex-1 w-full bg-white rounded-lg shadow overflow-hidden flex flex-col`}>
          <div className="overflow-y-auto flex-1">
            <div className="divide-y">
              {conversacionesFiltradas.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <p className="text-lg font-medium">No hay conversaciones</p>
                  <p className="text-sm">Ajusta los filtros</p>
                </div>
              ) : (
                conversacionesFiltradas.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversacion(conv)}
                    className={`p-4 lg:p-3 cursor-pointer transition-all border-l-4 ${
                      selectedConversacion?.id === conv.id
                        ? 'bg-slate-50 border-[#006c49] shadow-md'
                        : 'bg-white border-transparent hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-2 mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 text-base lg:text-sm">#{conv.id} - {conv.contactoNombre}</p>
                        {conv.etiqueta && (
                          <div className="mt-1">
                            {getBadgeEtiqueta(conv.etiqueta)}
                          </div>
                        )}
                        <p className="text-xs text-slate-500 mt-1">{new Date(conv.fechaHora).toLocaleString('es-ES')}</p>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {getBadgeCanal(conv.canal)}
                        {getBadgeEstado(conv.estado)}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2 mb-2">{conv.contenido}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Panel de Chat */}
        {selectedConversacion ? (
          <div className="flex-1 w-full lg:w-auto bg-white rounded-lg shadow overflow-hidden flex flex-col max-h-[calc(100vh-320px)] sm:max-h-[calc(100vh-280px)] lg:max-h-none lg:min-h-full">
            {/* Header Chat */}
            <div className="bg-gradient-to-r from-[#182442] to-[#006c49] text-white px-3 py-1.5 lg:p-4 flex flex-row lg:flex-row lg:justify-between lg:items-center gap-2 lg:gap-3 flex-shrink-0">
              <button
                onClick={() => setSelectedConversacion(null)}
                className="lg:hidden px-3 py-2 bg-white/30 hover:bg-white/50 rounded text-sm font-semibold transition-colors"
                title="Volver al listado"
              >
                ← Volver
              </button>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs lg:text-base truncate">#{selectedConversacion.id} - {selectedConversacion.contactoNombre}</h3>
                <p className="text-xs lg:text-sm opacity-90 line-clamp-1 hidden lg:block">{selectedConversacion.canal} • {selectedConversacion.estado}</p>
              </div>
              <div className="flex gap-0.5 lg:gap-2 flex-shrink-0">
                <button
                  onClick={() => descargarPDF(selectedConversacion)}
                  className="p-0.5 lg:p-1 bg-white/20 hover:bg-white/30 rounded text-base lg:text-lg"
                  title="Descargar PDF"
                >
                  📥
                </button>
              </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-5 lg:p-7 space-y-3 lg:space-y-4 bg-slate-50">
              {selectedConversacion.mensajes && selectedConversacion.mensajes.length > 0 ? (
                selectedConversacion.mensajes.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.tipo === 'entrada' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-2xl lg:max-w-2xl px-4 py-3 lg:px-5 lg:py-4 rounded-lg ${
                        msg.tipo === 'entrada'
                          ? 'bg-white border border-slate-200'
                          : 'bg-[#006c49] text-white'
                      }`}
                    >
                      <p className={`text-xs lg:text-sm font-semibold mb-1 lg:mb-1 ${msg.tipo === 'entrada' ? 'text-slate-600' : 'opacity-90'}`}>
                        {msg.remitente}
                      </p>
                      <p className="text-sm lg:text-sm break-words">{msg.contenido}</p>
                      <p className={`text-xs mt-2 lg:mt-2 ${msg.tipo === 'entrada' ? 'text-slate-400' : 'opacity-75'}`}>
                        {new Date(msg.fechaHora).toLocaleTimeString('es-ES')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-400 text-sm">No hay mensajes</div>
              )}
            </div>

            {/* Input Respuesta */}
            <div className="border-t border-slate-200 px-3 py-2 lg:p-4 space-y-2 lg:space-y-3 bg-white flex-shrink-0">
              <div className="flex gap-2 lg:gap-3">
                <textarea
                  value={respuesta}
                  onChange={(e) => setRespuesta(e.target.value)}
                  placeholder="Escribe tu respuesta..."
                  className="flex-1 px-2 py-1 lg:px-4 lg:py-2 border border-slate-300 rounded lg:rounded-lg resize-none focus:border-[#006c49] focus:ring-1 lg:focus:ring-2 focus:ring-[#006c49]/20 text-xs lg:text-sm"
                  rows={2}
                />
              </div>
              <div className="flex gap-1.5 lg:gap-3 flex-shrink-0">
                <button
                  onClick={() => setPlantillaModal(true)}
                  className="flex-1 px-1.5 py-1 lg:px-4 lg:py-2 bg-yellow-500 text-white rounded lg:rounded-lg hover:bg-yellow-600 font-semibold text-xs transition-colors"
                >
                  📧 Plantillas
                </button>
                <button
                  onClick={handleEnviarRespuesta}
                  disabled={!respuesta.trim()}
                  className="flex-1 px-1.5 py-1 lg:px-4 lg:py-2 bg-[#006c49] text-white rounded lg:rounded-lg hover:bg-[#005236] font-semibold disabled:bg-slate-400 disabled:cursor-not-allowed text-xs transition-colors"
                >
                  ✉️ Enviar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex flex-1 bg-white rounded-lg shadow flex items-center justify-center text-slate-400">
            <p>Selecciona una conversación para continuar</p>
          </div>
        )}
      </div>

      {/* Modal Plantillas */}
      {plantillaModal && selectedConversacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#182442]">📧 Selecciona una Plantilla</h3>
              <button
                onClick={() => setPlantillaModal(false)}
                className="text-2xl text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-3">
              {plantillas.map((plantilla) => (
                <div
                  key={plantilla.id}
                  className="border border-slate-200 rounded-lg p-4 hover:border-[#006c49] hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800">{plantilla.nombre}</h4>
                      <p className="text-sm text-slate-600 mt-1">{plantilla.contenido}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          {plantilla.tipo}
                        </span>
                        {plantilla.variables && plantilla.variables.length > 0 && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {plantilla.variables.length} variables
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setPlantillaSeleccionada(plantilla);
                        if (plantilla.variables && plantilla.variables.length > 0) {
                          setVariablesModal(true);
                        } else {
                          setRespuesta(plantilla.contenido);
                          incrementarUsoPlantilla(plantilla.id);
                          setPlantillaModal(false);
                        }
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

      {/* Modal Variables */}
      {variablesModal && plantillaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-[#182442] mb-4">
              📝 Personalizar: {plantillaSeleccionada.nombre}
            </h3>

            <div className="space-y-4 mb-6">
              {plantillaSeleccionada.variables?.map((variable: string) => (
                <div key={variable}>
                  <label className="block text-sm font-semibold text-[#182442] mb-1">
                    {variable}
                  </label>
                  <input
                    type="text"
                    value={variables[variable] || ''}
                    onChange={(e) => setVariables({ ...variables, [variable]: e.target.value })}
                    placeholder={`Ingresa ${variable}`}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-[#006c49] focus:ring-2 focus:ring-[#006c49]/20"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setVariablesModal(false);
                  setPlantillaSeleccionada(null);
                  setVariables({});
                }}
                className="flex-1 px-4 py-2 border border-slate-300 text-[#182442] rounded-lg hover:bg-slate-100 font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleAplicarPlantilla}
                className="flex-1 px-4 py-2 bg-[#006c49] text-white rounded-lg hover:bg-[#005236] font-medium"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
