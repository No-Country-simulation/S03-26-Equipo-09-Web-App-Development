import { useState, useEffect } from 'react'; 
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../hooks/useAuth';
import { dashboardMockData, MOCK_DASHBOARD_STATS } from '../features/dashboard/mocks/dashboardData';
import { metricasService, Metricas } from '../common/apiClient';
import { LineChart } from '../components/charts/line/Line';
import { BarChart } from '../components/charts/bar/bar';
import { PieChart } from '../components/charts/pie/pie';
import { Card } from '../components/ui/Card/Card';
import { Badge } from '../components/ui/Badge/Badge';
import { Modal } from '../components/ui/Modal/Modal';

interface MetricasVendedor {
  vendedorId: number;
  vendedorNombre: string;
  leadsAsignados: number;
  clientesConvertidos: number;
  leadsInactivos: number;
  totalLeads: number;
  tasaConversion: number;
}

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { isVendedor, userName, userId } = useAuth();
  const [isDevelopmentModalOpen, setIsDevelopmentModalOpen] = useState(false);
  const [metricas, setMetricas] = useState<Metricas | null>(null);
  const [metricasVendedor, setMetricasVendedor] = useState<MetricasVendedor | null>(null);

  useEffect(() => {
    const cargarMetricas = async () => {
      try {
        if (isVendedor && userId) {
          // Cargar métricas específicas del vendedor
          const metricsDataVendedor = await metricasService.getMetricasVendedor(userId);
          setMetricasVendedor(metricsDataVendedor);
        } else {
          // Cargar resumen general (solo para admin)
          const metricsData = await metricasService.getResumen();
          setMetricas(metricsData);
        }
      } catch (error) {
        console.error('Error cargando métricas:', error);
      }
    };
    cargarMetricas();
  }, [isVendedor, userId]);

  const mockStats = MOCK_DASHBOARD_STATS;

  const chartData = {
    lineData: [
      {
        id: 'Ingresos',
        data: dashboardMockData.revenue.map(item => ({
          x: item.month,
          y: item.ingresos
        }))
      }
    ],
    pieData: dashboardMockData.leadsByStatus.map(item => ({
      id: item.estado,
      label: item.estado,
      value: item.cantidad
    })),
    barData: dashboardMockData.sources
  };

  // ============================================
  // DASHBOARD PARA VENDEDOR
  // ============================================
  if (isVendedor) {
    return (
      <div className="space-y-8 animate-fade-in p-2 md:p-6">
        {/* Cabecera Simplificada */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-[#182442]">
              Resumen de Actividad
            </h2>
            <p className="text-slate-600 text-base mt-1">
              Tus leads y métricas del mes actual
            </p>
          </div>
          <Badge variant="success" className="bg-[#006c49] text-[#182442] font-semibold">Vendedor {userName?.split(' ')[0]}</Badge>
        </header>

        {/* KPIs Simplificados con Nueva Lógica */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tareas Pendientes - Mensajes Sin Responder */}
          <div 
            className="p-6 rounded-xl border border-slate-200 hover:shadow-lg hover:border-amber-200 transition-all cursor-pointer bg-white"
            onClick={() => navigate({ to: '/mi-inbox' })}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-amber-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-amber-600">notifications_active</span>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Tareas Pendientes</p>
                <h3 className="text-3xl font-bold text-amber-600 mt-1">8</h3>
                <p className="text-xs text-amber-600 mt-1 font-medium">Mensajes sin responder</p>
              </div>
            </div>
          </div>

          {/* Leads Totales del Mes */}
          <Card className="hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-green-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-green-600">people</span>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Leads Totales</p>
                <h3 className="text-3xl font-bold text-[#182442] mt-1">24</h3>
                <p className="text-xs text-slate-500 mt-1">Asignados en Abril</p>
              </div>
            </div>
          </Card>

          {/* Tasa de Conversión Mensual */}
          <Card className="hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-purple-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-purple-600">trending_up</span>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Tasa Conversión</p>
                <h3 className="text-3xl font-bold text-[#182442] mt-1">
                  {metricasVendedor ? `${metricasVendedor.tasaConversion.toFixed(1)}%` : '0%'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {metricasVendedor 
                    ? `${metricasVendedor.clientesConvertidos}/${metricasVendedor.totalLeads} clientes ganados`
                    : 'Cargando...'}
                </p>
              </div>
            </div>
          </Card>
        </section>
      </div>
    );
  }

  // ============================================
  // DASHBOARD PARA ADMIN (Original)
  // ============================================
  return (
    <div className="space-y-8 animate-fade-in p-2 md:p-6">
      
      {/* 1. Cabecera del Módulo */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#182442]">
            📊 Panel Administrativo
          </h2>
          <p className="text-slate-600 text-base mt-1">
            Bienvenido, {userName}. Resumen global de tu CRM.
          </p>
        </div>
        <Badge variant="success">Sistema Online</Badge>
      </header>

      {/* 2. Sección de Conectividad (APIs) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>chat_bubble</span></div>
                <div>
                  <h3 className="font-bold text-primary">WhatsApp Cloud API</h3>
                  <p className="text-xs text-on-surface-variant italic">Estado de la conexión</p>
                </div>
              </div>
                  <button className="text-xs font-bold text-secondary hover:underline transition-all" 
                  onClick={() => { setIsDevelopmentModalOpen(true); }}>Vincular mi cuenta</button>
          </div>
            <div className="bg-surface-container-low p-3 rounded-xl flex justify-between items-center border border-outline-variant/10">
              <span className="text-sm font-medium text-primary">Instancia: Activa</span>
              <span className="text-[10px] font-bold text-secondary uppercase tracking-tighter">Latencia: 120ms</span>
            </div>
        </Card>

        <Card>
          <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>alternate_email</span>
                </div>
                <div>
                  <h3 className="font-bold text-primary">Email (Brevo)</h3>
                  <p className="text-xs text-on-surface-variant">Marketing & Notificaciones</p>
                </div>
              </div>
                <button className="text-xs font-bold text-secondary hover:underline transition-all" 
                onClick={() => { setIsDevelopmentModalOpen(true); }}>Conectar correo</button>
          </div>

              <div className="bg-surface-container-low p-3 rounded-xl flex justify-between items-center">
                <span className="text-sm font-medium">Cuota: 2,450 / 3,000</span>
                <span className="text-[10px] font-bold text-primary/60 uppercase">Sincronizado</span>
              </div>
        </Card>
      </section>

      {/* 3. KPIs Principales */}
      <Card className="p-8" variant="dark">
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
          <div>
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Contactos Totales</p>
            <h4 className="text-4xl font-extrabold mt-2">{metricas?.totalContactos || mockStats.totalContactos.toLocaleString()}</h4>
            <p className="text-secondary text-sm font-bold mt-1">+15% este mes</p>
          </div>
          <div>
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Conversaciones</p>
            <h4 className="text-4xl font-extrabold mt-2">{metricas?.totalConversaciones || mockStats.interaccionesTotales.toLocaleString()}</h4>
            <p className="text-white/40 text-sm mt-1">Email + WhatsApp</p>
          </div>
          <div>
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Productos Vendidos</p>
            <h4 className="text-4xl font-extrabold mt-2 text-green-400">{metricas?.productosVendidos ?? mockStats.productosVendidos}</h4>
            <p className="text-secondary text-sm font-bold mt-1">+8% vs mes anterior</p>
          </div>
        </div>
      </Card>

      {/* 4. Análisis Detallado */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico: Eficiencia de Vendedores */}
        <Card as="article" className="p-6 flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-primary">
              Tasa de Conversión por Vendedor
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Eficiencia en capactación de leads (%)
            </p>
          </div>
          <div style={{ minHeight: '300px' }}>
            <BarChart data={[
              { fuente: 'Juan García', leads: 34 },
              { fuente: 'María López', leads: 38 },
              { fuente: 'Carlos Ruiz', leads: 29 },
              { fuente: 'Ana Chen', leads: 32 }
            ]} />
          </div>
        </Card>

        {/* Gráfico: Motivos de No Compra */}
        <Card as="article" className="p-6 flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-primary">
              Motivos de No Compra
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Análisis de oportunidades perdidas
            </p>
          </div>
          <div style={{ minHeight: '300px' }}>
            <PieChart data={[
              { id: 'Presupuesto insuficiente', label: 'Presupuesto insuficiente', value: 35 },
              { id: 'Falta de necesidad', label: 'Falta de necesidad', value: 25 },
              { id: 'Competencia', label: 'Competencia', value: 20 },
              { id: 'Timing', label: 'Timing', value: 15 },
              { id: 'Otro', label: 'Otro', value: 5 }
            ]} />
          </div>
        </Card>
      </section>

      {/* 5. Espacio para Gráficos */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart: Línea (Ingresos Mensual) */}
        <Card as="article" className="p-6 flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-primary">
              Ingresos Mensual
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Tendencia de ingresos (últimos 6 meses)
            </p>
          </div>
          <div className="flex-grow" style={{ minHeight: '300px' }}>
            <LineChart data={chartData.lineData} />
          </div>
        </Card>

        {/* Chart: Pie (Distribución de Leads) */}
        <Card as="article" className="p-6 flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-primary">
              Distribución de Leads
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Por estado del pipeline
            </p>
          </div>
          <div className="flex-grow" style={{ minHeight: '300px' }}>
            <PieChart data={chartData.pieData} />
          </div>
        </Card>
      </section>

      {/* Chart: Bar (Leads por Fuente) - Full Width */}
      <Card as="article" className="p-6 flex flex-col">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-primary">
            Leads por Fuente
          </h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Rendimiento de canales de adquisición
          </p>
        </div>
        <div style={{ minHeight: '320px' }}>
          <BarChart data={chartData.barData} />
        </div>
      </Card>

      {/* MODAL (Invisible hasta que se activa el estado) */}
      <Modal 
        isOpen={isDevelopmentModalOpen} 
        title="¡En Construcción!"
        onClose={() => { setIsDevelopmentModalOpen(false); }}
      >
        <p className="text-on-surface-variant text-sm">
          Esta función estará disponible en la próxima etapa de desarrollo.
        </p>
      </Modal>
    </div>
  );
};