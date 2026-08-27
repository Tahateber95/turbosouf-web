"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Car, ChevronDown, X } from "lucide-react";
import { usePathname } from "next/navigation";

import { CLIENT_API_URL } from "@/lib/api";
import { getT, type Locale } from "@/i18n/translations";

const API = CLIENT_API_URL;

interface Make { id: string; name: string; slug: string; }
interface Model { id: string; name: string; slug: string; }
interface Engine { id: string; name: string; engineCode: string | null; fuelType: string; powerCV: number | null; }

function detectLocale(pathname: string): Locale {
  if (pathname.startsWith("/en")) return "en";
  if (pathname.startsWith("/es")) return "es";
  return "fr";
}

// ── Searchable combobox for Make ────────────────────────────────────────────
export function MakeCombobox({
  makes,
  loading,
  value,
  onChange,
  locale: localeProp,
}: {
  makes: Make[];
  loading: boolean;
  value: string;
  onChange: (id: string) => void;
  locale?: Locale;
}) {
  const pathname = usePathname();
  const locale = localeProp ?? detectLocale(pathname);
  const t = getT(locale);

  const [open, setOpen]       = useState(false);
  const [query, setQuery]     = useState("");
  const containerRef          = useRef<HTMLDivElement>(null);
  const inputRef              = useRef<HTMLInputElement>(null);

  const selected = makes.find((m) => m.id === value);

  // Sort alphabetically then filter
  const filtered = makes
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter((m) => m.name.toLowerCase().includes(query.toLowerCase()));

  // Close on outside click
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function openDropdown() {
    setOpen(true);
    setQuery("");
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function select(make: Make) {
    onChange(make.id);
    setOpen(false);
    setQuery("");
  }

  function clear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange("");
    setOpen(false);
    setQuery("");
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={openDropdown}
        className="w-full h-12 px-4 rounded-xl bg-white border border-gray-200 text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#E85D26]/25 focus:border-[#E85D26] gap-2 transition-colors"
      >
        <span className={`truncate ${selected ? "text-gray-900 font-medium" : "text-gray-400"}`}>
          {loading ? t.search.loading : selected ? selected.name : t.search.make}
        </span>
        <span className="flex items-center gap-1 text-gray-400 shrink-0">
          {selected && (
            <span onClick={clear} className="hover:text-gray-700 p-0.5 rounded">
              <X className="h-3.5 w-3.5" />
            </span>
          )}
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 left-0 min-w-[260px] w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Search input */}
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[var(--ts-accent-400)] focus-within:bg-white transition-colors">
              <Search className="h-4 w-4 text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.search.searchMake}
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none min-w-0"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-600">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <ul className="max-h-60 overflow-y-auto py-1.5">
            {filtered.length === 0 ? (
              <li className="px-4 py-4 text-sm text-gray-400 text-center">{t.search.noMake}</li>
            ) : (
              filtered.map((m) => (
                <li
                  key={m.id}
                  onPointerDown={() => select(m)}
                  className={`mx-1.5 px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors ${
                    m.id === value
                      ? "bg-orange-50 text-[var(--ts-accent-600)] font-semibold"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {m.name}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export function VehicleFinder() {
  const [makes, setMakes]           = useState<Make[]>([]);
  const [models, setModels]         = useState<Model[]>([]);
  const [engines, setEngines]       = useState<Engine[]>([]);
  const [selectedMake, setSelectedMake]     = useState("");
  const [selectedModel, setSelectedModel]   = useState("");
  const [selectedEngine, setSelectedEngine] = useState("");
  const [loadingMakes, setLoadingMakes]     = useState(false);
  const [loadingModels, setLoadingModels]   = useState(false);
  const [loadingEngines, setLoadingEngines] = useState(false);

  useEffect(() => {
    setLoadingMakes(true);
    fetch(`${API}/api/v1/vehicles/makes`)
      .then((r) => r.json())
      .then((json) => setMakes(json.data || []))
      .catch(() => setMakes([]))
      .finally(() => setLoadingMakes(false));
  }, []);

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
    <section className="relative bg-gradient-to-br from-[var(--ts-primary-900)] via-[var(--ts-primary-800)] to-[var(--ts-primary-700)]">
      {/* Decorative circles — isolated overflow so the combobox dropdown is not clipped */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
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
            Sélectionnez votre marque, modèle et motorisation pour trouver les pièces compatibles.
          </p>
        </div>

        <form onSubmit={handleManualSearch} className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {/* Marque — searchable combobox */}
            <MakeCombobox
              makes={makes}
              loading={loadingMakes}
              value={selectedMake}
              onChange={setSelectedMake}
            />

            {/* Modèle — plain select */}
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

            {/* Motorisation — plain select */}
            <select
              value={selectedEngine}
              onChange={(e) => setSelectedEngine(e.target.value)}
              disabled={!selectedModel || loadingEngines}
              className="h-12 px-3 rounded-xl bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--ts-accent-500)] disabled:opacity-50"
            >
              <option value="">{loadingEngines ? "Chargement..." : "Motorisation"}</option>
              {engines.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}{e.powerCV ? ` (${e.powerCV} CV)` : ""}{e.engineCode ? ` — ${e.engineCode}` : ""}
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
      </div>
    </section>
  );
}
