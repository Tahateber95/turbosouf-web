"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SiteConfig {
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  city: string;
  hours: string;
  mapUrl: string;
}

const EMPTY: SiteConfig = { phone: "", email: "", whatsapp: "", address: "", city: "", hours: "", mapUrl: "" };

export default function ContactSettingsPage() {
  const [config, setConfig] = useState<SiteConfig>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/site-config")
      .then(r => r.json())
      .then(json => setConfig(json.data || EMPTY))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/site-config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("turbosouf_token") ?? ""}`,
        },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error();
      toast.success("Informations de contact sauvegardees");
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const update = (key: keyof SiteConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/parametres" className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Informations de contact</h1>
          <p className="text-sm text-gray-500">Ces informations apparaissent sur la page contact et le pied de page</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        <section className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Coordonnees</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telephone</label>
              <input
                value={config.phone}
                onChange={e => update("phone", e.target.value)}
                placeholder="+33 1 23 45 67 89"
                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={config.email}
                onChange={e => update("email", e.target.value)}
                placeholder="contact@turbosouf.com"
                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
              <input
                value={config.whatsapp}
                onChange={e => update("whatsapp", e.target.value)}
                placeholder="+33612345678"
                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
              />
              <p className="text-[10px] text-gray-400 mt-1">Numero au format international, sans espaces</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Adresse</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rue</label>
              <input
                value={config.address}
                onChange={e => update("address", e.target.value)}
                placeholder="123 Rue de l'Industrie"
                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code postal & Ville</label>
              <input
                value={config.city}
                onChange={e => update("city", e.target.value)}
                placeholder="67000 Strasbourg, France"
                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Google Maps (optionnel)</label>
              <input
                value={config.mapUrl}
                onChange={e => update("mapUrl", e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Horaires d&apos;ouverture</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Horaires</label>
            <textarea
              value={config.hours}
              onChange={e => update("hours", e.target.value)}
              placeholder={"Lun-Ven: 9h-18h\nSam: 9h-12h"}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
            />
            <p className="text-[10px] text-gray-400 mt-1">Une ligne par plage horaire</p>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="h-10 px-6 flex items-center gap-2 bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}
