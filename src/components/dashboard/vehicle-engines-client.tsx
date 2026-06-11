"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ChevronLeft, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminCreateEngine, adminDeleteEngine } from "@/lib/admin-api";
import type { VehicleMake, VehicleModel, VehicleEngine } from "@/lib/api";

interface Props {
  make: VehicleMake;
  model: VehicleModel;
  initialEngines: VehicleEngine[];
}

const FUEL_TYPES = ["Diesel", "Essence", "Hybride", "Electrique", "GPL"];

export function VehicleEnginesClient({ make, model, initialEngines }: Props) {
  const [engines, setEngines] = useState(initialEngines);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [engineCode, setEngineCode] = useState("");
  const [fuelType, setFuelType] = useState("Diesel");
  const [powerCV, setPowerCV] = useState("");
  const [displacementCC, setDisplacementCC] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");

  const resetForm = () => {
    setName("");
    setEngineCode("");
    setFuelType("Diesel");
    setPowerCV("");
    setDisplacementCC("");
    setYearFrom("");
    setYearTo("");
    setShowForm(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const engine = await adminCreateEngine(model.id, {
        name: name.trim(),
        engineCode: engineCode.trim() || null,
        fuelType,
        powerCV: powerCV ? Number(powerCV) : null,
        displacementCC: displacementCC ? Number(displacementCC) : null,
        yearFrom: yearFrom ? Number(yearFrom) : null,
        yearTo: yearTo ? Number(yearTo) : null,
      });
      setEngines(prev => [...prev, engine]);
      resetForm();
      toast.success("Motorisation créée");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, engineName: string) => {
    if (!confirm(`Supprimer la motorisation "${engineName}" ?`)) return;
    setDeletingId(id);
    try {
      await adminDeleteEngine(id);
      setEngines(prev => prev.filter(e => e.id !== id));
      toast.success("Motorisation supprimée");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/dashboard/vehicules/${make.id}`} className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-gray-900">{make.name} {model.name}</h1>
          <p className="text-sm text-gray-500">{engines.length} motorisations</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-1.5 h-9 px-4 bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Ajouter une motorisation
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-100 p-5 mb-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Nom *</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="1.5 dCi 110" className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" autoFocus />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Code moteur</label>
              <input value={engineCode} onChange={e => setEngineCode(e.target.value)} placeholder="K9K 636" className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Carburant *</label>
              <select value={fuelType} onChange={e => setFuelType(e.target.value)} className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]">
                {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Puissance (CV)</label>
              <input type="number" value={powerCV} onChange={e => setPowerCV(e.target.value)} placeholder="110" className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Cylindrée (CC)</label>
              <input type="number" value={displacementCC} onChange={e => setDisplacementCC(e.target.value)} placeholder="1461" className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Année début</label>
                <input type="number" value={yearFrom} onChange={e => setYearFrom(e.target.value)} placeholder="2012" className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Année fin</label>
                <input type="number" value={yearTo} onChange={e => setYearTo(e.target.value)} placeholder="2019" className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="h-9 px-4 bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Créer
            </button>
            <button type="button" onClick={resetForm} className="h-9 px-3 text-sm text-gray-500 hover:text-gray-700">
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider bg-gray-50/50">
                <th className="px-5 py-3 font-medium">Nom</th>
                <th className="px-5 py-3 font-medium">Code moteur</th>
                <th className="px-5 py-3 font-medium">Carburant</th>
                <th className="px-5 py-3 font-medium text-right">Puissance</th>
                <th className="px-5 py-3 font-medium text-right">Cylindrée</th>
                <th className="px-5 py-3 font-medium">Années</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {engines.map((engine) => (
                <tr key={engine.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-5 py-3 font-medium text-gray-900">{engine.name}</td>
                  <td className="px-5 py-3 font-mono text-xs text-gray-500">{engine.engineCode || "—"}</td>
                  <td className="px-5 py-3 text-gray-600">{engine.fuelType}</td>
                  <td className="px-5 py-3 text-right text-gray-600">{engine.powerCV ? `${engine.powerCV} cv` : "—"}</td>
                  <td className="px-5 py-3 text-right text-gray-600">{engine.displacementCC ? `${engine.displacementCC} cc` : "—"}</td>
                  <td className="px-5 py-3 text-gray-600">
                    {engine.yearFrom && engine.yearTo ? `${engine.yearFrom}–${engine.yearTo}` : engine.yearFrom ? `${engine.yearFrom}+` : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => handleDelete(engine.id, engine.name)}
                      disabled={deletingId === engine.id}
                      className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      {deletingId === engine.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                    </button>
                  </td>
                </tr>
              ))}
              {engines.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-gray-500">Aucune motorisation. Ajoutez-en une ci-dessus.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
