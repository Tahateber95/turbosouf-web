"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { CLIENT_API_URL } from "@/lib/api";
import { MakeCombobox } from "./vehicle-finder";
import { usePathname } from "next/navigation";
import { getT, type Locale } from "@/i18n/translations";

const API = CLIENT_API_URL;

interface Make   { id: string; name: string; slug: string; }
interface Model  { id: string; name: string; slug: string; }
interface Engine { id: string; name: string; engineCode: string | null; fuelType: string; powerCV: number | null; }

function detectLocale(pathname: string): Locale {
  if (pathname.startsWith("/en")) return "en";
  if (pathname.startsWith("/es")) return "es";
  return "fr";
}

/**
 * Horizontal glass search bar — designed to sit inside the hero section.
 * Uses backdrop-blur + white/10 so it blends with the dark hero background.
 */
export function VehicleFinderHeroSearch({ locale: localeProp }: { locale?: Locale }) {
  const pathname = usePathname();
  const locale = localeProp ?? detectLocale(pathname);
  const t = getT(locale);

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
    "w-full h-10 px-3 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm " +
    "focus:outline-none focus:ring-2 focus:ring-[#E85D26]/30 focus:border-[#E85D26] " +
    "disabled:opacity-40 disabled:bg-gray-50 transition-colors appearance-none";

  return (
    <div className="mt-8 rounded-2xl bg-white shadow-2xl shadow-black/20 p-5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
        {t.search.title}
      </p>
      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end"
      >
        {/* Make */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">{t.search.make}</label>
          <MakeCombobox
            makes={makes}
            loading={loadingMakes}
            value={selectedMake}
            onChange={setSelectedMake}
            locale={locale}
          />
        </div>

        {/* Model */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">{t.search.model}</label>
          <select
            value={selectedModel}
            onChange={e => setSelectedModel(e.target.value)}
            disabled={!selectedMake || loadingModels}
            className={selectCls}
          >
            <option value="">{loadingModels ? t.search.loading : t.search.select}</option>
            {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>

        {/* Engine */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">{t.search.engine}</label>
          <select
            value={selectedEngine}
            onChange={e => setSelectedEngine(e.target.value)}
            disabled={!selectedModel || loadingEngines}
            className={selectCls}
          >
            <option value="">{loadingEngines ? t.search.loading : t.search.select}</option>
            {engines.map(e => (
              <option key={e.id} value={e.id}>
                {e.name}{e.powerCV ? ` (${e.powerCV} CV)` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={!selectedMake}
          className="h-10 px-5 flex items-center gap-2 bg-[#E85D26] hover:bg-[#d44f1e] disabled:opacity-40 text-white font-bold rounded-lg transition-colors whitespace-nowrap text-sm shadow-md shadow-[#E85D26]/25"
        >
          <Search className="h-4 w-4 shrink-0" />
          {t.search.searchBtn}
        </button>
      </form>

      <div className="mt-3 pt-3 border-t border-gray-100 text-center">
        <a href="/produits" className="text-xs text-gray-400 hover:text-[#E85D26] transition-colors">
          {t.search.viewAll} →
        </a>
      </div>
    </div>
  );
}
