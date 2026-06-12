"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Save, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Banner {
  id: string;
  text: string;
  link: string;
  active: boolean;
  bgColor: string;
}

export default function BannersEditorPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/content/banners")
      .then(r => r.json())
      .then(json => setBanners(json.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/content/banners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(banners),
      });
      if (!res.ok) throw new Error();
      toast.success("Bannieres sauvegardees");
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const addBanner = () => setBanners(prev => [...prev, { id: Date.now().toString(), text: "", link: "", active: true, bgColor: "#e74c3c" }]);
  const removeBanner = (id: string) => setBanners(prev => prev.filter(b => b.id !== id));
  const updateBanner = (id: string, field: keyof Banner, val: string | boolean) =>
    setBanners(prev => prev.map(b => b.id === id ? { ...b, [field]: val } : b));

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/contenu" className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-gray-900">Bannieres</h1>
          <p className="text-sm text-gray-500">Bandeaux promotionnels affiches en haut du site</p>
        </div>
        <button type="button" onClick={addBanner} className="h-9 px-4 flex items-center gap-1.5 bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="h-4 w-4" /> Banniere
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-xl border border-gray-100 p-5">
            {/* Preview */}
            {banner.text && (
              <div className="mb-4 rounded-lg px-4 py-2 text-center text-white text-sm font-medium" style={{ backgroundColor: banner.bgColor || "#e74c3c" }}>
                {banner.text}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Texte</label>
                <input
                  value={banner.text}
                  onChange={e => updateBanner(banner.id, "text", e.target.value)}
                  placeholder="Livraison gratuite des 150EUR d'achat"
                  className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Lien (optionnel)</label>
                <input
                  value={banner.link}
                  onChange={e => updateBanner(banner.id, "link", e.target.value)}
                  placeholder="/produits"
                  className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
                />
              </div>
              <div className="flex items-end gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Couleur</label>
                  <input
                    type="color"
                    value={banner.bgColor}
                    onChange={e => updateBanner(banner.id, "bgColor", e.target.value)}
                    className="h-9 w-14 rounded-lg border border-gray-200 cursor-pointer"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer h-9">
                  <input
                    type="checkbox"
                    checked={banner.active}
                    onChange={e => updateBanner(banner.id, "active", e.target.checked)}
                    className="rounded border-gray-300 text-[var(--ts-primary-500)]"
                  />
                  Active
                </label>
                <button type="button" onClick={() => removeBanner(banner.id)} className="h-9 px-2 text-red-500 hover:text-red-700 ml-auto">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {banners.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>Aucune banniere. Cliquez sur &quot;+ Banniere&quot; pour en creer une.</p>
          </div>
        )}

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
