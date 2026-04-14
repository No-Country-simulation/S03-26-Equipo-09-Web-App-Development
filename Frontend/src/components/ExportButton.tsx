import { useState, useEffect } from 'react';
import { Button } from './ui/Button/Button';
import { Card } from './ui/Card/Card';
import { exportService } from '../common/services/exportService';
import { contactoService } from '../common/apiClient';
import { useAuth } from '../hooks/useAuth';

interface ExportButtonProps {
  leads?: any[];
}

export const ExportButton = ({ leads: propLeads }: ExportButtonProps) => {
  const { isAdmin } = useAuth();
  const [leads, setLeads] = useState(propLeads || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');

  // Cargar leads si no se proporcionan
  useEffect(() => {
    if (!propLeads || propLeads.length === 0) {
      loadLeads();
    }
  }, [propLeads]);

  const loadLeads = async () => {
    try {
      const data = await contactoService.getAll();
      setLeads(data);
    } catch (err) {
      console.error('Error cargando leads:', err);
      setLeads([]);
    }
  };

  // RBAC: Solo admin puede ver
  if (!isAdmin) {
    return null;
  }

  const handleExport = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filename = `reporte-crm-${new Date().toISOString().slice(0, 10)}`;

      if (exportFormat === 'csv') {
        exportService.exportLeadstoCSV(leads, `${filename}.csv`);
      } else {
        const reportData = {
          title: 'Reporte de Leads CRM',
          date: new Date().toLocaleString(),
          totalLeads: leads.length,
          leads: leads.map(l => ({
            id: l.id,
            nombre: l.nombre || 'S/N',
            email: l.email || 'N/A',
            telefono: l.telefono || 'N/A',
            estado: l.estado || 'Nuevo',
            fecha: l.fechaCreacion ? new Date(l.fechaCreacion).toLocaleDateString() : 'N/A'
          }))
        };
        await exportService.exportReportToPDF(reportData, `${filename}.pdf`);
      }

      // Exportado exitosamente
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en la exportación');
    } finally {
      setIsLoading(false);
    }
  };

  // Vista de Panel Completo (cuando se llama como tab)
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Información de Exportación */}
        <Card>
          <div className="text-center">
            <span className="material-symbols-outlined text-4xl text-[#006c49] mb-3 block">
              download
            </span>
            <h3 className="font-bold text-lg text-[#182442]">CSV</h3>
            <p className="text-sm text-slate-600 mt-2">Tabla compatible con Excel</p>
            <p className="text-xs text-slate-500 mt-3">{leads.length} registros</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <span className="material-symbols-outlined text-4xl text-[#006c49] mb-3 block">
              description
            </span>
            <h3 className="font-bold text-lg text-[#182442]">PDF</h3>
            <p className="text-sm text-slate-600 mt-2">Reporte profesional</p>
            <p className="text-xs text-slate-500 mt-3">Con formato completo</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <span className="material-symbols-outlined text-4xl text-[#006c49] mb-3 block">
              admin_panel_settings
            </span>
            <h3 className="font-bold text-lg text-[#182442]">Admin Only</h3>
            <p className="text-sm text-slate-600 mt-2">Función restringida</p>
            <p className="text-xs text-slate-500 mt-3">🔒 Protegido por RBAC</p>
          </div>
        </Card>
      </div>

      {/* Panel de Exportación */}
      <Card className="p-6 bg-gradient-to-br from-slate-50 to-white">
        <h3 className="text-lg font-bold text-[#182442] mb-4">Descargar Datos</h3>

        {error && (
          <div className="p-4 mb-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            ⚠️ {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#182442] mb-3">
              Selecciona el formato:
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setExportFormat('csv')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                  exportFormat === 'csv'
                    ? 'bg-[#006c49] text-white border-2 border-[#005236]'
                    : 'bg-slate-100 text-[#182442] border-2 border-slate-300 hover:bg-slate-200'
                }`}
              >
                📄 CSV (Excel)
              </button>
              <button
                onClick={() => setExportFormat('pdf')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                  exportFormat === 'pdf'
                    ? 'bg-[#006c49] text-white border-2 border-[#005236]'
                    : 'bg-slate-100 text-[#182442] border-2 border-slate-300 hover:bg-slate-200'
                }`}
              >
                📋 PDF
              </button>
            </div>
          </div>

          <div className="p-4 bg-[#182442]/5 rounded-lg border border-[#182442]/10">
            <p className="text-sm text-slate-600">
              <strong>{leads.length}</strong> registros serán exportados en formato <strong>{exportFormat.toUpperCase()}</strong>
            </p>
          </div>

          <Button
            onClick={handleExport}
            disabled={isLoading || leads.length === 0}
            variant="primary"
            className="w-full bg-[#006c49] hover:bg-[#005236]"
          >
            {isLoading ? '⏳ Exportando...' : `📥 Descargar ${exportFormat.toUpperCase()}`}
          </Button>
        </div>
      </Card>
    </div>
  );
};
