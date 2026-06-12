"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, ChevronRight, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminCreateMake, adminDeleteMake } from "@/lib/admin-api";
import { MakeLogo } from "@/components/store/make-logo";
import type { VehicleMake } from "@/lib/api";

interface Props {
  initialMakes: VehicleMake[];
}

export function VehicleMakesClient({ initialMakes }: Props) {
  const [makes, setMakes] = useState(initialMakes);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newLogo, setNewLogo] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = makes.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const make = await adminCreateMake({ name: newName.trim(), logoUrl: newLogo.trim() || null });
      setMakes(prev => [...prev, make]);
      setNewName("");
      setNewLogo("");
      setShowForm(false);
      toast.success("Marque créée");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer la marque "${name}" et tous ses modèles ?`)) return;
    setDeletingId(id);
    try {
      await adminDeleteMake(id);
      setMakes(prev => prev.filter(m => m.id !== id));
      toast.success("Marque supprimée");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Base Véhicules</h1>
          <p className="text-sm text-gray-500">{makes.length} marques · Gestion des marques, modèles et motorisations</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-1.5 h-9 px-4 bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Ajouter une marque
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-100 p-5 mb-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Nom de la marque *</label>
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="ex: Renault"
                className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">URL du logo (optionnel)</label>
              <input
                value={newLogo}
                onChange={e => setNewLogo(e.target.value)}
                placeholder="https://... .png ou .svg"
                className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
              />
            </div>
          </div>
          <p className="text-[10px] text-gray-400">Si aucun logo n&apos;est fourni, un logo SVG integre sera utilise pour les marques connues.</p>
          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="h-9 px-4 bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Creer
            </button>
            <button type="button" onClick={() => { setShowForm(false); setNewName(""); setNewLogo(""); }} className="h-9 px-3 text-sm text-gray-500 hover:text-gray-700">
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher une marque..."
          className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((make) => (
          <div key={make.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all group relative">
            <Link href={`/dashboard/vehicules/${make.id}`} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-gray-50 flex items-center justify-center p-1.5">
                  <MakeLogo name={make.name} logoUrl={make.logoUrl} className="w-full h-full" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{make.name}</h3>
                  <p className="text-xs text-gray-500">{make.modelCount} modèles</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[var(--ts-primary-500)] transition-colors" />
            </Link>
            <button
              onClick={() => handleDelete(make.id, make.name)}
              disabled={deletingId === make.id}
              className="absolute top-2 right-2 p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            >
              {deletingId === make.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-gray-500 col-span-full text-center py-8">Aucune marque trouvée.</p>
        )}
      </div>
    </div>
  );
}
