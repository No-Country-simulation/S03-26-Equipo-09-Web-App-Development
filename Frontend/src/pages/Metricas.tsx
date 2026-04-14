import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../hooks/useAuth';
import { MetricasAdmin } from '../features/metricas/components/AdminMetrics';
import { Card } from '../components/ui/Card/Card';

export const MetricasPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [mensajes, setMensajes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar acceso de ADMIN
    if (!isAuthenticated || !isAdmin) {
      navigate({ to: '/dashboard' });
      return;
    }

    // Cargar datos
    fetchData();
  }, [isAdmin, isAuthenticated]);

  const fetchData = async () => {
    try {
      const [leadsRes, mensajesRes] = await Promise.all([
        fetch('http://localhost:8080/api/leads'),
        fetch('http://localhost:8080/api/mensajes')
      ]);
      
      if (leadsRes.ok && mensajesRes.ok) {
        const leadsData = (await leadsRes.json()) as any;
        const mensajesData = (await mensajesRes.json()) as any;
        
        setLeads(leadsData.data || []);
        setMensajes(mensajesData.data || []);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-md">
          <div className="text-center space-y-4">
            <div className="text-4xl">🔒</div>
            <h2 className="text-lg font-bold text-on-surface">Acceso Denegado</h2>
            <p className="text-sm text-on-surface-variant">
              Este panel está reservado para administradores únicamente.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin text-4xl">⚙️</div>
          <p className="text-on-surface-variant">Cargando métricas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          📊 Panel de Métricas (Admin)
        </h1>
        <p className="text-on-surface-variant text-base mt-1">
          Visualización exclusiva para administradores - KPIs, funnel, y actividad omnicanal
        </p>
      </header>

      {/* Métricas exclusivas Admin */}
      <MetricasAdmin leads={leads} mensajes={mensajes} />
    </div>
  );
};
