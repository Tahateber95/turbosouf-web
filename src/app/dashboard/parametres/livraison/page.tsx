"use client";

import { useEffect, useState } from "react";
import { Truck, Save, Loader2 } from "lucide-react";
import { adminGetShippingMethods, adminUpdateShippingMethod, type ShippingMethod } from "@/lib/admin-api";

function ShippingMethodCard({ method, onSaved }: { method: ShippingMethod; onSaved: (m: ShippingMethod) => void }) {
  const [form, setForm] = useState({
    name: method.name,
    priceHT: method.priceHT.toString(),
    tvaRate: method.tvaRate.toString(),
    estimatedDelivery: method.estimatedDelivery ?? "",
    freeShippingThreshold: method.freeShippingThreshold?.toString() ?? "",
    isActive: method.isActive,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const priceHT = parseFloat(form.priceHT) || 0;
  const tvaRate = parseFloat(form.tvaRate) || 0;
  const priceTTC = Math.round(priceHT * (1 + tvaRate / 100) * 100) / 100;

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const updated = await adminUpdateShippingMethod(method.id, {
        name: form.name.trim(),
        priceHT: parseFloat(form.priceHT) || 0,
        tvaRate: parseFloat(form.tvaRate) || 20,
        estimatedDelivery: form.estimatedDelivery.trim() || null,
        freeShippingThreshold: form.freeShippingThreshold ? parseFloat(form.freeShippingThreshold) : null,
        isActive: form.isActive,
      });
      onSaved(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setSaving(false);
    }
  }

  const typeLabels: Record<string, string> = {
    Standard: "Livraison standard",
    RelayPoint: "Point relais",
    Express: "Express",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-[var(--ts-primary-500)]" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            {typeLabels[method.type] ?? method.type}
          </span>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-xs text-gray-500">Actif</span>
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
            className="h-4 w-4 accent-[var(--ts-primary-500)]"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">Nom affiché</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[var(--ts-primary-500)]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Prix HT (€)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.priceHT}
            onChange={(e) => setForm((f) => ({ ...f, priceHT: e.target.value }))}
            className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[var(--ts-primary-500)]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">TVA (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={form.tvaRate}
            onChange={(e) => setForm((f) => ({ ...f, tvaRate: e.target.value }))}
            className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[var(--ts-primary-500)]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Seuil livraison offerte (€)
            <span className="text-gray-400 font-normal ml-1">— laisser vide si aucun</span>
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={form.freeShippingThreshold}
            onChange={(e) => setForm((f) => ({ ...f, freeShippingThreshold: e.target.value }))}
            placeholder="Ex: 150"
            className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[var(--ts-primary-500)]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Délai estimé</label>
          <input
            type="text"
            value={form.estimatedDelivery}
            onChange={(e) => setForm((f) => ({ ...f, estimatedDelivery: e.target.value }))}
            placeholder="Ex: 2-3 jours ouvrés"
            className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[var(--ts-primary-500)]"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-gray-400">
          Prix TTC calculé&nbsp;: <span className="font-semibold text-gray-700">{priceTTC.toFixed(2)} €</span>
        </p>

        <div className="flex items-center gap-3">
          {error && <span className="text-xs text-red-500">{error}</span>}
          {success && <span className="text-xs text-emerald-600 font-medium">Enregistré !</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 h-8 px-4 rounded-lg bg-[var(--ts-primary-500)] text-white text-xs font-semibold hover:bg-[var(--ts-primary-600)] disabled:opacity-60 transition-colors"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ShippingSettingsPage() {
  const [methods, setMethods] = useState<ShippingMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGetShippingMethods()
      .then(setMethods)
      .catch(() => setMethods([]))
      .finally(() => setLoading(false));
  }, []);

  function handleSaved(updated: ShippingMethod) {
    setMethods((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Livraison</h1>
        <p className="text-sm text-gray-500">Configurez les tarifs et conditions de livraison</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-sm text-gray-400">Chargement...</div>
      ) : methods.length === 0 ? (
        <div className="text-sm text-gray-400 text-center py-16">Aucune méthode de livraison trouvée.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {methods.map((m) => (
            <ShippingMethodCard key={m.id} method={m} onSaved={handleSaved} />
          ))}
        </div>
      )}
    </div>
  );
}
