import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ContactoTable } from '../features/contactos/components/ContactoTable';
import { Button } from '../components/ui/Button/Button';
import { Modal } from '../components/ui/Modal/Modal';
import { usuarioService, Usuario, contactoService } from '../common/apiClient';

export const ContactosPage = () => {
  const { isAdmin, userId } = useAuth();
  const [activeTab, setActiveTab] = useState<'todos' | 'lead-activo' | 'cliente' | 'inactivo'>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVendedor, setSelectedVendedor] = useState<string>(''); // Filtro para Admin
  const [newLeadVendedor, setNewLeadVendedor] = useState<string>(''); // Selector en form para Admin
  const [vendedores, setVendedores] = useState<Usuario[]>([]);
  const [cargandoVendedores, setCargandoVendedores] = useState(false);
  
  // Estados para el formulario de nuevo lead
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    estado: 'LEAD_ACTIVO'
  });
  const [cargandoCrear, setCargandoCrear] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Para refrescar tabla

  // Cargar vendedores desde API
  useEffect(() => {
    const cargarVendedores = async () => {
      setCargandoVendedores(true);
      try {
        const datos = await usuarioService.getVendedores();
        setVendedores(datos);
      } catch (error) {
        console.error('Error cargando vendedores:', error);
        setVendedores([]);
      } finally {
        setCargandoVendedores(false);
      }
    };
    
    if (isAdmin) {
      cargarVendedores();
    }
  }, [isAdmin]);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔍 handleCreateLead iniciado - isAdmin:', isAdmin, 'userId:', userId);
    
    // Validar datos
    if (!formData.nombre || !formData.email || !formData.telefono) {
      alert('Por favor completa todos los campos');
      return;
    }

    // Validar que admin haya seleccionado vendedor
    if (isAdmin && !newLeadVendedor) {
      alert('Debes asignar un vendedor al lead');
      return;
    }

    // Validar vendedorAsignadoId
    const vendedorAsignadoId = isAdmin ? parseInt(newLeadVendedor) : userId;
    console.log('🔍 vendedorAsignadoId calculado:', vendedorAsignadoId);
    
    if (!vendedorAsignadoId) {
      alert('Error: No se puede obtener el ID del vendedor. Por favor, inicia sesión nuevamente.');
      console.error('❌ vendedorAsignadoId es null/undefined');
      return;
    }

    setCargandoCrear(true);
    try {
      // Crear objeto para enviar al API
      const nuevoLead = {
        ...formData,
        vendedorAsignadoId
      };

      console.log('📤 Enviando nuevo lead:', nuevoLead);

      const response = await contactoService.create(nuevoLead);
      console.log('✅ Lead creado:', response);

      // Cerrar modal y limpiar formulario
      setIsModalOpen(false);
      setFormData({ nombre: '', email: '', telefono: '', estado: 'LEAD_ACTIVO' });
      setNewLeadVendedor('');

      // Mostrar éxito
      alert('✓ Lead creado exitosamente');

      // Refrescar tabla sin recargar página
      setActiveTab('todos'); // Mostrar todos los leads
      setRefreshKey(prev => prev + 1); // Disparar recarga de datos
    } catch (error: any) {
      console.error('❌ Error creando lead:', error);
      console.error('   📊 Error details:', {
        message: error?.message,
        status: error?.status,
        responseData: error?.response?.data,
        responseStatus: error?.response?.status
      });
      
      // Mostrar error detallado
      let errorMsg = 'Error desconocido al crear el lead';
      
      if (error?.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else if (error?.message) {
        errorMsg = error.message;
      }
      
      console.error('   📤 Mensaje final:', errorMsg);
      alert(`✗ Error al crear el lead:\n${errorMsg}`);
    } finally {
      setCargandoCrear(false);
    }
  };

  const tabs = [
    { id: 'todos' as const, label: 'Todos', icon: 'list', color: 'slate', description: 'Todos los leads sin filtrar' },
    { id: 'lead-activo' as const, label: 'Lead Activo', icon: 'new_releases', color: 'blue', description: 'Recién capturados' },
    { id: 'cliente' as const, label: 'Cliente', icon: 'star', color: 'green', description: 'Compra finalizada' },
    { id: 'inactivo' as const, label: 'Inactivo', icon: 'block', color: 'red', description: 'Bloqueados o sin respuesta' }
  ];

  const getColorClasses = (color: string, isActive: boolean): string => {
    const colorMap: Record<string, { active: string; inactive: string }> = {
      slate: {
        active: 'bg-slate-600 border-slate-700',
        inactive: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
      },
      blue: {
        active: 'bg-blue-500 border-blue-600',
        inactive: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200'
      },
      yellow: {
        active: 'bg-yellow-400 border-yellow-500',
        inactive: 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200'
      },
      green: {
        active: 'bg-green-500 border-green-600',
        inactive: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'
      },
      orange: {
        active: 'bg-orange-500 border-orange-600',
        inactive: 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200'
      },
      red: {
        active: 'bg-red-500 border-red-600',
        inactive: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'
      }
    };
    const entry = colorMap[color];
    if (!entry) return '';
    return isActive ? entry.active : entry.inactive;
  };

  return (
    <div className="space-y-6 p-4 md:p-6 animate-fade-in">
      {/* Header con Título y Botón - DIFERENCIADO POR ROL */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#182442]">
            {isAdmin ? 'Centro de Gestión de Leads (Admin)' : 'Mis Leads'}
          </h1>
          <p className="text-slate-600 text-base mt-1">
            {isAdmin 
              ? 'Administra todos los leads del equipo en 3 estados: Activo, Cliente, Inactivo'
              : 'Administra tus leads en 3 estados: Activo, Cliente, Inactivo'
            }
          </p>
        </div>
        <Button 
          onClick={() => {
            setIsModalOpen(true);
          }}
          className="h-11 px-6 bg-[#182442] hover:bg-[#0d1420] text-white font-semibold whitespace-nowrap"
        >
          <span className="material-symbols-outlined mr-2">add</span>
          Nuevo Lead
        </Button>
      </header>

      {/* FILTRO DE VENDEDOR - SOLO PARA ADMIN */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-[#006c49]/5 to-[#006c49]/10 rounded-lg border border-[#006c49]/20 p-4">
          <label className="block text-sm font-semibold text-[#182442] mb-2">
            <span className="material-symbols-outlined inline mr-2 text-[18px]">person</span>
            Filtrar por Vendedor
          </label>
          <select
            value={selectedVendedor}
            onChange={(e) => setSelectedVendedor(e.target.value)}
            disabled={cargandoVendedores}
            className="w-full md:w-64 px-4 py-2 rounded-lg border border-[#006c49]/30 bg-white focus:border-[#006c49] focus:ring-2 focus:ring-[#006c49]/20 focus:outline-none transition-all font-medium disabled:opacity-50"
          >
            <option value="">Todos los Vendedores</option>
            {vendedores.map((vendedor) => (
              <option key={vendedor.id} value={vendedor.id.toString()}>
                {vendedor.nombre}
              </option>
            ))}
          </select>
          {selectedVendedor && (
            <p className="text-sm text-[#006c49] mt-2 font-semibold">
              ✓ Mostrando leads asignados a {vendedores.find(v => v.id.toString() === selectedVendedor)?.nombre}
            </p>
          )}
        </div>
      )}

      {/* Tabs como Badges Coloreados - 3 Estados */}
      <div className="flex flex-wrap gap-3 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all transform flex items-center gap-2 border-2 ${
              activeTab === tab.id
                ? `scale-105 shadow-lg text-white ${getColorClasses(tab.color, true)}`
                : `${getColorClasses(tab.color, false)} hover:scale-105`
            }`}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabla de Contactos con Filtros Aplicados */}
      <ContactoTable 
        filtroEstado={activeTab}
        filtroVendedor={selectedVendedor}
        refreshTrigger={refreshKey}
      />

      {/* Modal para Nuevo Lead */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Crear Nuevo Lead">
        <form onSubmit={handleCreateLead} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#182442] mb-1">Nombre Completo *</label>
            <input 
              type="text" 
              placeholder="Ingresa el nombre del potencial cliente"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-[#006c49] focus:ring-2 focus:ring-[#006c49]/20 focus:outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#182442] mb-1">Email *</label>
            <input 
              type="email" 
              placeholder="correo@ejemplo.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-[#006c49] focus:ring-2 focus:ring-[#006c49]/20 focus:outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#182442] mb-1">Teléfono *</label>
            <input 
              type="tel" 
              placeholder="+591 1234 5678"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-[#006c49] focus:ring-2 focus:ring-[#006c49]/20 focus:outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#182442] mb-1">Etiqueta *</label>
            <select 
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-[#006c49] focus:ring-2 focus:ring-[#006c49]/20 focus:outline-none transition-all" 
              required
            >
              <option value="LEAD_ACTIVO">Lead Activo</option>
              <option value="CLIENTE">Cliente</option>
              <option value="INACTIVO">Inactivo</option>
            </select>
          </div>

          {/* SELECTOR DE VENDEDOR - SOLO PARA ADMIN - AL FINAL */}
          {isAdmin && (
            <div>
              <label className="block text-sm font-medium text-[#182442] mb-1">Asignar a Vendedor *</label>
              <select
                value={newLeadVendedor}
                onChange={(e) => setNewLeadVendedor(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-[#006c49] focus:ring-2 focus:ring-[#006c49]/20 focus:outline-none transition-all"
                required
              >
                <option value="">-- Selecciona un vendedor --</option>
                {vendedores.map((vendedor) => (
                  <option key={vendedor.id} value={vendedor.id.toString()}>
                    {vendedor.nombre} ({vendedor.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setNewLeadVendedor('');
                setFormData({ nombre: '', email: '', telefono: '', estado: 'LEAD_ACTIVO' });
              }}
              className="px-4 py-2 rounded-lg border border-slate-300 text-[#182442] hover:bg-slate-100 transition-all"
              disabled={cargandoCrear}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#006c49] text-white font-semibold hover:bg-[#005236] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={cargandoCrear}
            >
              {cargandoCrear ? 'Creando...' : 'Crear Lead'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
