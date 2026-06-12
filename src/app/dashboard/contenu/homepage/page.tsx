"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Save, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface HomepageConfig {
  heroTagline: string;
  heroTitle: string;
  heroTitleHighlight: string;
  heroDescription: string;
  stats: { value: string; label: string }[];
  ctaTitle: string;
  ctaDescription: string;
  ctaPhone: string;
}

const EMPTY: HomepageConfig = {
  heroTagline: "", heroTitle: "", heroTitleHighlight: "", heroDescription: "",
  stats: [], ctaTitle: "", ctaDescription: "", ctaPhone: "",
};

export default function HomepageEditorPage() {
  const [config, setConfig] = useState<HomepageConfig>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/content/homepage")
      .then(r => r.json())
      .then(json => setConfig({ ...EMPTY, ...(json.data || {}) }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/content/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error();
      toast.success("Page d'accueil sauvegardee");
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const updateStat = (idx: number, field: "value" | "label", val: string) => {
    setConfig(prev => ({
      ...prev,
      stats: prev.stats.map((s, i) => i === idx ? { ...s, [field]: val } : s),
    }));
  };

  const addStat = () => setConfig(prev => ({ ...prev, stats: [...prev.stats, { value: "", label: "" }] }));
  const removeStat = (idx: number) => setConfig(prev => ({ ...prev, stats: prev.stats.filter((_, i) => i !== idx) }));

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/contenu" className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Page d&apos;accueil</h1>
          <p className="text-sm text-gray-500">Editez le contenu du hero, les stats et le bandeau CTA</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        {/* Hero */}
        <section className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Section Hero</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Badge / Tagline</label>
              <input value={config.heroTagline} onChange={e => setConfig(p => ({ ...p, heroTagline: e.target.value }))} placeholder="SPECIALISTE TURBO DEPUIS 2010" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre (ligne 1)</label>
                <input value={config.heroTitle} onChange={e => setConfig(p => ({ ...p, heroTitle: e.target.value }))} placeholder="Votre expert" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre (mot en couleur)</label>
                <input value={config.heroTitleHighlight} onChange={e => setConfig(p => ({ ...p, heroTitleHighlight: e.target.value }))} placeholder="turbocompresseur" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={config.heroDescription} onChange={e => setConfig(p => ({ ...p, heroDescription: e.target.value }))} rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Statistiques</h2>
            <button type="button" onClick={addStat} className="text-sm text-[var(--ts-primary-500)] hover:underline flex items-center gap-1">
              <Plus className="h-4 w-4" /> Ajouter
            </button>
          </div>
          {config.stats.length > 0 ? (
            <div className="space-y-3">
              {config.stats.map((stat, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <input value={stat.value} onChange={e => updateStat(idx, "value", e.target.value)} placeholder="15+" className="w-28 h-10 px-3 rounded-lg border border-gray-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
                  <input value={stat.label} onChange={e => updateStat(idx, "label", e.target.value)} placeholder="Annees d'expertise" className="flex-1 h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
                  <button type="button" onClick={() => removeStat(idx)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">Aucune statistique.</p>
          )}
        </section>

        {/* CTA Banner */}
        <section className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Bandeau CTA (bas de page)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
              <input value={config.ctaTitle} onChange={e => setConfig(p => ({ ...p, ctaTitle: e.target.value }))} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input value={config.ctaDescription} onChange={e => setConfig(p => ({ ...p, ctaDescription: e.target.value }))} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numero de telephone</label>
              <input value={config.ctaPhone} onChange={e => setConfig(p => ({ ...p, ctaPhone: e.target.value }))} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="h-10 px-6 flex items-center gap-2 bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}
