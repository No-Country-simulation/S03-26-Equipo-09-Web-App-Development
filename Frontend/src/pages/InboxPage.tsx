import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getConversaciones, marcarLeido, createConversacion } from '../services/conversacionesService';
import { getContactos } from '../services/contactosService';
import type { Conversacion, Contacto, Canal } from '../types/models';
import { Card } from '../components/ui/Card/Card';
import { Badge } from '../components/ui/Badge/Badge';

const CANAL_CONFIG: Record<Canal, { icon: string; color: string; bg: string }> = {
  WhatsApp: { icon: 'chat_bubble', color: 'text-green-600', bg: 'bg-green-100' },
  Email: { icon: 'alternate_email', color: 'text-blue-600', bg: 'bg-blue-100' },
};

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m`;
  if (hrs < 24) return `${hrs}h`;
  return `${days}d`;
};

export const InboxPage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [seleccionada, setSeleccionada] = useState<Conversacion | null>(null);
  const [filtroCanal, setFiltroCanal] = useState<Canal | 'TODOS'>('TODOS');
  const [respuesta, setRespuesta] = useState('');

  // TanStack Query - GET conversaciones
  const { data: conversaciones = [], isLoading: loadingConv } = useQuery({
    queryKey: ['conversaciones'],
    queryFn: getConversaciones,
  });

  // TanStack Query - GET contactos
  const { data: contactos = [] } = useQuery({
    queryKey: ['contactos'],
    queryFn: getContactos,
  });

  // TanStack Query - marcar como leído
  const marcarLeidoMutation = useMutation({
    mutationFn: marcarLeido,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversaciones'] });
    },
  });

  // TanStack Query - crear conversación
  const crearMutation = useMutation({
    mutationFn: createConversacion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversaciones'] });
      setRespuesta('');
    },
  });

  const seleccionar = async (conv: Conversacion) => {
    setSeleccionada(conv);
    if (!conv.leido) {
      await marcarLeidoMutation.mutateAsync(conv.id);
    }
  };

  const enviarRespuesta = async () => {
    if (!respuesta.trim() || !seleccionada) return;
    await crearMutation.mutateAsync({
      canal: seleccionada.canal,
      contenido: respuesta,
      fechaHora: new Date().toISOString(),
      contacto: seleccionada.contacto,
      leido: true,
    });
    setSeleccionada(null);
  };

  const filtradas = useMemo(() => 
    conversaciones.filter(c => filtroCanal === 'TODOS' || c.canal === filtroCanal),
    [conversaciones, filtroCanal]
  );

  const sinLeer = useMemo(() => 
    conversaciones.filter(c => !c.leido).length,
    [conversaciones]
  );

  const CANAL_FILTROS = [
    { key: 'TODOS' as const, label: t('inbox.filters.all') },
    { key: 'WhatsApp' as Canal, label: t('canal.WhatsApp') },
    { key: 'Email' as Canal, label: t('canal.Email') },
  ];

  return (
    <div className="animate-fade-in p-2 md:p-6 space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">{t('inbox.title')}</h2>
          <p className="text-on-surface-variant text-base mt-1">
            {t('inbox.subtitle')}
            {sinLeer > 0 && <span className="ml-2 text-yellow-600 font-bold">{t('inbox.unread_other', { count: sinLeer })}</span>}
          </p>
        </div>
        <div className="flex gap-2">
          {CANAL_FILTROS.map(({ key, label }) => (
            <button key={key} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filtroCanal === key ? 'bg-primary text-white' : 'bg-white text-on-surface-variant border border-outline-variant/30 hover:border-primary/40'}`} onClick={() => { setFiltroCanal(key); }}>
              {label}
            </button>
          ))}
        </div>
      </header>

      {loadingConv ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4" style={{ height: '65vh' }}>
          {/* Lista */}
          <div className="lg:col-span-4 overflow-y-auto space-y-2 pr-1">
            {filtradas.length === 0 ? (
              <Card className="flex flex-col items-center justify-center py-12 text-on-surface-variant gap-2">
                <span className="material-symbols-outlined text-5xl opacity-30">inbox</span>
                <p className="text-sm font-medium">{t('inbox.noMessages')}</p>
              </Card>
            ) : (
              filtradas.map(conv => {
                const canalCfg = CANAL_CONFIG[conv.canal];
                const isSelected = seleccionada?.id === conv.id;
                return (
                  <button
                    key={conv.id}
                    className={`w-full text-left rounded-2xl p-4 transition-all border ${isSelected ? 'bg-primary/5 border-primary/30 shadow-sm' : 'bg-white border-outline-variant/20 hover:border-primary/20 hover:bg-surface-container-low/50'}`}
                    onClick={() => { void seleccionar(conv); }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-full ${canalCfg.bg} flex items-center justify-center flex-shrink-0`}>
                        <span className={`material-symbols-outlined text-[18px] ${canalCfg.color}`}>{canalCfg.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-sm font-bold truncate ${conv.leido ? 'text-on-surface-variant' : 'text-primary'}`}>{conv.contacto?.nombre || t('common.unknown')}</p>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {!conv.leido && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                            <span className="text-[10px] text-on-surface-variant">{timeAgo(conv.fechaHora)}</span>
                          </div>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">{conv.contenido}</p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Panel de detalle */}
          <div className="lg:col-span-8 flex flex-col">
            {seleccionada ? (
              <Card className="flex flex-col h-full p-0 overflow-hidden">
                <div className="flex items-center gap-4 px-6 py-4 border-b border-outline-variant/20 bg-surface-container-low/30">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {seleccionada.contacto?.nombre?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-bold text-primary">{seleccionada.contacto?.nombre || t('common.unknown')}</p>
                    <p className="text-xs text-on-surface-variant">{seleccionada.contacto?.email || '-'}</p>
                  </div>
                  <div className="ml-auto">
                    <Badge variant={seleccionada.canal === 'WhatsApp' ? 'success' : 'info'}>
                      {t(`canal.${seleccionada.canal}`)}
                    </Badge>
                  </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="max-w-lg">
                    <div className="bg-surface-container-low rounded-2xl rounded-tl-sm p-4">
                      <p className="text-sm text-primary leading-relaxed">{seleccionada.contenido}</p>
                      <p className="text-[10px] text-on-surface-variant mt-2">{new Date(seleccionada.fechaHora).toLocaleString('es-CO')}</p>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-outline-variant/20">
                  <div className="flex gap-3">
                    <input
                      className="flex-1 rounded-xl border border-outline-variant/30 bg-surface px-4 py-2.5 text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors"
                      placeholder={t('inbox.replyPlaceholder', { canal: seleccionada.canal })}
                      value={respuesta}
                      onChange={e => { setRespuesta(e.target.value); }}
                      onKeyDown={e => { if (e.key === 'Enter') void enviarRespuesta(); }}
                    />
                    <button className="px-4 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50" disabled={!respuesta.trim() || crearMutation.isPending} onClick={() => { void enviarRespuesta(); }}>
                      <span className="material-symbols-outlined text-[18px]">send</span>
                    </button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="flex flex-col items-center justify-center h-full text-on-surface-variant gap-3">
                <span className="material-symbols-outlined text-6xl opacity-20">forum</span>
                <p className="text-sm font-medium">{t('inbox.selectConversation')}</p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
