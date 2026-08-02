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
  applicationsVisible: boolean;
  applicationsTagline: string;
  applicationsTitle: string;
  applicationsSubtitle: string;
  applications: { title: string; desc: string; href: string }[];
  whyTagline: string;
  whyTitle: string;
  whyItems: { title: string; desc: string }[];
  ctaTitle: string;
  ctaDescription: string;
  ctaPhone: string;
}

const APPLICATION_LABELS = ["Automobile", "Marine", "Industriel"];

const EMPTY: HomepageConfig = {
  heroTagline: "",
  heroTitle: "",
  heroTitleHighlight: "",
  heroDescription: "",
  stats: [],
  applicationsVisible: true,
  applicationsTagline: "",
  applicationsTitle: "",
  applicationsSubtitle: "",
  applications: [
    { title: "Automobile", desc: "", href: "/produits?application=automobile" },
    { title: "Marine", desc: "", href: "/produits?application=marine" },
    { title: "Industriel", desc: "", href: "/produits?application=industriel" },
  ],
  whyTagline: "",
  whyTitle: "",
  whyItems: [],
  ctaTitle: "",
  ctaDescription: "",
  ctaPhone: "",
};

export default function HomepageEditorPage() {
  const [config, setConfig] = useState<HomepageConfig>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/content/homepage")
      .then(r => r.json())
      .then(json => {
        const data = json.data || {};
        setConfig({
          ...EMPTY,
          ...data,
          applications:
            Array.isArray(data.applications) && data.applications.length === 3
              ? data.applications
              : EMPTY.applications,
        });
      })
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

  // ── Stats helpers ──────────────────────────────────────────────────────────
  const updateStat = (idx: number, field: "value" | "label", val: string) => {
    setConfig(prev => ({
      ...prev,
      stats: prev.stats.map((s, i) => i === idx ? { ...s, [field]: val } : s),
    }));
  };

  const addStat = () => setConfig(prev => ({ ...prev, stats: [...prev.stats, { value: "", label: "" }] }));
  const removeStat = (idx: number) => setConfig(prev => ({ ...prev, stats: prev.stats.filter((_, i) => i !== idx) }));

  // ── Applications helpers ───────────────────────────────────────────────────
  const updateApplication = (idx: number, field: keyof HomepageConfig["applications"][number], val: string) => {
    setConfig(prev => ({
      ...prev,
      applications: prev.applications.map((a, i) => i === idx ? { ...a, [field]: val } : a),
    }));
  };

  // ── Why items helpers ──────────────────────────────────────────────────────
  const updateWhyItem = (idx: number, field: "title" | "desc", val: string) => {
    setConfig(prev => ({
      ...prev,
      whyItems: prev.whyItems.map((w, i) => i === idx ? { ...w, [field]: val } : w),
    }));
  };

  const addWhyItem = () => setConfig(prev => ({ ...prev, whyItems: [...prev.whyItems, { title: "", desc: "" }] }));
  const removeWhyItem = (idx: number) => setConfig(prev => ({ ...prev, whyItems: prev.whyItems.filter((_, i) => i !== idx) }));

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/contenu" className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Page d&apos;accueil</h1>
          <p className="text-sm text-gray-500">Editez le contenu du hero, les stats, les applications, pourquoi nous et le bandeau CTA</p>
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

        {/* Applications */}
        <section className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Section Applications</h2>
            <button
              type="button"
              role="switch"
              aria-checked={config.applicationsVisible}
              onClick={() => setConfig(p => ({ ...p, applicationsVisible: !p.applicationsVisible }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)] focus:ring-offset-2 ${config.applicationsVisible ? "bg-[var(--ts-primary-500)]" : "bg-gray-200"}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${config.applicationsVisible ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
              <input value={config.applicationsTagline} onChange={e => setConfig(p => ({ ...p, applicationsTagline: e.target.value }))} placeholder="Nos domaines" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
              <input value={config.applicationsTitle} onChange={e => setConfig(p => ({ ...p, applicationsTitle: e.target.value }))} placeholder="Turbos pour toutes les applications" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sous-titre</label>
              <input value={config.applicationsSubtitle} onChange={e => setConfig(p => ({ ...p, applicationsSubtitle: e.target.value }))} placeholder="Automobile, marine, industriel — on couvre tout" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
            </div>
            <div className="space-y-4 pt-2">
              {config.applications.map((app, idx) => (
                <div key={idx} className="rounded-lg border border-gray-100 bg-gray-50 p-4 space-y-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{APPLICATION_LABELS[idx]}</p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                    <input value={app.title} onChange={e => updateApplication(idx, "title", e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea value={app.desc} onChange={e => updateApplication(idx, "desc", e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why TurboSouf */}
        <section className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Pourquoi TurboSouf</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
              <input value={config.whyTagline} onChange={e => setConfig(p => ({ ...p, whyTagline: e.target.value }))} placeholder="Notre difference" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
              <input value={config.whyTitle} onChange={e => setConfig(p => ({ ...p, whyTitle: e.target.value }))} placeholder="Pourquoi TurboSouf ?" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">Arguments</label>
                <button type="button" onClick={addWhyItem} className="text-sm text-[var(--ts-primary-500)] hover:underline flex items-center gap-1">
                  <Plus className="h-4 w-4" /> Ajouter
                </button>
              </div>
              {config.whyItems.length > 0 ? (
                <div className="space-y-3">
                  {config.whyItems.map((item, idx) => (
                    <div key={idx} className="rounded-lg border border-gray-100 bg-gray-50 p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <input value={item.title} onChange={e => updateWhyItem(idx, "title", e.target.value)} placeholder="Titre de l'argument" className="flex-1 h-10 px-3 rounded-lg border border-gray-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
                        <button type="button" onClick={() => removeWhyItem(idx)} className="text-red-500 hover:text-red-700 shrink-0"><Trash2 className="h-4 w-4" /></button>
                      </div>
                      <textarea value={item.desc} onChange={e => updateWhyItem(idx, "desc", e.target.value)} placeholder="Description de l'argument" rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">Aucun argument. Cliquez sur &quot;Ajouter&quot; pour en creer un.</p>
              )}
            </div>
          </div>
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
