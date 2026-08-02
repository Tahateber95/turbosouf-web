"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Save, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface FaqItem { q: string; a: string }
interface FaqCategory { category: string; items: FaqItem[] }

export default function FaqEditorPage() {
  const [sections, setSections] = useState<FaqCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/content/faq")
      .then(r => r.json())
      .then(json => setSections(json.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/content/faq", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("turbosouf_token") ?? ""}`,
        },
        body: JSON.stringify(sections),
      });
      if (!res.ok) throw new Error();
      toast.success("FAQ sauvegardee");
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const addCategory = () => setSections(prev => [...prev, { category: "", items: [] }]);
  const removeCategory = (idx: number) => setSections(prev => prev.filter((_, i) => i !== idx));
  const updateCategoryName = (idx: number, name: string) =>
    setSections(prev => prev.map((s, i) => i === idx ? { ...s, category: name } : s));

  const addItem = (catIdx: number) =>
    setSections(prev => prev.map((s, i) => i === catIdx ? { ...s, items: [...s.items, { q: "", a: "" }] } : s));
  const removeItem = (catIdx: number, itemIdx: number) =>
    setSections(prev => prev.map((s, i) => i === catIdx ? { ...s, items: s.items.filter((_, j) => j !== itemIdx) } : s));
  const updateItem = (catIdx: number, itemIdx: number, field: "q" | "a", val: string) =>
    setSections(prev => prev.map((s, i) => i === catIdx ? { ...s, items: s.items.map((item, j) => j === itemIdx ? { ...item, [field]: val } : item) } : s));

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/contenu" className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-gray-900">FAQ</h1>
          <p className="text-sm text-gray-500">Gerez les questions frequentes par categorie</p>
        </div>
        <button type="button" onClick={addCategory} className="h-9 px-4 flex items-center gap-1.5 bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="h-4 w-4" /> Categorie
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        {sections.map((section, catIdx) => (
          <section key={catIdx} className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <input
                value={section.category}
                onChange={e => updateCategoryName(catIdx, e.target.value)}
                placeholder="Nom de la categorie (ex: Garantie)"
                className="flex-1 h-10 px-3 rounded-lg border border-gray-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
              />
              <button type="button" onClick={() => removeCategory(catIdx)} className="text-red-500 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              {section.items.map((item, itemIdx) => (
                <div key={itemIdx} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-2">
                      <input
                        value={item.q}
                        onChange={e => updateItem(catIdx, itemIdx, "q", e.target.value)}
                        placeholder="Question..."
                        className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
                      />
                      <textarea
                        value={item.a}
                        onChange={e => updateItem(catIdx, itemIdx, "a", e.target.value)}
                        placeholder="Reponse..."
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
                      />
                    </div>
                    <button type="button" onClick={() => removeItem(catIdx, itemIdx)} className="text-red-400 hover:text-red-600 mt-1.5">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button type="button" onClick={() => addItem(catIdx)} className="mt-3 text-sm text-[var(--ts-primary-500)] hover:underline flex items-center gap-1">
              <Plus className="h-3.5 w-3.5" /> Ajouter une question
            </button>
          </section>
        ))}

        {sections.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>Aucune categorie FAQ. Cliquez sur &quot;+ Categorie&quot; pour commencer.</p>
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
