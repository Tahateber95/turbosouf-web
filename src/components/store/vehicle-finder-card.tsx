"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { CLIENT_API_URL } from "@/lib/api";
import { MakeCombobox } from "./vehicle-finder";

const API = CLIENT_API_URL;

interface Make   { id: string; name: string; slug: string; }
interface Model  { id: string; name: string; slug: string; }
interface Engine { id: string; name: string; engineCode: string | null; fuelType: string; powerCV: number | null; }

/**
 * Horizontal glass search bar — designed to sit inside the hero section.
 * Uses backdrop-blur + white/10 so it blends with the dark hero background.
 */
export function VehicleFinderHeroSearch() {
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
      .then(r => r.json()).then(j => setMakes(j.data || []))
      .catch(() => setMakes([])).finally(() => setLoadingMakes(false));
  }, []);

  useEffect(() => {
    setModels([]); setEngines([]);
    setSelectedModel(""); setSelectedEngine("");
    if (!selectedMake) return;
    setLoadingModels(true);
    fetch(`${API}/api/v1/vehicles/makes/${selectedMake}/models`)
      .then(r => r.json()).then(j => setModels(j.data || []))
      .catch(() => setModels([])).finally(() => setLoadingModels(false));
  }, [selectedMake]);

  useEffect(() => {
    setEngines([]); setSelectedEngine("");
    if (!selectedModel) return;
    setLoadingEngines(true);
    fetch(`${API}/api/v1/vehicles/models/${selectedModel}/engines`)
      .then(r => r.json()).then(j => setEngines(j.data || []))
      .catch(() => setEngines([])).finally(() => setLoadingEngines(false));
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

  const selectCls =
    "w-full h-11 px-3 rounded-xl bg-white/15 border border-white/25 text-white text-sm " +
    "placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#FF7A45]/50 focus:border-[#FF7A45]/60 " +
    "disabled:opacity-40 transition-colors appearance-none";

  return (
    <div className="mt-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-5">
      <p className="text-[11px] font-bold uppercase tracking-widest text-white/50 mb-4">
        Rechercher par véhicule
      </p>
      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end"
      >
        {/* Marque */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1.5">Marque</label>
          <MakeCombobox
            makes={makes}
            loading={loadingMakes}
            value={selectedMake}
            onChange={setSelectedMake}
          />
        </div>

        {/* Modèle */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1.5">Modèle</label>
          <select
            value={selectedModel}
            onChange={e => setSelectedModel(e.target.value)}
            disabled={!selectedMake || loadingModels}
            className={selectCls}
          >
            <option value="" className="text-gray-700 bg-white">{loadingModels ? "Chargement..." : "Sélectionner"}</option>
            {models.map(m => <option key={m.id} value={m.id} className="text-gray-700 bg-white">{m.name}</option>)}
          </select>
        </div>

        {/* Motorisation */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1.5">Motorisation</label>
          <select
            value={selectedEngine}
            onChange={e => setSelectedEngine(e.target.value)}
            disabled={!selectedModel || loadingEngines}
            className={selectCls}
          >
            <option value="" className="text-gray-700 bg-white">{loadingEngines ? "Chargement..." : "Sélectionner"}</option>
            {engines.map(e => (
              <option key={e.id} value={e.id} className="text-gray-700 bg-white">
                {e.name}{e.powerCV ? ` (${e.powerCV} CV)` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={!selectedMake}
          className="h-11 px-6 flex items-center gap-2 bg-[#E85D26] hover:bg-[#d44f1e] disabled:opacity-40 text-white font-bold rounded-xl transition-colors whitespace-nowrap text-sm"
        >
          <Search className="h-4 w-4 shrink-0" />
          Rechercher
        </button>
      </form>
    </div>
  );
}
