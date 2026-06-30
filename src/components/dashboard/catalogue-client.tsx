"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2, X, Check, Tag, Layers } from "lucide-react";
import { toast } from "sonner";
import type { Category, Brand } from "@/lib/api";
import {
  adminCreateCategory, adminUpdateCategory, adminDeleteCategory,
  adminCreateBrand, adminUpdateBrand, adminDeleteBrand,
} from "@/lib/admin-api";

// ─── shared field style ────────────────────────────────────────────────────
const inp = "w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]";
const btn = "h-9 px-4 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5";
const btnPrimary = `${btn} bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white`;
const btnGhost = `${btn} text-gray-500 hover:text-gray-700`;

// ═══════════════════════════════════════════════════════════════════════════
// CATEGORIES TAB
// ═══════════════════════════════════════════════════════════════════════════

interface CategoryFormState {
  name: string;
  description: string;
  imageUrl: string;
  parentId: string;
  sortOrder: string;
  isActive: boolean;
}

const emptyCatForm = (): CategoryFormState => ({
  name: "", description: "", imageUrl: "", parentId: "", sortOrder: "0", isActive: true,
});

function categoryToForm(c: Category): CategoryFormState {
  return {
    name: c.name,
    description: c.description ?? "",
    imageUrl: c.imageUrl ?? "",
    parentId: c.parentId ?? "",
    sortOrder: String(c.sortOrder),
    isActive: c.isActive,
  };
}

function CategoriesTab({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryFormState>(emptyCatForm());
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Flatten tree for the list view (top-level only, with children shown indented)
  const flatList = flattenCategories(categories);

  function flattenCategories(cats: Category[], depth = 0): { cat: Category; depth: number }[] {
    const result: { cat: Category; depth: number }[] = [];
    for (const cat of cats) {
      result.push({ cat, depth });
      if (cat.children?.length) result.push(...flattenCategories(cat.children, depth + 1));
    }
    return result;
  }

  // Root-level categories for parent selector
  const rootCategories = categories;

  const startEdit = (cat: Category) => {
    setShowCreate(false);
    setEditingId(cat.id);
    setForm(categoryToForm(cat));
  };

  const cancelEdit = () => { setEditingId(null); setForm(emptyCatForm()); };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const created = await adminCreateCategory({
        name: form.name.trim(),
        description: form.description.trim() || null,
        imageUrl: form.imageUrl.trim() || null,
        parentId: form.parentId || null,
        sortOrder: Number(form.sortOrder) || 0,
      });
      // Re-fetch is simplest; just append to root or rebuild. We'll append.
      setCategories(prev => [...prev, { ...created, children: [] }]);
      setShowCreate(false);
      setForm(emptyCatForm());
      toast.success("Catégorie créée");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await adminUpdateCategory(id, {
        name: form.name.trim(),
        description: form.description.trim() || null,
        imageUrl: form.imageUrl.trim() || null,
        parentId: form.parentId || null,
        sortOrder: Number(form.sortOrder) || 0,
        isActive: form.isActive,
      });
      setCategories(prev => updateCategoryInTree(prev, updated));
      setEditingId(null);
      toast.success("Catégorie mise à jour");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer la catégorie "${name}" ?`)) return;
    setDeletingId(id);
    try {
      await adminDeleteCategory(id);
      setCategories(prev => removeCategoryFromTree(prev, id));
      toast.success("Catégorie supprimée");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setDeletingId(null);
    }
  };

  function updateCategoryInTree(cats: Category[], updated: Category): Category[] {
    return cats.map(c => {
      if (c.id === updated.id) return { ...updated, children: c.children };
      return { ...c, children: updateCategoryInTree(c.children ?? [], updated) };
    });
  }

  function removeCategoryFromTree(cats: Category[], id: string): Category[] {
    return cats
      .filter(c => c.id !== id)
      .map(c => ({ ...c, children: removeCategoryFromTree(c.children ?? [], id) }));
  }

  const f = (field: keyof CategoryFormState, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const CategoryForm = ({ onSubmit, submitLabel }: { onSubmit: (e: React.FormEvent) => void; submitLabel: string }) => (
    <form onSubmit={onSubmit} className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Nom *</label>
          <input value={form.name} onChange={e => f("name", e.target.value)} placeholder="ex: Turbocompresseurs" className={inp} autoFocus required />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Catégorie parente</label>
          <select value={form.parentId} onChange={e => f("parentId", e.target.value)} className={inp}>
            <option value="">— Aucune (racine) —</option>
            {rootCategories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
          <input value={form.description} onChange={e => f("description", e.target.value)} placeholder="Description courte…" className={inp} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">URL image</label>
          <input value={form.imageUrl} onChange={e => f("imageUrl", e.target.value)} placeholder="https://…" className={inp} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Ordre d&apos;affichage</label>
          <input type="number" value={form.sortOrder} onChange={e => f("sortOrder", e.target.value)} className={inp} />
        </div>
        {editingId && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="cat-active"
              checked={form.isActive}
              onChange={e => f("isActive", e.target.checked)}
              className="rounded border-gray-300 text-[var(--ts-primary-500)] focus:ring-[var(--ts-primary-500)]"
            />
            <label htmlFor="cat-active" className="text-sm text-gray-700">Active</label>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 pt-1">
        <button type="submit" disabled={saving} className={btnPrimary}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          {submitLabel}
        </button>
        <button type="button" onClick={() => { setShowCreate(false); cancelEdit(); }} className={btnGhost}>
          Annuler
        </button>
      </div>
    </form>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{flatList.length} catégories</p>
        {!showCreate && !editingId && (
          <button onClick={() => setShowCreate(true)} className={btnPrimary}>
            <Plus className="h-4 w-4" /> Nouvelle catégorie
          </button>
        )}
      </div>

      {showCreate && <CategoryForm onSubmit={handleCreate} submitLabel="Créer" />}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 uppercase tracking-wider bg-gray-50/50">
              <th className="px-5 py-3 font-medium">Nom</th>
              <th className="px-5 py-3 font-medium">Slug</th>
              <th className="px-5 py-3 font-medium text-right">Produits</th>
              <th className="px-5 py-3 font-medium">Statut</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {flatList.map(({ cat, depth }) => (
              <>
                <tr key={cat.id} className={`hover:bg-gray-50/50 transition-colors ${editingId === cat.id ? "bg-blue-50/30" : ""}`}>
                  <td className="px-5 py-3">
                    <span style={{ paddingLeft: `${depth * 20}px` }} className="inline-flex items-center gap-2">
                      {depth > 0 && <span className="text-gray-300">└</span>}
                      <span className="font-medium text-gray-900">{cat.name}</span>
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-gray-400">{cat.slug}</td>
                  <td className="px-5 py-3 text-right text-gray-600">{cat.productCount}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      cat.isActive ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-100 text-gray-500"
                    }`}>
                      {cat.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => startEdit(cat)} className="text-xs font-medium text-[var(--ts-primary-500)] hover:underline">
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        disabled={deletingId === cat.id}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        {deletingId === cat.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </td>
                </tr>
                {editingId === cat.id && (
                  <tr key={`${cat.id}-edit`}>
                    <td colSpan={5} className="px-5 py-3">
                      <CategoryForm onSubmit={e => handleUpdate(e, cat.id)} submitLabel="Enregistrer" />
                    </td>
                  </tr>
                )}
              </>
            ))}
            {flatList.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-500">Aucune catégorie.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// BRANDS TAB
// ═══════════════════════════════════════════════════════════════════════════

interface BrandFormState {
  name: string;
  logoUrl: string;
  website: string;
  sortOrder: string;
  isActive: boolean;
}

const emptyBrandForm = (): BrandFormState => ({
  name: "", logoUrl: "", website: "", sortOrder: "0", isActive: true,
});

function brandToForm(b: Brand): BrandFormState {
  return {
    name: b.name,
    logoUrl: (b as Brand & { logoUrl?: string | null }).logoUrl ?? "",
    website: "",
    sortOrder: "0",
    isActive: b.isActive,
  };
}

function BrandsTab({ initialBrands }: { initialBrands: Brand[] }) {
  const [brands, setBrands] = useState(initialBrands);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BrandFormState>(emptyBrandForm());
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const startEdit = (b: Brand) => {
    setShowCreate(false);
    setEditingId(b.id);
    setForm(brandToForm(b));
  };

  const cancelEdit = () => { setEditingId(null); setForm(emptyBrandForm()); };

  const f = (field: keyof BrandFormState, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const created = await adminCreateBrand({
        name: form.name.trim(),
        logoUrl: form.logoUrl.trim() || null,
        website: form.website.trim() || null,
        sortOrder: Number(form.sortOrder) || 0,
      });
      setBrands(prev => [...prev, created]);
      setShowCreate(false);
      setForm(emptyBrandForm());
      toast.success("Marque créée");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await adminUpdateBrand(id, {
        name: form.name.trim(),
        logoUrl: form.logoUrl.trim() || null,
        website: form.website.trim() || null,
        sortOrder: Number(form.sortOrder) || 0,
        isActive: form.isActive,
      });
      setBrands(prev => prev.map(b => b.id === id ? updated : b));
      setEditingId(null);
      toast.success("Marque mise à jour");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer la marque "${name}" ?`)) return;
    setDeletingId(id);
    try {
      await adminDeleteBrand(id);
      setBrands(prev => prev.filter(b => b.id !== id));
      toast.success("Marque supprimée");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setDeletingId(null);
    }
  };

  const BrandForm = ({ onSubmit, submitLabel }: { onSubmit: (e: React.FormEvent) => void; submitLabel: string }) => (
    <form onSubmit={onSubmit} className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Nom *</label>
          <input value={form.name} onChange={e => f("name", e.target.value)} placeholder="ex: Garrett" className={inp} autoFocus required />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">URL du logo</label>
          <input value={form.logoUrl} onChange={e => f("logoUrl", e.target.value)} placeholder="https://… .png ou .svg" className={inp} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Site web</label>
          <input value={form.website} onChange={e => f("website", e.target.value)} placeholder="https://www.garrett.com" className={inp} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Ordre d&apos;affichage</label>
          <input type="number" value={form.sortOrder} onChange={e => f("sortOrder", e.target.value)} className={inp} />
        </div>
        {editingId && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="brand-active"
              checked={form.isActive}
              onChange={e => f("isActive", e.target.checked)}
              className="rounded border-gray-300 text-[var(--ts-primary-500)] focus:ring-[var(--ts-primary-500)]"
            />
            <label htmlFor="brand-active" className="text-sm text-gray-700">Active</label>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 pt-1">
        <button type="submit" disabled={saving} className={btnPrimary}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          {submitLabel}
        </button>
        <button type="button" onClick={() => { setShowCreate(false); cancelEdit(); }} className={btnGhost}>
          Annuler
        </button>
      </div>
    </form>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{brands.length} marques</p>
        {!showCreate && !editingId && (
          <button onClick={() => setShowCreate(true)} className={btnPrimary}>
            <Plus className="h-4 w-4" /> Nouvelle marque
          </button>
        )}
      </div>

      {showCreate && <BrandForm onSubmit={handleCreate} submitLabel="Créer" />}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 uppercase tracking-wider bg-gray-50/50">
              <th className="px-5 py-3 font-medium">Marque</th>
              <th className="px-5 py-3 font-medium">Slug</th>
              <th className="px-5 py-3 font-medium text-right">Produits</th>
              <th className="px-5 py-3 font-medium">Statut</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {brands.map(b => (
              <>
                <tr key={b.id} className={`hover:bg-gray-50/50 transition-colors ${editingId === b.id ? "bg-blue-50/30" : ""}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {b.logoUrl ? (
                        <img src={b.logoUrl} alt={b.name} className="w-7 h-7 object-contain rounded" />
                      ) : (
                        <div className="w-7 h-7 rounded bg-gray-100 flex items-center justify-center">
                          <Tag className="h-3.5 w-3.5 text-gray-400" />
                        </div>
                      )}
                      <span className="font-medium text-gray-900">{b.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-gray-400">{b.slug}</td>
                  <td className="px-5 py-3 text-right text-gray-600">{b.productCount}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      b.isActive ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-100 text-gray-500"
                    }`}>
                      {b.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => startEdit(b)} className="text-xs font-medium text-[var(--ts-primary-500)] hover:underline">
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(b.id, b.name)}
                        disabled={deletingId === b.id}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        {deletingId === b.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </td>
                </tr>
                {editingId === b.id && (
                  <tr key={`${b.id}-edit`}>
                    <td colSpan={5} className="px-5 py-3">
                      <BrandForm onSubmit={e => handleUpdate(e, b.id)} submitLabel="Enregistrer" />
                    </td>
                  </tr>
                )}
              </>
            ))}
            {brands.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-500">Aucune marque.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

type Tab = "categories" | "marques";

interface Props {
  initialCategories: Category[];
  initialBrands: Brand[];
  defaultTab?: Tab;
}

export function CatalogueClient({ initialCategories, initialBrands, defaultTab = "categories" }: Props) {
  const [tab, setTab] = useState<Tab>(defaultTab);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Catalogue</h1>
          <p className="text-sm text-gray-500">Gérez les catégories et les marques de turbos</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setTab("categories")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            tab === "categories"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Layers className="h-4 w-4" />
          Catégories
        </button>
        <button
          onClick={() => setTab("marques")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            tab === "marques"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Tag className="h-4 w-4" />
          Marques
        </button>
      </div>

      {tab === "categories" && <CategoriesTab initialCategories={initialCategories} />}
      {tab === "marques" && <BrandsTab initialBrands={initialBrands} />}
    </div>
  );
}
