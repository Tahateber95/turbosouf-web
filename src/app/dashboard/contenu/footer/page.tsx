"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface FooterConfig {
  description: string;
  phone: string;
  email: string;
  address: string;
}

const EMPTY: FooterConfig = { description: "", phone: "", email: "", address: "" };

export default function FooterEditorPage() {
  const [config, setConfig] = useState<FooterConfig>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/content/footer")
      .then(r => r.json())
      .then(json => setConfig({ ...EMPTY, ...json.data }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/content/footer", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("turbosouf_token") ?? ""}`,
        },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error();
      toast.success("Footer sauvegarde");
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/contenu" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <ChevronLeft className="h-4 w-4 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-gray-900">Footer</h1>
          <p className="text-sm text-gray-500">Texte et coordonnees affiches dans le bas de page</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <section className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={config.description}
              onChange={e => setConfig(p => ({ ...p, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telephone</label>
            <input
              value={config.phone}
              onChange={e => setConfig(p => ({ ...p, phone: e.target.value }))}
              placeholder="+33 1 23 45 67 89"
              className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              value={config.email}
              onChange={e => setConfig(p => ({ ...p, email: e.target.value }))}
              placeholder="contact@turbosouf.com"
              className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse / Ville</label>
            <input
              value={config.address}
              onChange={e => setConfig(p => ({ ...p, address: e.target.value }))}
              placeholder="Strasbourg, France"
              className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
            />
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 h-10 px-6 rounded-lg text-sm font-bold text-white disabled:opacity-60"
            style={{ background: "linear-gradient(180deg,#FF7A45 0%,#E85D26 100%)" }}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Sauvegarder
          </button>
        </div>
      </form>
    </div>
  );
}
