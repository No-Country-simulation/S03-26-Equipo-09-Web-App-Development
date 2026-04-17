import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tx } from '../common/tx';
import { getContactos, createContacto, updateContacto, deleteContacto } from '../services/contactosService';
import type { Contacto, EstadoLead } from '../types/models';
import { Card } from '../components/ui/Card/Card';
import { Button } from '../components/ui/Button/Button';
import { Badge } from '../components/ui/Badge/Badge';
import { Input } from '../components/ui/Input/Input';
import { Modal } from '../components/ui/Modal/Modal';

const BADGE_MAP: Record<EstadoLead, 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
  LEAD_ACTIVO: 'info',
  EN_SEGUIMIENTO: 'warning',
  CLIENTE: 'success',
  PERDIDO: 'error',
};

const ESTADOS: EstadoLead[] = ['LEAD_ACTIVO', 'EN_SEGUIMIENTO', 'CLIENTE', 'PERDIDO'];

interface ContactoFormData {
  nombre: string;
  email: string;
  telefono: string;
  estado: EstadoLead;
}

const EMPTY_FORM: ContactoFormData = { nombre: '', email: '', telefono: '', estado: 'LEAD_ACTIVO' };

export const ContactosPage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<EstadoLead | 'TODOS'>('TODOS');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<number | null>(null);
  const [editando, setEditando] = useState<Contacto | null>(null);
  const [formData, setFormData] = useState<ContactoFormData>(EMPTY_FORM);

  // TanStack Query - GET
  const { data: contactos = [], isLoading } = useQuery({
    queryKey: ['contactos'],
    queryFn: getContactos,
  });

  // TanStack Query - CREATE
  const createMutation = useMutation({
    mutationFn: createContacto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactos'] });
      setModalOpen(false);
      setFormData(EMPTY_FORM);
    },
  });

  // TanStack Query - UPDATE
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updateContacto>[1] }) => updateContacto(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactos'] });
      setModalOpen(false);
      setEditando(null);
      setFormData(EMPTY_FORM);
    },
  });

  // TanStack Query - DELETE
  const deleteMutation = useMutation({
    mutationFn: deleteContacto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactos'] });
      setDeleteModal(null);
    },
  });

  const filtrados = useMemo(() => contactos.filter(c => {
    const matchQ = busqueda === '' || [c.nombre, c.email, c.telefono].some(v => v.toLowerCase().includes(busqueda.toLowerCase()));
    const matchE = filtroEstado === 'TODOS' || c.estado === filtroEstado;
    return matchQ && matchE;
  }), [contactos, busqueda, filtroEstado]);

  const abrirCrear = () => { setEditando(null); setFormData(EMPTY_FORM); setModalOpen(true); };
  const abrirEditar = (c: Contacto) => { setEditando(c); setFormData({ nombre: c.nombre, email: c.email, telefono: c.telefono, estado: c.estado }); setModalOpen(true); };

  const handleGuardar = async () => {
    if (editando) {
      await updateMutation.mutateAsync({ id: editando.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const handleEliminar = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };

  const timeAgo = (iso?: string) => {
    if (!iso) return '—';
    const diff = Date.now() - new Date(iso).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return t('common.today');
    if (days === 1) return t('common.yesterday');
    return t('common.daysAgo', { count: days });
  };

  return (
    <div className="space-y-6 animate-fade-in p-2 md:p-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">{t('contactos.title')}</h2>
          <p className="text-on-surface-variant text-base mt-1">{t('contactos.subtitle', { count: contactos.length })}</p>
        </div>
        <Button icon="person_add" onClick={abrirCrear}>{t('contactos.new')}</Button>
      </header>

      {/* Filtros */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input id="busqueda" type="search" icon="search" placeholder={t('contactos.search')} value={busqueda} onChange={e => { setBusqueda(e.target.value); }} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['TODOS', ...ESTADOS] as const).map(estado => (
              <button
                key={estado}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${filtroEstado === estado ? 'bg-primary text-white border-primary' : 'bg-white text-on-surface-variant border-outline-variant/30 hover:border-primary/50'}`}
                onClick={() => { setFiltroEstado(estado); }}
              >
                {estado === 'TODOS' ? t('common.all') : t(`estado.${estado}`)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Tabla */}
      <Card className="overflow-hidden p-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : filtrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-on-surface-variant gap-2">
            <span className="material-symbols-outlined text-5xl opacity-30">people</span>
            <p className="text-sm font-medium">{t('common.noResults')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-surface-container-low">
                  {[
                    { key: 'name', cls: '' },
                    { key: 'email', cls: 'hidden md:table-cell' },
                    { key: 'phone', cls: 'hidden lg:table-cell' },
                    { key: 'status', cls: '' },
                    { key: 'created', cls: 'hidden sm:table-cell' },
                  ].map(col => (
                    <th key={col.key} className={`text-left px-6 py-3 text-xs font-extrabold uppercase tracking-widest text-on-surface-variant ${col.cls}`}>
                      {tx(`contactos.columns.${col.key}`)}
                    </th>
                  ))}
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtrados.map((contacto, i) => (
                  <tr key={contacto.id} className={`border-b border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors ${i % 2 === 0 ? '' : 'bg-surface-container-low/20'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                          {contacto.nombre.charAt(0)}
                        </div>
                        <span className="font-semibold text-primary">{contacto.nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant hidden md:table-cell">{contacto.email}</td>
                    <td className="px-6 py-4 text-on-surface-variant hidden lg:table-cell">{contacto.telefono}</td>
                    <td className="px-6 py-4">
                      <Badge variant={BADGE_MAP[contacto.estado]}>{t(`estado.${contacto.estado}`)}</Badge>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant hidden sm:table-cell text-xs">{timeAgo(contacto.fechaCreacion)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors" onClick={() => { abrirEditar(contacto); }}>
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" onClick={() => { setDeleteModal(contacto.id); }}>
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal Crear/Editar */}
      <Modal isOpen={modalOpen} title={editando ? t('contactos.editTitle') : t('contactos.createTitle')} onClose={() => { setModalOpen(false); }}>
        <div className="space-y-4">
          <Input id="modal-nombre" label={t('contactos.fullName')} placeholder={t('contactos.namePlaceholder')} type="text" value={formData.nombre} onChange={e => { setFormData(p => ({ ...p, nombre: e.target.value })); }} />
          <Input id="modal-email" label={t('contactos.columns.email')} placeholder={t('contactos.emailPlaceholder')} type="email" value={formData.email} onChange={e => { setFormData(p => ({ ...p, email: e.target.value })); }} />
          <Input id="modal-telefono" label={t('contactos.columns.phone')} placeholder={t('contactos.phonePlaceholder')} type="tel" value={formData.telefono} onChange={e => { setFormData(p => ({ ...p, telefono: e.target.value })); }} />
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">{t('contactos.statusLabel')}</label>
            <select className="w-full rounded-xl border border-outline-variant/30 bg-surface px-4 py-2.5 text-sm text-primary focus:outline-none focus:border-primary" value={formData.estado} onChange={e => { setFormData(p => ({ ...p, estado: e.target.value as EstadoLead })); }}>
              {ESTADOS.map(e => <option key={e} value={e}>{t(`estado.${e}`)}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button className="flex-1" variant="outline" onClick={() => { setModalOpen(false); }}>{t('common.cancel')}</Button>
            <Button className="flex-1" isLoading={createMutation.isPending || updateMutation.isPending} onClick={() => { void handleGuardar(); }}>
              {editando ? t('contactos.saveChanges') : t('contactos.createTitle')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Eliminar */}
      <Modal isOpen={deleteModal !== null} title={t('contactos.deleteTitle')} onClose={() => { setDeleteModal(null); }}>
        <p className="text-on-surface-variant text-sm mb-6">{t('contactos.deleteWarning')}</p>
        <div className="flex gap-3">
          <Button className="flex-1" variant="outline" onClick={() => { setDeleteModal(null); }}>{t('common.cancel')}</Button>
          <button className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors" onClick={() => { if (deleteModal) void handleEliminar(deleteModal); }}>
            {t('common.delete')}
          </button>
        </div>
      </Modal>
    </div>
  );
};
