import { useState } from 'react';
import { Card } from '../components/ui/Card/Card';
import { Modal } from '../components/ui/Modal/Modal';

interface Vendedor {
  id: number;
  nombre: string;
  email: string;
  leadsAsignados: number;
  leadsConvertidos: number;
  tasaConversion: number;
  tiempoRespuestaPromedio: number; // en horas
  estado: 'activo' | 'inactivo';
}

export const Vendedores = () => {
  const [vendedores, setVendedores] = useState<Vendedor[]>([
    {
      id: 1,
      nombre: 'Carlos Vendedor',
      email: 'carlos@crm.com',
      leadsAsignados: 24,
      leadsConvertidos: 6,
      tasaConversion: 25,
      tiempoRespuestaPromedio: 4.5,
      estado: 'activo'
    },
    {
      id: 2,
      nombre: 'Juan Pérez',
      email: 'juan@crm.com',
      leadsAsignados: 18,
      leadsConvertidos: 5,
      tasaConversion: 27.8,
      tiempoRespuestaPromedio: 6.2,
      estado: 'activo'
    },
    {
      id: 3,
      nombre: 'María García',
      email: 'maria@crm.com',
      leadsAsignados: 32,
      leadsConvertidos: 10,
      tasaConversion: 31.25,
      tiempoRespuestaPromedio: 2.1,
      estado: 'activo'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVendedorData, setNewVendedorData] = useState({ nombre: '', email: '' });

  // Encontrar mejor vendedor (mayor tasa de conversión)
  const mejorVendedor = vendedores.reduce((prev, current) => 
    (prev.tasaConversion > current.tasaConversion) ? prev : current
  );

  // Encontrar vendedor más lento (mayor tiempo de respuesta)
  const vendedorMasLento = vendedores.reduce((prev, current) => 
    (prev.tiempoRespuestaPromedio > current.tiempoRespuestaPromedio) ? prev : current
  );

  // Toggle estado del vendedor
  const toggleVendedorEstado = (id: number) => {
    setVendedores(vendedores.map(v => 
      v.id === id ? { ...v, estado: v.estado === 'activo' ? 'inactivo' : 'activo' } : v
    ));
  };

  // Crear nuevo vendedor
  const handleCreateVendedor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendedorData.nombre || !newVendedorData.email) return;

    const nuevoVendedor: Vendedor = {
      id: Math.max(...vendedores.map(v => v.id), 0) + 1,
      nombre: newVendedorData.nombre,
      email: newVendedorData.email,
      leadsAsignados: 0,
      leadsConvertidos: 0,
      tasaConversion: 0,
      tiempoRespuestaPromedio: 0,
      estado: 'activo'
    };

    setVendedores([...vendedores, nuevoVendedor]);
    setNewVendedorData({ nombre: '', email: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 p-4 md:p-6 animate-fade-in">
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
          className="h-11 px-6 bg-[#006c49] hover:bg-[#005236] text-white font-semibold rounded-lg flex items-center gap-2 whitespace-nowrap transition-all"
        >
          <span className="material-symbols-outlined">person_add</span>
          Nuevo Vendedor
        </button>
      </header>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-xs font-medium">Total Vendedores</p>
              <p className="text-2xl font-bold text-blue-600">{vendedores.filter(v => v.estado === 'activo').length}</p>
              <p className="text-xs text-slate-500 mt-1">{vendedores.filter(v => v.estado === 'inactivo').length} inactivos</p>
            </div>
            <span className="material-symbols-outlined text-blue-300 text-4xl">people</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-xs font-medium">Leads Totales</p>
              <p className="text-2xl font-bold text-green-600">
                {vendedores.reduce((acc, v) => acc + v.leadsAsignados, 0)}
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
                {(vendedores.reduce((acc, v) => acc + v.tasaConversion, 0) / vendedores.length).toFixed(1)}%
              </p>
            </div>
            <span className="material-symbols-outlined text-orange-300 text-4xl">percent</span>
          </div>
        </div>
      </div>

      {/* Gráficos de Análisis */}
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
                {mejorVendedor.leadsConvertidos} de {mejorVendedor.leadsAsignados} leads convertidos
              </p>
            </div>
          </div>
        </Card>

        {/* Vendedor Más Lento en Respuesta */}
        <Card as="article" className="p-6 flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#182442]">
              ⏱️ Tiempo de Respuesta Promedio
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Quien tarda más en resolver operaciones
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
              <p className="text-sm text-slate-600 font-medium">Vendedor Más Lento</p>
              <p className="text-2xl font-bold text-red-700 mt-1">{vendedorMasLento.nombre}</p>
              <p className="text-xs text-slate-600 mt-1">{vendedorMasLento.email}</p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-red-600">{vendedorMasLento.tiempoRespuestaPromedio.toFixed(1)}h</span>
                <span className="text-sm text-slate-600">tiempo promedio</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">
                Sugerencia: Optimizar procesos para mejorar velocidad
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabla de Vendedores */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="font-semibold text-[#182442] mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined">list_alt</span>
          Equipo de Vendedores
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Vendedor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Email</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Leads</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Convertidos</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Conversión</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Respuesta</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Estado</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vendedores.map((vendedor) => (
                <tr key={vendedor.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${vendedor.estado === 'inactivo' ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-3 font-semibold text-slate-800">{vendedor.nombre}</td>
                  <td className="px-4 py-3 text-slate-600 text-sm">{vendedor.email}</td>
                  <td className="px-4 py-3 text-center font-semibold text-slate-800">{vendedor.leadsAsignados}</td>
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
                  <td className="px-4 py-3 text-center text-sm text-slate-600 font-medium">
                    {vendedor.tiempoRespuestaPromedio.toFixed(1)}h
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      vendedor.estado === 'activo' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${vendedor.estado === 'activo' ? 'bg-green-600' : 'bg-slate-400'}`}></span>
                      {vendedor.estado === 'activo' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleVendedorEstado(vendedor.id)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        vendedor.estado === 'activo'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {vendedor.estado === 'activo' ? (
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
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-[#006c49] focus:ring-2 focus:ring-[#006c49]/20 focus:outline-none transition-all"
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
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-[#006c49] focus:ring-2 focus:ring-[#006c49]/20 focus:outline-none transition-all"
              required
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setNewVendedorData({ nombre: '', email: '' });
              }}
              className="px-4 py-2 rounded-lg border border-slate-300 text-[#182442] hover:bg-slate-100 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#006c49] text-white font-semibold hover:bg-[#005236] transition-all"
            >
              Crear Vendedor
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Vendedores;
