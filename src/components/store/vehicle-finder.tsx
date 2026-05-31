"use client";

import { useState, useEffect } from "react";
import { Search, Car } from "lucide-react";

import { CLIENT_API_URL } from "@/lib/api";

const API = CLIENT_API_URL;

interface Make { id: string; name: string; slug: string; }
interface Model { id: string; name: string; slug: string; }
interface Engine { id: string; name: string; engineCode: string | null; fuelType: string; powerCV: number | null; }

export function VehicleFinder() {
  const [mode, setMode] = useState<"plate" | "manual">("plate");
  const [plate, setPlate] = useState("");

  // Manual search state
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [engines, setEngines] = useState<Engine[]>([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedEngine, setSelectedEngine] = useState("");
  const [loadingMakes, setLoadingMakes] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingEngines, setLoadingEngines] = useState(false);

  // Fetch makes on mount
  useEffect(() => {
    setLoadingMakes(true);
    fetch(`${API}/api/v1/vehicles/makes`)
      .then((r) => r.json())
      .then((json) => setMakes(json.data || []))
      .catch(() => setMakes([]))
      .finally(() => setLoadingMakes(false));
  }, []);

  // Fetch models when make changes
  useEffect(() => {
    setModels([]);
    setEngines([]);
    setSelectedModel("");
    setSelectedEngine("");
    if (!selectedMake) return;
    setLoadingModels(true);
    fetch(`${API}/api/v1/vehicles/makes/${selectedMake}/models`)
      .then((r) => r.json())
      .then((json) => setModels(json.data || []))
      .catch(() => setModels([]))
      .finally(() => setLoadingModels(false));
  }, [selectedMake]);

  // Fetch engines when model changes
  useEffect(() => {
    setEngines([]);
    setSelectedEngine("");
    if (!selectedModel) return;
    setLoadingEngines(true);
    fetch(`${API}/api/v1/vehicles/models/${selectedModel}/engines`)
      .then((r) => r.json())
      .then((json) => setEngines(json.data || []))
      .catch(() => setEngines([]))
      .finally(() => setLoadingEngines(false));
  }, [selectedModel]);

  const handlePlateSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (plate.trim()) {
      window.location.href = `/produits?search=${encodeURIComponent(plate.trim())}`;
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEngine) {
      window.location.href = `/produits?engineId=${selectedEngine}`;
    } else if (selectedMake) {
      const make = makes.find((m) => m.id === selectedMake);
      if (make) window.location.href = `/produits?make=${make.slug}`;
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-[var(--ts-primary-900)] via-[var(--ts-primary-800)] to-[var(--ts-primary-700)] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-10 left-10 w-72 h-72 border border-white rounded-full" />
        <div className="absolute bottom-10 right-10 w-96 h-96 border border-white rounded-full" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 lg:py-20">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[var(--ts-accent-500)] text-xs font-semibold mb-4">
            <Car className="h-3.5 w-3.5" />
            Trouvez la bonne pièce
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Recherchez par véhicule
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Entrez votre plaque d&apos;immatriculation ou sélectionnez votre véhicule pour trouver les pièces compatibles.
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          <button onClick={() => setMode("plate")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === "plate" ? "bg-white text-[var(--ts-primary-900)]" : "bg-white/10 text-white hover:bg-white/20"}`}>
            Par plaque
          </button>
          <button onClick={() => setMode("manual")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === "manual" ? "bg-white text-[var(--ts-primary-900)]" : "bg-white/10 text-white hover:bg-white/20"}`}>
            Par marque / modèle
          </button>
        </div>

        {mode === "plate" && (
          <form onSubmit={handlePlateSearch} className="max-w-lg mx-auto animate-fade-in">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-6 rounded bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-[8px] font-bold">F</span>
                </div>
                <input type="text" value={plate} onChange={(e) => setPlate(e.target.value.toUpperCase())} placeholder="AA-123-BB" className="w-full h-14 pl-14 pr-4 rounded-xl bg-white text-lg font-mono font-bold text-gray-900 tracking-widest placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--ts-accent-500)]" maxLength={9} />
              </div>
              <button type="submit" className="h-14 px-6 flex items-center gap-2 bg-[var(--ts-accent-500)] hover:bg-[var(--ts-accent-600)] text-white font-semibold rounded-xl transition-colors">
                <Search className="h-5 w-5" />
                Rechercher
              </button>
            </div>
          </form>
        )}

        {mode === "manual" && (
          <form onSubmit={handleManualSearch} className="max-w-3xl mx-auto animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <select
                value={selectedMake}
                onChange={(e) => setSelectedMake(e.target.value)}
                className="h-12 px-3 rounded-xl bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--ts-accent-500)]"
              >
                <option value="">{loadingMakes ? "Chargement..." : "Marque"}</option>
                {makes.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>

              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={!selectedMake || loadingModels}
                className="h-12 px-3 rounded-xl bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--ts-accent-500)] disabled:opacity-50"
              >
                <option value="">{loadingModels ? "Chargement..." : "Modèle"}</option>
                {models.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>

              <select
                value={selectedEngine}
                onChange={(e) => setSelectedEngine(e.target.value)}
                disabled={!selectedModel || loadingEngines}
                className="h-12 px-3 rounded-xl bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--ts-accent-500)] disabled:opacity-50"
              >
                <option value="">{loadingEngines ? "Chargement..." : "Motorisation"}</option>
                {engines.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}{e.powerCV ? ` (${e.powerCV}cv)` : ""}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                disabled={!selectedMake}
                className="h-12 flex items-center justify-center gap-2 bg-[var(--ts-accent-500)] hover:bg-[var(--ts-accent-600)] text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                <Search className="h-5 w-5" />
                Chercher
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
