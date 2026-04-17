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
    const totalInteracciones = stats?.interaccionesTotales ?? 0;

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
            { x: 'Ene', y: Math.floor(totalInteracciones * 0.3) },
            { x: 'Feb', y: Math.floor(totalInteracciones * 0.4) },
            { x: 'Mar', y: Math.floor(totalInteracciones * 0.5) },
            { x: 'Abr', y: Math.floor(totalInteracciones * 0.6) },
            { x: 'May', y: Math.floor(totalInteracciones * 0.7) },
            { x: 'Jun', y: Math.floor(totalInteracciones * 0.8) }
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

  const isEmpty = !stats || (
    stats.totalContactos === 0 &&
    (stats.interaccionesTotales ?? 0) === 0 &&
    stats.mensajesSinLeer === 0 &&
    stats.nuevosLeadsHoy === 0
  );

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in p-2 md:p-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-72 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-96 bg-slate-200 rounded animate-pulse" />
          </div>
          <div className="h-7 w-32 bg-slate-200 rounded-full animate-pulse" />
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={`kpi-skeleton-${i}`} className="space-y-4">
              <div className="h-6 w-28 bg-slate-200 rounded animate-pulse" />
              <div className="h-8 w-12 bg-slate-200 rounded animate-pulse" />
              <div className="h-3 w-full bg-slate-200 rounded animate-pulse" />
            </Card>
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="flex flex-col min-h-72 sm:min-h-80 lg:min-h-96">
            <div className="h-5 w-40 bg-slate-200 rounded animate-pulse mb-4" />
            <div className="flex-1 h-52 sm:h-60 lg:h-72 rounded-2xl bg-slate-100 animate-pulse" />
          </Card>
          <Card className="flex flex-col min-h-72 sm:min-h-80 lg:min-h-96">
            <div className="h-5 w-44 bg-slate-200 rounded animate-pulse mb-4" />
            <div className="flex-1 h-52 sm:h-60 lg:h-72 rounded-2xl bg-slate-100 animate-pulse" />
          </Card>
        </section>

        <section>
          <Card className="flex flex-col min-h-72 sm:min-h-80 lg:min-h-96">
            <div className="h-5 w-36 bg-slate-200 rounded animate-pulse mb-4" />
            <div className="flex-1 h-52 sm:h-60 lg:h-72 rounded-2xl bg-slate-100 animate-pulse" />
          </Card>
        </section>
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

      {isEmpty && (
        <Card className="text-center py-12">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl">query_stats</span>
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">Aún no hay datos para mostrar</h3>
          <p className="text-on-surface-variant max-w-xl mx-auto">
            Cuando tengas interacciones y contactos registrados, aquí verás métricas, gráficas y tendencias de tu CRM.
          </p>
        </Card>
      )}

      {/* 3. Gráficos */}
      {!isEmpty && (
        <>
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="flex flex-col min-h-72 sm:min-h-80 lg:min-h-96">
              <h3 className="text-sm font-bold text-primary mb-4">Interacciones por Mes</h3>
              <div className="h-52 sm:h-60 lg:h-72">
                <LineChart data={chartData.lineData} />
              </div>
            </Card>
            <Card className="flex flex-col min-h-72 sm:min-h-80 lg:min-h-96">
              <h3 className="text-sm font-bold text-primary mb-4">Contactos por Estado</h3>
              <div className="h-52 sm:h-60 lg:h-72">
                <PieChart data={chartData.pieData} />
              </div>
            </Card>
          </section>

          <section>
            <Card className="flex flex-col min-h-72 sm:min-h-80 lg:min-h-96">
              <h3 className="text-sm font-bold text-primary mb-4">Fuentes de Leads</h3>
              <div className="h-52 sm:h-60 lg:h-72">
                <BarChart data={chartData.barData} />
              </div>
            </Card>
          </section>
        </>
      )}

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
