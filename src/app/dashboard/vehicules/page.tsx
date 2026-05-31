import { Plus, Search, ChevronRight } from "lucide-react";
import { SERVER_API_URL, type VehicleMake } from "@/lib/api";

export default async function VehiclesPage() {
  let makes: VehicleMake[] = [];

  try {
    const res = await fetch(`${SERVER_API_URL}/api/v1/vehicles/makes`, { next: { revalidate: 60 } });
    const json = await res.json();
    makes = json.data || [];
  } catch {
    // fallback to empty
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Base Véhicules</h1>
          <p className="text-sm text-gray-500">{makes.length} marques · Gestion des marques, modèles et motorisations</p>
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
        {makes.map((make) => (
          <div key={make.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-[var(--ts-primary-500)]/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-[var(--ts-primary-500)]">{make.name.slice(0, 2).toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{make.name}</h3>
                  <p className="text-xs text-gray-500">{make.modelCount} modèles</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[var(--ts-primary-500)] transition-colors" />
            </div>
          </div>
        ))}
        {makes.length === 0 && (
          <p className="text-sm text-gray-500 col-span-full text-center py-8">Aucune marque trouvée.</p>
        )}
      </div>
    </div>
  );
}
