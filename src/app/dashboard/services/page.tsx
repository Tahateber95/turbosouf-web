import { Wrench, Plus } from "lucide-react";

interface ServiceCard {
  id: string;
  number: string;
  customer: string;
  vehicle: string;
  service: string;
  date: string;
}

const COLUMNS: { status: string; label: string; color: string; cards: ServiceCard[] }[] = [
  {
    status: "Submitted", label: "Soumises", color: "border-amber-400",
    cards: [
      { id: "1", number: "SR-2026-012", customer: "Jean Dupont", vehicle: "Peugeot 308 1.6 HDi", service: "Reconditionnement Turbo", date: "20/05" },
      { id: "2", number: "SR-2026-013", customer: "Pierre Durand", vehicle: "VW Golf 2.0 TDI", service: "Diagnostic Turbo", date: "20/05" },
    ]
  },
  {
    status: "Diagnosed", label: "Diagnostiquées", color: "border-blue-400",
    cards: [
      { id: "3", number: "SR-2026-011", customer: "Marie Martin", vehicle: "Citroën C4 1.6 HDi", service: "Reconditionnement Turbo", date: "18/05" },
    ]
  },
  {
    status: "InProgress", label: "En cours", color: "border-indigo-400",
    cards: [
      { id: "4", number: "SR-2026-010", customer: "Auto Garage Pro", vehicle: "Renault Clio 1.5 dCi", service: "Réparation Mécanique", date: "17/05" },
    ]
  },
  {
    status: "Ready", label: "Prêtes", color: "border-purple-400",
    cards: [
      { id: "5", number: "SR-2026-009", customer: "Sophie Lefebvre", vehicle: "Peugeot 3008 2.0 HDi", service: "Reconditionnement Turbo", date: "15/05" },
    ]
  },
  {
    status: "Completed", label: "Terminées", color: "border-emerald-400",
    cards: []
  },
];

export default function ServiceOrdersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Services Atelier</h1>
          <p className="text-sm text-gray-500">Gestion des ordres de service</p>
        </div>
        <button className="inline-flex items-center gap-1.5 h-9 px-4 bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="h-4 w-4" />
          Nouveau service
        </button>
      </div>

      {/* Kanban */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <div key={col.status} className="flex-shrink-0 w-72">
            <div className={`rounded-t-xl border-t-3 ${col.color} bg-white border border-gray-100 rounded-xl overflow-hidden`}>
              <div className="px-4 py-3 flex items-center justify-between border-b border-gray-50">
                <h3 className="text-sm font-bold text-gray-900">{col.label}</h3>
                <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {col.cards.length}
                </span>
              </div>
              <div className="p-3 space-y-2 min-h-[200px]">
                {col.cards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[10px] font-semibold text-[var(--ts-primary-500)]">
                        {card.number}
                      </span>
                      <span className="text-[10px] text-gray-400">{card.date}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">{card.customer}</p>
                    <p className="text-xs text-gray-500 mb-1.5">{card.vehicle}</p>
                    <div className="flex items-center gap-1">
                      <Wrench className="h-3 w-3 text-gray-400" />
                      <span className="text-[10px] font-medium text-gray-600">{card.service}</span>
                    </div>
                  </div>
                ))}
                {col.cards.length === 0 && (
                  <div className="text-center py-8 text-xs text-gray-400">
                    Aucun service
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
