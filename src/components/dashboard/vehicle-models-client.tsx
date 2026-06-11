"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ChevronLeft, ChevronRight, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminCreateModel, adminDeleteModel } from "@/lib/admin-api";
import type { VehicleMake, VehicleModel } from "@/lib/api";

interface Props {
  make: VehicleMake;
  initialModels: VehicleModel[];
}

export function VehicleModelsClient({ make, initialModels }: Props) {
  const [models, setModels] = useState(initialModels);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const model = await adminCreateModel(make.id, { name: newName.trim() });
      setModels(prev => [...prev, model]);
      setNewName("");
      setShowForm(false);
      toast.success("Modèle créé");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer le modèle "${name}" et toutes ses motorisations ?`)) return;
    setDeletingId(id);
    try {
      await adminDeleteModel(id);
      setModels(prev => prev.filter(m => m.id !== id));
      toast.success("Modèle supprimé");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/vehicules" className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-gray-900">{make.name}</h1>
          <p className="text-sm text-gray-500">{models.length} modèles</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-1.5 h-9 px-4 bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Ajouter un modèle
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-100 p-4 mb-4 flex items-center gap-3">
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Nom du modèle (ex: Clio IV)"
            className="flex-1 h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
            autoFocus
          />
          <button type="submit" disabled={saving} className="h-9 px-4 bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Créer
          </button>
          <button type="button" onClick={() => { setShowForm(false); setNewName(""); }} className="h-9 px-3 text-sm text-gray-500 hover:text-gray-700">
            Annuler
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 uppercase tracking-wider bg-gray-50/50">
              <th className="px-5 py-3 font-medium">Modèle</th>
              <th className="px-5 py-3 font-medium text-center">Motorisations</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {models.map((model) => (
              <tr key={model.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-5 py-3 font-medium text-gray-900">{model.name}</td>
                <td className="px-5 py-3 text-center text-gray-600">{model.engineCount}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3 justify-end">
                    <Link
                      href={`/dashboard/vehicules/${make.id}/${model.id}`}
                      className="text-xs font-medium text-[var(--ts-primary-500)] hover:underline flex items-center gap-1"
                    >
                      Motorisations <ChevronRight className="h-3 w-3" />
                    </Link>
                    <button
                      onClick={() => handleDelete(model.id, model.name)}
                      disabled={deletingId === model.id}
                      className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      {deletingId === model.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {models.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-gray-500">Aucun modèle. Ajoutez-en un ci-dessus.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
