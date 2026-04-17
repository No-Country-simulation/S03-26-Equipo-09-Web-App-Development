import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPlantillas, createPlantilla, togglePlantilla, deletePlantilla } from '../services/plantillasService';
import type { Plantilla, Canal } from '../types/models';
import { Card } from '../components/ui/Card/Card';
import { Button } from '../components/ui/Button/Button';
import { Badge } from '../components/ui/Badge/Badge';
import { Modal } from '../components/ui/Modal/Modal';
import { Input } from '../components/ui/Input/Input';

const CANAL_COLORS: Record<Canal, string> = {
  WhatsApp: 'text-green-600 bg-green-50 border-green-200',
  Email: 'text-blue-600 bg-blue-50 border-blue-200',
};

export const PlantillasPage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [filtroCanal, setFiltroCanal] = useState<Canal | 'TODOS'>('TODOS');
  const [modalOpen, setModalOpen] = useState(false);
  const [vistaPrevia, setVistaPrevia] = useState<Plantilla | null>(null);
  const [formData, setFormData] = useState({ nombre: '', contenido: '', canal: 'WhatsApp' as Canal });

  // TanStack Query - GET
  const { data: plantillas = [], isLoading } = useQuery({
    queryKey: ['plantillas'],
    queryFn: getPlantillas,
  });

  // TanStack Query - CREATE
  const createMutation = useMutation({
    mutationFn: createPlantilla,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plantillas'] });
      setModalOpen(false);
      setFormData({ nombre: '', contenido: '', canal: 'WhatsApp' });
    },
  });

  // TanStack Query - TOGGLE (activate/deactivate)
  const toggleMutation = useMutation({
    mutationFn: togglePlantilla,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plantillas'] });
    },
  });

  // TanStack Query - DELETE
  const deleteMutation = useMutation({
    mutationFn: deletePlantilla,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plantillas'] });
      if (vistaPrevia) setVistaPrevia(null);
    },
  });

  const filtradas = useMemo(() => 
    plantillas.filter(p => filtroCanal === 'TODOS' || p.canal === filtroCanal),
    [plantillas, filtroCanal]
  );

  const handleCrear = async () => {
    if (!formData.nombre || !formData.contenido) return;
    await createMutation.mutateAsync({ ...formData, esActiva: true });
  };

  const handleToggle = async (id: number) => {
    await toggleMutation.mutateAsync(id);
  };

  const handleEliminar = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };

  const CANAL_FILTROS = [
    { key: 'TODOS' as const, label: t('plantillas.filters.all') },
    { key: 'WhatsApp' as Canal, label: 'WhatsApp' },
    { key: 'Email' as Canal, label: 'Email' },
  ];

  return (
    <div className="space-y-6 animate-fade-in p-2 md:p-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">{t('plantillas.title')}</h2>
          <p className="text-on-surface-variant text-base mt-1">
            {t('plantillas.subtitle', { active: plantillas.filter(p => p.esActiva).length, total: plantillas.length })}
          </p>
        </div>
        <Button icon="add" onClick={() => { setModalOpen(true); }}>{t('plantillas.new')}</Button>
      </header>

      {/* Filtros Canal */}
      <div className="flex gap-2">
        {CANAL_FILTROS.map(({ key, label }) => (
          <button key={key} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filtroCanal === key ? 'bg-primary text-white' : 'bg-white text-on-surface-variant border border-outline-variant/30 hover:border-primary/40'}`} onClick={() => { setFiltroCanal(key); }}>
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtradas.map(plantilla => (
            <Card key={plantilla.id} className={`flex flex-col gap-3 cursor-pointer hover:shadow-md transition-all ${!plantilla.esActiva ? 'opacity-50' : ''}`} onClick={() => { setVistaPrevia(plantilla); }}>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-primary text-sm truncate">{plantilla.nombre}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${CANAL_COLORS[plantilla.canal || 'WhatsApp']}`}>{t(`canal.${plantilla.canal || 'WhatsApp'}`)}</span>
              </div>
              <p className="text-xs text-on-surface-variant line-clamp-3 bg-surface-container-low rounded-lg p-3 font-mono leading-relaxed">{plantilla.contenido}</p>
              <div className="flex items-center justify-between pt-1">
                <Badge variant={plantilla.esActiva ? 'success' : 'error'}>
                  {plantilla.esActiva ? t('plantillas.badge.active') : t('plantillas.badge.inactive')}
                </Badge>
                <div className="flex gap-1">
                  <button className={`p-1.5 rounded-lg transition-colors ${plantilla.esActiva ? 'hover:bg-yellow-50 text-yellow-600' : 'hover:bg-green-50 text-green-600'}`} onClick={e => { e.stopPropagation(); void handleToggle(plantilla.id); }} disabled={toggleMutation.isPending}>
                    <span className="material-symbols-outlined text-[16px]">{plantilla.esActiva ? 'pause_circle' : 'play_circle'}</span>
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors" onClick={e => { e.stopPropagation(); void handleEliminar(plantilla.id); }} disabled={deleteMutation.isPending}>
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>
            </Card>
          ))}
          {filtradas.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-on-surface-variant gap-2">
              <span className="material-symbols-outlined text-6xl opacity-20">description</span>
              <p className="text-sm font-medium">{t('plantillas.noTemplates')}</p>
            </div>
          )}
        </div>
      )}

      {/* Modal Vista Previa */}
      <Modal isOpen={vistaPrevia !== null} title={vistaPrevia?.nombre ?? ''} onClose={() => { setVistaPrevia(null); }}>
        {vistaPrevia && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant={vistaPrevia.esActiva ? 'success' : 'error'}>
                {vistaPrevia.esActiva ? t('plantillas.badge.active') : t('plantillas.badge.inactive')}
              </Badge>
              <span className={`text-xs font-bold px-2 py-1 rounded-full border ${CANAL_COLORS[vistaPrevia.canal || 'WhatsApp']}`}>{t(`canal.${vistaPrevia.canal || 'WhatsApp'}`)}</span>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4">
              <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold mb-2">{t('plantillas.content')}</p>
              <p className="text-sm text-primary whitespace-pre-wrap leading-relaxed font-mono">{vistaPrevia.contenido}</p>
            </div>
            <p className="text-xs text-on-surface-variant">{t('plantillas.variablesNote')}</p>
          </div>
        )}
      </Modal>

      {/* Modal Crear */}
      <Modal isOpen={modalOpen} title={t('plantillas.new')} onClose={() => { setModalOpen(false); }}>
        <div className="space-y-4">
          <Input id="plantilla-nombre" label={t('plantillas.templateName')} placeholder={t('plantillas.namePlaceholder')} type="text" value={formData.nombre} onChange={e => { setFormData(p => ({ ...p, nombre: e.target.value })); }} />
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">{t('plantillas.channel')}</label>
            <select className="w-full rounded-xl border border-outline-variant/30 bg-surface px-4 py-2.5 text-sm text-primary focus:outline-none focus:border-primary" value={formData.canal} onChange={e => { setFormData(p => ({ ...p, canal: e.target.value as Canal })); }}>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Email">Email</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">{t('plantillas.content')}</label>
            <textarea className="w-full rounded-xl border border-outline-variant/30 bg-surface px-4 py-2.5 text-sm text-primary placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors resize-none" rows={5} placeholder={t('plantillas.contentPlaceholder')} value={formData.contenido} onChange={e => { setFormData(p => ({ ...p, contenido: e.target.value })); }} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button className="flex-1" variant="outline" onClick={() => { setModalOpen(false); }}>{t('common.cancel')}</Button>
            <Button className="flex-1" isLoading={createMutation.isPending} onClick={() => { void handleCrear(); }}>
              {t('plantillas.new')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
