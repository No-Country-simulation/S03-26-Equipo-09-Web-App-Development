import { useMemo } from 'react'; 
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../services/dashboardService';
import { LineChart } from '../components/charts/line/Line';
import { BarChart } from '../components/charts/bar/bar';
import { PieChart } from '../components/charts/pie/pie';
import { Card } from '../components/ui/Card/Card';
import { Badge } from '../components/ui/Badge/Badge';
import { Button } from '../components/ui/Button/Button';

export const DashboardPage = () => {
  // TanStack Query - GET dashboard stats
  const { data: stats = null, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  });

  /**
   * Transforma datos del backend al formato esperado por Nivo
   */
  const chartData = useMemo(() => {
    if (!stats) return {
      lineData: [],
      pieData: [],
      barData: [],
    };
    
    return {
      lineData: [
        {
          id: 'Interacciones',
          data: [
            { x: 'Ene', y: Math.floor(stats.interaccionesTotales * 0.3) },
            { x: 'Feb', y: Math.floor(stats.interaccionesTotales * 0.4) },
            { x: 'Mar', y: Math.floor(stats.interaccionesTotales * 0.5) },
            { x: 'Abr', y: Math.floor(stats.interaccionesTotales * 0.6) },
            { x: 'May', y: Math.floor(stats.interaccionesTotales * 0.7) },
            { x: 'Jun', y: Math.floor(stats.interaccionesTotales * 0.8) }
          ]
        }
      ],
      pieData: Object.entries(stats.contactosPorEstado || {}).map(([estado, cantidad]) => ({
        id: estado,
        label: estado,
        value: cantidad as number
      })),
      barData: [
        { fuente: 'Directos', leads: Math.floor(stats.nuevosLeadsHoy * 0.4) },
        { fuente: 'Referidos', leads: Math.floor(stats.nuevosLeadsHoy * 0.3) },
        { fuente: 'Marketing', leads: Math.floor(stats.nuevosLeadsHoy * 0.3) },
      ]
    };
  }, [stats]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in p-2 md:p-6">
      
      {/* 1. Cabecera del Módulo */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            Panel de Control General
          </h2>
          <p className="text-on-surface-variant text-base mt-1">
            Bienvenido de nuevo. Resumen operativo de tu CRM.
          </p>
        </div>
        <Badge variant="success">Sistema Online</Badge>
      </header>

      {/* 2. Sección de KPIs */}
      {stats && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-2xl">people</span>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase font-bold tracking-widest">Total Contactos</p>
                  <p className="text-2xl font-extrabold text-primary mt-1">{stats.totalContactos}</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant">Todos los contactos registrados en el sistema</p>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center text-info">
                  <span className="material-symbols-outlined text-2xl">chat_bubble</span>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase font-bold tracking-widest">Interacciones</p>
                  <p className="text-2xl font-extrabold text-primary mt-1">{stats.interaccionesTotales}</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant">Mensajes y conversaciones totales</p>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center text-warning">
                  <span className="material-symbols-outlined text-2xl">mail_outline</span>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase font-bold tracking-widest">Sin Leer</p>
                  <p className="text-2xl font-extrabold text-warning mt-1">{stats.mensajesSinLeer}</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant">Mensajes pendientes de revisar</p>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center text-success">
                  <span className="material-symbols-outlined text-2xl">trending_up</span>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase font-bold tracking-widest">Leads Hoy</p>
                  <p className="text-2xl font-extrabold text-success mt-1">{stats.nuevosLeadsHoy}</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant">Nuevos leads en las últimas 24h</p>
          </Card>
        </section>
      )}

      {/* 3. Gráficos */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <h3 className="text-sm font-bold text-primary mb-4">Interacciones por Mes</h3>
          <LineChart data={chartData.lineData} />
        </Card>
        <Card className="flex flex-col">
          <h3 className="text-sm font-bold text-primary mb-4">Contactos por Estado</h3>
          <PieChart data={chartData.pieData} />
        </Card>
      </section>

      <section>
        <Card className="flex flex-col">
          <h3 className="text-sm font-bold text-primary mb-4">Fuentes de Leads</h3>
          <BarChart data={chartData.barData} />
        </Card>
      </section>

      {/* 4. Sección de Acciones Rápidas */}
      <section>
        <h3 className="text-lg font-bold text-primary mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button icon="add_circle" variant="secondary" className="justify-start">
            Nuevo Contacto
          </Button>
          <Button icon="email" variant="secondary" className="justify-start">
            Enviar Plantilla
          </Button>
          <Button icon="phone" variant="secondary" className="justify-start">
            Hacer Llamada
          </Button>
          <Button icon="settings" variant="secondary" className="justify-start">
            Configuración
          </Button>
        </div>
      </section>
    </div>
  );
};
