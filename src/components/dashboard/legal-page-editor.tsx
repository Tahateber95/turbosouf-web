"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Save, Loader2, Plus, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";

export interface LegalSection {
  title: string;
  content: string;
}

interface LegalPageEditorProps {
  pageKey: string;
  pageTitle: string;
  pageDesc: string;
  backHref?: string;
}

const inp = "w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]";

export function LegalPageEditor({ pageKey, pageTitle, pageDesc, backHref = "/dashboard/contenu" }: LegalPageEditorProps) {
  const [sections, setSections] = useState<LegalSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/content/${pageKey}`)
      .then(r => r.json())
      .then(json => {
        if (Array.isArray(json.data)) setSections(json.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [pageKey]);

  const updateSection = (i: number, field: keyof LegalSection, value: string) =>
    setSections(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));

  const addSection = () =>
    setSections(prev => [...prev, { title: "", content: "" }]);

  const removeSection = (i: number) =>
    setSections(prev => prev.filter((_, idx) => idx !== i));

  const moveSection = (i: number, dir: -1 | 1) =>
    setSections(prev => {
      const next = [...prev];
      const swap = i + dir;
      if (swap < 0 || swap >= next.length) return prev;
      [next[i], next[swap]] = [next[swap], next[i]];
      return next;
    });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/content/${pageKey}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("turbosouf_token") ?? ""}`,
        },
        body: JSON.stringify(sections),
      });
      if (!res.ok) throw new Error();
      toast.success("Page sauvegardée");
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
    </div>
  );

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href={backHref} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <ChevronLeft className="h-4 w-4 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-gray-900">{pageTitle}</h1>
          <p className="text-sm text-gray-500">{pageDesc}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {sections.map((section, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-0.5">
                <button type="button" onClick={() => moveSection(i, -1)} disabled={i === 0}
                  className="text-gray-300 hover:text-gray-500 disabled:opacity-20 leading-none">
                  <GripVertical className="h-3 w-3" />
                </button>
              </div>
              <input
                value={section.title}
                onChange={e => updateSection(i, "title", e.target.value)}
                placeholder="Titre de la section…"
                className={`${inp} flex-1 font-semibold`}
              />
              <div className="flex gap-1">
                <button type="button" onClick={() => moveSection(i, -1)} disabled={i === 0}
                  className="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-30 px-1">↑</button>
                <button type="button" onClick={() => moveSection(i, 1)} disabled={i === sections.length - 1}
                  className="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-30 px-1">↓</button>
                <button type="button" onClick={() => removeSection(i)}
                  className="text-gray-300 hover:text-red-500 transition-colors ml-1">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <textarea
              value={section.content}
              onChange={e => updateSection(i, "content", e.target.value)}
              placeholder="Contenu de la section (HTML accepté)…"
              rows={5}
              className={inp}
            />
            <p className="text-[10px] text-gray-400">Le HTML est supporté : &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;a href=&quot;…&quot;&gt;</p>
          </div>
        ))}

        {sections.length === 0 && (
          <div className="bg-white rounded-xl border border-dashed border-gray-200 p-10 text-center text-gray-400 text-sm">
            Aucune section. Ajoutez-en une ci-dessous.
          </div>
        )}

        <button
          type="button"
          onClick={addSection}
          className="w-full h-10 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 hover:border-[var(--ts-primary-500)] hover:text-[var(--ts-primary-500)] transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" /> Ajouter une section
        </button>

        <div className="flex justify-end pt-2">
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
