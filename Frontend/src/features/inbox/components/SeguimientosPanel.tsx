import { useState, useEffect } from 'react';
import { seguimientoService, Seguimiento, contactoService, Contacto } from '../../../common/apiClient';
import { Card } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import { Modal } from '../../../components/ui/Modal/Modal';

export const SeguimientosPanel = () => {
  const [seguimientos, setSegimientos] = useState<Seguimiento[]>([]);
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSeguimiento, setSelectedSeguimiento] = useState<Seguimiento | null>(null);
  const [filterCompletado, setFilterCompletado] = useState<'todos' | 'pendientes' | 'completados'>('pendientes');

  useEffect(() => {
    cargarDatos();
  }, [filterCompletado]);

  const cargarDatos = async () => {
    setCargando(true);
    setError(null);
    try {
      const [segData, contData] = await Promise.all([
        seguimientoService.getAll(),
        contactoService.getAll()
      ]);
      setSegimientos(segData);
      setContactos(contData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando seguimientos');
    } finally {
      setCargando(false);
    }
  };

  const handleToggleCompletado = async (seguimiento: Seguimiento) => {
    try {
      await seguimientoService.update(seguimiento.id, {
        completado: !seguimiento.completado
      });
      cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error actualizando seguimiento');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este seguimiento?')) {
      try {
        await seguimientoService.delete(id);
        cargarDatos();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error eliminando seguimiento');
      }
    }
  };

  const filteredSeguimientos = seguimientos.filter((s) => {
    if (filterCompletado === 'pendientes') return !s.completado;
    if (filterCompletado === 'completados') return s.completado;
    return true;
  }).sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  const pendientes = seguimientos.filter(s => !s.completado).length;
  const completados = seguimientos.filter(s => s.completado).length;

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-primary">Seguimientos</h3>
          <Button 
            size="sm"
            onClick={() => {
              setSelectedSeguimiento(null);
              setIsModalOpen(true);
            }}
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Nuevo
          </Button>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterCompletado('pendientes')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              filterCompletado === 'pendientes'
                ? 'bg-secondary text-white'
                : 'bg-surface-container-low text-primary hover:bg-outline/20'
            }`}
          >
            Pendientes ({pendientes})
          </button>
          <button
            onClick={() => setFilterCompletado('completados')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              filterCompletado === 'completados'
                ? 'bg-success text-white'
                : 'bg-surface-container-low text-primary hover:bg-outline/20'
            }`}
          >
            Completados ({completados})
          </button>
          <button
            onClick={() => setFilterCompletado('todos')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              filterCompletado === 'todos'
                ? 'bg-primary text-white'
                : 'bg-surface-container-low text-primary hover:bg-outline/20'
            }`}
          >
            Todos ({seguimientos.length})
          </button>
        </div>

        {error && (
          <div className="bg-error/10 text-error p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {cargando ? (
          <div className="text-center py-8 text-on-surface-variant">Cargando...</div>
        ) : filteredSeguimientos.length === 0 ? (
          <div className="text-center py-8 text-on-surface-variant">
            No hay seguimientos en esta categoría
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredSeguimientos.map((seg) => {
              const contacto = contactos.find(c => c.id === seg.contactoId);
              return (
                <div
                  key={seg.id}
                  className={`p-4 rounded-lg border ${
                    seg.completado
                      ? 'bg-success/10 border-success/30'
                      : 'bg-surface-container-low border-outline/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <input
                          type="checkbox"
                          checked={seg.completado}
                          onChange={() => handleToggleCompletado(seg)}
                          className="w-4 h-4 rounded"
                        />
                        <p className={`font-medium ${seg.completado ? 'text-on-surface-variant line-through' : 'text-primary'}`}>
                          {seg.tarea}
                        </p>
                      </div>
                      <p className="text-xs text-on-surface-variant">
                        {contacto?.nombre} • {new Date(seg.fecha).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!seg.completado && (
                        <button
                          onClick={() => {
                            setSelectedSeguimiento(seg);
                            setIsModalOpen(true);
                          }}
                          className="text-secondary hover:underline text-xs font-bold"
                        >
                          Editar
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(seg.id)}
                        className="text-error hover:underline text-xs font-bold"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isModalOpen && (
        <SeguimientoModal
          seguimiento={selectedSeguimiento}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          contactos={contactos}
          onSave={() => {
            cargarDatos();
            setIsModalOpen(false);
          }}
        />
      )}
    </Card>
  );
};

interface SeguimientoModalProps {
  seguimiento: Seguimiento | null;
  isOpen: boolean;
  onClose: () => void;
  contactos: Contacto[];
  onSave: () => void;
}

const SeguimientoModal = ({ seguimiento, isOpen, onClose, contactos, onSave }: SeguimientoModalProps) => {
  const [formData, setFormData] = useState<Omit<Seguimiento, 'id'>>({
    tarea: (seguimiento?.tarea || '') as string,
    fecha: (seguimiento?.fecha || new Date().toISOString().split('T')[0]) as string,
    completado: seguimiento?.completado || false,
    contactoId: (seguimiento?.contactoId || 0) as number
  });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setError(null);

    try {
      if (seguimiento?.id) {
        await seguimientoService.update(seguimiento.id, formData);
      } else {
        await seguimientoService.create(formData);
      }
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error guardando seguimiento');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={seguimiento ? 'Editar Seguimiento' : 'Nuevo Seguimiento'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Contacto</label>
          <select
            value={formData.contactoId}
            onChange={(e) => setFormData({ ...formData, contactoId: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-outline rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-secondary"
            required
          >
            <option value="">Selecciona un contacto...</option>
            {contactos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-1">Tarea</label>
          <input
            type="text"
            value={formData.tarea}
            onChange={(e) => setFormData({ ...formData, tarea: e.target.value })}
            placeholder="Descripción de la tarea..."
            className="w-full px-3 py-2 border border-outline rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-secondary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-1">Fecha</label>
          <input
            type="date"
            value={formData.fecha as string}
            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
            className="w-full px-3 py-2 border border-outline rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-secondary"
            required
          />
        </div>

        {error && (
          <div className="bg-error/10 text-error p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose} disabled={guardando}>
            Cancelar
          </Button>
          <Button type="submit" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
