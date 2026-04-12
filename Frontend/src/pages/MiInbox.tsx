import { useState, useEffect } from 'react';
import { UnifiedInbox } from '../components/UnifiedInbox';
import { usuarioService } from '../common/apiClient';

interface Usuario {
  id: number;
  nombre: string;
  role: string;
}

export default function MiInbox() {
  const [vendedores, setVendedores] = useState<Usuario[]>([]);
  const [vendedorSeleccionado, setVendedorSeleccionado] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarVendedores();
  }, []);

  const cargarVendedores = async () => {
    try {
      const data = await usuarioService.getVendedores();
      setVendedores(data);
      if (data && data.length > 0) {
        setVendedorSeleccionado(data[0] || null);
      }
    } catch (error) {
      console.error('Error cargando vendedores:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Cargando...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-6xl mx-auto">
        {/* Selector de Vendedor (Demo) */}
        {vendedores.length > 1 && (
          <div className="mb-6 px-4 md:px-6">
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <label className="block text-sm font-semibold text-[#182442] mb-3">
                👤 Seleccionar Vendedor (Modo Demo)
              </label>
              <div className="flex gap-2 flex-wrap">
                {vendedores.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVendedorSeleccionado(v)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      vendedorSeleccionado?.id === v.id
                        ? 'bg-[#006c49] text-white shadow-md scale-105'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {v.nombre}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Inbox Unificado */}
        {vendedorSeleccionado && (
          <UnifiedInbox
            vendedorId={vendedorSeleccionado.id}
            vendedorNombre={vendedorSeleccionado.nombre}
          />
        )}
      </div>
    </div>
  );
}
