import { useState } from 'react';
import { Card } from '../components/ui/Card/Card';
import { Modal } from '../components/ui/Modal/Modal';
import { useVendedores, type VendedorMetricas } from '../hooks/useVendedores';

export const Vendedores = () => {
  const { vendedores, loading, error, createVendedor, toggleVendedorEstado } = useVendedores();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVendedorData, setNewVendedorData] = useState({ nombre: '', email: '', telefono: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtrar solo vendedores activos para estadísticas
  const vendedoresActivos = vendedores.filter(v => v.activo);

  // Encontrar mejor vendedor (mayor tasa de conversión)
  const mejorVendedor = vendedoresActivos.length > 0 
    ? vendedoresActivos.reduce((prev, current) => 
        (prev.tasaConversion > current.tasaConversion) ? prev : current
      )
    : null;

  // Encontrar vendedor con más leads
  const vendedorMasLeads = vendedoresActivos.length > 0
    ? vendedoresActivos.reduce((prev, current) => 
        (prev.totalLeads > current.totalLeads) ? prev : current
      )
    : null;

  // Crear nuevo vendedor
  const handleCreateVendedor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendedorData.nombre || !newVendedorData.email) {
      alert('Por favor completa nombre y email');
      return;
    }

    setIsSubmitting(true);
    try {
      const resultado = await createVendedor(
        newVendedorData.nombre,
        newVendedorData.email,
        newVendedorData.telefono || undefined
      );

      if (resultado) {
        console.log('✅ Vendedor creado:', resultado);
        setNewVendedorData({ nombre: '', email: '', telefono: '' });
        setIsModalOpen(false);
        alert(`✅ ${resultado.nombre} ha sido agregado al equipo`);
      } else {
        alert('❌ Error al crear vendedor');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error al crear vendedor');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar toggle de estado
  const handleToggleEstado = async (id: number) => {
    try {
      const resultado = await toggleVendedorEstado(id);
      if (resultado) {
        const vendedor = vendedores.find(v => v.id === id);
        console.log(`✅ Vendedor ${vendedor?.nombre} ${vendedor?.activo ? 'desactivado' : 'activado'}`);
      } else {
        console.error('❌ Error al cambiar estado');
        alert('❌ Error al cambiar estado del vendedor');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert('❌ Error al procesar la solicitud');
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 animate-fade-in">
      {/* Mostrar error si ocurre */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-red-600">error</span>
          <div>
            <p className="font-semibold text-red-800">Error al cargar vendedores</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Header con Botón Nuevo Vendedor */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#182442]">
            Gestión de Vendedores
          </h1>
          <p className="text-slate-600 text-base mt-1">
            Monitorea el desempeño de tu equipo de ventas
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={loading}
          className="h-11 px-6 bg-[#006c49] hover:bg-[#005236] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg flex items-center gap-2 whitespace-nowrap transition-all"
        >
          <span className="material-symbols-outlined">person_add</span>
          Nuevo Vendedor
        </button>
      </header>

      {/* Estadísticas Generales */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-slate-100 rounded-lg p-4 animate-pulse h-24"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-xs font-medium">Total Vendedores</p>
                <p className="text-2xl font-bold text-blue-600">{vendedoresActivos.length}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {vendedores.filter(v => !v.activo).length} inactivos
                </p>
              </div>
              <span className="material-symbols-outlined text-blue-300 text-4xl">people</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-xs font-medium">Leads Totales</p>
                <p className="text-2xl font-bold text-green-600">
                  {vendedores.reduce((acc, v) => acc + v.totalLeads, 0)}
                </p>
              </div>
              <span className="material-symbols-outlined text-green-300 text-4xl">person_add</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-xs font-medium">Conversiones</p>
                <p className="text-2xl font-bold text-purple-600">
                  {vendedores.reduce((acc, v) => acc + v.leadsConvertidos, 0)}
                </p>
              </div>
              <span className="material-symbols-outlined text-purple-300 text-4xl">trending_up</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-xs font-medium">Tasa Promedio</p>
                <p className="text-2xl font-bold text-orange-600">
                  {vendedoresActivos.length > 0
                    ? (vendedoresActivos.reduce((acc, v) => acc + v.tasaConversion, 0) / vendedoresActivos.length).toFixed(1)
                    : 0}%
                </p>
              </div>
              <span className="material-symbols-outlined text-orange-300 text-4xl">percent</span>
            </div>
          </div>
        </div>
      )}

      {/* Gráficos de Análisis */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mejor Vendedor */}
          <Card as="article" className="p-6 flex flex-col">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-[#182442]">
                🏆 Mejor Vendedor
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Basado en tasa de conversión
              </p>
            </div>
            {mejorVendedor ? (
              <div className="flex flex-col gap-4">
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                  <p className="text-sm text-slate-600 font-medium">Top Performer</p>
                  <p className="text-2xl font-bold text-yellow-700 mt-1">{mejorVendedor.nombre}</p>
                  <p className="text-xs text-slate-600 mt-1">{mejorVendedor.email}</p>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-yellow-600">{mejorVendedor.tasaConversion.toFixed(1)}%</span>
                    <span className="text-sm text-slate-600">tasa de conversión</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    {mejorVendedor.leadsConvertidos} de {mejorVendedor.totalLeads} leads convertidos
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-lg p-4 text-slate-600 text-center">
                Sin vendedores para mostrar
              </div>
            )}
          </Card>

          {/* Vendedor con Más Leads */}
          <Card as="article" className="p-6 flex flex-col">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-[#182442]">
                📊 Mayor Volumen de Leads
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Vendedor con más leads asignados
              </p>
            </div>
            {vendedorMasLeads ? (
              <div className="flex flex-col gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-slate-600 font-medium">Mayor Volumen</p>
                  <p className="text-2xl font-bold text-blue-700 mt-1">{vendedorMasLeads.nombre}</p>
                  <p className="text-xs text-slate-600 mt-1">{vendedorMasLeads.email}</p>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-blue-600">{vendedorMasLeads.totalLeads}</span>
                    <span className="text-sm text-slate-600">leads totales</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    {vendedorMasLeads.leadsConvertidos} convertidos, {vendedorMasLeads.leadsAsignados} asignados actualmente
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-lg p-4 text-slate-600 text-center">
                Sin vendedores para mostrar
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Tabla de Vendedores */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="font-semibold text-[#182442] mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined">list_alt</span>
          Equipo de Vendedores
        </h3>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-slate-100 rounded animate-pulse"></div>
            ))}
          </div>
        ) : vendedores.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-4xl text-slate-300 block mb-2">people_outline</span>
            <p className="text-slate-600">No hay vendedores registrados</p>
            <p className="text-sm text-slate-500">Crea uno nuevo para comenzar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Vendedor</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Email</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Leads</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Convertidos</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Conversión</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Activos</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Estado</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {vendedores.map((vendedor) => (
                  <tr key={vendedor.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${!vendedor.activo ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-3 font-semibold text-slate-800">{vendedor.nombre}</td>
                    <td className="px-4 py-3 text-slate-600 text-sm">{vendedor.email}</td>
                    <td className="px-4 py-3 text-center font-semibold text-slate-800">{vendedor.totalLeads}</td>
                    <td className="px-4 py-3 text-center font-semibold text-green-600">{vendedor.leadsConvertidos}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-[#006c49] h-2 rounded-full" 
                            style={{ width: `${vendedor.tasaConversion}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold text-[#006c49] text-sm w-12 text-right">
                          {vendedor.tasaConversion.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-slate-800">
                      {vendedor.leadsAsignados}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        vendedor.activo
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${vendedor.activo ? 'bg-green-600' : 'bg-slate-400'}`}></span>
                        {vendedor.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleEstado(vendedor.id)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          vendedor.activo
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {vendedor.activo ? (
                          <>
                            <span className="material-symbols-outlined text-sm">block</span>
                            Desactivar
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                            Activar
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal para Nuevo Vendedor */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Crear Nuevo Vendedor">
        <form onSubmit={handleCreateVendedor} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#182442] mb-1">Nombre Completo *</label>
            <input 
              type="text"
              value={newVendedorData.nombre}
              onChange={(e) => setNewVendedorData({ ...newVendedorData, nombre: e.target.value })}
              placeholder="Nombre del vendedor"
              disabled={isSubmitting}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-[#006c49] focus:ring-2 focus:ring-[#006c49]/20 focus:outline-none transition-all disabled:opacity-50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#182442] mb-1">Email *</label>
            <input 
              type="email"
              value={newVendedorData.email}
              onChange={(e) => setNewVendedorData({ ...newVendedorData, email: e.target.value })}
              placeholder="vendedor@crm.com"
              disabled={isSubmitting}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-[#006c49] focus:ring-2 focus:ring-[#006c49]/20 focus:outline-none transition-all disabled:opacity-50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#182442] mb-1">Teléfono (Opcional)</label>
            <input 
              type="tel"
              value={newVendedorData.telefono}
              onChange={(e) => setNewVendedorData({ ...newVendedorData, telefono: e.target.value })}
              placeholder="+34 600 000 000"
              disabled={isSubmitting}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-[#006c49] focus:ring-2 focus:ring-[#006c49]/20 focus:outline-none transition-all disabled:opacity-50"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setNewVendedorData({ nombre: '', email: '', telefono: '' });
              }}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg border border-slate-300 text-[#182442] hover:bg-slate-100 transition-all disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-[#006c49] text-white font-semibold hover:bg-[#005236] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                  Creando...
                </>
              ) : (
                'Crear Vendedor'
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Vendedores;
