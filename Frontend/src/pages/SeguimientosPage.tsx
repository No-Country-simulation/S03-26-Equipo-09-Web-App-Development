import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tx } from '../common/tx';
import { getSeguimientos, createSeguimiento, completarSeguimiento, deleteSeguimiento } from '../services/seguimientosService';
import { getContactos } from '../services/contactosService';
import type { Seguimiento, Contacto } from '../types/models';
import { Card } from '../components/ui/Card/Card';
import { Button } from '../components/ui/Button/Button';
import { Badge } from '../components/ui/Badge/Badge';
import { Modal } from '../components/ui/Modal/Modal';
import { Input } from '../components/ui/Input/Input';

type FiltroType = 'TODOS' | 'PENDIENTE' | 'VENCIDO' | 'COMPLETADO';

const getEstadoTarea = (seg: Seguimiento): 'vencida' | 'hoy' | 'pendiente' | 'completada' => {
  if (seg.completado) return 'completada';
  const hoy = new Date().toISOString().split('T')[0] ?? '';
  if (seg.fecha < hoy) return 'vencida';
  if (seg.fecha === hoy) return 'hoy';
  return 'pendiente';
};

export const SeguimientosPage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [filtro, setFiltro] = useState<FiltroType>('TODOS');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ tarea: '', fecha: '', contactoId: '' });

  // TanStack Query - GET seguimientos
  const { data: seguimientos = [], isLoading: loadingSeg } = useQuery({
    queryKey: ['seguimientos'],
    queryFn: getSeguimientos,
  });

  // TanStack Query - GET contactos
  const { data: contactos = [] } = useQuery({
    queryKey: ['contactos'],
    queryFn: getContactos,
  });

  // TanStack Query - completar
  const completarMutation = useMutation({
    mutationFn: completarSeguimiento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seguimientos'] });
    },
  });

  // TanStack Query - crear
  const createMutation = useMutation({
    mutationFn: createSeguimiento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seguimientos'] });
      setModalOpen(false);
      setFormData({ tarea: '', fecha: '', contactoId: '' });
    },
  });

  // TanStack Query - eliminar
  const deleteMutation = useMutation({
    mutationFn: deleteSeguimiento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seguimientos'] });
    },
  });

  const filtrados = useMemo(() => seguimientos.filter(s => {
    const estado = getEstadoTarea(s);
    if (filtro === 'TODOS') return true;
    if (filtro === 'PENDIENTE') return estado === 'pendiente' || estado === 'hoy';
    if (filtro === 'VENCIDO') return estado === 'vencida';
    if (filtro === 'COMPLETADO') return estado === 'completada';
    return true;
  }), [seguimientos, filtro]);

  const handleCompletar = async (id: number) => {
    await completarMutation.mutateAsync(id);
  };

  const handleEliminar = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };

  const handleCrear = async () => {
    const contacto = contactos.find(c => c.id === Number(formData.contactoId));
    if (!contacto || !formData.tarea || !formData.fecha) return;
    await createMutation.mutateAsync({ tarea: formData.tarea, fecha: formData.fecha, completado: false, contacto });
  };

  const counts = {
    pendiente: seguimientos.filter(s => ['pendiente', 'hoy'].includes(getEstadoTarea(s))).length,
    vencido: seguimientos.filter(s => getEstadoTarea(s) === 'vencida').length,
    completado: seguimientos.filter(s => s.completado).length,
  };

  const FILTROS: { key: FiltroType; labelKey: string }[] = [
    { key: 'TODOS', labelKey: 'seguimientos.filters.all' },
    { key: 'PENDIENTE', labelKey: 'seguimientos.filters.pending' },
    { key: 'VENCIDO', labelKey: 'seguimientos.filters.overdue' },
    { key: 'COMPLETADO', labelKey: 'seguimientos.filters.completed' },
  ];

  return (
    <div className="space-y-6 animate-fade-in p-2 md:p-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">{t('seguimientos.title')}</h2>
          <p className="text-on-surface-variant text-base mt-1">
            {t('seguimientos.subtitle_other', { count: counts.pendiente })}
            {counts.vencido > 0 && <span className="text-red-500 font-bold ml-2">· {t('seguimientos.overdue_other', { count: counts.vencido })}</span>}
          </p>
        </div>
        <Button icon="add_task" onClick={() => { setModalOpen(true); }}>{t('seguimientos.new')}</Button>
      </header>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { key: 'pendiente', value: counts.pendiente, color: 'text-yellow-600', bg: 'bg-yellow-50', icon: 'pending', label: t('seguimientos.kpi.pending') },
          { key: 'vencido', value: counts.vencido, color: 'text-red-600', bg: 'bg-red-50', icon: 'warning', label: t('seguimientos.kpi.overdue') },
          { key: 'completado', value: counts.completado, color: 'text-green-600', bg: 'bg-green-50', icon: 'task_alt', label: t('seguimientos.kpi.completed') },
        ].map(kpi => (
          <Card key={kpi.key} className={`${kpi.bg} border-0`}>
            <div className="flex items-center gap-3">
              <span className={`material-symbols-outlined text-2xl ${kpi.color}`}>{kpi.icon}</span>
              <div>
                <p className="text-2xl font-extrabold text-primary">{kpi.value}</p>
                <p className="text-xs text-on-surface-variant font-medium">{kpi.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {FILTROS.map(f => (
          <button key={f.key} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filtro === f.key ? 'bg-primary text-white' : 'bg-white text-on-surface-variant border border-outline-variant/30 hover:border-primary/40'}`} onClick={() => { setFiltro(f.key); }}>
            {tx(f.labelKey)}
          </button>
        ))}
      </div>

      {/* Lista */}
      {loadingSeg ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {filtrados.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-12 text-on-surface-variant gap-2">
              <span className="material-symbols-outlined text-5xl opacity-30">task_alt</span>
              <p className="text-sm font-medium">{t('seguimientos.noTasks')}</p>
            </Card>
          ) : (
            filtrados.map(seg => {
              const estado = getEstadoTarea(seg);
              return (
                <Card key={seg.id} className={`flex items-center gap-4 transition-all ${seg.completado ? 'opacity-60' : ''}`}>
                  <button
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${seg.completado ? 'bg-green-500 border-green-500' : estado === 'vencida' ? 'border-red-400 hover:border-red-500' : 'border-outline-variant hover:border-primary'}`}
                    onClick={() => { if (!seg.completado) void handleCompletar(seg.id); }}
                    disabled={completarMutation.isPending}
                  >
                    {seg.completado && <span className="material-symbols-outlined text-white text-[14px]">check</span>}
                  </button>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${seg.completado ? 'line-through text-on-surface-variant' : 'text-primary'}`}>{seg.tarea}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{seg.contacto?.nombre || t('common.unknown')}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-xs font-medium ${estado === 'vencida' ? 'text-red-600' : estado === 'hoy' ? 'text-yellow-600' : 'text-on-surface-variant'}`}>{seg.fecha}</p>
                    <p className="text-[10px] text-on-surface-variant mt-1">{t(`seguimientos.estado.${estado}`)}</p>
                  </div>
                  <button
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors ml-2"
                    onClick={() => { void handleEliminar(seg.id); }}
                    disabled={deleteMutation.isPending}
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Modal Crear */}
      <Modal isOpen={modalOpen} title={t('seguimientos.new')} onClose={() => { setModalOpen(false); }}>
        <div className="space-y-4">
          <Input id="tarea" label={t('seguimientos.taskLabel')} placeholder={t('seguimientos.taskPlaceholder')} type="text" value={formData.tarea} onChange={e => { setFormData(p => ({ ...p, tarea: e.target.value })); }} />
          <Input id="fecha" label={t('seguimientos.dateLabel')} type="date" value={formData.fecha} onChange={e => { setFormData(p => ({ ...p, fecha: e.target.value })); }} />
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">{t('seguimientos.contactLabel')}</label>
            <select className="w-full rounded-xl border border-outline-variant/30 bg-surface px-4 py-2.5 text-sm text-primary focus:outline-none focus:border-primary" value={formData.contactoId} onChange={e => { setFormData(p => ({ ...p, contactoId: e.target.value })); }}>
              <option value="">{t('seguimientos.selectContact')}</option>
              {contactos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button className="flex-1" variant="outline" onClick={() => { setModalOpen(false); }}>{t('common.cancel')}</Button>
            <Button className="flex-1" isLoading={createMutation.isPending} onClick={() => { void handleCrear(); }}>
              {t('seguimientos.new')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
