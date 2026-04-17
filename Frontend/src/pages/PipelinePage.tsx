import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getContactos, updateContacto } from '../services/contactosService';
import type { Contacto, EstadoLead } from '../types/models';
import { Card } from '../components/ui/Card/Card';
import { Badge } from '../components/ui/Badge/Badge';
import { Modal } from '../components/ui/Modal/Modal';

const COLUMNAS: { estado: EstadoLead; color: string; bg: string; icon: string }[] = [
  { estado: 'LEAD_ACTIVO', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', icon: 'person' },
  { estado: 'EN_SEGUIMIENTO', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200', icon: 'schedule' },
  { estado: 'CLIENTE', color: 'text-green-600', bg: 'bg-green-50 border-green-200', icon: 'verified' },
  { estado: 'PERDIDO', color: 'text-red-500', bg: 'bg-red-50 border-red-200', icon: 'person_off' },
];

const BADGE_MAP: Record<EstadoLead, 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
  LEAD_ACTIVO: 'info',
  EN_SEGUIMIENTO: 'warning',
  CLIENTE: 'success',
  PERDIDO: 'error',
};

export const PipelinePage = () => {
  const { t } = useTranslation();
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [loading, setLoading] = useState(true);
  const [detalle, setDetalle] = useState<Contacto | null>(null);
  const [moviendo, setMoviendo] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      try { setContactos(await getContactos()); }
      finally { setLoading(false); }
    };
    void cargar();
  }, []);

  const porEstado = (estado: EstadoLead) => contactos.filter(c => c.estado === estado);

  const moverContacto = async (contacto: Contacto, nuevoEstado: EstadoLead) => {
    if (contacto.estado === nuevoEstado) return;
    setMoviendo(true);
    try {
      const actualizado = await updateContacto(contacto.id, { estado: nuevoEstado });
      setContactos(prev => prev.map(c => (c.id === contacto.id ? actualizado : c)));
      setDetalle(actualizado);
    } finally { setMoviendo(false); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in p-2 md:p-6">
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-primary">{t('pipeline.title')}</h2>
        <p className="text-on-surface-variant text-base mt-1">{t('pipeline.subtitle', { count: contactos.length })}</p>
      </header>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {COLUMNAS.map(col => {
          const items = porEstado(col.estado);
          return (
            <div key={col.estado} className="flex flex-col gap-3">
              {/* Column Header */}
              <div className={`flex items-center justify-between px-4 py-3 rounded-xl border ${col.bg}`}>
                <div className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-[18px] ${col.color}`}>{col.icon}</span>
                  <span className={`text-sm font-bold ${col.color}`}>{t(`estado.${col.estado}`)}</span>
                </div>
                <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full bg-white/80 ${col.color}`}>{items.length}</span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-3 min-h-[120px]">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-24 rounded-xl border-2 border-dashed border-outline-variant/30 text-on-surface-variant/40">
                    <span className="material-symbols-outlined text-2xl">inbox</span>
                    <p className="text-xs mt-1">{t('pipeline.noContacts')}</p>
                  </div>
                ) : (
                  items.map(contacto => (
                    <Card
                      key={contacto.id}
                      className="cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-[0.98] border border-outline-variant/10"
                      onClick={() => { setDetalle(contacto); }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                          {contacto.nombre.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-primary text-sm truncate">{contacto.nombre}</p>
                          <p className="text-xs text-on-surface-variant truncate">{contacto.email}</p>
                          <p className="text-xs text-on-surface-variant/60 mt-1">{contacto.telefono}</p>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Detalle */}
      <Modal isOpen={detalle !== null} title={detalle?.nombre ?? ''} onClose={() => { setDetalle(null); }}>
        {detalle && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-surface-container-low rounded-xl p-3">
                <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-1">{t('common.email')}</p>
                <p className="font-medium text-primary">{detalle.email}</p>
              </div>
              <div className="bg-surface-container-low rounded-xl p-3">
                <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-1">{t('common.phone')}</p>
                <p className="font-medium text-primary">{detalle.telefono}</p>
              </div>
              <div className="bg-surface-container-low rounded-xl p-3 col-span-2">
                <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-2">{t('pipeline.currentStatus')}</p>
                <Badge variant={BADGE_MAP[detalle.estado]}>{t(`estado.${detalle.estado}`)}</Badge>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-primary mb-3">{t('pipeline.moveToStage')}</p>
              <div className="grid grid-cols-2 gap-2">
                {COLUMNAS.filter(c => c.estado !== detalle.estado).map(col => (
                  <button
                    key={col.estado}
                    disabled={moviendo}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.97] ${col.bg} ${col.color} disabled:opacity-50`}
                    onClick={() => { void moverContacto(detalle, col.estado); }}
                  >
                    <span className="material-symbols-outlined text-[16px]">{col.icon}</span>
                    {t(`estado.${col.estado}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
