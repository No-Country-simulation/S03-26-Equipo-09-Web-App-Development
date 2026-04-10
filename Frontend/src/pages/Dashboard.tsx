import { useState, useMemo } from 'react'; 
import { dashboardMockData, MOCK_DASHBOARD_STATS } from '../features/dashboard/mocks/dashboardData';
import { LineChart } from '../components/charts/line/Line';
import { BarChart } from '../components/charts/bar/bar';
import { PieChart } from '../components/charts/pie/pie';
import { Card } from '../components/ui/Card/Card';
import { Badge } from '../components/ui/Badge/Badge';
import { Button } from '../components/ui/Button/Button';
import { Modal } from '../components/ui/Modal/Modal';

export const DashboardPage = () => {
  const stats = MOCK_DASHBOARD_STATS;
  const [isDevelopmentModalOpen, setIsDevelopmentModalOpen] = useState(false);

  /**
   * Transforma datos mockados al formato esperado por Nivo
   */
  const chartData = useMemo(() => {
    return {
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
  }, []);

  // SOLO UN RETURN QUE ENCAPSULA TODO
  return (
    <div className="space-y-8 animate-fade-in p-2 md:p-6">
      
      {/* 1. Cabecera del Módulo */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            Panel de Control General
          </h2>
          <p className="text-on-surface-variant text-base mt-1">
            Bienvenido de nuevo, Harold. Resumen operativo de tu CRM.
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
            <h4 className="text-4xl font-extrabold mt-2">{stats.totalContactos.toLocaleString()}</h4>
            <p className="text-secondary text-sm font-bold mt-1">+15% este mes</p>
          </div>
          <div>
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Interacciones</p>
            <h4 className="text-4xl font-extrabold mt-2">{stats.interaccionesTotales.toLocaleString()}</h4>
            <p className="text-white/40 text-sm mt-1">Omnicanal (WA/Email)</p>
          </div>
          <div>
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Sin Leer</p>
            <h4 className="text-4xl font-extrabold mt-2 text-yellow-400">{stats.mensajesSinLeer}</h4>
            <button className="text-sm font-bold text-secondary hover:underline mt-1">Ver Inbox →</button>
          </div>
        </div>
      </Card>

      {/* 4. Acciones Rápidas */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button className="flex-col h-28" icon="person_add" variant="outline" onClick={() => { setIsDevelopmentModalOpen(true); }}>
          <span className="text-sm font-bold text-primary">Añadir Vendedor</span>
        </Button>

        <Button className="flex-col h-28" icon="database" variant="outline" onClick={() => { setIsDevelopmentModalOpen(true); }}>
          <span className="text-sm font-bold text-primary">Exportar Leads</span>
        </Button>

        <Button className="flex-col h-28" icon="settings" variant="outline" onClick={() => { setIsDevelopmentModalOpen(true); }}>
          <span className="text-sm font-bold text-primary">Ajustes</span>
        </Button>
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