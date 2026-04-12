import { useState } from 'react';

interface CalificadoLead {
  id: number;
  nombre: string;
  email: string;
  rating: number;
  notas: string;
}

export const CalificadoPanel = () => {
  const [leads, setLeads] = useState<CalificadoLead[]>([]);
  const [selectedLead, setSelectedLead] = useState<CalificadoLead | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleRating = (leadId: number, rating: number) => {
    setLeads(leads.map(lead => 
      lead.id === leadId ? { ...lead, rating } : lead
    ));

    // Mostrar celebración si es 5 estrellas
    if (rating === 5) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
  };

  const handleNotasChange = (notas: string) => {
    if (selectedLead) {
      const updatedLead = { ...selectedLead, notas };
      setLeads(leads.map(l => l.id === selectedLead.id ? updatedLead : l));
      setSelectedLead(updatedLead);
    }
  };

  const StarRating = ({ leadId, currentRating }: { leadId: number; currentRating: number }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRating(leadId, star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="transition-all duration-200 text-2xl focus:outline-none"
          >
            <span className={`${
              star <= (hoverRating || currentRating)
                ? 'text-orange-400'
                : 'text-slate-300'
            }`}>
              ★
            </span>
          </button>
        ))}
      </div>
    );
  };

  if (leads.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 text-base mb-2">Aún no tienes leads calificados para evaluar</p>
        <p className="text-slate-400 text-sm">Los leads con antigüedad de 7+ días aparecerán aquí</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Lista de Leads */}
      <div className="lg:col-span-2">
        <div className="space-y-3">
          {leads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedLead?.id === lead.id
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-slate-200 hover:border-orange-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-[#182442]">{lead.nombre}</p>
                  <p className="text-sm text-slate-500">{lead.email}</p>
                </div>
                {lead.rating === 5 && (
                  <div className="text-lg animate-bounce">🎉</div>
                )}
              </div>
              <StarRating leadId={lead.id} currentRating={lead.rating} />

              {/* Mensaje de 5 estrellas */}
              {lead.rating === 5 && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700 font-semibold">
                    ✨ ¿Convertir este lead en Cliente?
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Panel Lateral de Notas */}
      {selectedLead && (
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-4 rounded-lg border border-slate-200 bg-slate-50">
            <h3 className="font-semibold text-[#182442] mb-3 text-sm">
              📝 Notas de Calificación
            </h3>
            <textarea
              value={selectedLead.notas}
              onChange={(e) => handleNotasChange(e.target.value)}
              placeholder="Escribe por qué le diste esta puntuación..."
              className="w-full h-40 p-3 rounded-lg border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none resize-none text-sm"
            />
            <div className="mt-3 p-3 bg-white rounded-lg border border-orange-200">
              <p className="text-sm text-orange-700">
                ⭐ Puntuación: <span className="font-bold">{selectedLead.rating}/5</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Celebración */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
          <div className="text-6xl animate-bounce">🎊</div>
        </div>
      )}
    </div>
  );
};
