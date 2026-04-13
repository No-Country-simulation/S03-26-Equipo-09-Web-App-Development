import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { Card } from './ui/Card/Card';

interface MetricasAdminProps {
  leads?: any[];
  mensajes?: any[];
}

export const MetricasAdmin = ({ leads = [], mensajes = [] }: MetricasAdminProps) => {
  const [metricas, setMetricas] = useState({
    leadsActivos: 0,
    leadsActivoEtiqueta: 0,
    clientes: 0,
    inactivos: 0,
    leadsNuevosHoy: 0,
    mensajesEnviados: 0,
    mensajePorCanal: { whatsapp: 0, email: 0 },
    tasaRespuesta: 0,
    tasaConversion: 0,
    tiempoPromedioRespuesta: 2.5,
    vendedoresActivos: 3,
    tasaCrecimiento: 12.5
  });

  useEffect(() => {
    calcularMetricas();
  }, [leads, mensajes]);

  const calcularMetricas = () => {
    const activos = leads.filter((l: any) => l.estado !== 'DESCARTADO').length;
    const activoEtiqueta = leads.filter((l: any) => l.etiqueta === 'Lead Activo').length;
    const clientes = leads.filter((l: any) => l.etiqueta === 'Cliente').length;
    const inactivos = leads.filter((l: any) => l.etiqueta === 'Inactivo').length;

    const hoy = new Date().toDateString();
    const nuevosHoy = leads.filter((l: any) => 
      new Date(l.fechaCreacion || new Date()).toDateString() === hoy
    ).length;

    const whatsapp = mensajes.filter((m: any) => m.canal === 'WHATSAPP').length;
    const email = mensajes.filter((m: any) => m.canal === 'EMAIL').length;

    const tasaRespuesta = leads.length > 0 ? Math.round((email / leads.length) * 100) : 0;
    const tasaConversion = leads.length > 0 ? Math.round((clientes / leads.length) * 100) : 0;

    setMetricas({
      leadsActivos: activos,
      leadsActivoEtiqueta: activoEtiqueta,
      clientes,
      inactivos,
      leadsNuevosHoy: nuevosHoy,
      mensajesEnviados: whatsapp + email,
      mensajePorCanal: { whatsapp, email },
      tasaRespuesta,
      tasaConversion,
      tiempoPromedioRespuesta: 2.5,
      vendedoresActivos: 3,
      tasaCrecimiento: 12.5
    });
  };

  const descargarReportePDF = () => {
    try {
      const doc = new jsPDF();
      const pageHeight = doc.internal.pageSize.getHeight();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPosition = 20;

      // Header
      doc.setFillColor(24, 36, 66);
      doc.rect(0, 0, pageWidth, 30, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text('REPORTE DE METRICAS CRM', 15, 22);

      yPosition = 45;

      // Fecha y Hora
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text(`Generado: ${new Date().toLocaleString('es-ES')}`, 15, yPosition);
      yPosition += 8;

      // Sección KPIs
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('KPIs PRINCIPALES', 15, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      const kpis = [
        { label: 'Leads Activos', value: metricas.leadsActivos },
        { label: 'Clientes Confirmados', value: metricas.clientes },
        { label: 'Leads Inactivos', value: metricas.inactivos },
        { label: 'Nuevos Hoy', value: metricas.leadsNuevosHoy },
        { label: 'Mensajes Enviados', value: metricas.mensajesEnviados },
        { label: 'Tasa de Conversion', value: `${metricas.tasaConversion}%` },
        { label: 'Tasa de Respuesta', value: `${metricas.tasaRespuesta}%` },
        { label: 'Tiempo Promedio (h)', value: metricas.tiempoPromedioRespuesta }
      ];

      kpis.forEach(kpi => {
        doc.text(`${kpi.label}: ${kpi.value}`, 20, yPosition);
        yPosition += 7;
      });

      yPosition += 5;

      // Sección Canales
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('DISTRIBUCION DE CANALES', 15, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      const totalMensajes = metricas.mensajePorCanal.whatsapp + metricas.mensajePorCanal.email || 1;
      const pctWhatsApp = Math.round((metricas.mensajePorCanal.whatsapp / totalMensajes) * 100);
      const pctEmail = Math.round((metricas.mensajePorCanal.email / totalMensajes) * 100);

      doc.text(`WhatsApp: ${metricas.mensajePorCanal.whatsapp} mensajes (${pctWhatsApp}%)`, 20, yPosition);
      yPosition += 7;
      doc.text(`Email: ${metricas.mensajePorCanal.email} mensajes (${pctEmail}%)`, 20, yPosition);
      yPosition += 12;

      // Sección Funnel
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('FUNNEL DE VENTAS', 15, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`Lead Activo: ${metricas.leadsActivoEtiqueta}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Cliente: ${metricas.clientes}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Inactivo: ${metricas.inactivos}`, 20, yPosition);
      yPosition += 12;

      // Footer
      yPosition = pageHeight - 15;
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text(`CRM Intelligent - Reporte del ${new Date().toLocaleDateString('es-ES')}`, 15, yPosition);

      doc.save(`reporte_metricas_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error('Error descargando PDF:', error);
      alert('Error al descargar el reporte PDF');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con botón de descarga */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#182442]">Panel de Metricas Admin</h2>
          <p className="text-slate-600 text-sm mt-1">Dashboard en tiempo real de KPIs, funnel y actividad omnicanal</p>
        </div>
        <button
          onClick={descargarReportePDF}
          className="flex items-center gap-2 px-4 py-2 bg-[#006c49] hover:bg-[#005236] text-white rounded-lg font-semibold transition-all shadow-md"
        >
          <span className="text-lg">📥</span>
          Descargar Reporte PDF
        </button>
      </div>

      {/* KPIs Grid Principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* KPI 1: Leads Activos */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-md">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Leads Activos</span>
              <span className="text-2xl">📋</span>
            </div>
            <div className="text-3xl font-bold text-blue-700">{metricas.leadsActivos}</div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-green-600">+ {metricas.tasaCrecimiento}%</span>
              <span className="text-xs text-slate-500">este mes</span>
            </div>
          </div>
        </Card>

        {/* KPI 2: Clientes */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 shadow-md">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Clientes</span>
              <span className="text-2xl">🎯</span>
            </div>
            <div className="text-3xl font-bold text-green-700">{metricas.clientes}</div>
            <div className="text-xs text-slate-500">Conversion: {metricas.tasaConversion}%</div>
          </div>
        </Card>

        {/* KPI 3: Mensajes */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 shadow-md">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Mensajes Hoy</span>
              <span className="text-2xl">💬</span>
            </div>
            <div className="text-3xl font-bold text-purple-700">{metricas.mensajesEnviados}</div>
            <div className="flex gap-1 mt-1">
              <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">📱 {metricas.mensajePorCanal.whatsapp}</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Mail {metricas.mensajePorCanal.email}</span>
            </div>
          </div>
        </Card>

        {/* KPI 4: Tasa Respuesta */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 shadow-md">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Tasa Respuesta</span>
              <span className="text-2xl">📊</span>
            </div>
            <div className="text-3xl font-bold text-orange-700">{metricas.tasaRespuesta}%</div>
            <div className="text-xs text-slate-500">Efectividad en comunicacion</div>
          </div>
        </Card>
      </div>

      {/* Gráficos Secundarios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Embudo de Ventas */}
        <Card className="shadow-md">
          <div className="space-y-4">
            <h3 className="font-bold text-[#182442] text-lg">Embudo de Ventas</h3>
            
            {/* Lead Activo */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700">Lead Activo</span>
                <span className="text-xs font-bold text-blue-600">{metricas.leadsActivoEtiqueta}</span>
              </div>
              <div className="w-full h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700">
                {Math.round((metricas.leadsActivoEtiqueta / Math.max(metricas.leadsActivos, 1)) * 100)}%
              </div>
            </div>

            {/* Cliente */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700">Cliente</span>
                <span className="text-xs font-bold text-green-600">{metricas.clientes}</span>
              </div>
              <div className="w-full h-8 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-700">
                {Math.round((metricas.clientes / Math.max(metricas.leadsActivos, 1)) * 100)}%
              </div>
            </div>

            {/* Inactivo */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700">Inactivo</span>
                <span className="text-xs font-bold text-red-600">{metricas.inactivos}</span>
              </div>
              <div className="w-full h-8 bg-red-100 rounded-full flex items-center justify-center font-bold text-red-700">
                {Math.round((metricas.inactivos / Math.max(metricas.leadsActivos, 1)) * 100)}%
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <p className="text-xs text-slate-500">Total en el funnel: {metricas.leadsActivos}</p>
            </div>
          </div>
        </Card>

        {/* Distribución de Canales */}
        <Card className="shadow-md">
          <div className="space-y-4">
            <h3 className="font-bold text-[#182442] text-lg">Canales de Comunicacion</h3>
            
            <div className="space-y-4">
              {/* WhatsApp */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <span className="text-lg">📱</span>WhatsApp
                  </span>
                  <span className="text-xs font-bold">{metricas.mensajePorCanal.whatsapp}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all" 
                    style={{
                      width: `${metricas.mensajesEnviados > 0 
                        ? (metricas.mensajePorCanal.whatsapp / metricas.mensajesEnviados) * 100 
                        : 0}%`
                    }}
                  ></div>
                </div>
                <span className="text-xs text-slate-500 mt-1">
                  {metricas.mensajesEnviados > 0 ? Math.round((metricas.mensajePorCanal.whatsapp / metricas.mensajesEnviados) * 100) : 0}%
                </span>
              </div>

              {/* Email */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <span className="text-lg">📧</span>Email
                  </span>
                  <span className="text-xs font-bold">{metricas.mensajePorCanal.email}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all" 
                    style={{
                      width: `${metricas.mensajesEnviados > 0 
                        ? (metricas.mensajePorCanal.email / metricas.mensajesEnviados) * 100 
                        : 0}%`
                    }}
                  ></div>
                </div>
                <span className="text-xs text-slate-500 mt-1">
                  {metricas.mensajesEnviados > 0 ? Math.round((metricas.mensajePorCanal.email / metricas.mensajesEnviados) * 100) : 0}%
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <p className="text-xs text-slate-500">Total: {metricas.mensajesEnviados} mensajes</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Métricas Secundarias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Nuevos Hoy */}
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 shadow-md">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Nuevos Hoy</span>
              <span className="text-2xl">✨</span>
            </div>
            <div className="text-3xl font-bold text-indigo-700">{metricas.leadsNuevosHoy}</div>
            <p className="text-xs text-slate-600">Capturados en las ultimas 24h</p>
          </div>
        </Card>

        {/* Tiempo Promedio */}
        <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border border-cyan-200 shadow-md">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Respuesta Promedio</span>
              <span className="text-2xl">⏱️</span>
            </div>
            <div className="text-3xl font-bold text-cyan-700">{metricas.tiempoPromedioRespuesta}h</div>
            <p className="text-xs text-slate-600">Tiempo promedio de respuesta</p>
          </div>
        </Card>

        {/* Vendedores Activos */}
        <Card className="bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200 shadow-md">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Vendedores Activos</span>
              <span className="text-2xl">👥</span>
            </div>
            <div className="text-3xl font-bold text-rose-700">{metricas.vendedoresActivos}</div>
            <p className="text-xs text-slate-600">En el sistema actualmente</p>
          </div>
        </Card>
      </div>

      {/* Desglose Detallado */}
      <Card className="shadow-md">
        <div className="space-y-4">
          <h3 className="font-bold text-[#182442] text-lg">Desglose Detallado por Estado</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
              <span className="text-xs text-blue-600 font-semibold">LEAD ACTIVO</span>
              <div className="text-2xl font-bold text-blue-700 mt-2">{metricas.leadsActivoEtiqueta}</div>
              <span className="text-xs text-blue-500 mt-1 block">Nuevos en seguimiento</span>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-200">
              <span className="text-xs text-green-600 font-semibold">CLIENTE</span>
              <div className="text-2xl font-bold text-green-700 mt-2">{metricas.clientes}</div>
              <span className="text-xs text-green-500 mt-1 block">Compra realizada</span>
            </div>
            <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border-2 border-red-200">
              <span className="text-xs text-red-600 font-semibold">INACTIVO</span>
              <div className="text-2xl font-bold text-red-700 mt-2">{metricas.inactivos}</div>
              <span className="text-xs text-red-500 mt-1 block">Sin respuesta o rechazo</span>
            </div>
            <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border-2 border-slate-200">
              <span className="text-xs text-slate-600 font-semibold">CONVERSION</span>
              <div className="text-2xl font-bold text-slate-700 mt-2">{metricas.tasaConversion}%</div>
              <span className="text-xs text-slate-500 mt-1 block">Tasa de conversion</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
