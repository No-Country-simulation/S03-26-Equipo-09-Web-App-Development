import { useState, useEffect } from 'react';
import { conversacionService, Conversacion, contactoService, Contacto, whatsappService, emailService } from '../../../common/apiClient';
import { Card } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import { Badge } from '../../../components/ui/Badge/Badge';
import { Modal } from '../../../components/ui/Modal/Modal';

interface ConversacionesProps {
  contactoId?: number;
}

export const ConversacionesPanel = ({ contactoId }: ConversacionesProps) => {
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    setError(null);
    try {
      const [convData, contactosData] = await Promise.all([
        conversacionService.getAll(),
        contactoService.getAll()
      ]);
      setConversaciones(convData);
      setContactos(contactosData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando conversaciones');
    } finally {
      setCargando(false);
    }
  };

  const filteredConversaciones = contactoId
    ? conversaciones.filter(c => c.contactoId === contactoId)
    : conversaciones;

  const getCanalbadgeColor = (canal: string) => {
    return canal === 'WhatsApp' ? 'secondary' : 'primary';
  };

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-primary">Conversaciones</h3>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setIsWhatsAppModalOpen(true)}
            >
              <span className="material-symbols-outlined text-sm">chat_bubble</span>
              WhatsApp
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setIsEmailModalOpen(true)}
            >
              <span className="material-symbols-outlined text-sm">mail</span>
              Email
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-error/10 text-error p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {cargando ? (
          <div className="text-center py-8 text-on-surface-variant">Cargando conversaciones...</div>
        ) : filteredConversaciones.length === 0 ? (
          <div className="text-center py-8 text-on-surface-variant">
            No hay conversaciones disponibles
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredConversaciones.map((conv) => {
              const contacto = contactos.find(c => c.id === conv.contactoId);
              return (
                <div key={conv.id} className="p-4 bg-surface-container-low rounded-lg border border-outline/20">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-primary text-sm">{contacto?.nombre || 'Desconocido'}</p>
                      <Badge variant={getCanalbadgeColor(conv.canal) as any} className="mt-1">
                        {conv.canal}
                      </Badge>
                    </div>
                    <span className="text-xs text-on-surface-variant">
                      {new Date(conv.fechaHora).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant line-clamp-2">{conv.contenido}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isWhatsAppModalOpen && (
        <WhatsAppModal
          isOpen={isWhatsAppModalOpen}
          onClose={() => setIsWhatsAppModalOpen(false)}
          contactos={contactos}
          onSend={() => {
            cargarDatos();
            setIsWhatsAppModalOpen(false);
          }}
        />
      )}

      {isEmailModalOpen && (
        <EmailModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          contactos={contactos}
          onSend={() => {
            cargarDatos();
            setIsEmailModalOpen(false);
          }}
        />
      )}
    </Card>
  );
};

// Modal WhatsApp
interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactos: Contacto[];
  onSend: () => void;
}

const WhatsAppModal = ({ isOpen, onClose, contactos, onSend }: WhatsAppModalProps) => {
  const [contactoId, setContactoId] = useState<number | string>('');
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactoId || !mensaje) {
      setError('Completa todos los campos');
      return;
    }

    setEnviando(true);
    setError(null);
    try {
      await whatsappService.enviarMensajeYRegistrar(Number(contactoId), mensaje);
      alert('Mensaje enviado exitosamente');
      setMensaje('');
      setContactoId('');
      onSend();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error enviando mensaje');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enviar Mensaje WhatsApp">
      <form onSubmit={handleSend} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Contacto</label>
          <select
            value={contactoId}
            onChange={(e) => setContactoId(e.target.value)}
            className="w-full px-3 py-2 border border-outline rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-secondary"
            required
          >
            <option value="">Selecciona un contacto...</option>
            {contactos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre} ({c.telefono})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-1">Mensaje</label>
          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="w-full px-3 py-2 border border-outline rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
            rows={5}
            required
          />
        </div>

        {error && (
          <div className="bg-error/10 text-error p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose} disabled={enviando}>
            Cancelar
          </Button>
          <Button type="submit" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Modal Email
interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactos: Contacto[];
  onSend: () => void;
}

const EmailModal = ({ isOpen, onClose, contactos, onSend }: EmailModalProps) => {
  const [contactoId, setContactoId] = useState<number | string>('');
  const [asunto, setAsunto] = useState('');
  const [contenido, setContenido] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactoId || !asunto || !contenido) {
      setError('Completa todos los campos');
      return;
    }

    const contacto = contactos.find(c => c.id === Number(contactoId));
    if (!contacto) {
      setError('Contacto no válido');
      return;
    }

    setEnviando(true);
    setError(null);
    try {
      await emailService.enviarEmail(contacto.email, asunto, contenido);
      alert('Email enviado exitosamente');
      setAsunto('');
      setContenido('');
      setContactoId('');
      onSend();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error enviando email');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enviar Email">
      <form onSubmit={handleSend} className="space-y-4 max-h-96 overflow-y-auto">
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Contacto</label>
          <select
            value={contactoId}
            onChange={(e) => setContactoId(e.target.value)}
            className="w-full px-3 py-2 border border-outline rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-secondary"
            required
          >
            <option value="">Selecciona un contacto...</option>
            {contactos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre} ({c.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-1">Asunto</label>
          <input
            type="text"
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            placeholder="Asunto del email..."
            className="w-full px-3 py-2 border border-outline rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-secondary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-1">Contenido</label>
          <textarea
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            placeholder="Cuerpo del email..."
            className="w-full px-3 py-2 border border-outline rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
            rows={5}
            required
          />
        </div>

        {error && (
          <div className="bg-error/10 text-error p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose} disabled={enviando}>
            Cancelar
          </Button>
          <Button type="submit" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
