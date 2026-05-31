import { Plus, Search, ChevronRight } from "lucide-react";

const MAKES = [
  { name: "Peugeot", models: 8, engines: 24 },
  { name: "Renault", models: 10, engines: 30 },
  { name: "Citroën", models: 7, engines: 18 },
  { name: "BMW", models: 12, engines: 35 },
  { name: "Volkswagen", models: 9, engines: 28 },
  { name: "Audi", models: 8, engines: 22 },
];

export default function VehiclesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Base Véhicules</h1>
          <p className="text-sm text-gray-500">Gestion des marques, modèles et motorisations</p>
        </div>
        <button className="inline-flex items-center gap-1.5 h-9 px-4 bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="h-4 w-4" />
          Ajouter une marque
        </button>
      </div>

      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input type="text" placeholder="Rechercher une marque..." className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MAKES.map((make) => (
          <div key={make.name} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-[var(--ts-primary-500)]/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-[var(--ts-primary-500)]">{make.name.slice(0, 2).toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{make.name}</h3>
                  <p className="text-xs text-gray-500">{make.models} modèles · {make.engines} motorisations</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[var(--ts-primary-500)] transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
