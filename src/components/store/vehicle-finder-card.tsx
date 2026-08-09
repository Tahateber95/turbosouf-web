"use client";

import { useState, useEffect } from "react";
import { Search, Car } from "lucide-react";
import { CLIENT_API_URL } from "@/lib/api";
import { MakeCombobox } from "./vehicle-finder";

const API = CLIENT_API_URL;

interface Make   { id: string; name: string; slug: string; }
interface Model  { id: string; name: string; slug: string; }
interface Engine { id: string; name: string; engineCode: string | null; fuelType: string; powerCV: number | null; }

export function VehicleFinderCard() {
  const [makes,          setMakes]          = useState<Make[]>([]);
  const [models,         setModels]         = useState<Model[]>([]);
  const [engines,        setEngines]        = useState<Engine[]>([]);
  const [selectedMake,   setSelectedMake]   = useState("");
  const [selectedModel,  setSelectedModel]  = useState("");
  const [selectedEngine, setSelectedEngine] = useState("");
  const [loadingMakes,   setLoadingMakes]   = useState(false);
  const [loadingModels,  setLoadingModels]  = useState(false);
  const [loadingEngines, setLoadingEngines] = useState(false);

  useEffect(() => {
    setLoadingMakes(true);
    fetch(`${API}/api/v1/vehicles/makes`)
      .then(r => r.json())
      .then(j => setMakes(j.data || []))
      .catch(() => setMakes([]))
      .finally(() => setLoadingMakes(false));
  }, []);

  useEffect(() => {
    setModels([]); setEngines([]);
    setSelectedModel(""); setSelectedEngine("");
    if (!selectedMake) return;
    setLoadingModels(true);
    fetch(`${API}/api/v1/vehicles/makes/${selectedMake}/models`)
      .then(r => r.json())
      .then(j => setModels(j.data || []))
      .catch(() => setModels([]))
      .finally(() => setLoadingModels(false));
  }, [selectedMake]);

  useEffect(() => {
    setEngines([]); setSelectedEngine("");
    if (!selectedModel) return;
    setLoadingEngines(true);
    fetch(`${API}/api/v1/vehicles/models/${selectedModel}/engines`)
      .then(r => r.json())
      .then(j => setEngines(j.data || []))
      .catch(() => setEngines([]))
      .finally(() => setLoadingEngines(false));
  }, [selectedModel]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEngine) {
      window.location.href = `/produits?engineId=${selectedEngine}`;
    } else if (selectedMake) {
      const make = makes.find(m => m.id === selectedMake);
      if (make) window.location.href = `/produits?make=${make.slug}`;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-[#E85D26]/10 flex items-center justify-center shrink-0">
          <Car className="h-5 w-5 text-[#E85D26]" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-[#E85D26] uppercase tracking-wider">Recherche par véhicule</p>
          <h3 className="text-sm font-black text-gray-900 leading-tight">Trouvez la bonne pièce</h3>
        </div>
      </div>

      <form onSubmit={handleSearch} className="space-y-3">
        {/* Make — searchable combobox */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Marque</label>
          <MakeCombobox
            makes={makes}
            loading={loadingMakes}
            value={selectedMake}
            onChange={setSelectedMake}
          />
        </div>

        {/* Model */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Modèle</label>
          <select
            value={selectedModel}
            onChange={e => setSelectedModel(e.target.value)}
            disabled={!selectedMake || loadingModels}
            className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#E85D26]/30 focus:border-[#E85D26] disabled:opacity-40 disabled:bg-gray-50 transition-colors"
          >
            <option value="">{loadingModels ? "Chargement..." : "Sélectionner un modèle"}</option>
            {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>

        {/* Engine */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Motorisation</label>
          <select
            value={selectedEngine}
            onChange={e => setSelectedEngine(e.target.value)}
            disabled={!selectedModel || loadingEngines}
            className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#E85D26]/30 focus:border-[#E85D26] disabled:opacity-40 disabled:bg-gray-50 transition-colors"
          >
            <option value="">{loadingEngines ? "Chargement..." : "Sélectionner une motorisation"}</option>
            {engines.map(e => (
              <option key={e.id} value={e.id}>
                {e.name}{e.powerCV ? ` (${e.powerCV} CV)` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Search button */}
        <button
          type="submit"
          disabled={!selectedMake}
          className="w-full h-12 flex items-center justify-center gap-2 bg-[#E85D26] hover:bg-[#d44f1e] disabled:opacity-40 text-white font-bold rounded-xl transition-colors shadow-md shadow-[#E85D26]/25 text-sm uppercase tracking-wide"
        >
          <Search className="h-4 w-4" />
          Rechercher
        </button>
      </form>

      {/* Divider + direct link */}
      <div className="mt-4 pt-4 border-t border-gray-100 text-center">
        <a href="/produits" className="text-xs text-gray-400 hover:text-[#E85D26] transition-colors">
          Voir tous les produits →
        </a>
      </div>
    </div>
  );
}
